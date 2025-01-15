import { config } from 'dotenv';
import path from 'path';
config({ path: path.resolve('./config/.env') });

import axios from 'axios';
import orderModel from '../../DB/model/order.model.js';

export const fetchOrders = async (req, res) => {
  try {
    // Fetch orders from Shopify
    const url = `https://${process.env.SHOPIFY_STORE}.myshopify.com/admin/api/2025-01/orders.json?status=any`;
    const response = await axios.get(url,
      {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.SHOPIFY_API_TOKEN_PASSWORD,
      },
    });

    const orders = response.data.orders;

    // console.log(orders);
    
    // Save or update orders in MongoDB
    for (const order of orders) {
      const orderData = {
        shopifyId: order.id,
        email: order.email,
        customer: {
          id: order.customer?.id,
          firstName: order.customer?.first_name,
          lastName: order.customer?.last_name,
          email: order.customer?.email,
          defaultAddress: order.customer?.default_address,
        },
        lineItems: order.line_items.map((item) => ({
          id: item.id,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
          sku: item.sku,
        })),
        totalPrice: order.total_price,
        currency: order.currency,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
        billingAddress: order.billing_address,
        shippingAddress: order.shipping_address,
      };

      // Upsert order in MongoDB
      await orderModel.findOneAndUpdate(
        { shopifyId: order.id },
        orderData,
        { upsert: true, new: true }
      );
    }

    res.status(200).json({ message: 'Orders fetched and stored successfully.',orders });
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

export const createOrders = async (req, res) => {
  try {

    const newOrder = req.body
    // Fetch orders from Shopify
    const url = `https://${process.env.SHOPIFY_STORE}.myshopify.com/admin/api/2025-01/orders.json`;
    const response = await axios.post(url,newOrder,
      {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.SHOPIFY_API_TOKEN_PASSWORD,
      },
    });

    const orders = response.data.order;

    
    // console.log(orders);

      // Upsert order in MongoDB
      await orderModel.findOneAndUpdate(
        { shopifyId: orders.id },
        orders,
        { upsert: true, new: true }
      );
    

    res.status(200).json({ message: 'Orders created and stored successfully.',orders });
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({ error: 'Failed to create orders' });
  }
};

export const cancelOrders = async (req, res) => {
  try {

    const id = req.params.id

    console.log(id);
    
    // Fetch orders from Shopify
    const url = `https://${process.env.SHOPIFY_STORE}.myshopify.com/admin/api/2025-01/orders/${id}/cancel.json`;
    const response = await axios.post(url,
      {},
      {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.SHOPIFY_API_TOKEN_PASSWORD,
      },
    });

    const orders = response.data.order;

    
    console.log(orders);

      // Upsert order in MongoDB
      await orderModel.findOneAndUpdate(
        { shopifyId: orders.id },
        orders,
        { upsert: true, new: true }
      );
    

    res.status(200).json({ message: 'Orders canceld and stored successfully.',orders });
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({ error: 'Failed to cancel orders' });
  }
};

export const closeOrders = async (req, res) => {
  try {

    const id = req.params.id

    console.log(id);
    
    // Fetch orders from Shopify
    const url = `https://${process.env.SHOPIFY_STORE}.myshopify.com/admin/api/2025-01/orders/${id}/close.json`;
    const response = await axios.post(url,
      {},
      {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.SHOPIFY_API_TOKEN_PASSWORD,
      },
    });

    const orders = response.data.order;

    
    // console.log(orders);

      // Upsert order in MongoDB
      await orderModel.findOneAndUpdate(
        { shopifyId: orders.id },
        orders,
        { upsert: true, new: true }
      );
    

    res.status(200).json({ message: 'Orders closed and stored successfully.',orders });
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({ error: 'Failed to cancel orders' });
  }
};

