import { createOrderService } from '#src/modules/sale/services/sale.service.js';
import { getPaymentInfo } from '../controllers/mercadopago.controller.js';

const processPaymentService = async (transaction_id) => {
  try {
    const payment = await getPaymentInfo(transaction_id);
    payment.metadata.transaction_id = transaction_id;

    const saleOrder = await createOrderService(payment.metadata);
    return saleOrder;
  } catch (error) {
    throw error;
  }
};

export { processPaymentService };
