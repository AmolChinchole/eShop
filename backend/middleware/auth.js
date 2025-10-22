// middleware/auth.js
import jwt from "jsonwebtoken";

/**
 * Middleware to protect routes and verify JWT token
 */
export default function auth(req, res, next) {
  try {
    // 1️⃣ Check if Authorization header exists
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    // 2️⃣ Extract token (format: "Bearer <token>")
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ message: "Invalid token format" });
    }
    const token = parts[1];

    // 3️⃣ Verify token
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Attach user info to request object
    req.user = payload;

    // 5️⃣ Proceed to next middleware/route
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