export const reOpenOrders = async (req, res) => {
  try {

    const id = req.params.id

    // console.log(id);
    
    // Fetch orders from Shopify
    const url = `https://${process.env.SHOPIFY_STORE}.myshopify.com/admin/api/2025-01/orders/${id}/open.json`;
    const response = await axios.post(url,
      {},
      {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.SHOPIFY_API_TOKEN_PASSWORD,
      },
    });

    const orders = response.data.order;

    
    // console.log(orders);

      // Upsert order in MongoDB
      await orderModel.findOneAndUpdate(
        { shopifyId: orders.id },
        orders,
        { upsert: true, new: true }
      );
    

    res.status(200).json({ message: 'Orders opened and stored successfully.',orders });
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({ error: 'Failed to cancel orders' });
  }
};


export const singleOrders = async (req, res) => {
  try {

    const id = req.params.id
    // Fetch orders from Shopify
    const url = `https://${process.env.SHOPIFY_STORE}.myshopify.com/admin/api/2025-01/orders/${id}.json`;
    const response = await axios.get(url,
      {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.SHOPIFY_API_TOKEN_PASSWORD,
      },
    });

    const orders = response.data.order;

    res.status(200).json({ message: 'Orders found successfully.',orders });
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};


export const ordersCount = async (req, res) => {
  try {

    // Fetch orders from Shopify
    const url = `https://${process.env.SHOPIFY_STORE}.myshopify.com/admin/api/2025-01/orders/count.json?status=any`;
    const response = await axios.get(url,
      {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.SHOPIFY_API_TOKEN_PASSWORD,
      },
    });

    const count = response.data.count;

    res.status(200).json({ message: `${count} Orders` });
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};


export const findOrderByIdAndUpdate = async (req, res, next) => {
  try {
    const newData = req.body; // Data to update
    const id = req.params.id; // Customer ID from the URL
    console.log("Data to update:", newData);

    const url = `https://${process.env.SHOPIFY_STORE}.myshopify.com/admin/api/2023-10/orders/${id}.json`;

    // Make the PUT request
    const response = await axios.put(
      url,
      {
        order: newData, // Payload under "customer" key
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": process.env.SHOPIFY_API_TOKEN_PASSWORD,
        },
      }
    );

    const order = response.data.order;

    res.status(200).json({ message: "order updated successfully", order });
  } catch (error) {
    console.error("Error updating order:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to update order", details: error.response?.data });
  }
};

export const deleteOrder = async (req, res, next) => {

  const id = req.params.id




  try {
    const url = `https://${process.env.SHOPIFY_STORE}.myshopify.com/admin/api/2025-01/orders/${id}.json`;
    const response = await axios.delete(url, {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.SHOPIFY_API_TOKEN_PASSWORD,
      },
    });
    

    const orderExsisted = await orderModel.findOne({
      shopifyId:id
    })
  
    if(!orderExsisted){
      res.status(404).json({message:"order not found"})
    }
  
    await orderModel.deleteOne({ shopifyId: id });



    res.status(200).json({ message: 'order deleted' });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};


export const createDraftOrders = async (req, res) => {
  try {
    // Fetch orders from Shopify
    const url = `https://${process.env.SHOPIFY_STORE}.myshopify.com/admin/api/2025-1/draft_orders.json`;
    const response = await axios.post(url,
      {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.SHOPIFY_API_TOKEN_PASSWORD,
      },
    });

    const orders = response.data.orders;

    // Save or update orders in MongoDB
    for (const order of orders) {
      const orderData = {
        shopifyId: order.id,
        email: order.email,
        customer: {
          id: order.customer?.id,
          firstName: order.customer?.first_name,
          lastName: order.customer?.last_name,
          email: order.customer?.email,
          defaultAddress: order.customer?.default_address,
        },
        lineItems: order.line_items.map((item) => ({
          id: item.id,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
          sku: item.sku,
        })),
        totalPrice: order.total_price,
        currency: order.currency,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
        billingAddress: order.billing_address,
        shippingAddress: order.shipping_address,
      };

      // Upsert order in MongoDB
      await orderModel.findOneAndUpdate(
        { shopifyId: order.id },
        orderData,
        { upsert: true, new: true }
      );
    }

    res.status(200).json({ message: 'Orders fetched and stored successfully.',orders });
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};