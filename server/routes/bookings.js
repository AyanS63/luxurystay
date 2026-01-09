import express from 'express';
import { createBooking, getBookings, getBooking, updateBookingStatus, deleteBooking, createPaymentIntent } from '../controllers/bookingController.js';
import { verifyToken, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken); // All booking routes require auth

router.post('/create-payment-intent', createPaymentIntent);
router.post('/', createBooking);
router.get('/', getBookings);
router.get('/:id', getBooking);
router.put('/:id/status', updateBookingStatus); // Access control handled in controller
router.delete('/:id', checkRole(['admin', 'manager']), deleteBooking);

export default router;
