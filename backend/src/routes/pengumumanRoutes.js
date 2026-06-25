import express from 'express';
import { auth, role } from '../middleware/authMiddleware.js';
import { 
  getAllPengumuman, 
  createPengumuman, 
  deletePengumuman 
} from '../controllers/pengumumanController.js';

const router = express.Router();

// Get all announcements (accessible by all logged-in users)
router.get('/', auth, getAllPengumuman);

// Create and delete announcements (admin only)
router.post('/', auth, role('admin'), createPengumuman);
router.delete('/:id', auth, role('admin'), deletePengumuman);

export default router;
