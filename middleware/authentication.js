import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authenticateToken = (req, res, next) => {
  // Retrieve the Authorization header
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'fail',
      message: 'Unauthorized: Missing or invalid token',
    });
  }

  // Extract the token from the header
  const token = authHeader.split(' ')[1];
  
  // Verify the token
  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      alert("Session Expired. Please login again");
      return res.status(403).json({
        status: 'fail',
        message: 'Forbidden: Invalid or expired token',
      });
    }

    // Attach user data to the request object
    req.user = user;
    next();
  });
};

export default authenticateToken;
