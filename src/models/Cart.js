import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';
import { Product } from './Product.js';
import { User } from './User.js';

export const Cart = sequelize.define(
  'cart',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    timestamps: true,
  },
);

Product.hasMany(Cart, {
  foreigKey: 'productId',
  sourceKey: 'id',
});
Cart.belongsTo(Product, {
  foreignKey: 'productId',
  targetId: 'id',
});

User.hasMany(Cart, {
  foreignKey: 'userId',
  sourceKey: 'id',
});
Cart.belongsTo(User, {
  foreignKey: 'userId',
  targetId: 'id',
});