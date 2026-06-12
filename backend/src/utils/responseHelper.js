/**
 * Format response konsisten di seluruh API
 */

export const successResponse = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
  });
};

export const errorResponse = (res, err, statusCode = 500) => {
  console.error(err);
  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Terjadi kesalahan server.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
