import prisma from '../lib/prisma.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';

/**
 * Get all orders for the logged-in user
 */
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await prisma.order.findMany({
      where: { user_id: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          select: {
            nama_produk: true,
            kuantitas: true
          }
        }
      }
    });
    return successResponse(res, orders);
  } catch (err) {
    return errorResponse(res, err);
  }
};

/**
 * Get a single order by ID, ensuring it belongs to the logged-in user
 */
export const getOrderById = async (req, res) => {
  try {
    const { id: orderId } = req.params;
    const userId = req.user.id;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
      }
    });

    if (!order) {
      return errorResponse(res, { message: 'Pesanan tidak ditemukan.' }, 404);
    }
    
    // Security check
    if (order.user_id !== userId) {
      return errorResponse(res, { message: 'Akses ditolak.' }, 403);
    }

    return successResponse(res, order);
  } catch (err) {
    return errorResponse(res, err);
  }
};
