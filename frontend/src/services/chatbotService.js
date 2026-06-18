import api from './api';

/**
 * Note: For SSE (Streaming), we use native fetch API in the component 
 * because axios doesn't support streaming readable bodies in the browser easily.
 */

export default {
  // We can keep this for non-streaming fallback if needed
  sendMessage: async (messages) => {
    const response = await api.post('/chatbot/message', { messages });
    return response.data;
  }
};
