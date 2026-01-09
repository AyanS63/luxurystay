import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  totalAmount: { type: Number, required: true },
  paymentIntentId: { type: String }, // For refunds
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'CheckedIn', 'CheckedOut', 'Cancelled', 'Rejected'],
    default: 'Pending'
  },
  guests: { type: Number, default: 1 },
  extras: [{
    name: { type: String, required: true },
    price: { type: Number, required: true }
  }],
  specialRequests: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Booking', BookingSchema);
