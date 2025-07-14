import { DataTypes } from 'sequelize';
import { sequelize } from '#src/database/database.js';

export const ProductCategory = sequelize.define('product_category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  parent_id: {
    type: DataTypes.INTEGER,
  },
  parent_path: {
    type: DataTypes.STRING,
  },
});
