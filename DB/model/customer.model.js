import  { model, Schema } from 'mongoose';

const AddressSchema = new Schema({
  id: { type: String},
  customer_id: { type: String },
  first_name: { type: String },
  last_name: { type: String },
  company: { type: String },
  address1: { type: String },
  address2: { type: String },
  city: { type: String },
  province: { type: String },
  country: { type: String },
  zip: { type: String },
  phone: { type: String },
  name: { type: String },
  province_code: { type: String },
  country_code: { type: String },
  country_name: { type: String },
  default: { type: Boolean },
});

const CustomerSchema = new Schema({
  shopifyId: { type: String, required: true, unique: true },
  email: { type: String },
  createdAt: { type: Date },
  updatedAt: { type: Date },
  firstName: { type: String },
  lastName: { type: String },
  ordersCount: { type: Number },
  state: { type: String },
  totalSpent: { type: String },
  lastOrderId: { type: String },
  note: { type: String },
  verifiedEmail: { type: Boolean },
  multipassIdentifier: { type: String },
  taxExempt: { type: Boolean },
  tags: { type: String },
  lastOrderName: { type: String },
  currency: { type: String },
  phone: { type: String },
  addresses: [AddressSchema],
  taxExemptions: [String],
  emailMarketingConsent: {
    state: { type: String },
    optInLevel: { type: String },
    consentUpdatedAt: { type: Date },
  },
  smsMarketingConsent: {
    state: { type: String },
    optInLevel: { type: String },
    consentUpdatedAt: { type: Date, default: null },
    consentCollectedFrom: { type: String },
  },
  adminGraphqlApiId: { type: String },
  defaultAddress: AddressSchema,
});

const Customer = model('Customer', CustomerSchema);

export default Customer;
