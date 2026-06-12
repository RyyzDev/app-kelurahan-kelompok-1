import express from 'express';
import { auth } from '../middleware/authMiddleware.js';
import { sendMessage } from '../controllers/chatbotController.js';

const router = express.Router();

// Chatbot membutuhkan login
router.post('/message', auth, sendMessage);

export default router;
