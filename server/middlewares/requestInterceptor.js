/* Request Interceptor & Logging Filter */
export const requestInterceptor = (req, res, next) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`[HTTP INTERCEPTOR] ${req.method} ${req.originalUrl} -> Status: ${res.statusCode} (${duration}ms)`);
  });

  // Standardize Response Headers
  res.setHeader('X-MediKiosk-Version', '2.0-Hackathon-Prototype');
  res.setHeader('X-Powered-By', 'MediKiosk Engine');

  next();
};
