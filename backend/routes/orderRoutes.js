import express from "express";
import asyncHandler from "express-async-handler";
import Order from "../models/order.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Create a new order (protected)
router.post(
  "/",
  auth,
  asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
    }

    const order = new Order({
      user: req.user.id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  })
);

// Get logged in user's orders
router.get(
  "/mine",
  auth,
  asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  })
);

// Get order by stripe session id (public) - used after returning from Stripe
router.get(
  "/session/:sessionId",
  asyncHandler(async (req, res) => {
    const order = await Order.findOne({ stripeSessionId: req.params.sessionId });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  })
);

// Get order by id (protected) - user must own the order or be admin in future
router.get(
  "/:id",
  auth,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    // ensure the requesting user owns the order
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }
    res.json(order);
  })
);

export default router;
