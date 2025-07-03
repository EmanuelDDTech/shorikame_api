import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';
import { FilterGroup } from './FilterGroup.js';

export const FilterValue = sequelize.define('filter_value', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  order: {
    type: DataTypes.INTEGER,
    // allowNull: false,
    defaultValue: 0,
  },
});

FilterGroup.hasMany(FilterValue, {
  foreignkey: 'filter_group_id',
  sourceKey: 'id',
});
FilterValue.belongsTo(FilterGroup, {
  foreignkey: 'filter_group_id',
  targetId: 'id',
});
