import mongoose from 'mongoose';
import { server_config } from './environment';

mongoose.connect(server_config.MONGO_URI);
