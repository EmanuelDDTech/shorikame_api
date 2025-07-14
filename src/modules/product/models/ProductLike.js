import { DataTypes } from 'sequelize';
import { sequelize } from '#src/database/database.js';
import { Product } from '#modules/product/Product.js';
import { User } from '#modules/user/models/User.js';

export const ProductLike = sequelize.define(
  'product_like',
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

Product.hasMany(ProductLike, {
  foreigKey: 'productId',
  sourceKey: 'id',
});
ProductLike.belongsTo(Product, {
  foreignKey: 'productId',
  targetId: 'id',
});

User.hasMany(ProductLike, {
  foreignKey: 'userId',
  sourceKey: 'id',
});
ProductLike.belongsTo(User, {
  foreignKey: 'userId',
  targetId: 'id',
});
