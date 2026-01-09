import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to DB');
    
    // Update Staff
    await User.findOneAndUpdate(
      { email: 'chatstaff@gmail.com' },
      { role: 'hotel_staff' }
    );
    console.log('Updated chatstaff to hotel_staff');

    // Update Receptionist
    await User.findOneAndUpdate(
      { email: 'chatreceptionist@gmail.com' },
      { role: 'receptionist' }
    );
    console.log('Updated chatreceptionist to receptionist');

    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
