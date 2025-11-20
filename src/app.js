import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import logger from './config/logger.js';

// Rutas
import authRoutes from '#modules/auth/routes/auth.routes.js';
import productRoutes from '#modules/product/routes/product.routes.js';
import categoryRoutes from '#modules/category/routes/category.routes.js';
import filterGroupRoutes from '#modules/filter/routes/filterGroup.routes.js';
import filterValueRoutes from '#modules/filter/routes/filterValue.routes.js';
import filterCategoryRoutes from '#modules/filter/routes/filterCategory.routes.js';
import productGalleryRoutes from '#modules/product/routes/productGallery.routes.js';
import filterProductRoutes from '#modules/filter/routes/filterValueProduct.routes.js';
import bannerRoutes from '#modules/banner/routes/banner.routes.js';
import productsRoutes from '#modules/product/routes/products.routes.js';
import carritoRoutes from '#modules/cart/routes/carrito.routes.js';
import addressRoutes from '#modules/address/routes/address.routes.js';
import paypalRoutes from '#modules/paypal/routes/paypal.routes.js';
import saleRoutes from '#modules/sale/routes/sale.routes.js';
import campaignTypeRoutes from '#modules/campaign/routes/campaignType.routes.js';
import campaignRoutes from '#modules/campaign/routes/campaign.routes.js';
import campaignAdminRoutes from '#modules/campaign/routes/campaignAdmin.routes.js';
import campaignProductRoutes from '#modules/campaign/routes/campaignProducts.routes.js';
import deliveryRoutes from '#modules/delivery/routes/delivery.routes.js';
import featuredProductRoutes from '#modules/product/routes/featuredProduct.routes.js';
import discountCodeRoutes from '#modules/discount/routes/discountCode.routes.js';
import usersRoutes from '#modules/user/routes/users.routes.js';

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

app.use(logger);
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
