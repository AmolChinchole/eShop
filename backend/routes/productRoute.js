import express from "express";
import Product from "../models/product.js";

const router = express.Router();

// Get all products with optional search, filters, sort, and pagination
router.get("/", async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 12;
  const page = Number(req.query.page) || 1;

  const keyword = req.query.search
    ? { name: { $regex: req.query.search, $options: "i" } }
    : {};

  const category = req.query.category ? { category: req.query.category } : {};

  const min = req.query.min ? Number(req.query.min) : 0;
  const max = req.query.max ? Number(req.query.max) : Number.MAX_SAFE_INTEGER;

  const priceFilter = { price: { $gte: min, $lte: max } };

  let sort = {};
  if (req.query.sort === "priceAsc") sort = { price: 1 };
  else if (req.query.sort === "priceDesc") sort = { price: -1 };
  else sort = { createdAt: -1 };

  const filter = { ...keyword, ...category, ...priceFilter };

  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort(sort)
    .skip(pageSize * (page - 1))
    .limit(pageSize);

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// Get product by ID
router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if(product) res.json(product);
  else res.status(404).json({ message: "Product not found" });
});

export default router;
