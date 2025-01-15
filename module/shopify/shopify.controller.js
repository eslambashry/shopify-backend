import axios from 'axios';
import { config } from 'dotenv';
import path from 'path';

config({ path: path.resolve('./config/.env') });

export const createCheckout = async (req, res, next) => {
  try {
    console.log('Request body:', req.body);  // Log the incoming request body

    // Extract line_items from the request body
    const { line_items } = req.body.checkout;

    // Validate if line_items exists and is an array
    if (!line_items || !Array.isArray(line_items)) {
      return res.status(400).json({ error: 'line_items is required and should be an array' });
    }

    // Prepare the data to send to Shopify to create the checkout
    const checkoutData = {
      checkout: {
        line_items: line_items.map(item => ({
          variant_id: item.variantId,
          quantity: item.quantity,
        })),
      },
    };

    const url = `https://${process.env.SHOPIFY_STORE}.myshopify.com/admin/api/2025-01/checkouts.json`;

    // Make a POST request to Shopify API to create the checkout
    const response = await axios.post(url, checkoutData, {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.SHOPIFY_API_TOKEN_PASSWORD,
      },
    });

    if (response.data.errors) {
      return res.status(400).json({ error: 'Checkout creation failed', response: response.data });
    }

    // If checkout creation is successful, extract necessary data
    if (response.data.checkout && response.data.checkout.web_url) {
      const checkoutUrl = response.data.checkout.web_url;
      res.status(200).json({ checkoutUrl });
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


