import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { processPaymentService } from '../services/mercadopago.service.js';

const { MERCADO_PAGO_TOKEN } = process.env;

const client = new MercadoPagoConfig({ accessToken: MERCADO_PAGO_TOKEN });
const preference = new Preference(client);
const payment = new Payment(client);

const createPreference = async (req, res) => {
  const {
    items,
    back_urls,
    notification_url,
    auto_return = 'approved',
    shipments,
    metadata,
  } = req.body;

  const preferenceData = {
    body: {
      items,
      back_urls,
      auto_return,
      notification_url,
      shipments,
      metadata,
    },
  };

  try {
    const response = await preference.create(preferenceData);
    res.status(201).json(response);
  } catch (error) {
    req.log.error(error.message);
    res.status(500).json({ ok: false, error: error.message });
  }
};

const getPaymentInfoService = async (req, res) => {
  const { paymentId } = req.params;

  try {
    const response = await payment.get({ id: paymentId });
    res.status(200).json({ ok: true, data: response });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

const getPaymentInfo = async (paymentId) => {
  try {
    const response = await payment.get({ id: paymentId });
    return response;
  } catch (error) {
    throw error;
  }
};

const webhook = async (req, res) => {
  const { type, data } = req.body;

  try {
    switch (type) {
      case 'payment':
        await processPaymentService(data.id);
        res.status(200).json();
        break;
      case 'plan':
        res.status(200).json();
        break;
      case 'subscription':
        res.status(200).json();
        break;
      case 'invoice':
        res.status(200).json();
        break;
      case 'point_integration_wh':
        res.status(200).json();
        break;
    }
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

const processPayment = async (req, res) => {
  const { payment_id: transaction_id } = req.body;

  try {
    const saleOrder = await processPaymentService(transaction_id);
    res.status(200).json({ order: saleOrder });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

export { createPreference, webhook, getPaymentInfoService, getPaymentInfo, processPayment };
