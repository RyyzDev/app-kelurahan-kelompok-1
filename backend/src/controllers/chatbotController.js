import { getChatbotResponse } from '../services/chatbotService.js';
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
    const aiResponse = await getChatbotResponse(messages);

    return successResponse(res, {
      role: 'assistant',
      content: aiResponse,
    });
  } catch (err) {
    return errorResponse(res, err);
  }
};
