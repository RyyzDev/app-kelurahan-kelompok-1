import express from 'express';
import { auth, role } from '../middleware/authMiddleware.js';
import {
  createJadwal,
  getAllJadwal,
  updateJadwal,
  deleteJadwal,
  registerForVaksinasi,
  getMyVaksinasi,
  getVaksinasiRegistrationById
} from '../controllers/vaksinasiController.js';

const router = express.Router();

// Public routes
router.get('/', getAllJadwal);

// Authenticated user routes
router.get('/my-registrations', auth, getMyVaksinasi);
router.get('/my-registrations/:id', auth, getVaksinasiRegistrationById);
router.post('/:jadwalId/register', auth, registerForVaksinasi);

// Admin only routes
router.post('/', auth, role('admin'), createJadwal);
router.patch('/:id', auth, role('admin'), updateJadwal);
router.delete('/:id', auth, role('admin'), deleteJadwal);

export default router;
