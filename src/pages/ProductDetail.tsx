import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useCheckout } from '../contexts/CheckoutContext';
import { productService } from '../services/api';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addSingleItemToCheckout } = useCheckout();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'description' | 'sizes' | 'specifications'>('description');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    if (product && selectedSize) {
      addToCart(product, quantity, selectedSize);
      alert(`Added ${quantity} x ${product.name} (Size: ${selectedSize}) to cart!`);
    } else if (product && !selectedSize) {
      alert('Please select a size before adding to cart.');
    }  };

  const handleBuyNow = () => {
    if (product && selectedSize) {
      // Add the single item to checkout context
      addSingleItemToCheckout(product, quantity, selectedSize);
      // Navigate to checkout page
      navigate('/checkout');
    } else if (product && !selectedSize) {
      alert('Please select a size before buying.');
    }
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 99) {
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
        <Link to="/">Trang chủ</Link>
        <span className="breadcrumb-separator">›</span>
        <Link to="/products">Sản phẩm</Link>
        <span className="breadcrumb-separator">›</span>
        <span className="current-page">{product.name}</span>
      </nav>

      <div className="product-detail-content">
        {/* Product Images */}
        <div className="product-images">
          <div className="main-image">
            <img src={selectedImage} alt={product.name} />
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
          <h1 className="product-title">{product.name}</h1>
          
          <div className="product-price">
            <span className="current-price">{product.price.toLocaleString()}₫</span>
            {product.originalPrice && (
              <span className="original-price">{product.originalPrice.toLocaleString()}₫</span>
            )}
          </div>

          <p className="product-short-description">{product.shortDescription}</p>

          <div className="product-stock">
            {product.inStock ? (
              <span className="in-stock">✓ Còn hàng</span>
            ) : (
              <span className="out-of-stock">✗ Hết hàng</span>
            )}
          </div>

          {/* Size Selector */}
          <div className="size-selector">
            <label>Kích thước:</label>
            <div className="size-options">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="quantity-selector">
            <label>Số lượng:</label>
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
                type="number" 
                value={quantity === 0 ? '' : quantity}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '') {
                    setQuantity(0);
                  } else {
                    const num = parseInt(val);
                    if (!isNaN(num) && num <= 99) {
                      setQuantity(num);
                    }
                  }
                }}
                onBlur={(e) => {
                  let val = parseInt(e.target.value);
                  if (isNaN(val) || val < 1) val = 1;
                  if (val > 99) val = 99;
                  setQuantity(val);
                }}
                min="1"
                max="99"
              />
              <button 
                type="button" 
                className="quantity-btn quantity-increase"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= 99}
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="action-buttons">            <button 
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              {product.inStock ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
            </button>
            <button 
              className="buy-now-btn" 
              onClick={handleBuyNow}
              disabled={!product.inStock}
            >
              {product.inStock ? 'Mua ngay' : 'Hết hàng'}
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
            Mô tả chi tiết
          </button>
          <button 
            className={`tab-header ${activeTab === 'sizes' ? 'active' : ''}`}
            onClick={() => setActiveTab('sizes')}
          >
            Kích thước
          </button>
          <button 
            className={`tab-header ${activeTab === 'specifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('specifications')}
          >
            Thông số kỹ thuật
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'description' && (
            <div className="description-content">
              <p>{product.detailDescription}</p>
            </div>
          )}

          {activeTab === 'sizes' && (
            <div className="sizes-content">
              <h3>Kích thước có sẵn:</h3>
              <div className="available-sizes">
                {product.sizes.map((size, index) => (
                  <span key={index} className="size-badge">{size}</span>
                ))}
              </div>
              <p className="size-guide">
                Vui lòng tham khảo bảng size để chọn kích thước phù hợp nhất.
              </p>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="specifications-content">
              <h3>Thông số kỹ thuật:</h3>
              <table>
                <tbody>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <tr key={key}>
                      <td className="spec-key">{key}</td>
                      <td className="spec-value">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Back to Products */}
      <div className="back-navigation">
        <Link to="/products" className="back-to-products">
          ← Quay lại danh sách sản phẩm
        </Link>
      </div>
    </div>
  );
}
