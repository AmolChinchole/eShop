import express from "express";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import nodemailer from "nodemailer";

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

// Send OTP to email for login
router.post(
  "/send-otp",
  asyncHandler(async (req, res) => {
    console.log("📧 Received OTP request for email:", req.body?.email);
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found. Please register first." });
    }

    // Generate 6-digit OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expires = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes

    user.otp = otp;
    user.otpExpires = expires;
    await user.save();

    // Send email using nodemailer
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const from = process.env.FROM_EMAIL || process.env.SMTP_USER;
      const mail = {
        from,
        to: user.email,
        subject: "Your OTP for eShop",
        text: `Your verification code is ${otp}. It expires in 10 minutes.`,
      };

      await transporter.sendMail(mail);
      res.json({ success: true, message: "OTP sent to email" });
    } catch (err) {
      // If email sending fails, still return success but log the OTP to server logs for testing
      console.error("Failed to send OTP email, OTP:", otp, err);
      res.json({ success: true, message: "OTP generated (email sending failed in server). Check server logs for OTP in development." });
    }
  })
);

// Verify OTP and issue JWT
router.post(
  "/verify-otp",
  asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.otp || !user.otpExpires || new Date() > user.otpExpires) {
      return res.status(400).json({ message: "OTP expired or not generated" });
    }

    if (String(user.otp) !== String(otp)) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    // Clear OTP fields
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Issue token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
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
