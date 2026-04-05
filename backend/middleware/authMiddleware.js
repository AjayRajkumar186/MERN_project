const jwt = require('jsonwebtoken');

// —————————————————————————————————————————————————————————————————————————————
// Extract Token
// —————————————————————————————————————————————————————————————————————————————

const extractToken = (req) => {
  // 1. Check Authorization header (Bearer token)
  const authHeader = req.get('Authorization') || req.get('authorization');

  if (authHeader) {
    const trimmedHeader = authHeader.trim();
    const bearerMatch = trimmedHeader.match(/^Bearer\s+(.+)$/i);

    if (bearerMatch) {
      return bearerMatch[1].trim();
    }

    return trimmedHeader;
  }

  // 2. Fallback: Check x-auth-token header
  const xAuthToken = req.get('x-auth-token');
  if (xAuthToken) {
    return xAuthToken.trim();
  }

  return null;
};

// —————————————————————————————————————————————————————————————————————————————
// Protect
// —————————————————————————————————————————————————————————————————————————————

exports.protect = (req, res, next) => {

  let token = extractToken(req);
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token, authorization denied. Send Authorization: Bearer <token>'
    });
  }

  try {
    // 🛡️ Strip accidental quotes frontend might include (e.g. "eyJ...")
    token = token.replace(/^["']|["']$/g, '');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT Verification Failed:", err.message);
    console.error("Token that failed:", token);

    return res.status(401).json({
      success: false,
      message: 'Token is not valid'
    });
  }
};

// —————————————————————————————————————————————————————————————————————————————
// Authorize
// —————————————————————————————————————————————————————————————————————————————

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }

    next();
  };
};

exports.adminOnly = exports.authorize('admin');
