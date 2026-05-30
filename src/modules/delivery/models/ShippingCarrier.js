import { sequelize } from '#src/database/database.js';
import { DataTypes } from 'sequelize';

export const ShippingCarrier = sequelize.define('shipping_carrier', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  pricing_type_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'shipping_pricing_types',
      key: 'id',
    },
  },
  pricing_source: {
    type: DataTypes.ENUM('TABLE', 'API'),
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  priority: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});
