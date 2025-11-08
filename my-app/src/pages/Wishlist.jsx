import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";
import { resolveImageUrl } from "../utils/image";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, loading } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  // 🧾 Log wishlist data for debugging
  useEffect(() => {
    console.log("🧾 Wishlist Items:", wishlistItems);
    if (wishlistItems && wishlistItems.length > 0) {
      console.log("📦 First item details:", {
        item: wishlistItems[0],
        product: wishlistItems[0].product,
        image: wishlistItems[0].product?.image,
        images: wishlistItems[0].product?.images,
        imagesFirstElement: wishlistItems[0].product?.images?.[0],
        name: wishlistItems[0].product?.name,
        price: wishlistItems[0].product?.price
      });
    }
  }, [wishlistItems]);

  // 🔄 Loader
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 💔 Empty wishlist
  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-semibold mb-4">Your Wishlist is Empty 💔</h2>
        <p className="text-gray-600 mb-6">
          Browse our collection and add your favorite products!
        </p>
        <Link
          to="/eshop"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  // ❤️ Wishlist items
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center md:text-left">
        My Wishlist ❤️
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {wishlistItems.map((item) => {
          // Extract product data from nested structure
          const product = item?.product || item;
          const productId = product?._id || item?.productId;

          // Get image URL - check both image and images array
          const img = product?.image || product?.images?.[0] || null;
          const imageUrl = resolveImageUrl(img, { w: 300, h: 300, text: product?.name || 'Product' });

          // Get product details
          const name = product?.name || "Unnamed Product";
          const price = typeof product?.price === "number" ? product.price : 0;
          
          // Debug log for each product
          console.log("🖼️ Image check:", {
            productName: name,
            hasImage: !!product?.image,
            imageValue: product?.image,
            hasImagesArray: !!product?.images,
            imagesArray: product?.images,
            resolvedUrl: imageUrl
          });

          return (
            <div
              key={productId || Math.random()}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden"
            >
              {/* 🖼 Product Image */}
              <div className="relative w-full h-64 bg-gray-200">
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                  onLoad={(e) => {
                    console.log("✅ Image loaded successfully:", name, imageUrl);
                    e.target.style.opacity = '1';
                  }}
                  onError={(e) => {
                    // Fallback to embedded SVG placeholder if image fails
                    console.error("❌ Image load failed for:", name, imageUrl);
                    e.target.src = resolveImageUrl(null, { w: 300, h: 300, text: name });
                  }}
                  style={{ opacity: 1 }}
                />

                {/* ❌ Remove Button */}
                <button
                  onClick={() => {
                    if (!productId) {
                      toast.error("Unable to remove item ❌");
                      return;
                    }
                    removeFromWishlist(productId);
                    toast.info(`${name} removed from wishlist ❤️‍🔥`, {
                      autoClose: 1200,
                    });
                  }}
                  aria-label="Remove from wishlist"
                  className="absolute top-3 right-3 bg-white/90 hover:bg-red-100 text-red-500 p-2 rounded-full transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* 🧾 Product Info */}
              <div className="p-5 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {name}
                  </h3>
                  <p className="text-gray-600 mt-1 mb-3">₹{price.toFixed(2)}</p>
                </div>

                {/* 🛍 Buttons */}
                <div className="mt-auto flex gap-2">
                  <button
                    onClick={() => {
                      addToCart(product);
                      toast.success(`${name} added to cart 🛒`, {
                        autoClose: 1200,
                      });
                    }}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    Add to Cart
                  </button>
                  <Link
                    to={productId ? `/product/${productId}` : "#"}
                    className={`flex-1 border border-gray-300 py-2 rounded-md text-center hover:bg-gray-50 transition ${
                      !productId ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
