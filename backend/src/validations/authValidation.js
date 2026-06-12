import Joi from 'joi';

export const registerSchema = Joi.object({
  nik: Joi.string().length(16).required().messages({
    'string.length': 'NIK harus 16 digit',
    'any.required': 'NIK wajib diisi'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Format email tidak valid',
    'any.required': 'Email wajib diisi'
  }),
  nama_lengkap: Joi.string().min(3).required().messages({
    'string.min': 'Nama lengkap minimal 3 karakter',
    'any.required': 'Nama lengkap wajib diisi'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password minimal 6 karakter',
    'any.required': 'Password wajib diisi'
  }),
  confirm_password: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Konfirmasi kata sandi tidak cocok',
    'any.required': 'Konfirmasi kata sandi wajib diisi'
  }),
  tanggal_lahir: Joi.date().allow(null).optional().messages({
    'date.base': 'Format tanggal lahir tidak valid. Gunakan format YYYY-MM-DD (contoh: 1990-01-01)'
  }),
  phone: Joi.string().allow('', null).optional(),
  alamat: Joi.string().allow('', null).optional(),
});

export const loginSchema = Joi.object({
  identifier: Joi.string().required().messages({
    'any.required': 'NIK atau Email wajib diisi'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password wajib diisi'
  }),
});
