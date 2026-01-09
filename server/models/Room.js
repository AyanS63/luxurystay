import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true },
  type: { 
    type: String, 
    required: true,
    enum: ['Single', 'Double', 'Suite', 'Deluxe', 'Penthouse']
  },
  pricePerNight: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Available', 'Occupied', 'Cleaning', 'Maintenance'],
    default: 'Available'
  },
  description: { type: String },
  amenities: [{ type: String }], // e.g., ["TV", "WiFi", "Mini Bar"]
  images: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Room', RoomSchema);
