import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext.jsx";
import { Link } from "react-router-dom";

function Home() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        const data = res.data;
        // Support both shapes: { products, page, pages } or an array
        if (Array.isArray(data)) {
          if (mounted) setProducts(data);
        } else if (data && Array.isArray(data.products)) {
          if (mounted) setProducts(data.products);
        } else {
          if (mounted) setProducts([]);
        }
      } catch (err) {
        console.error("Failed to load products", err);
      }
    };
    load();
    return () => { mounted = false };
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product._id} className="border p-4 rounded shadow hover:shadow-lg transition">
            <Link to={`/product/${product._id}`}>
              <img
                src={product.images?.[0] || "https://via.placeholder.com/400"}
                alt={product.name}
                className="w-full h-48 object-cover mb-2"
              />
              <h2 className="text-xl font-semibold">{product.name}</h2>
            </Link>
            <p className="text-gray-700">{product.description}</p>
            <p className="text-green-600 font-bold mt-2">₹{product.price}</p>
            <button
              onClick={() => addToCart(product)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
