import { DataTypes } from 'sequelize';
import { sequelize } from '#src/database/database.js';
import { Product } from '#modules/product/models/Product.js';
import { User } from '#modules/user/models/User.js';

export const Cart = sequelize.define(
  'carts',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
