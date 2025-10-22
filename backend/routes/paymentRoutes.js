import express from "express";
import asyncHandler from "express-async-handler";
import Stripe from "stripe";
import Order from "../models/order.js";
import auth from "../middleware/auth.js";

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET, { apiVersion: "2022-11-15" });

// Create a checkout session
router.post(
  "/create-checkout-session",
  auth,
  asyncHandler(async (req, res) => {
    const { items, successUrl, cancelUrl, shippingAddress, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    // Create order server-side first
    const itemsPrice = items.reduce((acc, it) => acc + (it.price || 0) * (it.qty || 1), 0);
    const taxPrice = 0;
    const shippingPrice = 0;
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    const order = new Order({
      user: req.user.id,
      orderItems: items.map((it) => ({ product: it.productId, name: it.name, qty: it.qty, price: it.price, image: it.image })),
      shippingAddress,
      paymentMethod: paymentMethod || "card",
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    });

    await order.save();

    const line_items = items.map((it) => ({
      price_data: {
        currency: "inr",
        product_data: { name: it.name },
        unit_amount: Math.round(it.price * 100)
      },
      quantity: it.qty || 1
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: successUrl || "http://localhost:3000/checkout/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: cancelUrl || "http://localhost:3000/checkout/cancel",
      metadata: { orderId: order._id.toString() }
    });

    // Save stripe session id to order
    order.stripeSessionId = session.id;
    await order.save();

    res.json({ id: session.id, url: session.url });
  })
);

// Webhook to handle checkout.session.completed
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      // If webhook secret not configured, parse directly (less secure)
      event = req.body;
    }
  } catch (err) {
    console.error("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("Checkout session completed", session.id);

    try {
      // Try to find order by metadata.orderId first
      const orderId = session.metadata?.orderId;
      let order = null;
      if (orderId) order = await Order.findById(orderId);

      // Fallback: find by stripeSessionId
      if (!order) order = await Order.findOne({ stripeSessionId: session.id });

      if (order) {
        order.isPaid = true;
        order.paidAt = new Date();
        order.paymentResult = session;
        order.status = "Paid";
        await order.save();
        console.log("Order marked as paid", order._id.toString());
      } else {
        console.warn("No order found for session", session.id);
      }
    } catch (err) {
      console.error("Failed to mark order paid:", err);
    }
  }

  res.json({ received: true });
});

export default router;
