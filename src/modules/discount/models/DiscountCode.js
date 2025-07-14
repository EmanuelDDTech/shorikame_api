import { DataTypes } from 'sequelize';
import { sequelize } from '#src/database/database.js';

export const DiscountCode = sequelize.define('discount_code', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  discount_type: {
    type: DataTypes.ENUM('fijo', 'porcentaje'),
    allowNull: false,
    defaultValue: 'fijo',
  },
  discount_value: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  min_purchase: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  max_discount: {
    type: DataTypes.DECIMAL(10, 2),
  },
  usage_limit: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  times_used: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  expires_at: {
    type: DataTypes.DATE,
  },
});
