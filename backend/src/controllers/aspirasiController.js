import prisma from '../lib/prisma.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';
import Joi from 'joi';

const aspirasiSchema = Joi.object({
  pesan: Joi.string().min(5).required().messages({
    'string.min': 'Pesan aspirasi minimal 5 karakter',
    'any.required': 'Pesan aspirasi wajib diisi'
  })
});

/**
 * Warga menyampaikan aspirasi baru
 */
export const createAspirasi = async (req, res) => {
  try {
    const { error, value } = aspirasiSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: error.details.map((d) => d.message),
      });
    }

    const userId = req.user.id;

    const aspirasi = await prisma.aspirasi.create({
      data: {
        user_id: userId,
        pesan: value.pesan
      },
      include: {
        user: { select: { nama_lengkap: true } }
      }
    });

    return successResponse(res, aspirasi, 201);
  } catch (err) {
    return errorResponse(res, err);
  }
};

/**
 * Admin mendapatkan semua aspirasi dari warga
 */
export const getAllAspirasi = async (req, res) => {
  try {
    const list = await prisma.aspirasi.findMany({
      include: {
        user: {
          select: { nama_lengkap: true, nik: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return successResponse(res, list);
  } catch (err) {
    return errorResponse(res, err);
  }
};
