const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'domain_sell_super_secure_jwt_token_neon_violet_2026_xyz';

const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Missing or invalid authorization token.'
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || !decoded.username) {
      return res.status(403).json({
        success: false,
        message: 'Invalid administrative privileges.'
      });
    }
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Session expired or invalid token. Please log in again.'
    });
  }
};

module.exports = {
  verifyAdminToken,
  JWT_SECRET
};
