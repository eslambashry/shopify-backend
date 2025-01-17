import express from 'express';
import { connectionDB } from './DB/connection.js';
import { config } from 'dotenv';
import path from 'path';
import cors from 'cors';
import color from '@colors/colors';

const app = express();
const port = process.env.PORT || 8000;

// Load environment variables
config({ path: path.resolve('./config/.env') });
console.log("Loaded environment variables:", process.env);

// Middleware
app.use(express.json());
app.use(cors());

// Global Error Handling for JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error("Bad JSON:", err.message);
    return res.status(400).json({ error: "Invalid JSON payload" });
  }
  next(err);
});

// Test Route
app.get('/', (req, res) => res.send('Hello World!'.random.bgBlack));

// Routes
import customerRoutes from './module/customers/customer.routes.js';
import productRoutes from './module/products/product.routes.js';
import shopifyRouter from './module/shopify/shopify.routes.js';
import orderRouters from './module/orders/order.routes.js';

app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/shopify', shopifyRouter);
app.use('/api/orders', orderRouters);

// Database Connection
connectionDB();

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`.cyan.bold);
});
