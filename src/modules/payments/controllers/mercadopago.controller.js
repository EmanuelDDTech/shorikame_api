import { MercadoPagoConfig, Preference } from 'mercadopago';

const { MERCADO_PAGO_TOKEN } = process.env;

const client = new MercadoPagoConfig({ accessToken: MERCADO_PAGO_TOKEN });
const preference = new Preference(client);

const createPreference = async (req, res) => {
  const { items, back_urls } = req.body;

  // console.log('Items', body.items);

  const preferenceData = {
    body: {
      items: items,
      back_urls: back_urls,
      auto_return: 'approved',
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

export { createPreference };
