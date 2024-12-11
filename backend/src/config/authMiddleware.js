const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

function authMiddleware(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];  // Assuming token is passed in the "Authorization" header as "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.decode(token, process.env.JWT_SECRET);  // Decode the token
    req.user = decoded; 
    
    next();
  } catch (error) {
    return res.status(400).json({ message: 'Invalid token.' });
  }
}

module.exports = authMiddleware;
