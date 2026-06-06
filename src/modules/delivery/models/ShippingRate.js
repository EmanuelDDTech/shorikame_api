import { sequelize } from '#src/database/database.js';
import { DataTypes } from 'sequelize';

export const ShippingRate = sequelize.define('shipping_rates', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  carrier_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'shipping_carriers',
      key: 'id',
    },
  },
  pricing_type_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'shipping_pricing_types',
      key: 'id',
    },
  },
  min_weight: {
    type: DataTypes.FLOAT,
  },
  max_weight: {
    type: DataTypes.FLOAT,
  },
  base_price: {
    type: DataTypes.DECIMAL(10, 2),
  },
  extra_kg_price: {
    type: DataTypes.DECIMAL(10, 2),
  },
  zone_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'shipping_zones',
      key: 'id',
    },
  },
});
