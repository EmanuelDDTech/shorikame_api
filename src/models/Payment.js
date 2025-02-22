import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';
import { SaleOrder } from './SaleOrder.js';

export const Payment = sequelize.define('payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  transaction_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

SaleOrder.hasMany(Payment, {
  foreignKey: 'sale_order_id',
  sourceKey: 'id',
});
Payment.belongsTo(SaleOrder, {
  foreignKey: 'sale_order_id',
  targetId: 'id',
});
