import { sendEmailSaleConfirmation } from '#src/emails/saleEmailService.js';
import { Address } from '#src/modules/address/models/Address.js';
import { DeliveryCarrier } from '#src/modules/delivery/models/DeliveryCarrier.js';
import { Payment } from '#src/modules/payments/models/Payment.js';
import { Product } from '#src/modules/product/models/Product.js';
import { ProductGallery } from '#src/modules/product/models/ProductGallery.js';
import { User } from '#src/modules/user/models/User.js';
import { SaleCart } from '../models/SaleCart.js';
import { SaleOrder } from '../models/SaleOrder.js';

const createOrderService = async (orderData) => {
  const { products, transaction_id, ...data } = orderData;

  const user = await User.findByPk(data.user_id, {
    attributes: ['id', 'name', 'email', 'isAdmin'],
  });
  let saleOrder = null;
  let orderProducts = [];

  try {
    if (transaction_id) {
      const paymentExist = await Payment.findOne({
        where: { transaction_id },
      });

      if (paymentExist) {
        const saleExist = await getOrderByIdService(paymentExist.sale_order_id);
        return saleExist;
      }
    }

    saleOrder = await SaleOrder.create(data);

    await Payment.create({
      transaction_id,
      sale_order_id: saleOrder.dataValues.id,
    });
  } catch (error) {
    throw error;
  }

  try {
    for (const sale_line of products) {
      const product = await Product.findOne({
        where: { id: sale_line.product_id },
        attributes: ['id', 'name', 'sku', 'price', 'stock'],
      });

      if (product.stock < sale_line.quantity) {
        return new Error({ msg: 'No hay stock suficiente para algunos productos' });
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

    await sendEmailSaleConfirmation({ user: user, order: saleOrder, items: orderProducts });
    return saleOrder;
  } catch (error) {
    throw error;
  }
};

const getOrderByIdService = async (id) => {
  return await SaleOrder.findOne({
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
};

export { createOrderService, getOrderByIdService };
