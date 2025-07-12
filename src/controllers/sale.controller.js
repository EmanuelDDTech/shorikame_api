import { SaleOrder } from '../models/SaleOrder.js';
import { SaleCart } from '../models/SaleCart.js';
import { Product } from '../models/Product.js';
import { Payment } from '../models/Payment.js';
import { sendEmailSaleConfirmation, sendEmailSaleUpdate } from '../emails/saleEmailService.js';
import { order } from './paypal.controller.js';
import { ProductGallery } from '../models/ProductGallery.js';
import { Address } from '../models/Address.js';
import { User } from '../models/User.js';
import { DeliveryCarrier } from '../models/DeliveryCarrier.js';

const getOrders = async (req, res) => {
  const { id: userId } = req.user;

  try {
    const saleOrders = await SaleOrder.findAll({
      where: { user_id: userId },
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

const getOrdersAdmin = async (req, res) => {
  const { isAdmin } = req.user;
  const { limit = 10, page = 1 } = req.query;

  if (!isAdmin) {
    const error = new Error('Acción no válida');
    return res.status(403).json({ msg: error.message });
  }

  try {
    const ids = await SaleOrder.findAll({
      attributes: ['id'],
      where: {},
      order: [['id', 'DESC']],
      limit: limit,
      offset: limit * (page - 1),
    });

    const idsList = ids.map((row) => row.id);

    if (!idsList.length) return [];

    const saleOrders = await SaleOrder.findAll({
      where: { id: idsList },
      attributes: {
        exclude: ['updatedAt'],
      },
      order: [['id', 'DESC']],
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
          model: User,
          attributes: ['id', 'name', 'email'],
        },
      ],
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
        {
          model: User,
          attributes: ['id', 'name', 'email'],
        },
        {
          model: DeliveryCarrier,
          attributes: ['id', 'name'],
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
  const { id: userId, isAdmin } = req.user;
  let updateState = false;
  let updateType = '';

  try {
    const saleOrder = await SaleOrder.findOne({ where: { id } });

    if (saleOrder.user_id !== userId && !isAdmin) {
      return res.status(403).json({ msg: 'No puede acceder a esta orden' });
    }

    if (req.body.state !== saleOrder.state) {
      updateState = true;
      updateType = req.body.state;
    }

    saleOrder.state = req.body.state || saleOrder.state;
    saleOrder.is_payed = req.body.is_payed || saleOrder.is_payed;

    await saleOrder.save();
    if (updateState) {
      await sendEmailSaleUpdate(req.body);
    }

    return res.json({ msg: 'Carrito actualizado correctamente' });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export { getOrders, getOrdersAdmin, createOrder, getOrderById, updateOrder };
