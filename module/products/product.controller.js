import axios from 'axios';
import { config } from 'dotenv';
import path from 'path';
import productModel from '../../DB/model/product.model.js';
 
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

    res.status(200).json({ message: 'Products fetched and stored successfully.',products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { title, bodyHtml, vendor, productType, variants, images } = req.body;

    // Validate required fields
    if (!title || !variants || variants.length === 0) {
      return res.status(400).json({ error: 'Title and at least one variant are required.' });
    }

    // Construct payload for Shopify API
    const payload = {
      product: {
        title,
        body_html: bodyHtml,
        vendor,
        product_type: productType,
        variants: variants.map((variant) => ({
          title: variant.title,
          price: variant.price,
          sku: variant.sku,
          inventory_quantity: variant.inventory_quantity,
        })),
        images: images?.map((image) => ({ src: image })),
      },
    };

    // Create product in Shopify
    const url = `https://${process.env.SHOPIFY_STORE}.myshopify.com/admin/api/2023-10/products.json`;
    const response = await axios.post(url, payload, {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.SHOPIFY_API_TOKEN_PASSWORD,
      },
    });

    const product = response.data.product;

    // Save product in MongoDB
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

    await productModel.create(productData);

    res.status(201).json({ message: 'Product created successfully.', product });
  } catch (error) {
    console.error('Error creating product:', error.message);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

export const fetchProductsNumber = async (req, res, next) => {
  try {
    const url = `https://${process.env.SHOPIFY_STORE}.myshopify.com/admin/api/2023-10/products.json`;
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.SHOPIFY_API_TOKEN_PASSWORD,
      },
    });
    
    const count = response.data.count;


    res.status(200).json({ message: `Products Number is ${count}` });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const getSingleProducts = async (req, res, next) => {

  const id = req.params.id

  try {
    const url = `https://${process.env.SHOPIFY_STORE}.myshopify.com/admin/api/2023-10/products/${id}.json`;
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.SHOPIFY_API_TOKEN_PASSWORD,
      },
    });
    
    const product = response.data.product;

    res.status(200).json({ message: 'Products found',product });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const deleteProduct = async (req, res, next) => {

  const id = req.params.id


  const productExsited = await productModel.findOne({
    shopifyId:id
  })

  if(!productExsited){
    res.status(404).json({message:"product not found"})
  }


  try {
    const url = `https://${process.env.SHOPIFY_STORE}.myshopify.com/admin/api/2023-10/products/${id}.json`;
    const response = await axios.delete(url, {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.SHOPIFY_API_TOKEN_PASSWORD,
      },
    });
    
    const product = response.data.product;

    await productModel.deleteOne({ shopifyId: id });



    res.status(200).json({ message: 'Products deleted',product });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};


