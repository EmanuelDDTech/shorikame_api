import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';
import { Product } from './Product.js';
import { SaleOrder } from './SaleOrder.js';

export const SaleCart = sequelize.define('sale_cart', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price_unit: {
    type: DataTypes.DOUBLE,
  },
  subtotal: {
    type: DataTypes.DOUBLE,
  },
  discount: {
    type: DataTypes.DOUBLE,
  },
});

Product.hasMany(SaleCart);
SaleCart.belongsTo(Product);

SaleOrder.hasMany(SaleCart);
SaleCart.belongsTo(SaleOrder);
