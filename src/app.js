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
import bannerRoutes from './routes/banner.routes.js';
import productsRoutes from './routes/products.routes.js';
import carritoRoutes from './routes/carrito.routes.js';
import addressRoutes from './routes/address.routes.js';
import paypalRoutes from './routes/paypal.routes.js';
import saleRoutes from './routes/sale.routes.js';
import campaignTypeRoutes from './routes/campaignType.routes.js';
import campaignRoutes from './routes/campaign.routes.js';
import campaignAdminRoutes from './routes/campaignAdmin.routes.js';
import campaignProductRoutes from './routes/campaignProducts.routes.js';
import deliveryRoutes from './routes/delivery.routes.js';
import featuredProductRoutes from './routes/featuredProduct.routes.js';
import discountCodeRoutes from './routes/discountCode.routes.js';
import usersRoutes from './routes/users.routes.js';

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
app.use('/banner', bannerRoutes);
app.use('/productos', productsRoutes);
app.use('/carrito', carritoRoutes);
app.use('/address', addressRoutes);
app.use('/paypal', paypalRoutes);
app.use('/ordenes', saleRoutes);
app.use('/campanas-tipos', campaignTypeRoutes);
app.use('/campanas', campaignRoutes);
app.use('/campanas-admin', campaignAdminRoutes);
app.use('/campanas-productos', campaignProductRoutes);
app.use('/delivery', deliveryRoutes);
app.use('/productos-destacados', featuredProductRoutes);
app.use('/codigo-descuento', discountCodeRoutes);
app.use('/users', usersRoutes);

export default app;
