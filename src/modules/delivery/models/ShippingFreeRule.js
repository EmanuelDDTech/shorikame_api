import { sequelize } from '#src/database/database.js';
import { DataTypes } from 'sequelize';

export const ShippingFreeRule = sequelize.define('shipping_free_rules', {
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
  min_order_amount: {
    type: DataTypes.DECIMAL(10, 2),
  },
  zone_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'shipping_zones',
      key: 'id',
    },
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});
