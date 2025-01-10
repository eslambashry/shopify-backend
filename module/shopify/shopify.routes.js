import { Router } from 'express';
import { createCheckout, fetchProducts, handleOrderPaid } from './shopify.controller.js';
const shopifyRouter = Router();

// Route to create checkout session
shopifyRouter.post('/create-checkout', createCheckout);

// Webhook to handle order payment event
shopifyRouter.post('/webhooks/order-paid', handleOrderPaid);

// Route to fetch products from Shopify
shopifyRouter.get('/fetch-products', fetchProducts);

export default shopifyRouter;
