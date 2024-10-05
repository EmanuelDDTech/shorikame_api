import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';
import { FilterValue } from './FilterValue.js';
import { Product } from './Product.js';

export const FilterValueProduct = sequelize.define('filter_value_product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});

FilterValue.hasMany(FilterValueProduct, {
  foreignkey: 'filter_value_id',
  sourceKey: 'id',
});
FilterValueProduct.belongsTo(FilterValue, {
  foreignkey: 'filter_value_id',
  targetId: 'id',
});

Product.hasMany(FilterValueProduct, {
  foreignkey: 'product_id',
  sourceKey: 'id',
});
FilterValueProduct.belongsTo(Product, {
  foreignkey: 'product_id',
  targetId: 'id',
});
