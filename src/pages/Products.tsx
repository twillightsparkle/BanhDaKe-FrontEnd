import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from '../types';
import { productService } from '../services/api';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getAllProducts();
        setProducts(data.products || data); // Handle both paginated and direct array response
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);return (
    <div className="products-container">
      <h1>Giày thể thao nổi bật</h1>
      
      {loading && (
        <div className="loading">
          <p>Đang tải sản phẩm...</p>
        </div>
      )}
      
      {error && (
        <div className="error">
          <p>Lỗi: {error}</p>
          <p>Vui lòng kiểm tra xem server backend có đang chạy không.</p>
        </div>
      )}
        {!loading && !error && (
        <div className="products-grid">
          {products.map(product => (
            <Link key={product._id} to={`/product/${product._id}`} className="product-card">
              <img src={product.image} alt={product.name} />
              <h2>{product.name}</h2>
              <p>{product.price.toLocaleString()}₫</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};


export default Products;
