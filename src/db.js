import pg from 'pg';
import fs from 'fs';
import { DB_DATABASE, DB_HOST, DB_PASS, DB_PORT, DB_USER } from './config.js';

export const pool = new pg.Pool({
  user: DB_USER,
  host: DB_HOST,
  password: DB_PASS,
  database: DB_DATABASE,
  port: DB_PORT,
  ssl: {
    ca: fs.readFileSync('C:/Users/PC/Emanuel/Proyectos_personales/us-east-2-bundle.pem').toString(),
  },
});
