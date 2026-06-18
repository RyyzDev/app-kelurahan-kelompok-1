import express from 'express';
import { auth, role } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getMyEventRegistrations,
  getRegistrationById
} from '../controllers/eventController.js';

const router = express.Router();

// --- AUTHENTICATED USER ROUTES ---
router.get('/my-registrations', auth, getMyEventRegistrations);
router.get('/my-registrations/:id', auth, getRegistrationById);
router.post('/:id/register', auth, registerForEvent);

// --- PUBLIC ROUTES ---
router.get('/', getAllEvents);
router.get('/:id', getEventById);

// --- ADMIN ONLY ROUTES ---
router.post('/', auth, role('admin'), upload.single('foto'), createEvent);
router.patch('/:id', auth, role('admin'), upload.single('foto'), updateEvent);
router.delete('/:id', auth, role('admin'), deleteEvent);

export default router;
