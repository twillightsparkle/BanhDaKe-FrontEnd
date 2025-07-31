import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import type { Product } from '../types';
import { productService } from '../services/api';
import { useLocalizedContent } from '../hooks/useLocalizedContent';

const Products: React.FC = () => {
  const { t } = useTranslation();
  const { getLocalized } = useLocalizedContent();
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
  }, []);  return (
    <div className="products-container">
      
      {loading && (
        <div className="loading" data-text={t('common.loading')}></div>
      )}
      
      {error && (
        <div className="error">
          <p>{t('common.error')}: {error}</p>
          <p>Vui lòng kiểm tra xem server backend có đang chạy không.</p>
        </div>
      )}
        {!loading && !error && (
        <div>
        <h1>{t('products.title')}</h1>
        <div className="products-grid">
          {products.map(product => (
            <Link key={product._id} to={`/product/${product._id}`} className="product-card">
              <img src={product.image} alt={getLocalized(product.name)} />
              <h2>{getLocalized(product.name)}</h2>
              <p>{product.price.toLocaleString()}₫</p>
            </Link>
          ))}
        </div>
        </div>
      )}
    </div>
  );
};


export default Products;
