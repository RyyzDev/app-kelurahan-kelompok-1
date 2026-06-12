import express from 'express';
import { auth, role } from '../middleware/authMiddleware.js';
import { 
  createPermohonan, 
  getMyPermohonan, 
  getPermohonanDetail, 
  getAvailableServices 
} from '../controllers/wargaController.js';

const router = express.Router();

// Semua route warga membutuhkan login
router.use(auth);

// Mendapatkan daftar layanan tersedia (bisa diakses semua role yang login)
router.get('/layanan', getAvailableServices);

// Route khusus role 'warga'
router.post('/permohonan', role('warga'), createPermohonan);
router.get('/permohonan', role('warga'), getMyPermohonan);
router.get('/permohonan/:id', role('warga'), getPermohonanDetail);

export default router;
