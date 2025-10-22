// models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    images: { type: [String], default: [] }, // Array of image URLs
    category: { type: String, default: "", trim: true },
    stock: { type: Number, default: 10 }
  },
  {
    timestamps: true // Automatically adds createdAt & updatedAt
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
