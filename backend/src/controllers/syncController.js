import prisma from '../lib/prisma.js';
import { successResponse } from '../utils/responseHelper.js';
import bcrypt from 'bcryptjs';

/**
 * Dispatcher untuk sinkronisasi data dari offline queue
 */
export const syncData = async (req, res) => {
  const { requests } = req.body;
  const userId = req.user.id;
  const results = [];

  for (const item of requests) {
    const { type, data } = item;
    try {
      let result = null;

      switch (type) {
        case 'permohonan_surat':
          result = await prisma.permohonanSurat.create({
            data: { ...data, user_id: userId }
          });
          break;

        case 'update_profile':
          result = await prisma.user.update({
            where: { id: userId },
            data: data
          });
          break;

        case 'change_password':
          const hashedPassword = await bcrypt.hash(data.new_password, 10);
          result = await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
          });
          break;

        case 'add_produk':
          // Note: Offline upload foto kompleks, sementara simpan data teks saja
          // atau asumsikan foto_url sudah dihandle via base64/placeholder
          const toko = await prisma.toko.findUnique({ where: { user_id: userId } });
          if (toko) {
            result = await prisma.produk.create({
              data: { ...data, toko_id: toko.id, harga: Number(data.harga), stok: Number(data.stok) }
            });
          }
          break;

        case 'update_produk':
          result = await prisma.produk.update({
            where: { id: data.id },
            data: { 
              nama_produk: data.nama_produk,
              deskripsi: data.deskripsi,
              harga: data.harga ? Number(data.harga) : undefined,
              stok: data.stok ? Number(data.stok) : undefined,
              status: 'pending'
            }
          });
          break;

        case 'delete_produk':
          await prisma.produk.delete({ where: { id: data.id } });
          result = { message: 'Deleted' };
          break;

        default:
          throw new Error(`Unknown sync type: ${type}`);
      }

      results.push({ status: 'success', type, id: item.id });
    } catch (err) {
      results.push({ status: 'failed', type, id: item.id, error: err.message });
    }
  }

  return successResponse(res, results);
};
