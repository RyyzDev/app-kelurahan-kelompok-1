import api from './api';

export const checkout = async (items) => {
  try {
    const response = await api.post('/payment/checkout', { items });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  checkout
};
