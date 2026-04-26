// JWT Authentication Middleware for MiniStore
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Access denied. No token provided.' 
      });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET environment variable not set');
      return res.status(500).json({ 
        error: 'Server configuration error' 
      });
    }

    // Verify token
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ 
            error: 'Token expired. Please login again.' 
          });
        } else if (err.name === 'JsonWebTokenError') {
          return res.status(401).json({ 
            error: 'Invalid token.' 
          });
        } else {
          console.error('JWT verification error:', err);
          return res.status(500).json({ 
            error: 'Token verification failed.' 
          });
        }
      }

      // Add decoded user info to request object
      req.user = decoded;
      next();
    });

  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({ 
      error: 'Internal server error during authentication.' 
    });
  }
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  // First authenticate the token
  authenticateToken(req, res, () => {
    // Check if user has admin role
    if (req.user && req.user.role === 'admin') {
      next(); // User is admin, proceed
    } else {
      res.status(403).json({ 
        error: 'Access denied. Admin privileges required.' 
      });
    }
  });
};

module.exports = {
  authenticateToken,
  requireAdmin
};
