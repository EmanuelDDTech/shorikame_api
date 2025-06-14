import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';
import { User } from './User.js';
import { Address } from './Address.js';
import { DeliveryCarrier } from './DeliveryCarrier.js';
import { DiscountCode } from './DiscountCode.js';

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
    type: DataTypes.ENUM('pendiente', 'completado', 'cancelado', 'pago pendiente'),
  },
  require_payment: {
    type: DataTypes.BOOLEAN,
  },
  payment_method: {
    type: DataTypes.ENUM('paypal', 'transferencia'),
  },
  amount_subtotal: {
    type: DataTypes.DOUBLE,
  },
  amount_total: {
    type: DataTypes.DOUBLE,
  },
  is_payed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  discount_amount: {
    type: DataTypes.DOUBLE,
  },
  invoice_required: {
    type: DataTypes.BOOLEAN,
  },
  amount_shipping: {
    type: DataTypes.DOUBLE,
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

Address.hasMany(SaleOrder, {
  foreignKey: 'address_id',
  sourceKey: 'id',
});
SaleOrder.belongsTo(Address, {
  foreignKey: 'address_id',
  targetId: 'id',
});

DeliveryCarrier.hasMany(SaleOrder, {
  foreignKey: 'delivery_carrier_id',
  sourceKey: 'id',
});
SaleOrder.belongsTo(DeliveryCarrier, {
  foreignKey: 'delivery_carrier_id',
  targetId: 'id',
});

DiscountCode.hasMany(SaleOrder, {
  foreignKey: 'discount_code_id',
  sourceKey: 'id',
});
SaleOrder.belongsTo(DiscountCode, {
  foreignKey: 'discount_code_id',
  targetId: 'id',
});
