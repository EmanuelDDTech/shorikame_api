import { DataTypes } from 'sequelize';
import { sequelize } from '#src/database/database.js';
import { Product } from '#modules/product/models/Product.js';
import { SaleOrder } from '#modules/sale/models/SaleOrder.js';

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

Product.hasMany(SaleCart, {
  foreignKey: 'product_id',
  sourceKey: 'id',
});
SaleCart.belongsTo(Product, {
  foreignKey: 'product_id',
  targetId: 'id',
});

SaleOrder.hasMany(SaleCart);
SaleCart.belongsTo(SaleOrder);
