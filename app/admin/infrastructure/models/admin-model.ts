import { Schema, model } from 'mongoose';

const AdminsSchema = new Schema({
  user: String,
  password: String,
  is_active: Boolean,
  is_admin: Boolean,
  modification_date: Number,
});

export default model('admin', AdminsSchema);
