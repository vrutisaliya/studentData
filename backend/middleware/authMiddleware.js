const jwt = require('jsonwebtoken');

// Authentication middleware
const authenticate = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({
      status: false,
      message: 'Unauthorized',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check token expiration
    const currentTime = Date.now() / 1000;
    if (decoded.exp <= currentTime) {
      console.log('Token expired');
      return res.status(402).json({
        status: false,
        message: 'Token expired',
      });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports = authenticate;
