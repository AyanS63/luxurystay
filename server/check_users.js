import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to DB');
    const users = await User.find({}, 'username email role');
    console.log('Users:', users);
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
