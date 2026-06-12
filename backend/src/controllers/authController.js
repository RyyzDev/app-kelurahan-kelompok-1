import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';
import { registerSchema, loginSchema } from '../validations/authValidation.js';

export const register = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: error.details.map((d) => d.message),
      });
    }

    const { nik, email, nama_lengkap, password, tanggal_lahir, phone, alamat } = value;

    // Cek apakah NIK atau Email sudah terdaftar
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { nik },
          { email },
        ],
      },
    });

    if (existingUser) {
      const field = existingUser.nik === nik ? 'NIK' : 'Email';
      return res.status(409).json({
        success: false,
        message: `${field} sudah terdaftar.`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        nik,
        email,
        nama_lengkap,
        password: hashedPassword,
        tanggal_lahir: tanggal_lahir ? new Date(tanggal_lahir) : null,
        phone,
        alamat,
        role: 'warga', // Default role untuk registrasi mandiri
      },
    });

    // Jangan kirim password di response
    const { password: _, ...userWithoutPassword } = user;

    return successResponse(res, userWithoutPassword, 201);
  } catch (err) {
    return errorResponse(res, err);
  }
};

export const login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: error.details.map((d) => d.message),
      });
    }

    const { identifier, password } = value;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { nik: identifier },
          { email: identifier },
        ],
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'NIK/Email atau password salah.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'NIK/Email atau password salah.',
      });
    }

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Akun Anda tidak aktif. Silakan hubungi admin.',
      });
    }

    const token = jwt.sign(
      { id: user.id, nik: user.nik, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const { password: _, ...userWithoutPassword } = user;

    return successResponse(res, {
      token,
      user: userWithoutPassword,
    });
  } catch (err) {
    return errorResponse(res, err);
  }
};
