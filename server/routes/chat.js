import express from 'express';
import Message from '../models/Message.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get chat history between current user and another user
router.get('/history/:userId', verifyToken, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId }
      ]
    })
    .sort({ createdAt: 1 })
    .populate('sender', 'username role')
    .populate('receiver', 'username role');

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chat history', error: error.message });
  }
});

// Mark messages as read
router.put('/read/:userId', verifyToken, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const otherUserId = req.params.userId;

    await Message.updateMany(
      { sender: otherUserId, receiver: currentUserId, read: false },
      { $set: { read: true } }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking messages as read', error: error.message });
  }
});

export default router;
