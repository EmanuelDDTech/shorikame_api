import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';
import { uniqueId } from '../utils/index.js';

export const Product = sequelize.define('products', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  discount: {
    type: DataTypes.DECIMAL,
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});
