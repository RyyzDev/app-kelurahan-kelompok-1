import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

export const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token tidak ditemukan. Silakan login kembali.',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Optional: Check if user still exists and is active in DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Token tidak valid atau akun tidak aktif.',
      });
    }

    req.user = decoded; // { id, role, nik }
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Token tidak valid atau kadaluarsa.',
    });
  }
};

export const role = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user?.role)) {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak. Anda tidak memiliki izin untuk mengakses resource ini.',
      });
    }
    next();
  };
};
