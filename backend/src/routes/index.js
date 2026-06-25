import express from 'express';
import chatbotRoutes from './chatbotRoutes.js';
import authRoutes from './authRoutes.js';
import adminRoutes from './adminRoutes.js';
import wargaRoutes from './wargaRoutes.js';
import userRoutes from './userRoutes.js';
import umkmRoutes from './umkmRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import eventRoutes from './eventRoutes.js';
import vaksinasiRoutes from './vaksinasiRoutes.js';
import orderRoutes from './orderRoutes.js';
import pengumumanRoutes from './pengumumanRoutes.js';
import aspirasiRoutes from './aspirasiRoutes.js';
import { auth } from '../middleware/authMiddleware.js';
import { syncData } from '../controllers/syncController.js';

const router = express.Router();

router.post('/sync', auth, syncData);

router.use('/chatbot', chatbotRoutes);
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/warga/surat', wargaRoutes);
router.use('/user', userRoutes);
router.use('/umkm', umkmRoutes);
router.use('/payment', paymentRoutes);
router.use('/events', eventRoutes);
router.use('/vaksinasi', vaksinasiRoutes);
router.use('/orders', orderRoutes);
router.use('/pengumuman', pengumumanRoutes);
router.use('/aspirasi', aspirasiRoutes);

export default router;
