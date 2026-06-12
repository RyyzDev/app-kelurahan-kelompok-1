import prisma from '../lib/prisma.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';
import Joi from 'joi';

// Validasi Toko
const tokoSchema = Joi.object({
  nama_toko: Joi.string().min(3).required(),
  deskripsi: Joi.string().allow('', null).optional(),
  alamat_toko: Joi.string().allow('', null).optional(),
  phone_toko: Joi.string().allow('', null).optional(),
});

// Validasi Produk
const produkSchema = Joi.object({
  nama_produk: Joi.string().min(3).required(),
  deskripsi: Joi.string().allow('', null).optional(),
  harga: Joi.number().min(0).required(),
  kategori: Joi.string().allow('', null).optional(),
  stok: Joi.number().integer().min(0).default(0),
  foto_url: Joi.string().uri().allow('', null).optional(),
});

// --- CITIZEN SIDE (WARGA) ---

/**
 * Mendaftarkan Toko baru untuk Warga
 */
export const registerToko = async (req, res) => {
  try {
    const { error, value } = tokoSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const userId = req.user.id;

    // Cek apakah user sudah punya toko
    const existingToko = await prisma.toko.findUnique({ where: { user_id: userId } });
    if (existingToko) return res.status(409).json({ success: false, message: 'Anda sudah memiliki toko.' });

    const toko = await prisma.toko.create({
      data: { ...value, user_id: userId }
    });

    return successResponse(res, toko, 201);
  } catch (err) {
    return errorResponse(res, err);
  }
};

/**
 * Mendapatkan info Toko milik sendiri
 */
export const getMyToko = async (req, res) => {
  try {
    const toko = await prisma.toko.findUnique({
      where: { user_id: req.user.id },
      include: { produk: true }
    });
    if (!toko) return res.status(404).json({ success: false, message: 'Toko belum terdaftar.' });
    return successResponse(res, toko);
  } catch (err) {
    return errorResponse(res, err);
  }
};

/**
 * Menambahkan Produk ke Toko
 */
export const addProduk = async (req, res) => {
  try {
    const { error, value } = produkSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const { nama_produk, deskripsi, harga, kategori, stok } = value;
    const userId = req.user.id;

    const toko = await prisma.toko.findUnique({ where: { user_id: userId } });
    if (!toko) return res.status(404).json({ success: false, message: 'Daftarkan toko Anda terlebih dahulu.' });

    // Handle foto_url dari file upload
    const foto_url = req.file ? `${req.protocol}://${req.get('host')}/uploads/produk/${req.file.filename}` : null;

    const produk = await prisma.produk.create({
      data: {
        nama_produk,
        deskripsi,
        harga: Number(harga),
        kategori,
        stok: Number(stok),
        foto_url,
        toko_id: toko.id,
        status: 'pending' // Wajib verifikasi admin
      }
    });

    return successResponse(res, produk, 201);
  } catch (err) {
    console.error('Error in addProduk:', err);
    return errorResponse(res, err);
  }
};

/**
 * Mengupdate Produk (status akan kembali ke pending untuk verifikasi ulang)
 */
export const updateProduk = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Gunakan skema yang sama tapi buat semua field opsional untuk PATCH
    const updateSchema = produkSchema.fork(Object.keys(produkSchema.describe().keys), (schema) => schema.optional());
    
    const { error, value } = updateSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const userId = req.user.id;
    const toko = await prisma.toko.findUnique({ where: { user_id: userId } });
    const existingProduk = await prisma.produk.findUnique({ where: { id } });

    if (!existingProduk || existingProduk.toko_id !== toko?.id) {
      return res.status(403).json({ success: false, message: 'Akses ditolak atau produk tidak ditemukan.' });
    }

    // Handle foto_url baru jika ada upload
    const foto_url = req.file 
      ? `${req.protocol}://${req.get('host')}/uploads/produk/${req.file.filename}` 
      : existingProduk.foto_url;

    const updated = await prisma.produk.update({
      where: { id },
      data: {
        nama_produk: value.nama_produk,
        deskripsi: value.deskripsi,
        harga: value.harga ? Number(value.harga) : undefined,
        kategori: value.kategori,
        stok: value.stok ? Number(value.stok) : undefined,
        foto_url,
        status: 'pending' // Reset status saat diubah
      }
    });

    return successResponse(res, updated);
  } catch (err) {
    console.error('Error in updateProduk:', err);
    return errorResponse(res, err);
  }
};

/**
 * Menghapus Produk dari Toko
 */
export const deleteProduk = async (req, res) => {
  try {
    const { id } = req.params;
    const toko = await prisma.toko.findUnique({ where: { user_id: req.user.id } });
    const existingProduk = await prisma.produk.findUnique({ where: { id } });

    if (!existingProduk || existingProduk.toko_id !== toko?.id) {
      return res.status(403).json({ success: false, message: 'Akses ditolak atau produk tidak ditemukan.' });
    }

    await prisma.produk.delete({
      where: { id }
    });

    return successResponse(res, { message: 'Produk berhasil dihapus.' });
  } catch (err) {
    return errorResponse(res, err);
  }
};

// --- ADMIN SIDE ---

/**
 * List semua produk yang menunggu verifikasi
 */
export const getPendingProduk = async (req, res) => {
  try {
    const products = await prisma.produk.findMany({
      where: { status: 'pending' },
      include: { toko: { include: { user: { select: { nama_lengkap: true } } } } }
    });
    return successResponse(res, products);
  } catch (err) {
    return errorResponse(res, err);
  }
};

/**
 * Verifikasi Produk oleh Admin
 */
export const verifyProduk = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, catatan_admin } = req.body; // status: 'disetujui' atau 'ditolak'

    if (!['disetujui', 'ditolak'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status tidak valid.' });
    }

    const updated = await prisma.produk.update({
      where: { id },
      data: { status, catatan_admin }
    });

    return successResponse(res, updated);
  } catch (err) {
    return errorResponse(res, err);
  }
};

// --- PUBLIC SIDE ---

/**
 * Menampilkan semua produk yang sudah disetujui
 */
export const getPublicProduk = async (req, res) => {
  try {
    const { kategori } = req.query;
    const products = await prisma.produk.findMany({
      where: {
        status: 'disetujui',
        ...(kategori && { kategori })
      },
      include: { toko: true },
      orderBy: { createdAt: 'desc' }
    });
    return successResponse(res, products);
  } catch (err) {
    return errorResponse(res, err);
  }
};
