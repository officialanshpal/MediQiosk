/* Middleware Guard to check session validity */
export const authGuard = (req, res, next) => {
  const sessionId = req.headers['x-session-id'] || req.query.sessionId || req.body?.sessionId;

  // Allow open endpoints (health check, auth login, staff, doctor)
  const path = req.path;
  const url = req.originalUrl;
  if (
    path.startsWith('/auth') || path.startsWith('/health') || path.startsWith('/staff') || path.startsWith('/doctor') || path.startsWith('/bhashini') ||
    url.startsWith('/api/auth') || url.startsWith('/api/health') || url.startsWith('/api/staff') || url.startsWith('/api/doctor') || url.startsWith('/api/bhashini')
  ) {
    return next();
  }

  if (!sessionId) {
    return res.status(401).json({
      success: false,
      errorCode: 'SESSION_MISSING',
      message: 'Authentication Guard: Session ID header (X-Session-ID) or query parameter is required.'
    });
  }

  req.sessionId = sessionId;
  next();
};
