import { SaleOrder } from '../models/SaleOrder.js';
import { SaleCart } from '../models/SaleCart.js';
import { Product } from '../models/Product.js';
import { Payment } from '../models/Payment.js';
import { sendEmailSaleConfirmation } from '../emails/saleEmailService.js';
import { order } from './paypal.controller.js';
import { ProductGallery } from '../models/ProductGallery.js';
import { Address } from '../models/Address.js';

const getOrders = async (req, res) => {
  const { id: userId, isAdmin } = req.user;

  try {
    const saleOrders = await SaleOrder.findAll({
      where: isAdmin ? {} : { user_id: userId },
      attributes: { exclude: ['updatedAt'] },
      order: [['id', 'DESC']],
      include: {
        model: SaleCart,
        attributes: ['quantity', 'price_unit', 'subtotal'],
        include: {
          model: Product,
          attributes: ['id', 'name'],
          include: {
            model: ProductGallery,
            attributes: ['url'],
            where: { order: 1 },
          },
        },
      },
    });

    return res.json(saleOrders);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const createOrder = async (req, res) => {
  const { id: userId } = req.user;
  const { products, transaction_id, ...data } = req.body;

  data.user_id = userId;
  let saleOrder = {};
  let orderProducts = [];

  try {
    saleOrder = await SaleOrder.create(data);

    if (transaction_id) {
      await Payment.create({
        transaction_id,
        sale_order_id: saleOrder.dataValues.id,
      });
    }
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }

  try {
    for (const sale_line of products) {
      const product = await Product.findOne({
        where: { id: sale_line.productId },
        attributes: ['id', 'name', 'sku', 'price', 'stock'],
      });

      if (product.stock < sale_line.quantity) {
        return res.status(409).json({ msg: 'No hay stock suficiente para algunos productos' });
      }

      product.stock = product.stock - sale_line.quantity;
      await product.save();

      sale_line.saleOrderId = saleOrder.id;
      await SaleCart.create(sale_line);

      const productData = {
        name: product.name,
        quantity: sale_line.quantity,
        price: sale_line.price_unit,
      };

      orderProducts.push(productData);
    }

    await sendEmailSaleConfirmation({ user: req.user, order: saleOrder, items: orderProducts });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
  return res.json({ order: saleOrder });
};

const getOrderById = async (req, res) => {
  const { id } = req.params;
  const { id: userId, isAdmin } = req.user;

  try {
    const saleOrder = await SaleOrder.findOne({
      where: { id },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        {
          model: SaleCart,
          attributes: ['quantity', 'price_unit', 'subtotal'],
          include: {
            model: Product,
            attributes: ['id', 'name'],
            include: {
              model: ProductGallery,
              attributes: ['url'],
              where: { order: 1 },
            },
          },
        },
        {
          model: Address,
        },
      ],
    });

    if (saleOrder.user_id !== userId && !isAdmin) {
      return res.status(403).json({ msg: 'No puede acceder a esta orden' });
    }

    return res.json(saleOrder);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  try {
    const saleOrder = await SaleOrder.findOne({ where: { id } });

    if (saleOrder.user_id !== userId) {
      return res.status(403).json({ msg: 'No puede acceder a esta orden' });
    }

    saleOrder.state = req.body.state || saleOrder.state;
    saleOrder.is_payed = req.body.is_payed || saleOrder.is_payed;

    await saleOrder.save();

    return res.json({ msg: 'Carrito actualizado correctamente' });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export { getOrders, createOrder, getOrderById, updateOrder };
