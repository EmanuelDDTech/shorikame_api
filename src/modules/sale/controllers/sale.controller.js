import { Sequelize } from 'sequelize';
import {
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  endOfDay,
  endOfMonth,
  format,
  parseISO,
  startOfDay,
  startOfMonth,
} from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { utc, UTCDate } from '@date-fns/utc';

import { sequelize } from '#src/database/database.js';
import { sendEmailSaleConfirmation, sendEmailSaleUpdate } from '#src/emails/saleEmailService.js';

import { SaleOrder } from '#modules/sale/models/SaleOrder.js';
import { SaleCart } from '#modules/sale/models/SaleCart.js';
import { Product } from '#modules/product/models/Product.js';
import { Payment } from '#modules/paypal/models/Payment.js';
import { order } from '#modules/paypal/controllers/paypal.controller.js';
import { ProductGallery } from '#modules/product/models/ProductGallery.js';
import { Address } from '#modules/address/models/Address.js';
import { User } from '#modules/user/models/User.js';
import { DeliveryCarrier } from '#modules/delivery/models/DeliveryCarrier.js';

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

const salesByYear = async (req, res) => {
  const { isAdmin } = req.user;

  if (!isAdmin) {
    const error = new Error('Acción no válida');
    return res.status(403).json({ msg: error.message });
  }

  try {
    const saleOrders = await SaleOrder.findAll({
      attributes: [
        [sequelize.fn('DATE_PART', 'year', sequelize.col('createdAt')), 'year'],
        [sequelize.literal('ROUND(SUM("amount_total")::numeric, 2)'), 'total'],
      ],
      group: [sequelize.fn('DATE_PART', 'year', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE_PART', 'year', sequelize.col('createdAt')), 'DESC']],
    });

    console.log(saleOrders);

    return res.json(saleOrders);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const salesByMonth = async (req, res) => {
  const { isAdmin } = req.user;

  if (!isAdmin) {
    const error = new Error('Acción no válida');
    return res.status(403).json({ msg: error.message });
  }

  try {
    const saleOrders = await SaleOrder.findAll({
      attributes: [
        [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'month'],
        [sequelize.literal('ROUND(SUM("amount_total")::numeric, 2)'), 'total'],
      ],
      group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'DESC']],
    });

    const dates = saleOrders.map((sale) => sale.dataValues.month);

    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    const allMonths = eachMonthOfInterval(
      {
        start: minDate,
        end: maxDate,
      },
      { in: utc },
    );

    const filled = allMonths.map((date) => {
      const found = saleOrders.find((sale) => {
        return (
          formatInTimeZone(sale.dataValues.month, 'UTC', 'yyyy-MM-dd') ===
          formatInTimeZone(date, 'UTC', 'yyyy-MM-dd')
        );
      });

      return {
        month: formatInTimeZone(date, 'UTC', 'yyyy-MM-dd'),
        total: found ? parseFloat(found.dataValues.total) : 0,
      };
    });

    return res.json(filled);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const salesByWeek = async (req, res) => {
  const { isAdmin } = req.user;

  if (!isAdmin) {
    const error = new Error('Acción no válida');
    return res.status(403).json({ msg: error.message });
  }

  try {
    const saleOrders = await SaleOrder.findAll({
      attributes: [
        [sequelize.fn('DATE_TRUNC', 'week', sequelize.col('createdAt')), 'week'],
        [sequelize.literal('ROUND(SUM("amount_total")::numeric, 2)'), 'total'],
      ],
      group: [sequelize.fn('DATE_TRUNC', 'week', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE_TRUNC', 'week', sequelize.col('createdAt')), 'DESC']],
    });

    const dates = saleOrders.map((sale) => sale.dataValues.week);

    const minDate = new UTCDate(Math.min(...dates));
    const maxDate = new UTCDate(Math.max(...dates));

    const allWeeks = eachWeekOfInterval(
      {
        start: minDate,
        end: maxDate,
      },
      { in: utc, weekStartsOn: 1 },
    );

    const filled = allWeeks.map((date) => {
      const found = saleOrders.find((sale) => {
        return (
          formatInTimeZone(sale.dataValues.week, 'UTC', 'yyyy-MM-dd') ===
          formatInTimeZone(date, 'UTC', 'yyyy-MM-dd')
        );
      });

      return {
        week: formatInTimeZone(date, 'UTC', 'yyyy-MM-dd'),
        total: found ? parseFloat(found.dataValues.total) : 0,
      };
    });

    return res.json(filled);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const salesByDay = async (req, res) => {
  const { isAdmin } = req.user;

  if (!isAdmin) {
    const error = new Error('Acción no válida');
    return res.status(403).json({ msg: error.message });
  }

  try {
    const saleOrders = await SaleOrder.findAll({
      attributes: [
        [sequelize.fn('DATE_TRUNC', 'day', sequelize.col('createdAt')), 'day'],
        [sequelize.literal('ROUND(SUM("amount_total")::numeric, 2)'), 'total'],
      ],
      group: [sequelize.fn('DATE_TRUNC', 'day', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE_TRUNC', 'day', sequelize.col('createdAt')), 'DESC']],
    });

    const dates = saleOrders.map((sale) => sale.dataValues.day);

    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    const allDays = eachDayOfInterval(
      {
        start: minDate,
        end: maxDate,
      },
      { in: utc },
    );

    const filled = allDays.map((date) => {
      const found = saleOrders.find((sale) => {
        return (
          formatInTimeZone(sale.dataValues.day, 'UTC', 'yyyy-MM-dd') ===
          formatInTimeZone(date, 'UTC', 'yyyy-MM-dd')
        );
      });

      return {
        day: formatInTimeZone(date, 'UTC', 'yyyy-MM-dd'),
        total: found ? parseFloat(found.dataValues.total) : 0,
      };
    });

    return res.json(filled);
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

export {
  getOrders,
  getOrdersAdmin,
  salesByYear,
  salesByMonth,
  salesByWeek,
  salesByDay,
  createOrder,
  getOrderById,
  updateOrder,
};
