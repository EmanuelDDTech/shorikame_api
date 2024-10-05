import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';
import { FilterGroup } from './FilterGroup.js';
import { ProductCategory } from './ProductCategory.js';

export const FilterCategory = sequelize.define('filter_category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});

FilterGroup.hasMany(FilterCategory, {
  foreignKey: 'filter_group_id',
  sourceKey: 'id',
});
FilterCategory.belongsTo(FilterGroup, {
  foreignKey: 'filter_group_id',
  targetId: 'id',
});

ProductCategory.hasMany(FilterCategory, {
  foreignKey: 'product_category_id',
  sourceKey: 'id',
});
FilterCategory.belongsTo(ProductCategory, {
  foreignKey: 'product_category_id',
  targetId: 'id',
});
