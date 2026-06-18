import midtransClient from 'midtrans-client';
import dotenv from 'dotenv';

dotenv.config();

// Create Snap API instance
const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
});

/**
 * Service to handle Midtrans payments
 */
export const createTransaction = async (orderId, grossAmount, customerDetails, itemDetails) => {
  try {
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount
      },
      customer_details: customerDetails,
      item_details: itemDetails,
      usage_limit: 1 // Optional: prevent multiple payments for same order
    };

    const transaction = await snap.createTransaction(parameter);
    return transaction; // Returns { token, redirect_url }
  } catch (error) {
    console.error('Midtrans Transaction Error:', error);
    throw error;
  }
};

/**
 * Service to handle Midtrans notifications (webhooks)
 */
export const verifyNotification = async (notificationJson) => {
  try {
    const statusResponse = await snap.transaction.notification(notificationJson);
    return statusResponse;
  } catch (error) {
    console.error('Midtrans Notification Error:', error);
    throw error;
  }
};

export default {
  createTransaction,
  verifyNotification
};
