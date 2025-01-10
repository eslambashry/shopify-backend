import {Schema,model} from 'mongoose';

const orderSchema = new Schema({
  shopifyOrderId: { type: String, required: true, unique: true },
  checkoutId: { type: String, required: true },
  customerName: String,
  customerEmail: String,
  totalPrice: { type: Number, required: true },
  items: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  }],
  orderStatus: { type: String, required: true },
});

const Order = model('Order', orderSchema);

export default Order;
