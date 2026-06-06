import { sequelize } from '#src/database/database.js';
import { DataTypes } from 'sequelize';

export const ShippingZone = sequelize.define('shipping_zones', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
  },
});
