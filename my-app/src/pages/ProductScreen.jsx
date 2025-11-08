import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import { resolveImageUrl } from "../utils/image";
import { CartContext } from "../context/CartContext.jsx";
import WishlistButton from "../components/WishlistButton";

function ProductScreen() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!product) return <p className="p-6">Loading product...</p>;
  // Some products store a single image in `image` (singular) while others use `images` array.
  // Prefer the first entry in `images`, but fall back to `image` if present.
  const img = product?.images?.[0] || product?.image || null;

  const handleAdd = () => addToCart(product);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <img
            src={resolveImageUrl(img, { w: 600, h: 400 })}
            alt={product.name}
            className="w-full h-96 object-cover mb-4"
            onError={(e) => {
              try {
                e.currentTarget.src = resolveImageUrl(null, { w: 600, h: 400 });
              } catch (err) {
                /* ignore */
              }
            }}
          />
      <p className="text-gray-700 mb-2">{product.description}</p>
      <p className="text-green-600 font-bold mb-4">₹{product.price}</p>
      <div className="flex items-center gap-3">
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Add to Cart
        </button>

        <WishlistButton productId={product._id || product.id} />
      </div>
    </div>
  );
}

export default ProductScreen;
