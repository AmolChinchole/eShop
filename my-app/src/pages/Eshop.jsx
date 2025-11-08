import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import WishlistButton from "../components/WishlistButton";
import { fetchProductsWithParams } from "../api/api";
import { resolveImageUrl } from "../utils/image";

export default function Eshop() {
  const [productsData, setProductsData] = useState({ products: [], page: 1, pages: 1 });
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // debounce search input
  const debouncedSearch = useDebouncedValue(search, 500);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProductsWithParams({ search: debouncedSearch, category, page, pageSize: 12 });
        // backend may return either array or { products, page, pages }
        if (Array.isArray(data)) setProductsData({ products: data, page: 1, pages: 1 });
        else setProductsData(data);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [debouncedSearch, category, page]);

  const categories = useMemo(() => {
    const set = new Set(productsData.products.map((p) => p.category).filter(Boolean));
    return Array.from(set).slice(0, 8);
  }, [productsData.products]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold">Discover great deals</h1>
        <p className="text-gray-600">Search, filter and explore products in our interactive eShop.</p>
      </header>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex-1">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full md:w-96 p-2 border rounded"
          />
        </div>
        <div className="flex items-center gap-3">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="p-2 border rounded">
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button onClick={() => { setSearch(""); setCategory(""); setPage(1); }} className="text-sm text-gray-600">Reset</button>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {productsData.products.map((p) => {
              const img = p.image || p.images?.[0] || null;
              const src = resolveImageUrl(img, { w: 600, h: 400 });

              return (
                <div key={p._id || p.id} className="border rounded p-3 hover:shadow-lg transition relative">
                  <Link to={`/product/${p._id || p.id}`} className="block">
                    <img src={src} alt={p.name} className="h-40 w-full object-cover mb-2 rounded" onError={(e) => { e.currentTarget.src = resolveImageUrl(null, { w: 600, h: 400 }); }} />
                    <h3 className="font-semibold text-sm">{p.name}</h3>
                  </Link>

                  {/* Wishlist heart - top right of card */}
                  <div className="absolute top-3 right-3">
                    <WishlistButton productId={p._id || p.id} />
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-lg font-bold">₹{p.price}</div>
                    <Link to={`/product/${p._id || p.id}`} className="text-sm text-blue-600">View</Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-center space-x-2">
            {Array.from({ length: productsData.pages || 1 }).map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-1 border rounded ${i + 1 === (productsData.page || 1) ? 'bg-gray-800 text-white' : ''}`}>
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Simple debounce hook
function useDebouncedValue(value, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

