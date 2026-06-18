import api from './api';

export const getMyOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export default {
  getMyOrders,
  getOrderById,
};
