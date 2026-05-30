import {
  getAvailableShippingOptionsFromUserCart,
  getAvailableShippingOptionsFromProducts,
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

  if (!zipCode) {
    throw createControllerError('El parámetro zipCode es obligatorio');
  }

  if (userId) {
    return getAvailableShippingOptionsFromUserCart({ userId, zipCode });
  } else if (productsIds && Array.isArray(productsIds) && productsIds.length > 0) {
    return getAvailableShippingOptionsFromProducts({ productsIds, zipCode });
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
