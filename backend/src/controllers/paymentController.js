import prisma from '../lib/prisma.js';
import midtransService from '../services/midtransService.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';

/**
 * Create a new order and Midtrans transaction
 */
export const checkout = async (req, res) => {
  try {
    const { items } = req.body; // Array of { id, nama_produk, harga, kuantitas }
    const userId = req.user.id;
    const user = req.user;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Keranjang belanja kosong.' });
    }

    const totalHarga = items.reduce((total, item) => total + (item.harga * item.kuantitas), 0);

    // 1. Create Order in Database using transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          user_id: userId,
          total_harga: totalHarga,
          status_pembayaran: 'pending',
          items: {
            create: items.map(item => ({
              produk_id: item.id,
              nama_produk: item.nama_produk,
              harga: item.harga,
              kuantitas: item.kuantitas
            }))
          }
        },
        include: { items: true }
      });
      return newOrder;
    });

    // 2. Create Midtrans Transaction
    // Fetch full user data since middleware only provides {id, role, nik}
    const fullUser = await prisma.user.findUnique({ where: { id: userId } });
    
    const customerDetails = {
      first_name: fullUser.nama_lengkap,
      email: fullUser.email,
      phone: fullUser.phone
    };

    const itemDetails = items.map(item => ({
      id: item.id,
      price: item.harga,
      quantity: item.kuantitas,
      name: item.nama_produk
    }));

    const midtransTransaction = await midtransService.createTransaction(
      order.id,
      totalHarga,
      customerDetails,
      itemDetails
    );

    // 3. Update Order with Snap Token
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        snap_token: midtransTransaction.token,
        snap_redirect_url: midtransTransaction.redirect_url
      }
    });

    return successResponse(res, {
      order_id: updatedOrder.id,
      snap_token: updatedOrder.snap_token,
      snap_redirect_url: updatedOrder.snap_redirect_url
    });
  } catch (err) {
    console.error('Checkout Error:', err);
    return errorResponse(res, err);
  }
};

/**
 * Handle Midtrans Webhook Notification
 */
export const handleNotification = async (req, res) => {
  try {
    const statusResponse = await midtransService.verifyNotification(req.body);
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    let newStatus = 'pending';

    if (transactionStatus === 'capture') {
      if (fraudStatus === 'challenge') {
        newStatus = 'pending';
      } else if (fraudStatus === 'accept') {
        newStatus = 'berhasil';
      }
    } else if (transactionStatus === 'settlement') {
      newStatus = 'berhasil';
    } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
      newStatus = 'gagal';
    } else if (transactionStatus === 'pending') {
      newStatus = 'pending';
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status_pembayaran: newStatus }
    });

    return res.status(200).json({ status: 'OK' });
  } catch (err) {
    console.error('Notification Error:', err);
    return res.status(500).json({ status: 'Error', message: err.message });
  }
};

export default {
  checkout,
  handleNotification
};
