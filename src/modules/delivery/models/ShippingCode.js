import { sequelize } from '#src/database/database.js';
import { DataTypes } from 'sequelize';

export const ShippingCode = sequelize.define('shipping_codes', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  zipcode: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  zone_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'shipping_zones',
      key: 'id',
    },
  },
  air_shipping_available: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});
