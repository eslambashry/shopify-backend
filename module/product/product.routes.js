import { Router } from 'express';
import * as ProductController from './product.controller.js';

const productRoutes = Router();

// Route to fetch products from Shopify and store them in MongoDB
productRoutes.get('/fetch', ProductController.fetchProducts);

export default productRoutes;
