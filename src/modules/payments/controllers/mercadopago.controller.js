import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

const { MERCADO_PAGO_TOKEN } = process.env;

const client = new MercadoPagoConfig({ accessToken: MERCADO_PAGO_TOKEN });
const preference = new Preference(client);
const payment = new Payment(client);

const createPreference = async (req, res) => {
  const { items, back_urls, notification_url, auto_return = 'approved' } = req.body;

  // console.log('Items', body.items);

  const preferenceData = {
    body: {
      items: items,
      back_urls: back_urls,
      auto_return: auto_return,
      notification_url: notification_url,
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

const getPaymentInfoService = async (payment_id) => {
  try {
    const response = await payment.get({ id: payment_id });

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
        const response = await getPaymentInfoService(data.id);
        console.log('Payment info:', response);
        res.status(200).json(response);
        break;
      case 'plan':
        // const plan = await mercadopago.plans.get(data.id);
        break;
      case 'subscription':
        // const subscription = await mercadopago.subscriptions.get(data.id);
        break;
      case 'invoice':
        // const invoice = await mercadopago.invoices.get(data.id);
        break;
      case 'point_integration_wh':
        // Contiene la informaciòn relacionada a la notificaciòn.
        break;
    }
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

export { createPreference, webhook };
