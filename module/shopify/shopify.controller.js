import axios from 'axios';
import { config } from 'dotenv';
import path from 'path';
import productModel from '../../DB/model/product.model.js';
import Order from '../../DB/model/order.model.js';

config({ path: path.resolve('./config/.env') });

export const fetchProducts = async (req, res, next) => {
  try {
    const url = `https://${process.env.SHOPIFY_STORE}.myshopify.com/admin/api/2023-10/products.json`;
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.SHOPIFY_API_TOKEN_PASSWORD,
      },
    });
    
    const products = response.data.products;

    // Save or update products in MongoDB
    for (const product of products) {
      const productData = {
        shopifyId: product.id,
        title: product.title,
        bodyHtml: product.body_html,
        vendor: product.vendor,
        productType: product.product_type,
        createdAt: product.created_at,
        updatedAt: product.updated_at,
        images: product.images.map((img) => img.src),
        variants: product.variants.map((variant) => ({
          id: variant.id,
          title: variant.title,
          price: variant.price,
          sku: variant.sku,
          inventory_quantity: variant.inventory_quantity,
        })),
      };

      // Use upsert (update or insert)
      await productModel.findOneAndUpdate(
        { shopifyId: product.id },
        productData,
        { upsert: true, new: true }
      );
    }

    res.status(200).json({ message: 'Products fetched and stored successfully.' });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const createCheckout = async (req, res, next) => {
    try {
      const { lineItems } = req.body;  // Extract line items from request body
  
      // Prepare the data to send to Shopify to create the checkout
      const checkoutData = {
        checkout: {
          line_items: lineItems.map(item => ({
            variant_id: item.variantId,
            quantity: item.quantity,
          })),
        },
      };
  
      const url = `https://${process.env.SHOPIFY_STORE}.myshopify.com/admin/api/2023-10/checkouts.json`;
  
      // Make a POST request to Shopify API to create the checkout
      const response = await axios.post(url, checkoutData, {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": process.env.SHOPIFY_API_TOKEN_PASSWORD,
        },
      });
  
      // Log the response for debugging purposes
      console.log('Shopify Checkout Response:', response.data);
      if (response.data.errors) {
        return res.status(400).json({ error: 'Checkout creation failed', response: response.data });
      }
  
      // If checkout creation is successful, extract necessary data
      if (response.data.checkout && response.data.checkout.web_url) {
        const checkoutUrl = response.data.checkout.web_url;
  
        // Create a new order object based on Shopify checkout response
        const orderData = {
          shopifyOrderId: response.data.checkout.id,  // Shopify order ID
          checkoutId: response.data.checkout.token,   // Checkout token
          totalPrice: response.data.checkout.total_price,
          customerName: response.data.checkout.customer ? response.data.checkout.customer.first_name : 'Guest',
          customerEmail: response.data.checkout.customer ? response.data.checkout.customer.email : 'Not provided',
          orderStatus: response.data.checkout.financial_status,  // Assuming the financial status as order status
          items: response.data.checkout.line_items.map(item => ({
            productId: item.variant_id,  // Assuming variant ID is the product ID (adjust if necessary)
            quantity: item.quantity,
            price: item.price,
          })),
        };
  
        // Save the order in the database
        const newOrder = new Order(orderData);
        await newOrder.save();
  
        // Send response with the checkout URL
        res.status(200).json({ checkoutUrl, orderId: newOrder._id });
      } else {
        return res.status(400).json({ error: 'Checkout creation failed', response: response.data });
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      res.status(500).json({ error: 'Failed to create checkout' });
    }
  };
  
  // Handle order paid webhook
  
export const handleOrderPaid = async (req, res) => {
    const order = req.body;
  
    try {
      // Ensure checkoutId is present
      if (!order.checkout_id) {
        return res.status(400).send('Checkout ID is required');
      }
  
      // Handle the order payment status here
      if (order.financial_status === 'paid') {
        console.log('Order paid:', order);
  
        // Handle item references and prepare them for saving
        const items = order.line_items.map(item => ({
          productId: item.variant_id.toString(),  // Convert variant_id to a string
          quantity: item.quantity,
          price: parseFloat(item.price),  // Convert price to number (assuming it's a string)
        }));
  
        // Create the order object to save in MongoDB
        const newOrder = new Order({
          shopifyOrderId: order.id.toString(),
          checkoutId: order.checkout_id,
          totalPrice: parseFloat(order.total_price),  // Convert total price to number
          customerName: order.customer ? order.customer.first_name : 'Guest', // Optional fallback
          customerEmail: order.customer ? order.customer.email : 'Not provided',
          orderStatus: 'paid',
          items,
        });
  
        // Save the order in the database
        await newOrder.save();
        console.log('New order saved:', newOrder);
  
        res.status(200).send('Webhook received and order processed successfully');
      } else {
        res.status(400).send('Order not paid');
      }
    } catch (error) {
      console.error('Error processing webhook:', error);
      res.status(500).send('Error processing webhook');
    }
  };