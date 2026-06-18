import express from 'express';
import { checkout, handleNotification } from '../controllers/paymentController.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

// User must be logged in to checkout
router.post('/checkout', auth, checkout);

// Midtrans will call this endpoint
router.post('/notification', handleNotification);

export default router;
