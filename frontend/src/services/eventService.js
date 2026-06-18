import api from './api';

export const getAllEvents = async () => {
  const response = await api.get('/events');
  return response.data;
};

export const createEvent = async (eventData) => {
  const response = await api.post('/events', eventData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const updateEvent = async (id, eventData) => {
  const response = await api.patch(`/events/${id}`, eventData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const deleteEvent = async (id) => {
  const response = await api.delete(`/events/${id}`);
  return response.data;
};

export const registerForEvent = async (eventId) => {
  const response = await api.post(`/events/${eventId}/register`);
  return response.data;
};

export const getMyRegistrations = async () => {
  const response = await api.get('/events/my-registrations');
  return response.data;
};

export const getRegistrationById = async (id) => {
  const response = await api.get(`/events/my-registrations/${id}`);
  return response.data;
};

export default {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getMyRegistrations
};
