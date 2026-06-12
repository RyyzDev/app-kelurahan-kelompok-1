import axios from 'axios';

/**
 * Service untuk interaksi dengan LLM via AgentRouter
 */
export const getChatbotResponse = async (messages) => {
  try {
    const response = await axios.post(
      `${process.env.LLM_API_URL}`,
      {
        model: process.env.LLM_MODEL || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Anda adalah asisten AI resmi untuk SI-GERCAP, aplikasi digitalisasi layanan Kelurahan. Tugas Anda adalah membantu warga dengan informasi terkait layanan surat, bansos, dan antrean kelurahan secara ramah dan profesional. Jawablah dalam Bahasa Indonesia yang baik.'
          },
          ...messages
        ],
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.LLM_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (err) {
    console.error('Chatbot Service Error:', err.response?.data || err.message);
    throw new Error('Gagal mendapatkan respon dari AI Chatbot.');
  }
};
