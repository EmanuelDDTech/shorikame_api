import Sequelize from 'sequelize';
import fs from 'fs';

export const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync('./../us-east-2-bundle.pem').toString(),
      },
    },
  },
);
