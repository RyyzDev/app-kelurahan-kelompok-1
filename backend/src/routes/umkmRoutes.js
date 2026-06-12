import express from 'express';
import { auth, role } from '../middleware/authMiddleware.js';
import {
  registerToko,
  getMyToko,
  addProduk,
  updateProduk,
  deleteProduk,
  getPendingProduk,
  verifyProduk,
  getPublicProduk
} from '../controllers/umkmController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// --- PUBLIC ROUTES ---
router.get('/produk', getPublicProduk);

// --- WARGA ROUTES (Hanya warga yang sudah login) ---
router.post('/toko', auth, role('warga'), registerToko);
router.get('/toko/my', auth, role('warga'), getMyToko);
router.post('/produk', auth, role('warga'), upload.single('foto'), addProduk);
router.patch('/produk/:id', auth, role('warga'), upload.single('foto'), updateProduk);
router.delete('/produk/:id', auth, role('warga'), deleteProduk);

// --- ADMIN ROUTES (Hanya admin) ---
router.get('/admin/pending', auth, role('admin'), getPendingProduk);
router.patch('/admin/verify/:id', auth, role('admin'), verifyProduk);

export default router;
