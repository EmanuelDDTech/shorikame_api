import { sequelize } from '#src/database/database.js';
import { DataTypes } from 'sequelize';

export const ShippingDisplayRule = sequelize.define('shipping_display_rules', {
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
  condition_type: {
    type: DataTypes.ENUM('MIN_ORDER_TOTAL', 'MAX_ORDER_TOTAL', 'USAGE_LIMIT'),
  },
  value: {
    type: DataTypes.FLOAT,
  },
  starts_at: {
    type: DataTypes.DATE,
  },
  ends_at: {
    type: DataTypes.DATE,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});
