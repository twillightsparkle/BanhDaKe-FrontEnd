import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { productService } from '../services/api';
import { useTranslation } from 'react-i18next';
import { useLocalizedContent } from '../hooks/useLocalizedContent';

export default function ProductDetail() {
  const { t } = useTranslation();
  const { getLocalized } = useLocalizedContent();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(-1);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState<number>(-1);
  const [activeTab, setActiveTab] = useState<'description' | 'sizes' | 'specifications'>('description');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper functions for new schema
  const getCurrentVariation = () => {
    return product?.variations[selectedColorIndex];
  };

  const getCurrentSizeOption = () => {
    const variation = getCurrentVariation();
    return variation?.sizeOptions[selectedSizeIndex];
  };

  const getCurrentPrice = () => {
    const sizeOption = getCurrentSizeOption();
    return sizeOption?.price || 0;
  };

  const getCurrentStock = () => {
    const sizeOption = getCurrentSizeOption();
    return sizeOption?.stock || 0;
  };

  const isInStock = () => {
    return product?.inStock && getCurrentStock() > 0;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const productData = await productService.getProductById(id);
        setProduct(productData);
        setSelectedImage(productData.image);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);  const handleAddToCart = () => {
    if (!product) return;
    
    if (selectedColorIndex < 0) {
      alert('Please select a color first.');
      return;
    }
    
    if (selectedSizeIndex < 0) {
      alert('Please select a size first.');
      return;
    }

    const variation = getCurrentVariation();
    const sizeOption = getCurrentSizeOption();
    if (variation && sizeOption) {
      // Check if quantity exceeds available stock
      if (quantity > sizeOption.stock) {
        alert(`Sorry, only ${sizeOption.stock} items are available in stock.`);
        return;
      }
      
      if (sizeOption.stock === 0) {
        alert('This size is currently out of stock.');
        return;
      }
      
      // Create a simplified product object for cart compatibility
      addToCart(product, quantity, sizeOption.price, variation.color.en, sizeOption.size.toString());
      alert(`Added ${quantity} x ${getLocalized(product.name)} (Color: ${getLocalized(variation.color)}, Size: ${sizeOption.size}) to cart!`);
    }
  };

  const handleBuyNow = () => {
    if (!product) return;
    
    if (selectedColorIndex < 0) {
      alert('Please select a color first.');
      return;
    }
    
    if (selectedSizeIndex < 0) {
      alert('Please select a size first.');
      return;
    }

    const variation = getCurrentVariation();
    const sizeOption = getCurrentSizeOption();
    if (variation && sizeOption) {
      // Check if quantity exceeds available stock
      if (quantity > sizeOption.stock) {
        alert(`Sorry, only ${sizeOption.stock} items are available in stock.`);
        return;
      }
      
      if (sizeOption.stock === 0) {
        alert('This size is currently out of stock.');
        return;
      }
      
      // Create a simplified product object for cart compatibility
      addToCart(product, quantity, sizeOption.price, variation.color.en, sizeOption.size.toString());
      navigate('/cart');
    }
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    const maxQuantity = Math.min(99, getCurrentStock());
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="product-detail-container">
        <div className="loading">
          <h1>Đang tải sản phẩm...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-detail-container">
        <div className="error">
          <h1>Lỗi</h1>
          <p>Lỗi: {error}</p>
          <p>Vui lòng kiểm tra xem server backend có đang chạy không.</p>
          <Link to="/products" className="back-to-products">
            ← Quay lại danh sách sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-container">
        <div className="product-not-found">
          <h1>Sản phẩm không tìm thấy</h1>
          <p>Rất tiếc, sản phẩm bạn tìm kiếm không tồn tại.</p>
          <Link to="/products" className="back-to-products">
            ← Quay lại danh sách sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link to="/">{t('navigation.home')}</Link>
        <span className="breadcrumb-separator">›</span>
        <Link to="/products">{t('navigation.products')}</Link>
        <span className="breadcrumb-separator">›</span>
        <span className="current-page">{getLocalized(product.name)}</span>
      </nav>

      <div className="product-detail-content">
        {/* Product Images */}
        <div className="product-images">
          <div className="main-image">
            <img src={selectedImage} alt={getLocalized(product.name)} />
          </div>
          {product.images.length > 1 && (
            <div className="thumbnail-images">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className={selectedImage === image ? 'active' : ''}
                  onClick={() => setSelectedImage(image)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="product-info">
          <h1 className="product-title">{getLocalized(product.name)}</h1>
          
          <div className="product-price">
            {selectedSizeIndex >= 0 ? (
              <span className="current-price">{getCurrentPrice().toLocaleString()}₫</span>
            ) : (
              <span className="price-placeholder">Select size to see price</span>
            )}
          </div>

          {product.shortDescription && (
            <p className="product-short-description">{getLocalized(product.shortDescription)}</p>
          )}

          <div className="product-stock">
            {selectedSizeIndex >= 0 ? (
              isInStock() ? (
                <span className="in-stock">✓ Còn hàng ({getCurrentStock()} available)</span>
              ) : (
                <span className="out-of-stock">✗ Hết hàng</span>
              )
            ) : (
              <span className="select-size">Select size to check availability</span>
            )}
          </div>

          {/* Color Selector */}
          {product.variations && product.variations.length >= 1 && (
            <div className="color-selector">
              <label>Color:</label>
              <div className="color-options">
                {product.variations.map((variation, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`color-option ${selectedColorIndex === index ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedColorIndex(index);
                      setSelectedSizeIndex(-1); // Reset size selection when color changes
                      setQuantity(1); // Reset quantity when color changes
                      // Update image if variation has one
                      if (variation.image) {
                        setSelectedImage(variation.image);
                      }
                    }}
                  >
                    {getLocalized(variation.color)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          <div className="size-selector">
            <label>{t('products.sizes')}</label>
            <div className="size-options">
              {getCurrentVariation()?.sizeOptions.map((sizeOption, index) => (
                <button
                  key={index}
                  type="button"
                  className={`size-option ${selectedSizeIndex === index ? 'selected' : ''} ${sizeOption.stock === 0 ? 'out-of-stock' : ''}`}
                  onClick={() => {
                    setSelectedSizeIndex(index);
                    // Adjust quantity if it exceeds the new stock limit
                    const newStock = sizeOption.stock;
                    if (quantity > newStock) {
                      setQuantity(Math.min(quantity, newStock));
                    }
                  }}
                  disabled={sizeOption.stock === 0}
                >
                  {sizeOption.size}
                  {sizeOption.stock === 0 && <span className="stock-indicator"> (Out of stock)</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="quantity-selector">
            <label>{t('products.quantity')}:</label>
            <div className="quantity-controls">
              <button 
                type="button" 
                className="quantity-btn quantity-decrease"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                -
              </button>
              <input 
                type="text" 
                inputMode="numeric"
                value={quantity === 0 ? '' : quantity}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '') {
                    setQuantity(0);
                  } else {
                    const num = parseInt(val);
                    const maxQuantity = Math.min(99, getCurrentStock());
                    if (!isNaN(num) && num <= maxQuantity) {
                      setQuantity(num);
                    }
                  }
                }}
                onBlur={(e) => {
                  let val = parseInt(e.target.value);
                  if (isNaN(val) || val < 1) val = 1;
                  const maxQuantity = Math.min(99, getCurrentStock());
                  if (val > maxQuantity) val = maxQuantity;
                  setQuantity(val);
                }}
                min="1"
                max={Math.min(99, getCurrentStock())}
              />
              <button 
                type="button" 
                className="quantity-btn quantity-increase"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= Math.min(99, getCurrentStock())}
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="action-buttons">            
            <button 
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={!product?.inStock}
            >
              {!product?.inStock ? t('products.outOfStock') : t('products.addToCart')}
            </button>
            <button 
              className="buy-now-btn" 
              onClick={handleBuyNow}
              disabled={!product?.inStock}
            >
              {!product?.inStock ? t('products.outOfStock') : t('products.buyNow')}
            </button>
          </div>
        </div>
      </div>      {/* Product Details Tabs */}
      <div className="product-details-tabs">
        <div className="tab-headers">
          <button 
            className={`tab-header ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            {t('products.description')}
          </button>
          <button 
            className={`tab-header ${activeTab === 'sizes' ? 'active' : ''}`}
            onClick={() => setActiveTab('sizes')}
          >
            {t('products.sizes')}
          </button>
          <button 
            className={`tab-header ${activeTab === 'specifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('specifications')}
          >
            {t('products.specifications')}
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'description' && (
            <div className="description-content">
              <p>{getLocalized(product.detailDescription)}</p>
            </div>
          )}

          {activeTab === 'sizes' && (
            <div className="sizes-content">
              <h3>{t('products.sizes')}:</h3>
              {product.variations.map((variation, varIndex) => (
                <div key={varIndex} className="variation-sizes">
                  <h4>{getLocalized(variation.color)}:</h4>
                  <div className="available-sizes">
                    {variation.sizeOptions.map((sizeOption, sizeIndex) => (
                      <span 
                        key={sizeIndex} 
                        className={`size-badge ${sizeOption.stock === 0 ? 'out-of-stock' : ''}`}
                      >
                        Size {sizeOption.size} - {sizeOption.price.toLocaleString()}₫ 
                        {sizeOption.stock === 0 ? ' (Out of stock)' : ` (${sizeOption.stock} in stock)`}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              <p className="size-guide">
                Vui lòng tham khảo bảng size để chọn kích thước phù hợp nhất.
              </p>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="specifications-content">
              <h3>{t('products.specifications')}:</h3>
              <table>
                <tbody>
                  {Array.isArray(product.specifications) && product.specifications.length > 0 ? (
                    product.specifications.map((spec, index) => (
                      <tr key={index}>
                        <td className="spec-key">{getLocalized(spec.key)}</td>
                        <td className="spec-value">{getLocalized(spec.value)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2}>{t('products.noSpecifications')}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Back to Products */}
      <div className="back-navigation">
        <Link to="/products" className="back-to-products">
          ← {t('products.getBackToProductsList')}
        </Link>
      </div>
    </div>
  );
}
