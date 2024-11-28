import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import categoryRoutes from './routes/category.routes.js';
import filterGroupRoutes from './routes/filterGroup.routes.js';
import filterValueRoutes from './routes/filterValue.routes.js';
import filterCategoryRoutes from './routes/filterCategory.routes.js';
import productGalleryRoutes from './routes/productGallery.routes.js';
import filterProductRoutes from './routes/filterValueProduct.routes.js';

const app = express();

app.use(morgan('dev'));
app.use(express.json());

const whitelist = [process.env.FRONTEND_URL];

if (process.argv[2] === '--insomnia') {
  whitelist.push(undefined);
}

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Error de CORS'));
    }
  },
};

app.use(cors(corsOptions));

app.use('/auth', authRoutes);
app.use('/categoria', categoryRoutes);
app.use('/producto', productRoutes);
app.use('/filtro-grupo', filterGroupRoutes);
app.use('/filtro-valor', filterValueRoutes);
app.use('/filtro-categoria', filterCategoryRoutes);
app.use('/product-gallery', productGalleryRoutes);
app.use('/filtro-producto', filterProductRoutes);

export default app;
