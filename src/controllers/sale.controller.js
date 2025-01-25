import { SaleOrder } from '../models/SaleOrder.js';
import { SaleCart } from '../models/SaleCart.js';
import { Product } from '../models/Product.js';

const getOrders = async (req, res) => {
  const { id: userId } = req.user;

  try {
    const saleOrders = await SaleOrder.findAll({ where: { user_id: userId } });

    return res.json(saleOrders);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const createOrder = async (req, res) => {
  const { id: userId } = req.user;
  const { products, ...data } = req.body;

  data.user_id = userId;

  // console.log(data);
  // console.log(products);
  let saleOrder = {};

  try {
    saleOrder = await SaleOrder.create(data);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }

  try {
    products.forEach(async (sale_line) => {
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
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }

  return res.json({ order: saleOrder });
};

const getOrderById = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  try {
    const saleOrder = await SaleOrder.findOne({
      where: { id },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: {
        model: SaleCart,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: {
          model: Product,
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      },
    });

    if (saleOrder.user_id !== userId) {
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
