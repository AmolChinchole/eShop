import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Reference to the Product model
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now, // Track when product was added
        },
      },
    ],
  },
  { timestamps: true }
);

// ✅ Remove duplicates before saving
wishlistSchema.pre("save", function (next) {
  if (this.products && this.products.length > 0) {
    const uniqueProducts = [];
    const seen = new Set();

    for (const item of this.products) {
      const idStr = item.product.toString();
      if (!seen.has(idStr)) {
        seen.add(idStr);
        uniqueProducts.push(item);
      }
    }

    this.products = uniqueProducts;
  }
  next();
});

// ✅ Optional cleanup: remove invalid product references
wishlistSchema.pre("save", function (next) {
  this.products = this.products.filter((p) => !!p.product);
  next();
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

export default Wishlist;
