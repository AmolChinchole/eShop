import React, { useEffect, useState } from 'react';
import API from '../api/api';
import ProductCard from '../components/ProductCard';

function HomeScreen() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get('/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.length === 0 ? <p>Loading products...</p> : products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default HomeScreen;
