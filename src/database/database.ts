import { Sequelize } from 'sequelize';
import pg from 'pg';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// const filePath = join(__dirname, '/../certificados', 'us-east-2-bundle.pem');

export const sequelize = new Sequelize(
  process.env.DB_DATABASE!,
  process.env.DB_USER!,
  process.env.DB_PASS!,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 6543,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
      // Transaction mode (PgBouncer) no soporta prepared statements
      statement_timeout: 10000,
    },
    dialectModule: pg,
    logging: false,
    pool: {
      max: 1, // Una conexión por instancia serverless
      min: 0,
      acquire: 10000,
      idle: 1000,
    },
  },
);
