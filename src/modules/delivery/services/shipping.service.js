import { Op } from 'sequelize';

import { Cart } from '#modules/cart/models/Cart.js';
import { Product } from '#modules/product/models/Product.js';
import { SaleOrder } from '#modules/sale/models/SaleOrder.js';
import { ShippingCarrier } from '#modules/delivery/models/ShippingCarrier.js';
import { ShippingCode } from '#modules/delivery/models/ShippingCode.js';
import { ShippingDisplayRule } from '#modules/delivery/models/ShippingDisplayRule.js';
import { ShippingFreeRule } from '#modules/delivery/models/ShippingFreeRule.js';
import { ShippingPricingType } from '#modules/delivery/models/ShippingPricingType.js';
import { ShippingRate } from '#modules/delivery/models/ShippingRate.js';
import { ShippingZone } from '#modules/delivery/models/ShippingZone.js';

const SHIPPING_PRICING_TYPES = {
  FIXED_PLUS_EXTRA: 'FIXED_PLUS_EXTRA',
  WEIGHT_RANGE: 'WEIGHT_RANGE',
  PER_KG: 'PER_KG',
};

const SHIPPING_CARRIER_TYPES = {
  DELIVERY: 'DELIVERY',
  PICKUP: 'PICKUP',
};

const SHIPPING_METHODS = {
  DELIVERY: 'envio',
  PICKUP: 'sucursal',
};

const PICKUP_OPTION_ID = 'pickup-branch';
const PICKUP_OPTION_NAME = 'Recoger en sucursal';

const VOLUMETRIC_WEIGHT_DIVISOR = 5000;
const PRODUCT_SHIPPING_ATTRIBUTES = ['id', 'weight', 'length', 'width', 'height'];

