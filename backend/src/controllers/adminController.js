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

/**
 * Mendapatkan statistik ringkasan dan data chart untuk Dashboard Admin
 */
export const getDashboardStats = async (req, res) => {
  try {
    // 1. Stats
    const totalWarga = await prisma.user.count({ where: { role: 'warga' } });
    const permohonanSurat = await prisma.permohonanSurat.count({ where: { status: 'verifikasi' } });
    const totalPengumuman = await prisma.pengumuman.count();
    const totalEvent = await prisma.event.count({ where: { status: 'aktif' } });

    // 2. Chart Data (Requests over last 7 days)
    const requests = await prisma.permohonanSurat.findMany({
      where: {
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      },
      select: { createdAt: true }
    });

    const daysName = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = daysName[d.getDay()];
      const count = requests.filter(r => new Date(r.createdAt).toDateString() === d.toDateString()).length;
      chartData.push({ day: dayName, total: count });
    }

    // 3. Recent Activity (Latest 4 letter requests)
    const recentPermohonan = await prisma.permohonanSurat.findMany({
      take: 4,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { nama_lengkap: true } },
        jenis_surat: { select: { nama_layanan: true } }
      }
    });

    const recentActivity = recentPermohonan.map(item => {
      const diffMs = Date.now() - new Date(item.createdAt).getTime();
      const diffMin = Math.floor(diffMs / (1000 * 60));
      let timeAgo = 'Baru saja';
      if (diffMin > 0) {
        if (diffMin < 60) {
          timeAgo = `${diffMin} Menit Lalu`;
        } else {
          const diffHours = Math.floor(diffMin / 60);
          if (diffHours < 24) {
            timeAgo = `${diffHours} Jam Lalu`;
          } else {
            timeAgo = `${Math.floor(diffHours / 24)} Hari Lalu`;
          }
        }
      }
      return {
        id: item.id,
        text: `Permohonan "${item.jenis_surat.nama_layanan}" oleh ${item.user.nama_lengkap}`,
        timeAgo
      };
    });

    // 4. Antrian Hari Ini (Pendaftaran Vaksinasi Terbaru)
    const antrianData = await prisma.pendaftaranVaksinasi.findMany({
      take: 5,
      orderBy: { registeredAt: 'desc' },
      include: {
        user: { select: { nama_lengkap: true } },
        jadwal: { select: { nama_vaksin: true, jam_mulai: true, jam_selesai: true } }
      }
    });

    const antrian = antrianData.map((item) => ({
      id: item.id,
      number: `V-${String(item.nomor_antrian).padStart(3, '0')}`,
      name: item.user.nama_lengkap,
      slot: `${item.jadwal.nama_vaksin} (${item.jadwal.jam_mulai} - ${item.jadwal.jam_selesai})`,
      status: item.status === 'terdaftar' ? 'Menunggu' : item.status === 'hadir' ? 'Selesai' : 'Melayani'
    }));

    return successResponse(res, {
      stats: {
        totalWarga,
        permohonanSurat,
        totalPengumuman,
        totalEvent
      },
      chartData,
      recentActivity,
      antrian
    });
  } catch (err) {
    return errorResponse(res, err);
  }
};

/**
 * Mendapatkan daftar antrean vaksinasi (jadwal vaksinasi)
 */
export const getVaksinAntrianList = async (req, res) => {
  try {
    const list = await prisma.jadwalVaksinasi.findMany({
      include: {
        _count: {
          select: { pendaftar: true }
        }
      },
      orderBy: { tanggal: 'desc' }
    });
    return successResponse(res, list);
  } catch (err) {
    return errorResponse(res, err);
  }
};

/**
 * Mendapatkan detail pendaftar antrean vaksinasi berdasarkan jadwal ID
 */
export const getVaksinAntrianDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const detail = await prisma.pendaftaranVaksinasi.findMany({
      where: { jadwal_id: id },
      include: {
        user: {
          select: { nama_lengkap: true, nik: true }
        }
      },
      orderBy: { nomor_antrian: 'asc' }
    });
    return successResponse(res, detail);
  } catch (err) {
    return errorResponse(res, err);
  }
};

/**
 * Memperbarui status kehadiran warga di antrean vaksinasi
 */
export const updateVaksinAntrianStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['terdaftar', 'hadir', 'tidak_hadir'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status tidak valid.' });
    }

    const updated = await prisma.pendaftaranVaksinasi.update({
      where: { id },
      data: { status }
    });
    return successResponse(res, updated);
  } catch (err) {
    return errorResponse(res, err);
  }
};

/**
 * Mendapatkan daftar antrean event
 */
export const getEventAntrianList = async (req, res) => {
  try {
    const list = await prisma.event.findMany({
      include: {
        _count: {
          select: { registrations: true }
        }
      },
      orderBy: { tanggal: 'desc' }
    });
    return successResponse(res, list);
  } catch (err) {
    return errorResponse(res, err);
  }
};

/**
 * Mendapatkan detail pendaftar antrean event berdasarkan event ID
 */
export const getEventAntrianDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const detail = await prisma.eventRegistration.findMany({
      where: { event_id: id },
      include: {
        user: {
          select: { nama_lengkap: true, nik: true }
        }
      },
      orderBy: { registeredAt: 'asc' }
    });
    return successResponse(res, detail);
  } catch (err) {
    return errorResponse(res, err);
  }
};
