import prisma from '../lib/prisma.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';
import Joi from 'joi';
import bcrypt from 'bcryptjs';

const updateProfileSchema = Joi.object({
  nama_lengkap: Joi.string().min(3).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().allow('', null).optional(),
  alamat: Joi.string().allow('', null).optional(),
  tanggal_lahir: Joi.date().allow(null).optional().messages({
    'date.base': 'Format tanggal lahir tidak valid. Gunakan format YYYY-MM-DD (contoh: 1990-01-01)'
  }),
});

const changePasswordSchema = Joi.object({
  old_password: Joi.string().required().messages({
    'any.required': 'Kata sandi lama wajib diisi'
  }),
  new_password: Joi.string().min(6).required().messages({
    'string.min': 'Kata sandi baru minimal 6 karakter',
    'any.required': 'Kata sandi baru wajib diisi'
  }),
  confirm_new_password: Joi.string().valid(Joi.ref('new_password')).required().messages({
    'any.only': 'Konfirmasi kata sandi baru tidak cocok',
    'any.required': 'Konfirmasi kata sandi baru wajib diisi'
  }),
});

/**
 * Mendapatkan profil user yang sedang login
 */
export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) return res.status(404).json({ message: 'User tidak ditemukan.' });

    const { password, ...userWithoutPassword } = user;
    return successResponse(res, userWithoutPassword);
  } catch (err) {
    return errorResponse(res, err);
  }
};

/**
 * Update profil diri sendiri
 */
export const updateProfile = async (req, res) => {
  try {
    const { error, value } = updateProfileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: error.details.map((d) => d.message),
      });
    }

    const userId = req.user.id;

    // Cek jika email diubah, pastikan tidak duplikat dengan user lain
    if (value.email) {
      const existingEmail = await prisma.user.findFirst({
        where: {
          email: value.email,
          NOT: { id: userId },
        },
      });

      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message: 'Email sudah digunakan oleh pengguna lain.',
        });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: value,
    });

    const { password, ...userWithoutPassword } = updatedUser;
    return successResponse(res, userWithoutPassword);
  } catch (err) {
    return errorResponse(res, err);
  }
};

/**
 * Ganti Password
 */
export const changePassword = async (req, res) => {
  try {
    const { error, value } = changePasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: error.details.map((d) => d.message),
      });
    }

    const { old_password, new_password } = value;
    const userId = req.user.id;

    // Ambil user untuk mendapatkan password lama
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) return res.status(404).json({ message: 'User tidak ditemukan.' });

    // Verifikasi password lama
    const isMatch = await bcrypt.compare(old_password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Kata sandi lama salah.',
      });
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(new_password, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return successResponse(res, null, 200);
  } catch (err) {
    return errorResponse(res, err);
  }
};
