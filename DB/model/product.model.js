import { Schema, model } from 'mongoose';

const productSchema = new Schema({
  shopifyId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  bodyHtml: String,
  vendor: String,
  productType: String,
  createdAt: Date,
  updatedAt: Date,
  images: [String],
  variants: [
    {
      id: String,
      title: String,
      price: String,
      sku: String,
      inventory_quantity: Number,
    },
  ],
},{timeseries:true});

export default model('Product', productSchema);
