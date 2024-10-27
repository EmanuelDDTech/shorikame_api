import app from './app.js';
import { sequelize } from './database/database.js';
import { ProductCategory } from './models/ProductCategory.js';
import { FilterGroup } from './models/FilterGroup.js';
import { FilterValue } from './models/FilterValue.js';
import { FilterCategory } from './models/FilterCategory.js';
import { FilterValueProduct } from './models/FilterValueProduct.js';

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
