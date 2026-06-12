import express from 'express';
import { auth } from '../middleware/authMiddleware.js';
import { getProfile, updateProfile, changePassword } from '../controllers/userController.js';

const router = express.Router();

router.use(auth);

router.get('/profile', getProfile);
router.patch('/profile', updateProfile);
router.put('/change-password', changePassword);

export default router;
