import prisma from '../lib/prisma.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';
import Joi from 'joi';

const jadwalSchema = Joi.object({
  nama_vaksin: Joi.string().min(3).required(),
  deskripsi: Joi.string().allow('', null),
  tanggal: Joi.date().iso().required(),
  jam_mulai: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(), // HH:mm format
  jam_selesai: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
  lokasi: Joi.string().required(),
  kuota: Joi.number().integer().min(1).required(),
});

// ADMIN CONTROLLERS

export const createJadwal = async (req, res) => {
  try {
    console.log("Inspecting prisma object keys:", Object.keys(prisma));
    const { error, value } = jadwalSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const jadwal = await prisma.jadwalVaksinasi.create({
      data: { ...value, sisa_kuota: value.kuota }
    });
    return successResponse(res, jadwal, 201);
  } catch (err) {
    console.error("Error in createJadwal:", err);
    return errorResponse(res, err);
  }
};

export const updateJadwal = async (req, res) => {
  try {
    const { id } = req.params;
    const updateSchema = jadwalSchema.fork(Object.keys(jadwalSchema.describe().keys), (schema) => schema.optional());
    const { error, value } = updateSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    
    // If quota is updated, sisa_kuota should be adjusted too.
    // This is a simplified logic. A more complex one would consider existing registrations.
    if (value.kuota) {
      const existingJadwal = await prisma.jadwalVaksinasi.findUnique({ where: { id } });
      const pendaftarCount = await prisma.pendaftaranVaksinasi.count({ where: { jadwal_id: id } });
      value.sisa_kuota = value.kuota - pendaftarCount;
    }

    const jadwal = await prisma.jadwalVaksinasi.update({ where: { id }, data: value });
    return successResponse(res, jadwal);
  } catch (err) {
    return errorResponse(res, err);
  }
};

export const deleteJadwal = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.jadwalVaksinasi.delete({ where: { id } });
    return successResponse(res, { message: 'Jadwal vaksinasi berhasil dihapus.' });
  } catch (err) {
    return errorResponse(res, err);
  }
};

// PUBLIC & USER CONTROLLERS

export const getAllJadwal = async (req, res) => {
  try {
    // Auto-update status for past events
    await prisma.jadwalVaksinasi.updateMany({
      where: { tanggal: { lt: new Date() }, status: { not: 'SELESAI' } },
      data: { status: 'SELESAI' }
    });
    
    const allJadwal = await prisma.jadwalVaksinasi.findMany({
      orderBy: { tanggal: 'desc' }
    });
    return successResponse(res, allJadwal);
  } catch (err) {
    return errorResponse(res, err);
  }
};

export const registerForVaksinasi = async (req, res) => {
  try {
    const { jadwalId } = req.params;
    const userId = req.user.id;

    const result = await prisma.$transaction(async (tx) => {
      const jadwal = await tx.jadwalVaksinasi.findUnique({
        where: { id: jadwalId },
      });

      if (!jadwal || jadwal.status !== 'TERSEDIA') {
        throw new Error('Jadwal tidak tersedia, sudah berakhir, atau penuh.');
      }

      if (jadwal.sisa_kuota <= 0) {
        throw new Error('Kuota untuk jadwal ini sudah habis.');
      }

      const existingRegistration = await tx.pendaftaranVaksinasi.findUnique({
        where: { user_id_jadwal_id: { user_id: userId, jadwal_id: jadwalId } }
      });

      if (existingRegistration) {
        throw new Error('Anda sudah terdaftar pada jadwal ini.');
      }
      
      const nomorAntrian = jadwal.kuota - jadwal.sisa_kuota + 1;

      const newRegistration = await tx.pendaftaranVaksinasi.create({
        data: {
          user_id: userId,
          jadwal_id: jadwalId,
          nomor_antrian: nomorAntrian
        }
      });
      
      const newSisaKuota = jadwal.sisa_kuota - 1;
      await tx.jadwalVaksinasi.update({
        where: { id: jadwalId },
        data: { 
          sisa_kuota: newSisaKuota,
          status: newSisaKuota === 0 ? 'PENUH' : 'TERSEDIA'
        }
      });

      // Refetch the registration to include the nested `jadwal` details for the response
      const fullRegistration = await tx.pendaftaranVaksinasi.findUnique({
        where: { id: newRegistration.id },
        include: { jadwal: true }
      });

      return fullRegistration;
    });

    return successResponse(res, result, 201);

  } catch (err) {
     if (err.message.includes('sudah terdaftar') || err.message.includes('kuota') || err.message.includes('tidak tersedia')) {
        return errorResponse(res, { message: err.message }, 409); // Conflict
     }
    return errorResponse(res, err);
  }
};

export const getMyVaksinasi = async (req, res) => {
  try {
    const userId = req.user.id;
    const registrations = await prisma.pendaftaranVaksinasi.findMany({
      where: { user_id: userId },
      include: { jadwal: true },
      orderBy: { jadwal: { tanggal: 'desc' } }
    });
    return successResponse(res, registrations);
  } catch (err) {
    return errorResponse(res, err);
  }
};

export const getVaksinasiRegistrationById = async (req, res) => {
  try {
    const { id: registrationId } = req.params;
    const userId = req.user.id;

    const registration = await prisma.pendaftaranVaksinasi.findUnique({
      where: { id: registrationId },
      include: {
        jadwal: true,
        user: { select: { nik: true, nama_lengkap: true } }
      }
    });

    if (!registration) {
      return errorResponse(res, { message: 'Tiket pendaftaran tidak ditemukan.' }, 404);
    }

    if (registration.user_id !== userId) {
      return errorResponse(res, { message: 'Akses ditolak.' }, 403);
    }
    
    return successResponse(res, registration);
  } catch (err) {
    return errorResponse(res, err);
  }
};
