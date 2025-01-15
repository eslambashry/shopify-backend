import { Router } from 'express';
import { createCheckout,  handleOrderPaid } from './shopify.controller.js';
const shopifyRouter = Router();


// Route to create checkout session
shopifyRouter.post('/create-checkout', createCheckout);

// Webhook to handle order payment event
shopifyRouter.post('/webhooks/order-paid', handleOrderPaid);



export default shopifyRouter;
