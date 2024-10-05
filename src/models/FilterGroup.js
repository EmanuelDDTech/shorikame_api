import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

export const FilterGroup = sequelize.define('filter_group', {
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
});
