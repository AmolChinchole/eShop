import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext.jsx";

function ProductScreen() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!product) return <p className="p-6">Loading product...</p>;

  const handleAdd = () => addToCart(product);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <img
        src={product.images[0] || "https://via.placeholder.com/600"}
        alt={product.name}
        className="w-full h-96 object-cover mb-4"
      />
      <p className="text-gray-700 mb-2">{product.description}</p>
      <p className="text-green-600 font-bold mb-4">₹{product.price}</p>
      <button
        onClick={handleAdd}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductScreen;
