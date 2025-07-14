import { DataTypes } from 'sequelize';
import { sequelize } from '../../../database/database.js';
import { Product } from './Product.js';

export const FeaturedProduct = sequelize.define('featured_product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Product.hasOne(FeaturedProduct, {
  foreignKey: 'product_id',
  sourceKey: 'id',
});
FeaturedProduct.belongsTo(Product, {
  foreignKey: 'product_id',
  targetId: 'id',
});
