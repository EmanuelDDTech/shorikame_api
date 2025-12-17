import app from './app';
import { sequelize } from './database/database';

async function main() {
  try {
    await sequelize.sync({ alter: false });

    app.listen(process.env.PORT);

    console.log('Server on port', process.env.PORT);
  } catch (error) {
    console.error('No se pudo establecer la conexión con la DB', error);
  }
}

main();
