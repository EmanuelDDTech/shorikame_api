import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';
import { Product } from './Product.js';

export const ProductGallery = sequelize.define('product_gallery', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Product.hasMany(ProductGallery, {
  foreignKey: 'product_id',
  sourceKey: 'id',
});
ProductGallery.belongsTo(Product, {
  foreignKey: 'product_id',
  targetId: 'id',
});
