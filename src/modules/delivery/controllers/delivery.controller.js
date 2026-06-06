import {
  getAvailableShippingOptionsFromUserCart,
  getAvailableShippingOptionsFromProducts,
  getShippingZoneByZipCode,
} from '#modules/delivery/services/shipping.service.js';

const SHIPPING_CARRIER_TYPES = {
  DELIVERY: 'DELIVERY',
  PICKUP: 'PICKUP',
};

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
    const quote = await buildShippingQuote(req.body);
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

const buildShippingQuote = async (data = {}) => {
  const productsIds = data.productsIds;
  const userId = data.userId;
  const zipCode = data.zipCode;
  const type = String(data.type ?? SHIPPING_CARRIER_TYPES.DELIVERY)
    .trim()
    .toUpperCase();

  if (type !== SHIPPING_CARRIER_TYPES.DELIVERY && type !== SHIPPING_CARRIER_TYPES.PICKUP) {
    throw createControllerError('El parámetro type debe ser "DELIVERY" o "PICKUP"');
  }

  if (type === SHIPPING_CARRIER_TYPES.DELIVERY && !zipCode) {
    throw createControllerError('El parámetro zipCode es obligatorio para type=delivery');
  }

  if (userId) {
    return getAvailableShippingOptionsFromUserCart({ userId, zipCode, type });
  } else if (productsIds && Array.isArray(productsIds) && productsIds.length > 0) {
    return getAvailableShippingOptionsFromProducts({ productsIds, zipCode, type });
  } else {
    throw createControllerError(
      'Debe proporcionar un userId o una lista de productos para cotizar el envío',
    );
  }
};

const createControllerError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

export { findAvailable, findZoneByZipCode, quoteShipping };
