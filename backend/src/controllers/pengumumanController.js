import prisma from '../lib/prisma.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';
import Joi from 'joi';

const pengumumanSchema = Joi.object({
  judul: Joi.string().min(3).required().messages({
    'string.min': 'Judul minimal 3 karakter',
    'any.required': 'Judul wajib diisi'
  }),
  konten: Joi.string().min(10).required().messages({
    'string.min': 'Konten minimal 10 karakter',
    'any.required': 'Konten wajib diisi'
  }),
  tanggal: Joi.date().iso().optional()
});

/**
 * Mendapatkan semua pengumuman
 */
export const getAllPengumuman = async (req, res) => {
  try {
    const list = await prisma.pengumuman.findMany({
      orderBy: { tanggal: 'desc' }
    });
    return successResponse(res, list);
  } catch (err) {
    return errorResponse(res, err);
  }
};

/**
 * Membuat pengumuman baru (Admin Only)
 */
export const createPengumuman = async (req, res) => {
  try {
    const { error, value } = pengumumanSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: error.details.map((d) => d.message),
      });
    }

    const pengumuman = await prisma.pengumuman.create({
      data: {
        judul: value.judul,
        konten: value.konten,
        tanggal: value.tanggal || new Date()
      }
    });

    return successResponse(res, pengumuman, 201);
  } catch (err) {
    return errorResponse(res, err);
  }
};

/**
 * Menghapus pengumuman (Admin Only)
 */
export const deletePengumuman = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.pengumuman.delete({
      where: { id }
    });
    return successResponse(res, { message: 'Pengumuman berhasil dihapus.' });
  } catch (err) {
    return errorResponse(res, err);
  }
};
