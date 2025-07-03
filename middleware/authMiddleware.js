import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Middleware to verify JWT token
export const protectRoute = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Expecting format: Bearer <token>
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Can access req.user.id in routes
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
