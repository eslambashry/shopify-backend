import axios from 'axios';
import { config } from 'dotenv'
import path from 'path'
config({path: path.resolve('./config/.env')})
import productModel from '../../DB/model/product.model.js';

export const fetchProducts = async (req, res, next) => {
  try {

    const url = `https://elnasr-eg.myshopify.com/admin/api/2023-10/products.json`;
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

    res.status(200).json({ message: 'Products fetched and stored successfully.'});
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};
