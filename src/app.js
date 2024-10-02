import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';

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
app.use(productRoutes);

export default app;
