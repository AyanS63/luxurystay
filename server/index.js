import express from 'express'; // Server entry point
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/auth.js';
import roomRoutes from './routes/rooms.js';
import bookingRoutes from './routes/bookings.js';
import reviewRoutes from './routes/reviewRoutes.js';
import billingRoutes from './routes/billing.js';
import taskRoutes from './routes/tasks.js';
import reportRoutes from './routes/reports.js';
import userRoutes from './routes/users.js';
import searchRoutes from './routes/search.js';
import chatRoutes from './routes/chat.js';
import eventRoutes from './routes/eventRoutes.js';
import inquiryRoutes from './routes/inquiries.js';
import notificationRoutes from './routes/notifications.js';
import Message from './models/Message.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST"]
  }
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connection established successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => {
  res.send('LuxuryStay HMS API');
});

// Socket.io Logic
io.on('connection', (socket) => {
  socket.on('join_room', (userId) => {
    socket.join(userId);
  });

  socket.on('send_message', async (data) => {
    const { sender, receiver, message } = data;
    try {
      const newMessage = new Message({ sender, receiver, message });
      await newMessage.save();
      
      // Populate sender details before emitting
      await newMessage.populate('sender', 'username role');

      io.to(receiver).emit('receive_message', newMessage);
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  socket.on('disconnect', () => {
    // User disconnected
  });
});

httpServer.listen(PORT, () => {

  console.log(`Server is running on port: ${PORT}`);
});
