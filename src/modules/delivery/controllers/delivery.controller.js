import {
  getAvailableShippingOptions,
  getShippingZoneByZipCode,
} from '#modules/delivery/services/shipping.service.js';

const findAvailable = async (req, res) => {
  try {
    const quote = await buildShippingQuote(req.query);
    return res.json(quote.options);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ msg: error.message });
  }
};

const quoteShipping = async (req, res) => {
  try {
    const quote = await buildShippingQuote(req.method === 'GET' ? req.query : req.body);
    return res.json(quote);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ msg: error.message });
  }
};

const findZoneByZipCode = async (req, res) => {
  const { zipCode } = req.params;

  try {
    const zone = await getShippingZoneByZipCode(zipCode);
    return res.json(zone);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ msg: error.message });
  }
};

const buildShippingQuote = async (data) => {
  const weight = parseRequiredNumber(data.weight ?? data.totalWeight, 'weight');
  const orderTotal = parseOptionalNumber(
    data.orderTotal ?? data.order_total ?? data.subtotal ?? data.amountSubtotal,
    'orderTotal',
  );
  const zipCode = data.zipCode ?? data.zip ?? data.postalCode;

  return getAvailableShippingOptions({ weight, zipCode, orderTotal });
};

const parseRequiredNumber = (value, fieldName) => {
  if (value === undefined || value === null || value === '') {
    throw createControllerError(`El parámetro ${fieldName} es obligatorio`);
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    throw createControllerError(`El parámetro ${fieldName} debe ser un número mayor o igual a 0`);
  }

  return parsed;
};

const parseOptionalNumber = (value, fieldName) => {
  if (value === undefined || value === null || value === '') return 0;

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    throw createControllerError(`El parámetro ${fieldName} debe ser un número mayor o igual a 0`);
  }

  return parsed;
};

const createControllerError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

export { findAvailable, findZoneByZipCode, quoteShipping };
