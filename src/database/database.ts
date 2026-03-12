import Sequelize from 'sequelize';
import pg from 'pg';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const filePath = join(__dirname, '/../certificados', 'us-east-2-bundle.pem');

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
        ca: fs.readFileSync(filePath).toString(),
      },
    },
    dialectModule: pg,
    pool: {
      max: 10, // Máximo número de conexiones
      min: 0, // Mínimo número de conexiones
      acquire: 30000, // Tiempo máximo para obtener una conexión (ms)
      idle: 10000, // Tiempo que una conexión inactiva espera antes de cerrarse (ms)
    },
  },
);
