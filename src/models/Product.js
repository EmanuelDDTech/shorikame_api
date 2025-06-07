import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';
import { ProductCategory } from './ProductCategory.js';

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
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: true,
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
  discount: {
    type: DataTypes.DECIMAL,
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  stock_visible: {
    type: DataTypes.BOOLEAN,
    default: true,
  },
  weight: {
    type: DataTypes.DOUBLE,
  },
});

ProductCategory.hasMany(Product, {
  foreignKey: 'product_category_id',
  sourceKey: 'id',
});
Product.belongsTo(ProductCategory, {
  foreignKey: 'product_category_id',
  targetId: 'id',
});
