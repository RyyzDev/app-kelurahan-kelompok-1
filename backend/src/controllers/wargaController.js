import prisma from '../lib/prisma.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';
import Joi from 'joi';

const permohonanSchema = Joi.object({
  jenis_surat_id: Joi.string().uuid().required().messages({
    'string.guid': 'ID Jenis Surat tidak valid',
    'any.required': 'Jenis surat wajib dipilih'
  }),
  format_surat: Joi.string().valid('digital', 'cap_basah').required().messages({
    'any.only': 'Format surat harus digital atau cap_basah',
    'any.required': 'Format surat wajib dipilih'
  }),
  alasan_permohonan: Joi.string().min(10).required().messages({
    'string.min': 'Alasan permohonan minimal 10 karakter',
    'any.required': 'Alasan permohonan wajib diisi'
  }),
});

/**
 * Mengajukan permohonan surat baru
 */
export const createPermohonan = async (req, res) => {
  try {
    const { error, value } = permohonanSchema.validate(req.body);
    if (error) {
      console.log('Validation Error Detail:', error.details);
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: error.details.map((d) => d.message),
      });
    }

    const { jenis_surat_id, format_surat, alasan_permohonan } = value;
    const userId = req.user.id;

    // Cek apakah jenis surat ada
    const jenisSurat = await prisma.jenisSurat.findUnique({
      where: { id: jenis_surat_id },
    });

    if (!jenisSurat || !jenisSurat.is_active) {
      return res.status(404).json({
        success: false,
        message: 'Layanan surat tidak ditemukan atau sedang tidak aktif.',
      });
    }

    const permohonan = await prisma.permohonanSurat.create({
      data: {
        user_id: userId,
        jenis_surat_id,
        format_surat,
        alasan_permohonan,
        status: 'verifikasi', // Status awal
      },
      include: {
        jenis_surat: true
      }
    });

    return successResponse(res, permohonan, 201);
  } catch (err) {
    return errorResponse(res, err);
  }
};

/**
 * Mendapatkan riwayat permohonan milik user yang login
 */
export const getMyPermohonan = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const riwayat = await prisma.permohonanSurat.findMany({
      where: { user_id: userId },
      include: {
        jenis_surat: {
          select: { nama_layanan: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(res, riwayat);
  } catch (err) {
    return errorResponse(res, err);
  }
};

/**
 * Mendapatkan detail permohonan tertentu
 */
export const getPermohonanDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const permohonan = await prisma.permohonanSurat.findUnique({
      where: { id },
      include: {
        jenis_surat: true
      }
    });

    if (!permohonan) {
      return res.status(404).json({
        success: false,
        message: 'Permohonan tidak ditemukan.',
      });
    }

    // Pastikan user hanya bisa melihat permohonannya sendiri
    if (permohonan.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses ke permohonan ini.',
      });
    }

    return successResponse(res, permohonan);
  } catch (err) {
    return errorResponse(res, err);
  }
};

/**
 * Daftar semua layanan surat yang tersedia untuk warga
 */
export const getAvailableServices = async (req, res) => {
  try {
    const services = await prisma.jenisSurat.findMany({
      where: { is_active: true },
      orderBy: { nama_layanan: 'asc' }
    });
    return successResponse(res, services);
  } catch (err) {
    return errorResponse(res, err);
  }
};
