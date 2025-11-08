import express from "express";
import asyncHandler from "express-async-handler";
import Order from "../models/order.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Process checkout
router.post("/checkout", auth, asyncHandler(async (req, res) => {
  try {
    const { products, totalAmount, shippingAddress } = req.body;

    // Validate request
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Invalid products data" });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ message: "Invalid total amount" });
    }

    // Generate a fake payment ID (in real world this would come from payment gateway)
    const paymentId = 'PAY_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);

    // Create new order
    const order = new Order({
      user: req.user.id,
      orderItems: products.map(item => ({
        product: item.id,
        name: item.name,
        qty: item.quantity,
        price: item.price,
        image: item.image
      })),
      shippingAddress,
      paymentMethod: 'Demo Payment',
      itemsPrice: totalAmount,
      taxPrice: totalAmount * 0.10, // 10% tax
      shippingPrice: 10.00,
      totalPrice: totalAmount + (totalAmount * 0.10) + 10.00,
      paymentId,
      paymentStatus: 'Success',
      isPaid: true,
      paidAt: Date.now(),
      status: 'Confirmed'
    });

    await order.save();

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    res.json({
      success: true,
      message: "Payment successful",
      orderId: order._id,
      paymentId,
      paymentStatus: "Success"
    });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({ message: "Checkout failed", error: error.message });
  }
}));

// Get order status
router.get("/order/:orderId", auth, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
  res.json(order);
}));

export default router;
