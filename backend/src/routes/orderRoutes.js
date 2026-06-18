import express from 'express';
import { auth } from '../middleware/authMiddleware.js';
import { getMyOrders, getOrderById } from '../controllers/orderController.js';

const router = express.Router();

router.get('/', auth, getMyOrders);
router.get('/:id', auth, getOrderById);

export default router;
