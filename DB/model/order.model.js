import {Schema,model} from 'mongoose';

// Order Schema and Model
const orderSchema = new Schema({
  shopifyId:{type: String},
  email: { type: String, required: true },
  customer: {
    id: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    defaultAddress: {
      address1: { type: String },
      city: { type: String },
      province: { type: String },
      country: { type: String },
      zip: { type: String },
    },
  },
  lineItems: [
    {
      id: { type: String },
      title: { type: String },
      quantity: { type: Number },
      price: { type: String },
      sku: { type: String },
    },
  ],
  totalPrice: { type: String },
  currency: { type: String },
  createdAt: { type: Date },
  updatedAt: { type: Date },
  billingAddress: {
    address1: { type: String },
    city: { type: String },
    province: { type: String },
    country: { type: String },
    zip: { type: String },
  },
  shippingAddress: {
    address1: { type: String },
    city: { type: String },
    province: { type: String },
    country: { type: String },
    zip: { type: String },
  },
});

const orderModel = model('Order', orderSchema);


export default orderModel;
