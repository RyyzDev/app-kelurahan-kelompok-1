import prisma from '../lib/prisma.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';

/**
 * Verifikasi Permohonan Surat
 * Mengubah status dari 'verifikasi' ke 'penandatanganan_rt' (digital) 
 * atau langsung ke 'penandatanganan' (cap_basah)
 */
export const verifyPermohonan = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, catatan_admin } = req.body; // action: 'approve' atau 'reject'

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Action tidak valid. Gunakan approve atau reject.',
      });
    }

    const permohonan = await prisma.permohonanSurat.findUnique({
      where: { id },
    });

    if (!permohonan) {
      return res.status(404).json({
        success: false,
        message: 'Permohonan surat tidak ditemukan.',
      });
    }

    if (permohonan.status !== 'verifikasi') {
      return res.status(400).json({
        success: false,
        message: 'Hanya permohonan dengan status verifikasi yang dapat diverifikasi.',
      });
    }

    let nextStatus;
    if (action === 'reject') {
      nextStatus = 'ditolak';
    } else {
      // Jika disetujui, tentukan alur berdasarkan format surat
      if (permohonan.format_surat === 'digital') {
        nextStatus = 'penandatanganan_rt';
      } else {
        // cap_basah langsung ke proses penandatanganan kelurahan
        nextStatus = 'penandatanganan';
      }
    }

    const updated = await prisma.permohonanSurat.update({
      where: { id },
      data: {
        status: nextStatus,
        catatan_admin,
      },
    });

    return successResponse(res, updated, 200);
  } catch (err) {
    return errorResponse(res, err);
  }
};

/**
 * Endpoint simulasi untuk penandatanganan RT/RW (Opsional, untuk memajukan status digital)
 */
export const updateProgressRT_RW = async (req, res) => {
  try {
    const { id } = req.params;
    const { role_signer } = req.body; // 'rt' atau 'rw'

    const permohonan = await prisma.permohonanSurat.findUnique({
      where: { id },
    });

    if (!permohonan) return res.status(404).json({ message: 'Permohonan tidak ditemukan.' });

    let nextStatus;
    if (role_signer === 'rt' && permohonan.status === 'penandatanganan_rt') {
      nextStatus = 'penandatanganan_rw';
    } else if (role_signer === 'rw' && permohonan.status === 'penandatanganan_rw') {
      nextStatus = 'penandatanganan';
    } else {
      return res.status(400).json({ message: 'Urutan penandatanganan tidak sesuai.' });
    }

    const updated = await prisma.permohonanSurat.update({
      where: { id },
      data: { status: nextStatus },
    });

    return successResponse(res, updated);
  } catch (err) {
    return errorResponse(res, err);
  }
};

/**
 * Menandatangani Permohonan Surat (Tahap Kelurahan)
 * Mengubah status ke 'siap_diambil' atau 'siap_didownload'
 */
export const signPermohonan = async (req, res) => {
  try {
    const { id } = req.params;
    const { nomor_surat, file_url } = req.body;

    if (!nomor_surat) {
      return res.status(400).json({
        success: false,
        message: 'Nomor surat wajib diisi saat penandatanganan.',
      });
    }

    const permohonan = await prisma.permohonanSurat.findUnique({
      where: { id },
    });

    if (!permohonan) {
      return res.status(404).json({
        success: false,
        message: 'Permohonan surat tidak ditemukan.',
      });
    }

    if (permohonan.status !== 'penandatanganan') {
      return res.status(400).json({
        success: false,
        message: 'Hanya permohonan dengan status penandatanganan yang dapat ditandatangani oleh kelurahan.',
      });
    }

    // Tentukan status akhir berdasarkan format surat
    const nextStatus = permohonan.format_surat === 'digital' 
      ? 'siap_didownload' 
      : 'siap_diambil';

    const updated = await prisma.permohonanSurat.update({
      where: { id },
      data: {
        status: nextStatus,
        nomor_surat,
        file_url: file_url || null,
      },
    });

    return successResponse(res, updated, 200);
  } catch (err) {
    return errorResponse(res, err);
  }
};

/**
 * Mendapatkan daftar permohonan untuk admin (dengan filter status)
 */
export const getAllPermohonan = async (req, res) => {
  try {
    const { status } = req.query;
    
    const permohonan = await prisma.permohonanSurat.findMany({
      where: status 
        ? { status } 
        : { 
            NOT: { 
              status: { in: ['selesai', 'ditolak', 'siap_didownload', 'siap_diambil'] } 
            } 
          },
      include: {
        user: {
          select: { nama_lengkap: true, nik: true, email: true }
        },
        jenis_surat: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(res, permohonan);
  } catch (err) {
    return errorResponse(res, err);
  }
};

/**
 * Mendapatkan semua daftar penduduk (Warga)
 */
export const getAllUsers = async (req, res) => {
  try {
    const { role: filterRole, search } = req.query;

    const users = await prisma.user.findMany({
      where: {
        AND: [
          filterRole ? { role: filterRole } : { role: 'warga' },
          search ? {
            OR: [
              { nama_lengkap: { contains: search, mode: 'insensitive' } },
              { nik: { contains: search } },
              { email: { contains: search, mode: 'insensitive' } }
            ]
          } : {}
        ]
      },
      select: {
        id: true,
        nik: true,
        nama_lengkap: true,
        email: true,
        role: true,
        is_active: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return successResponse(res, users);
  } catch (err) {
    return errorResponse(res, err);
  }
};

/**
 * Mendapatkan detail penduduk berdasarkan ID
 */
export const getUserDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        permohonan: {
          include: { jenis_surat: true },
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        toko: true
      }
    });

    if (!user) return res.status(404).json({ success: false, message: 'Data penduduk tidak ditemukan.' });

    const { password, ...userWithoutPassword } = user;
    return successResponse(res, userWithoutPassword);
  } catch (err) {
    return errorResponse(res, err);
  }
};
