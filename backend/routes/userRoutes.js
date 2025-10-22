import express from "express";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

const router = express.Router();

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Register user
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const user = await User.create({ name, email, password });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  })
);

// Login user
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid credentials");
    }
  })
);

// Get user's cart (protected) - client should include Bearer token
router.get(
  "/cart",
  asyncHandler(async (req, res) => {
    // Expect token in Authorization header; verify using jwt
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Not authorized" });
    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.cart || []);
  })
);

// Update/merge user's cart (protected)
router.post(
  "/cart",
  asyncHandler(async (req, res) => {
    const { cart } = req.body;
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Not authorized" });
    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Simple merge: for each incoming item, sum quantities by productId
    const map = new Map();
    (user.cart || []).forEach((it) => map.set(String(it.productId), { ...it }));
    (cart || []).forEach((it) => {
      const key = String(it.productId || it._id || it.productId);
      if (map.has(key)) {
        map.get(key).qty = (map.get(key).qty || 0) + (it.qty || 0);
      } else {
        map.set(key, { productId: it.productId || it._id, name: it.name, qty: it.qty || 1, price: it.price, image: it.image });
      }
    });

    user.cart = Array.from(map.values());
    await user.save();
    res.json(user.cart);
  })
);

export default router;
