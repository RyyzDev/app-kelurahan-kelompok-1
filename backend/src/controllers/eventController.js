import prisma from '../lib/prisma.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';
import Joi from 'joi';

const eventSchema = Joi.object({
  nama_event: Joi.string().min(3).required(),
  deskripsi: Joi.string().allow('', null),
  tanggal: Joi.date().iso().required(),
  lokasi: Joi.string().allow('', null),
});

/**
 * Create a new event
 */
export const createEvent = async (req, res) => {
  try {
    console.log("Received body:", req.body);
    const { error, value } = eventSchema.validate(req.body);
    if (error) {
      // console.error("Joi validation error:", error.details[0].message);
      return res.status(400).json({ success: false, message: error.details[0].message });
    }
    
    // console.log("Validated value:", value);
    // console.log("Received file:", req.file);

    const foto_url = req.file ? `/uploads/event/${req.file.filename}` : null;

    const event = await prisma.event.create({
      data: {
        ...value,
        foto_url
      }
    });

    return successResponse(res, event, 201);
  } catch (err) {
    console.error("Error creating event:", err);
    return errorResponse(res, err);
  }
};

/**
 * Get all events (public or admin)
 * Dynamically updates status if date has passed
 */
export const getAllEvents = async (req, res) => {
  try {
    // Atomically update all events that have passed and are still 'aktif'
    await prisma.event.updateMany({
      where: {
        tanggal: {
          lt: new Date()
        },
        status: 'aktif'
      },
      data: {
        status: 'berakhir'
      }
    });

    // Fetch the fresh list of all events
    const events = await prisma.event.findMany({
      orderBy: {
        tanggal: 'desc'
      }
    });

    return successResponse(res, events);
  } catch (err) {
    console.error("Error in getAllEvents:", err);
    return errorResponse(res, err);
  }
};

/**
 * Get a single event by ID
 */
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return errorResponse(res, { message: 'Event tidak ditemukan' }, 404);
    return successResponse(res, event);
  } catch (err) {
    return errorResponse(res, err);
  }
};

/**
 * Update an event
 */
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateSchema = eventSchema.fork(Object.keys(eventSchema.describe().keys), (schema) => schema.optional());
    const { error, value } = updateSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    
    const foto_url = req.file ? `/uploads/event/${req.file.filename}` : undefined;
    
    const event = await prisma.event.update({
      where: { id },
      data: {
        ...value,
        ...(foto_url && { foto_url })
      }
    });

    return successResponse(res, event);
  } catch (err) {
    return errorResponse(res, err);
  }
};

/**
 * Delete an event
 */
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.event.delete({ where: { id } });
    return successResponse(res, { message: 'Event berhasil dihapus.' });
  } catch (err) {
    return errorResponse(res, err);
  }
};

/**
 * Register the logged-in user for an event
 */
export const registerForEvent = async (req, res) => {
  try {
    const { id: eventId } = req.params;
    const userId = req.user.id;

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event || event.status !== 'aktif') {
      return errorResponse(res, { message: 'Event tidak tersedia atau sudah berakhir.' }, 404);
    }
    
    // Check if already registered
    const existingRegistration = await prisma.eventRegistration.findUnique({
      where: { user_id_event_id: { user_id: userId, event_id: eventId } }
    });

    if (existingRegistration) {
      return errorResponse(res, { message: 'Anda sudah terdaftar di event ini.' }, 409);
    }

    const registration = await prisma.eventRegistration.create({
      data: {
        user_id: userId,
        event_id: eventId,
      }
    });

    return successResponse(res, registration, 201);
  } catch (err) {
    return errorResponse(res, err);
  }
};

/**
 * Get all event registrations for the logged-in user
 */
export const getMyEventRegistrations = async (req, res) => {
  try {
    const userId = req.user.id;
    const registrations = await prisma.eventRegistration.findMany({
      where: { user_id: userId },
      include: {
        event: true // Include full event details
      },
      orderBy: {
        event: {
          tanggal: 'desc'
        }
      }
    });
    return successResponse(res, registrations);
  } catch (err) {
    return errorResponse(res, err);
  }
};

/**
 * Get a single event registration by ID for the logged-in user
 */
export const getRegistrationById = async (req, res) => {
  try {
    const { id: registrationId } = req.params;
    const userId = req.user.id;

    const registration = await prisma.eventRegistration.findUnique({
      where: { id: registrationId },
      include: {
        event: true,
        user: {
          select: {
            nik: true,
            nama_lengkap: true
          }
        }
      }
    });

    if (!registration) {
      return errorResponse(res, { message: 'Tiket pendaftaran tidak ditemukan.' }, 404);
    }

    // Security check: ensure the user requesting the ticket is the one who owns it
    if (registration.user_id !== userId) {
      return errorResponse(res, { message: 'Akses ditolak.' }, 403);
    }
    
    return successResponse(res, registration);
  } catch (err) {
    return errorResponse(res, err);
  }
};
