import { sequelize } from '#src/database/database.js';
import { DataTypes } from 'sequelize';

export const ShippingInsurance = sequelize.define('shipping_insurance', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  percentage: {
    type: DataTypes.INTEGER,
  },
});
