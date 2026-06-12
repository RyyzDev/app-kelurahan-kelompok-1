import express from 'express';
import chatbotRoutes from './chatbotRoutes.js';
import authRoutes from './authRoutes.js';
import adminRoutes from './adminRoutes.js';
import wargaRoutes from './wargaRoutes.js';
import userRoutes from './userRoutes.js';
import umkmRoutes from './umkmRoutes.js';
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

export default router;
