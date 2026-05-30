import { Op } from 'sequelize';

import { SaleOrder } from '#modules/sale/models/SaleOrder.js';
import { ShippingCarrier } from '#modules/delivery/models/ShippingCarrier.js';
import { ShippingCode } from '#modules/delivery/models/ShippingCode.js';
import { ShippingDisplayRule } from '#modules/delivery/models/ShippingDisplayRule.js';
import { ShippingFreeRule } from '#modules/delivery/models/ShippingFreeRule.js';
import { ShippingRate } from '#modules/delivery/models/ShippingRate.js';
import { ShippingZone } from '#modules/delivery/models/ShippingZone.js';

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

const roundMoney = (value) => Number((Math.round((value + Number.EPSILON) * 100) / 100).toFixed(2));

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

const findRateForCarrier = async ({ carrierId, zoneId, weight }) => {
  const weightFilter = {
    [Op.and]: [
      {
        [Op.or]: [{ min_weight: null }, { min_weight: { [Op.lte]: weight } }],
      },
      {
        [Op.or]: [{ max_weight: null }, { max_weight: { [Op.gte]: weight } }],
      },
    ],
  };

  const rate = await ShippingRate.findOne({
    where: {
      carrier_id: carrierId,
      zone_id: zoneId,
      ...weightFilter,
    },
    order: [
      ['max_weight', 'ASC'],
      ['id', 'ASC'],
    ],
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });

  if (rate) {
    return {
      rate: rate.get({ plain: true }),
      useExtraKgOverflow: false,
    };
  }

  const overflowRate = await ShippingRate.findOne({
    where: {
      carrier_id: carrierId,
      zone_id: zoneId,
      extra_kg_price: { [Op.gt]: 0 },
      [Op.or]: [{ min_weight: null }, { min_weight: { [Op.lte]: weight } }],
    },
    order: [
      ['max_weight', 'DESC'],
      ['id', 'ASC'],
    ],
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });

  if (!overflowRate) return null;

  return {
    rate: overflowRate.get({ plain: true }),
    useExtraKgOverflow: true,
  };
};

const calculateRatePrice = (rate, weight, useExtraKgOverflow = false) => {
  const basePrice = toNumber(rate.base_price);
  const extraKgPrice = toNumber(rate.extra_kg_price);

  if (extraKgPrice <= 0) return roundMoney(basePrice);

  const minWeight = toNumber(rate.min_weight);
  const maxWeight = rate.max_weight === null ? null : toNumber(rate.max_weight);
  let extraKg = 0;

  if (useExtraKgOverflow && maxWeight !== null) {
    extraKg = Math.ceil(Math.max(0, weight - maxWeight));
  } else if (maxWeight === null) {
    extraKg = Math.ceil(Math.max(0, weight - minWeight));
  }

  return roundMoney(basePrice + extraKg * extraKgPrice);
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
}) => {
  return {
    id: carrier.id,
    carrier_id: carrier.id,
    name: carrier.name,
    pricing_type_id: carrier.pricing_type_id,
    pricing_source: carrier.pricing_source,
    is_active: carrier.is_active,
    active: carrier.is_active,
    priority: carrier.priority,
    zone_id: zone.id,
    zone,
    zipcode: shippingCode.zipcode,
    air_shipping_available: shippingCode.air_shipping_available,
    price: finalPrice,
    amount: finalPrice,
    amount_shipping: finalPrice,
    is_free_shipping: Boolean(freeRule),
    free_rule_id: freeRule?.id ?? null,
    shipping_rate: {
      ...rate,
      calculated_price: calculatedPrice,
    },
    shipping_free_rule: freeRule,
    delivery_price_rules: [
      {
        id: rate.id,
        carrier_id: carrier.id,
        max_value: rate.max_weight,
        list_base_price: finalPrice,
      },
    ],
  };
};

const getAvailableShippingOptions = async ({ weight, zipCode, orderTotal = 0 }) => {
  const now = new Date();
  const { shippingCode, zone } = await getShippingZoneByZipCode(zipCode);

  const carriers = await ShippingCarrier.findAll({
    where: {
      is_active: true,
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

      const rateMatch = await findRateForCarrier({
        carrierId: carrier.id,
        zoneId: zone.id,
        weight,
      });

      if (!rateMatch) return null;

      const calculatedPrice = calculateRatePrice(
        rateMatch.rate,
        weight,
        rateMatch.useExtraKgOverflow,
      );
      const freeRule = await findMatchingFreeRule({
        carrierId: carrier.id,
        zoneId: zone.id,
        orderTotal,
      });
      const finalPrice = freeRule ? 0 : calculatedPrice;

      return buildShippingOption({
        carrier,
        rate: rateMatch.rate,
        zone,
        shippingCode,
        calculatedPrice,
        finalPrice,
        freeRule,
      });
    }),
  );

  return {
    zipCode: shippingCode.zipcode,
    zone,
    air_shipping_available: shippingCode.air_shipping_available,
    weight,
    order_total: orderTotal,
    options: options.filter(Boolean),
  };
};

export { getAvailableShippingOptions, getShippingZoneByZipCode };
