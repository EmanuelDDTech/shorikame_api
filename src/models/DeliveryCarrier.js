import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

export const DeliveryCarrier = sequelize.define('delivery_carrier', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  active: {
    type: DataTypes.BOOLEAN,
  },
  fixed_price: {
    type: DataTypes.DOUBLE,
  },
  servicelevel: {
    type: DataTypes.STRING,
  },
  free_over: {
    type: DataTypes.BOOLEAN,
  },
});
