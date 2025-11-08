import express from "express";
import asyncHandler from "express-async-handler";
import Wishlist from "../models/wishlist.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/**
 * ✅ Get logged-in user's wishlist
 * @route  GET /api/wishlist/my-wishlist
 * @access Private
 */
router.get(
  "/my-wishlist",
  auth,
  asyncHandler(async (req, res) => {
    let wishlist = await Wishlist.findOne({ user: req.user.id }).populate(
      "products.product"
    );

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, products: [] });
    }

    // Return products as-is from database without modification
    const normalized = wishlist.products.map((it) => ({
      _id: it._id,
      addedAt: it.addedAt,
      product: it.product,
      productId: it.product?._id || it.product,
    }));

    res.status(200).json({
      success: true,
      count: normalized.length,
      wishlist: normalized,
    });
  })
);

/**
 * ✅ Add product to wishlist
 * @route  POST /api/wishlist/add/:productId
 * @access Private
 */
router.post(
  "/add/:productId",
  auth,
  asyncHandler(async (req, res) => {
    const { productId } = req.params;

    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user.id,
        products: [{ product: productId }],
      });
    } else {
      const alreadyExists = wishlist.products.some(
        (item) => item.product.toString() === productId
      );

      if (!alreadyExists) {
        wishlist.products.push({ product: productId });
        await wishlist.save();
      }
    }

    wishlist = await Wishlist.findOne({ user: req.user.id }).populate(
      "products.product"
    );

    const normalized = wishlist.products.map((it) => ({
      _id: it._id,
      addedAt: it.addedAt,
      product: it.product,
      productId: it.product?._id || it.product,
    }));

    res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      wishlist: normalized,
    });
  })
);

/**
 * ✅ Remove product from wishlist
 * @route  DELETE /api/wishlist/remove/:productId
 * @access Private
 */
router.delete(
  "/remove/:productId",
  auth,
  asyncHandler(async (req, res) => {
    const { productId } = req.params;

    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      return res
        .status(404)
        .json({ success: false, message: "Wishlist not found" });
    }

    // Remove by productId or wishlist entry ID
    const pullResult = await Wishlist.updateOne(
      { user: req.user.id },
      { $pull: { products: { product: productId } } }
    );

    if (pullResult.modifiedCount === 0) {
      await Wishlist.updateOne(
        { user: req.user.id },
        { $pull: { products: { _id: productId } } }
      );
    }

    wishlist = await Wishlist.findOne({ user: req.user.id }).populate(
      "products.product"
    );

    const normalized = wishlist.products.map((it) => ({
      _id: it._id,
      addedAt: it.addedAt,
      product: it.product,
      productId: it.product?._id || it.product,
    }));

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      wishlist: normalized,
    });
  })
);

export default router;