const createShippingError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const toNumber = (value, fallback = 0) => {
  if (value === null || value === undefined || value === '') return fallback;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const roundMoney = (value) => Number(Math.ceil(value));

const normalizeZipCode = (zipCode) => String(zipCode ?? '').trim();

const getActiveDateFilter = (now) => ({
  [Op.and]: [
    {
      [Op.or]: [{ starts_at: null }, { starts_at: { [Op.lte]: now } }],
    },
    {
      [Op.or]: [{ ends_at: null }, { ends_at: { [Op.gte]: now } }],
    },
  ],
});

const getShippingZoneByZipCode = async (zipCode) => {
  const normalizedZipCode = normalizeZipCode(zipCode);

  if (!normalizedZipCode) {
    throw createShippingError('El código postal es obligatorio');
  }

  const shippingCode = await ShippingCode.findOne({
    where: { zipcode: normalizedZipCode },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });

  if (!shippingCode) {
    throw createShippingError('No hay cobertura para este código postal', 404);
  }

  const zone = await ShippingZone.findByPk(shippingCode.zone_id, {
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });

  if (!zone) {
    throw createShippingError('La zona de envío no existe', 404);
  }

  return {
    shippingCode: shippingCode.get({ plain: true }),
    zone: zone.get({ plain: true }),
  };
};

const getProductFromLine = (line) => {
  return line.product ?? line.Product ?? line.products ?? line;
};

const getProductIdFromLine = (line) => {
  return line.product_id ?? line.productId ?? line.product?.id ?? line.Product?.id ?? line.id;
};

const getQuantityFromLine = (line) => {
  const quantity = toNumber(line.quantity, 1);
  return quantity > 0 ? quantity : 1;
};

const hydrateProductLine = async (line) => {
  const product = getProductFromLine(line);

  if (
    product &&
    (product.weight !== undefined ||
      product.length !== undefined ||
      product.width !== undefined ||
      product.height !== undefined)
  ) {
    return {
      quantity: getQuantityFromLine(line),
      product,
    };
  }

  const productId = getProductIdFromLine(line);

  if (!productId) {
    throw createShippingError('Cada producto del carrito debe incluir id o datos de medidas');
  }

  const productModel = await Product.findByPk(productId, {
    attributes: PRODUCT_SHIPPING_ATTRIBUTES,
  });

  if (!productModel) {
    throw createShippingError(`Producto ${productId} no encontrado`, 404);
  }

  return {
    quantity: getQuantityFromLine(line),
    product: productModel.get({ plain: true }),
  };
};

const calculateCartShippingWeight = async (products) => {
  if (!Array.isArray(products) || products.length === 0) {
    throw createShippingError('El carrito debe incluir al menos un producto');
  }

  const hydratedLines = await Promise.all(products.map((line) => hydrateProductLine(line)));

  const summary = hydratedLines.reduce(
    (totals, line) => {
      const { product, quantity } = line;
      const physicalWeight = toNumber(product.weight) * quantity;
      const volumetricWeight =
        (toNumber(product.length) * toNumber(product.width) * toNumber(product.height) * quantity) /
        VOLUMETRIC_WEIGHT_DIVISOR;

      totals.physical_weight += physicalWeight;
      totals.volumetric_weight += volumetricWeight;

      return totals;
    },
    {
      physical_weight: 0,
      volumetric_weight: 0,
    },
  );

  const physicalWeight = roundWeight(summary.physical_weight);
  const volumetricWeight = roundWeight(summary.volumetric_weight);
  const chargeableWeight = Math.max(physicalWeight, volumetricWeight);

  return {
    physical_weight: physicalWeight,
    volumetric_weight: volumetricWeight,
    chargeable_weight: chargeableWeight,
    weight_source: volumetricWeight > physicalWeight ? 'VOLUMETRIC' : 'PHYSICAL',
  };
};

const getProductsFromIds = async (productsIds) => {
  if (!Array.isArray(productsIds) || productsIds.length === 0) {
    throw createShippingError('Debe proporcionar una lista de IDs de productos');
  }

  const products = await Product.findAll({
    where: { id: productsIds },
    attributes: PRODUCT_SHIPPING_ATTRIBUTES,
  });

  if (products.length !== productsIds.length) {
    const foundIds = products.map((p) => p.id);
    const missingIds = productsIds.filter((id) => !foundIds.includes(id));
    throw createShippingError(
      `No se encontraron los siguientes productos: ${missingIds.join(', ')}`,
      404,
    );
  }

  return products.map((p) => p.get({ plain: true }));
};

const getCartShippingWeightByUserId = async (userId) => {
  const cartProducts = await Cart.findAll({
    where: { userId },
    attributes: ['id', 'quantity'],
    include: {
      model: Product,
      attributes: PRODUCT_SHIPPING_ATTRIBUTES,
    },
  });

  if (!cartProducts.length) {
    throw createShippingError('El carrito no tiene productos');
  }

  return calculateCartShippingWeight(
    cartProducts.map((cartProduct) => cartProduct.get({ plain: true })),
  );
};

const roundWeight = (value) =>
  Number((Math.round((value + Number.EPSILON) * 1000) / 1000).toFixed(3));

const buildRateWhere = ({ carrierId, zoneId, pricingTypeId, filters = [] }) => {
  const conditions = [
    {
      carrier_id: carrierId,
      zone_id: zoneId,
    },
  ];

  if (pricingTypeId !== undefined) {
    conditions.push({ pricing_type_id: pricingTypeId });
  }

  return {
    [Op.and]: [...conditions, ...filters],
  };
};

const getPricingTypeForCarrier = async (carrier) => {
  if (!carrier.pricing_type_id) return null;

  const pricingType = await ShippingPricingType.findByPk(carrier.pricing_type_id, {
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });

  return pricingType?.get({ plain: true }) ?? null;
};

const findRateForCarrier = async ({ carrierId, zoneId, weight, pricingType }) => {
  const pricingTypeCode = pricingType?.code;
  const pricingTypeId = pricingType?.id;

  if (pricingTypeCode === SHIPPING_PRICING_TYPES.FIXED_PLUS_EXTRA) {
    return findFixedPlusExtraRate({ carrierId, zoneId, pricingTypeId });
  }

  if (pricingTypeCode === SHIPPING_PRICING_TYPES.PER_KG) {
    return findPerKgRate({ carrierId, zoneId, weight, pricingTypeId });
  }

  return findWeightRangeRate({ carrierId, zoneId, weight, pricingTypeId });
};

const findFixedPlusExtraRate = async ({ carrierId, zoneId, pricingTypeId }) => {
  return findRateWithPricingFallback({
    carrierId,
    zoneId,
    pricingTypeId,
    order: [
      ['max_weight', 'ASC'],
      ['id', 'ASC'],
    ],
  });
};

const findWeightRangeRate = async ({ carrierId, zoneId, weight, pricingTypeId }) => {
  return findRateWithPricingFallback({
    carrierId,
    zoneId,
    pricingTypeId,
    filters: [
      {
        [Op.or]: [{ min_weight: null }, { min_weight: { [Op.lt]: weight } }],
      },
      {
        max_weight: { [Op.gt]: weight },
      },
    ],
    order: [
      ['max_weight', 'ASC'],
      ['id', 'ASC'],
    ],
  });
};

const findPerKgRate = async ({ carrierId, zoneId, weight, pricingTypeId }) => {
  return findRateWithPricingFallback({
    carrierId,
    zoneId,
    pricingTypeId,
    filters: [
      {
        max_weight: { [Op.gt]: weight },
      },
    ],
    order: [
      ['max_weight', 'ASC'],
      ['id', 'ASC'],
    ],
  });
};

const findRateWithPricingFallback = async ({
  carrierId,
  zoneId,
  pricingTypeId,
  filters = [],
  order,
}) => {
  if (!pricingTypeId) {
    return findRate({
      where: buildRateWhere({ carrierId, zoneId, filters }),
      order,
    });
  }

  const exactRate = await findRate({
    where: buildRateWhere({ carrierId, zoneId, pricingTypeId, filters }),
    order,
  });

  if (exactRate) return exactRate;

  return findRate({
    where: buildRateWhere({ carrierId, zoneId, pricingTypeId: null, filters }),
    order,
  });
};

const findRate = async ({ where, order }) => {
  const rate = await ShippingRate.findOne({
    where,
    order,
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });

  return rate?.get({ plain: true }) ?? null;
};

const calculateRatePrice = (rate, weight, pricingTypeCode) => {
  const basePrice = toNumber(rate.base_price);
  const extraKgPrice = toNumber(rate.extra_kg_price);
  const maxWeight = rate.max_weight === null ? null : toNumber(rate.max_weight);

  if (pricingTypeCode === SHIPPING_PRICING_TYPES.FIXED_PLUS_EXTRA) {
    const extraKg = maxWeight === null ? 0 : Math.ceil(Math.max(0, weight - maxWeight));
    return roundMoney(basePrice + extraKg * extraKgPrice);
  }

  if (pricingTypeCode === SHIPPING_PRICING_TYPES.PER_KG) {
    return roundMoney(Math.ceil(weight) * basePrice);
  }

  return roundMoney(basePrice);
};

const getCarrierUsageCount = async (carrierId, rule) => {
  const where = {
    delivery_carrier_id: carrierId,
    state: {
      [Op.ne]: 'cancelado',
    },
  };

  if (rule.starts_at || rule.ends_at) {
    where.createdAt = {};

    if (rule.starts_at) {
      where.createdAt[Op.gte] = rule.starts_at;
    }

    if (rule.ends_at) {
      where.createdAt[Op.lte] = rule.ends_at;
    }
  }

  return SaleOrder.count({
    where,
  });
};

const ruleIsMet = async ({ rule, carrierId, orderTotal }) => {
  const value = toNumber(rule.value);

  if (rule.condition_type === 'MIN_ORDER_TOTAL') {
    return orderTotal >= value;
  }

  if (rule.condition_type === 'MAX_ORDER_TOTAL') {
    return orderTotal <= value;
  }

  if (rule.condition_type === 'USAGE_LIMIT') {
    if (value <= 0) return false;

    const usageCount = await getCarrierUsageCount(carrierId, rule);
    return usageCount < value;
  }

  return false;
};

const carrierShouldBeDisplayed = async ({ carrierId, orderTotal, now }) => {
  const rules = await ShippingDisplayRule.findAll({
    where: {
      carrier_id: carrierId,
      is_active: true,
      ...getActiveDateFilter(now),
    },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });

  for (const rule of rules) {
    const isMet = await ruleIsMet({
      rule: rule.get({ plain: true }),
      carrierId,
      orderTotal,
    });

    if (!isMet) return false;
  }

  return true;
};

const findMatchingFreeRule = async ({ carrierId, zoneId, orderTotal }) => {
  const rules = await ShippingFreeRule.findAll({
    where: {
      carrier_id: carrierId,
      is_active: true,
      min_order_amount: { [Op.lte]: orderTotal },
      [Op.or]: [{ zone_id: zoneId }, { zone_id: null }],
    },
    order: [
      ['min_order_amount', 'DESC'],
      ['id', 'ASC'],
    ],
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });

  if (!rules.length) return null;

  const rule = rules.find((freeRule) => Number(freeRule.zone_id) === Number(zoneId)) ?? rules[0];
  return rule.get({ plain: true });
};

const buildShippingOption = ({
  carrier,
  rate,
  zone,
  shippingCode,
  calculatedPrice,
  finalPrice,
  freeRule,
  pricingType,
}) => {
  return {
    id: carrier.id,
    carrier_id: carrier.id,
    carrier_type: carrier.type,
    name: carrier.name,
    pricing_type_id: carrier.pricing_type_id,
    pricing_type: pricingType,
    pricing_source: carrier.pricing_source,
    is_active: carrier.is_active,
    active: carrier.is_active,
    priority: carrier.priority,
    zone_id: zone?.id ?? null,
    zone,
    zipcode: shippingCode?.zipcode ?? null,
    air_shipping_available: shippingCode?.air_shipping_available ?? false,
    price: finalPrice,
    amount: finalPrice,
    amount_shipping: finalPrice,
    is_free_shipping: Boolean(freeRule),
    free_rule_id: freeRule?.id ?? null,
    shipping_rate: rate
      ? {
          ...rate,
          calculated_price: calculatedPrice,
        }
      : null,
    shipping_free_rule: freeRule,
    delivery_price_rules: rate
      ? [
          {
            id: rate.id,
            carrier_id: carrier.id,
            max_value: rate.max_weight,
            list_base_price: finalPrice,
          },
        ]
      : [],
  };
};

const resolveCarrierTypeFromQuoteType = (type) => {
  if (type === SHIPPING_CARRIER_TYPES.DELIVERY) {
    return SHIPPING_CARRIER_TYPES.DELIVERY;
  }

  if (type === SHIPPING_CARRIER_TYPES.PICKUP) {
    return SHIPPING_CARRIER_TYPES.PICKUP;
  }

  throw createShippingError('El parámetro type debe ser "DELIVERY" o "PICKUP"');
};

const getAvailableShippingOptions = async ({
  weight,
  zipCode,
  orderTotal = 0,
  type = SHIPPING_CARRIER_TYPES.DELIVERY,
}) => {
  const now = new Date();
  const carrierType = resolveCarrierTypeFromQuoteType(type);

  let shippingCode = null;
  let zone = null;

  if (carrierType === SHIPPING_CARRIER_TYPES.DELIVERY) {
    if (!normalizeZipCode(zipCode)) {
      throw createShippingError('El código postal es obligatorio para type=DELIVERY');
    }

    const zoneData = await getShippingZoneByZipCode(zipCode);
    shippingCode = zoneData.shippingCode;
    zone = zoneData.zone;
  }

  const carriers = await ShippingCarrier.findAll({
    where: {
      is_active: true,
      type: carrierType,
    },
    order: [
      ['priority', 'ASC'],
      ['id', 'ASC'],
    ],
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });

  const options = await Promise.all(
    carriers.map(async (carrierModel) => {
      const carrier = carrierModel.get({ plain: true });
      const shouldDisplay = await carrierShouldBeDisplayed({
        carrierId: carrier.id,
        orderTotal,
        now,
      });

      if (!shouldDisplay) return null;

      if (carrier.type === SHIPPING_CARRIER_TYPES.PICKUP) {
        return buildShippingOption({
          carrier,
          rate: null,
          zone,
          shippingCode,
          calculatedPrice: 0,
          finalPrice: 0,
          freeRule: null,
          pricingType: null,
        });
      }

      const pricingType = await getPricingTypeForCarrier(carrier);

      const rateMatch = await findRateForCarrier({
        carrierId: carrier.id,
        zoneId: zone?.id,
        weight: weight,
        pricingType,
      });

      if (!rateMatch) return null;

      const calculatedPrice = calculateRatePrice(rateMatch, weight, pricingType?.code);
      const freeRule = await findMatchingFreeRule({
        carrierId: carrier.id,
        zoneId: zone?.id,
        orderTotal,
      });
      const finalPrice = freeRule ? 0 : calculatedPrice;

      return buildShippingOption({
        carrier,
        rate: rateMatch,
        zone,
        shippingCode,
        calculatedPrice,
        finalPrice,
        freeRule,
        pricingType,
      });
    }),
  );

  return {
    zipCode: shippingCode?.zipcode ?? null,
    zone,
    air_shipping_available: shippingCode?.air_shipping_available ?? false,
    weight,
    // weight_summary: weightSummary,
    order_total: orderTotal,
    options: options.filter(Boolean),
  };
};

const getAvailableShippingOptionsFromUserCart = async ({
  userId,
  zipCode,
  orderTotal = 0,
  type = SHIPPING_CARRIER_TYPES.DELIVERY,
}) => {
  const weightSummary = await getCartShippingWeightByUserId(userId);

  const quote = await getAvailableShippingOptions({
    weight: weightSummary.chargeable_weight,
    zipCode,
    orderTotal,
    type,
  });

  return {
    ...quote,
    weight_summary: weightSummary,
  };
};

const getAvailableShippingOptionsFromProducts = async ({
  productsIds,
  zipCode,
  orderTotal = 0,
  type = SHIPPING_CARRIER_TYPES.DELIVERY,
}) => {
  const products = await getProductsFromIds(productsIds);
  const weightSummary = await calculateCartShippingWeight(products);

  const quote = await getAvailableShippingOptions({
    weight: weightSummary.chargeable_weight,
    zipCode,
    orderTotal,
    type,
  });

  return {
    ...quote,
    weight_summary: weightSummary,
  };
};

export {
  calculateCartShippingWeight,
  getAvailableShippingOptions,
  getAvailableShippingOptionsFromUserCart,
  getAvailableShippingOptionsFromProducts,
  getShippingZoneByZipCode,
};
