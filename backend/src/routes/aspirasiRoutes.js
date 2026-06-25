import express from 'express';
import { auth, role } from '../middleware/authMiddleware.js';
import { createAspirasi, getAllAspirasi } from '../controllers/aspirasiController.js';

const router = express.Router();

// Warga: Kirim aspirasi baru (butuh login)
router.post('/', auth, createAspirasi);

// Admin: Lihat daftar semua aspirasi (butuh login & role admin)
router.get('/', auth, role('admin'), getAllAspirasi);

export default router;
