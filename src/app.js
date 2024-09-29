import express from 'express';
import userRoutes from './routes/users.routes.js';
import productRoutes from './routes/product.routes.js';
import morgan from 'morgan';

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use(userRoutes);
app.use(productRoutes);

export default app;
