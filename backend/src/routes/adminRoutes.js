import express from 'express';
import { auth, role } from '../middleware/authMiddleware.js';
import { 
  verifyPermohonan, 
  signPermohonan, 
  getAllPermohonan, 
  updateProgressRT_RW,
  getAllUsers,
  getUserDetail,
  getDashboardStats,
  getVaksinAntrianList,
  getVaksinAntrianDetail,
  updateVaksinAntrianStatus,
  getEventAntrianList,
  getEventAntrianDetail
} from '../controllers/adminController.js';

const router = express.Router();

// Semua route di bawah ini membutuhkan login dan role admin
router.use(auth, role('admin'));

router.get('/dashboard/stats', getDashboardStats);
router.get('/permohonan', getAllPermohonan);
router.patch('/permohonan/:id/verify', verifyPermohonan);
router.patch('/permohonan/:id/progress-rt-rw', updateProgressRT_RW);
router.patch('/permohonan/:id/sign', signPermohonan);

// Antrean Management
router.get('/antrian/vaksin', getVaksinAntrianList);
router.get('/antrian/vaksin/:id', getVaksinAntrianDetail);
router.patch('/antrian/vaksin/:id/status', updateVaksinAntrianStatus);
router.get('/antrian/event', getEventAntrianList);
router.get('/antrian/event/:id', getEventAntrianDetail);

// User Management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserDetail);

export default router;
