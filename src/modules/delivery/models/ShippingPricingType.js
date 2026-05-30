import { sequelize } from '#src/database/database.js';
import { DataTypes } from 'sequelize';

export const ShippingPricingType = sequelize.define('shipping_pricing_type', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  code: {
    type: DataTypes.TEXT,
  },
  description: {
    type: DataTypes.TEXT,
  },
});
