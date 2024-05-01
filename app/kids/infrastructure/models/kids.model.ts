import { Schema, model } from 'mongoose';

const KidsSchema = new Schema({
  customer_id: String,
  name: String,
  age: Number,
  years: Number,
  gender: String,
  creation_date: Number,
  modification_date: Number,
  is_active: Boolean,
  avatar: String,
  family_context: Array,
  personal_context: Array,
  socioemotional_context: Array,
  aspects: Array,
  personality: Array,
  t_c: [{ ip: String, date: Number, version: String }],
});

export default model('kid', KidsSchema);
