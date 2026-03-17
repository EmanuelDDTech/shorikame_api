import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '#src/database/database.js';
import { uniqueId } from '#src/utils/index';

interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  verified: boolean;
  isAdmin: boolean;
  token: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'verified' | 'isAdmin' | 'token'> {}

export interface UserInstance extends Model<UserAttributes, UserCreationAttributes>, UserAttributes {}

export const User = sequelize.define<UserInstance,
  UserAttributes>('users',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    token: {
      type: DataTypes.STRING,
      defaultValue: () => uniqueId(),
    },
  },
  {
    timestamps: true,
  },
);
