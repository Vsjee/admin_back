import { model, Schema } from 'mongoose';

const accountsSchema = new Schema({
  customer_id: String,
  isActive: Boolean,
  type: String,
  creationDate: Number,
  discountCode: String,
  t_c: [{ ip: String, date: Number, version: String }],
});

export default model('account', accountsSchema);
