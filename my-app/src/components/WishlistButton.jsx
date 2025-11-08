import React, { useContext, useState } from "react";
import { WishlistContext } from "../context/WishlistContext";
import { toast } from "react-toastify"; // optional (add: npm i react-toastify)

const WishlistButton = ({ productId }) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);
  const [loading, setLoading] = useState(false);

  const isWishlisted = isInWishlist(productId);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (isWishlisted) {
        await removeFromWishlist(productId);
        toast.success("Removed from wishlist ❤️‍🔥");
      } else {
        await addToWishlist(productId);
        toast.success("Added to wishlist 💖");
      }
    } catch (error) {
      console.error("❌ Wishlist action failed:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`p-2 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm
        ${
          isWishlisted
            ? "bg-red-100 text-red-500 hover:bg-red-200"
            : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-red-500"
        }
        ${loading ? "opacity-50 cursor-not-allowed" : ""}
      `}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      {loading ? (
        // 🔄 Spinner while waiting for response
        <svg
          className="animate-spin h-5 w-5 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      ) : (
        // ❤️ Heart toggle icon
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill={isWishlisted ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 
              20.364l7.682-7.682a4.5 
              4.5 0 00-6.364-6.364L12 
              7.636l-1.318-1.318a4.5 
              4.5 0 00-6.364 0z"
          />
        </svg>
      )}
    </button>
  );
};

export default WishlistButton;
