import express from 'express';
import { auth, role } from '../middleware/authMiddleware.js';
import { 
  verifyPermohonan, 
  signPermohonan, 
  getAllPermohonan, 
  updateProgressRT_RW,
  getAllUsers,
  getUserDetail
} from '../controllers/adminController.js';

const router = express.Router();

// Semua route di bawah ini membutuhkan login dan role admin
router.use(auth, role('admin'));

router.get('/permohonan', getAllPermohonan);
router.patch('/permohonan/:id/verify', verifyPermohonan);
router.patch('/permohonan/:id/progress-rt-rw', updateProgressRT_RW);
router.patch('/permohonan/:id/sign', signPermohonan);

// User Management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserDetail);

export default router;
