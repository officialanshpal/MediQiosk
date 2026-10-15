/* Global Error Handling Filter */
export const errorFilter = (err, req, res, next) => {
  console.error('[UNHANDLED EXCEPTION FILTER]:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error in MediKiosk Backend';

  res.status(statusCode).json({
    success: false,
    errorCode: err.code || 'INTERNAL_ERROR',
    message,
    timestamp: new Date().toISOString()
  });
};
