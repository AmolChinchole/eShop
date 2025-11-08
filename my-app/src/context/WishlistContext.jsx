import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import api from "../api/api";
import { toast } from "react-toastify";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useContext(AuthContext);

  // 🧩 Normalize a single product
  const normalizeProduct = (p) => {
    if (!p) return null;
    return {
      _id: p._id || p.id || "",
      name: p.name || p.title || "Unnamed Product",
      price: p.price || 0,
      images: p.images || [],  // Keep the images array as-is
      description: p.description || "",
      category: p.category || "",
    };
  };

  // 🧩 Normalize full wishlist (supports multiple formats)
  const normalizeWishlist = (data) => {
    if (!data) return [];

    // Case 1: API response shape { success, wishlist: [...] }
    if (Array.isArray(data.wishlist)) {
      return data.wishlist.map((it) => ({
        _id: it._id,
        addedAt: it.addedAt || null,
        product: normalizeProduct(it.product),
        productId: it.product?._id || it.productId || it._id,
      }));
    }

    // Case 2: Document shape { products: [...] }
    if (Array.isArray(data.products)) {
      return data.products.map((p) => ({
        _id: p._id,
        addedAt: p.addedAt || null,
        product: normalizeProduct(p.product),
        productId: p.product?._id || p._id,
      }));
    }

    // Case 3: Raw array fallback
    if (Array.isArray(data)) {
      return data.map((p) => ({
        _id: p._id || p.id,
        addedAt: p.addedAt || null,
        product: normalizeProduct(p.product || p),
        productId: p.product?._id || p._id,
      }));
    }

    return [];
  };

  // 🔹 Fetch wishlist on login
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!isAuthenticated) {
        setWishlistItems([]);
        return;
      }

      try {
        setLoading(true);
        const headers = user?.token
          ? { Authorization: `Bearer ${user.token}` }
          : {};

        const response = await api.get("/wishlist/my-wishlist", { headers });
        setWishlistItems(normalizeWishlist(response.data));
      } catch (error) {
        console.error("❌ Error fetching wishlist:", error);
        toast.error("Failed to load wishlist 😢");
        setWishlistItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [isAuthenticated, user?.token]);

  // 🔹 Add to wishlist
  const addToWishlist = async (productId) => {
    if (!isAuthenticated) {
      toast.warning("Please login to add items 💖");
      return;
    }

    if (wishlistItems.some((it) => String(it.productId) === String(productId))) {
      toast.info("Already in wishlist 💝");
      return;
    }

    try {
      const headers = user?.token
        ? { Authorization: `Bearer ${user.token}` }
        : {};

      const response = await api.post(`/wishlist/add/${productId}`, null, {
        headers,
      });

      setWishlistItems(normalizeWishlist(response.data));
      // toast.success("Added to wishlist 💝"); // handled by button
    } catch (error) {
      console.error("❌ Error adding to wishlist:", error);
      toast.error("Failed to add item 😢");
    }
  };

  // 🔹 Remove from wishlist
  const removeFromWishlist = async (productIdOrEntryId) => {
    try {
      const headers = user?.token
        ? { Authorization: `Bearer ${user.token}` }
        : {};

      const response = await api.delete(
        `/wishlist/remove/${productIdOrEntryId}`,
        { headers }
      );

      setWishlistItems(normalizeWishlist(response.data));
      // toast.info("Removed from wishlist ❤️‍🔥"); // handled by button
    } catch (error) {
      console.error("❌ Error removing from wishlist:", error);
      toast.error("Failed to remove item 😢");
    }
  };

  // 🔹 Check if product exists in wishlist
  const isInWishlist = (productId) =>
    wishlistItems.some(
      (item) =>
        String(item.productId) === String(productId) ||
        String(item._id) === String(productId)
    );

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
