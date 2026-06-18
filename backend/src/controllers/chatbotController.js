import { processChatStream } from '../services/chatbotService.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';
import Joi from 'joi';

const chatSchema = Joi.object({
  messages: Joi.array().items(
    Joi.object({
      role: Joi.string().valid('user', 'assistant').required(),
      content: Joi.string().required(),
    })
  ).required().messages({
    'any.required': 'Messages history wajib dikirim'
  }),
});

export const sendMessage = async (req, res) => {
  try {
    const { error, value } = chatSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: error.details.map((d) => d.message),
      });
    }

    const { messages } = value;
    const userId = req.user.id; // User ID from auth middleware

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Start stream and tool execution
    await processChatStream(messages, userId, res);

  } catch (err) {
    console.error('SendMessage Error:', err);
    // If headers already sent, we can't use errorResponse
    if (!res.headersSent) {
      return errorResponse(res, err);
    } else {
      res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
      res.end();
    }
  }
};
