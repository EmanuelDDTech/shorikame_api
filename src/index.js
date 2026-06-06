import app from './app.js';
import { sequelize } from './database/database.js';

async function main() {
  try {
    await sequelize.sync({ alter: false });

    app.listen(process.env.PORT);

    console.log('Server on port', process.env.PORT);
  } catch (error) {
    console.error('No se pudo establecer la conexión con la DB', error);
  }
}

// Vercel loads this module and expects an export instead of a listen() call.
export default app;

const isVercel = process.env.VERCEL === '1';

if (!isVercel) {
  main();
}
