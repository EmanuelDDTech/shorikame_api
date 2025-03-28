import { Op } from 'sequelize';
import { DeliveryCarrier } from '../models/DeliveryCarrier.js';
import { DeliveryPriceRule } from '../models/DeliveryPriceRule.js';
import { Product } from '../models/Product.js';

const findAvailable = async (req, res) => {
  const { weight, zipCode } = req.query;
  const serviceLevels = ['delivery'];
  let freeDelivery = {};

  try {
    const deliveries = await DeliveryCarrier.findAll({
      where: {
        free_over: false,
        servicelevel: serviceLevels,
      },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        {
          model: DeliveryPriceRule,
          required: true,
          order: [['max_value', 'ASC']],
          where: {
            max_value: {
              [Op.gte]: weight,
            },
          },
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      ],
    });

    if (weight <= 0) {
      freeDelivery = await findFreeDelivery();
      deliveries.push(freeDelivery);
    }

    const localDelivery = await findLocalDelivery();
    if (localDelivery) deliveries.push(localDelivery);

    return res.json(deliveries);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const findFreeDelivery = async () => {
  try {
    return await DeliveryCarrier.findOne({
      where: {
        free_over: true,
      },
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const findLocalDelivery = async () => {
  try {
    return await DeliveryCarrier.findOne({
      where: {
        free_over: true,
        servicelevel: 'local',
      },
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export { findAvailable };
