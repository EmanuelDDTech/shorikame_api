import { DataTypes } from 'sequelize';
import { sequelize } from '../../../database/database.js';
import { User } from '#modules/user/models/User.js';

export const Address = sequelize.define('address', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  street: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  colony: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  zip: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.hasMany(Address, {
  foreignKey: 'user_id',
  sourceKey: 'id',
});

Address.belongsTo(User, {
  foreignKey: 'user_id',
  targetId: 'id',
});
