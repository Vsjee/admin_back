import { model, Schema } from 'mongoose';

const customersSchema = new Schema({
  fistName: String,
  lastName: String,
  cellphone: String,
  email: String,
  isActive: Boolean,
  document_type: String,
  document_id: Number,
  address: String,
  uid: String,
  creationDate: Number,
  modificationDate: Number,
  profile: {
    preferred_name: String,
    birthdate: Number,
  },
  kids_count: Number,
});

export default model('customer', customersSchema);
