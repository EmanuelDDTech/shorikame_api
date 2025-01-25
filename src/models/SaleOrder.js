import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';
import { User } from './User.js';

export const SaleOrder = sequelize.define('sale_order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  state: {
    type: DataTypes.ENUM('sale', 'draft', 'canceled'),
  },
  require_payment: {
    type: DataTypes.BOOLEAN,
  },
  amount_total: {
    type: DataTypes.DOUBLE,
  },
  is_payed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  invoice_required: {
    type: DataTypes.BOOLEAN,
  },
});

User.hasMany(SaleOrder, {
  foreignKey: 'user_id',
  sourceKey: 'id',
});
SaleOrder.belongsTo(User, {
  foreignKey: 'user_id',
  targetId: 'id',
});
