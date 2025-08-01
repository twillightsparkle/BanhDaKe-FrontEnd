import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useLocalizedContent } from '../hooks/useLocalizedContent';
import { shippingService } from '../services/api';
import type { ShippingFeeChoice } from '../types';
import '../styles/cart.css';

export default function Cart() {
  const { t } = useTranslation();
  const { getLocalized } = useLocalizedContent();
  const { user } = useAuth();
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    getTotalPrice, 
    getTotalItems, 
    getTotalWeight,
    shippingCountry,
    setShippingCountry
  } = useCart();
  
  // Shipping state
  const [shippingFees, setShippingFees] = useState<ShippingFeeChoice[]>([]);
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [isLoadingShipping, setIsLoadingShipping] = useState<boolean>(false);
  const [shippingError, setShippingError] = useState<string | null>(null);

  // Load shipping fees on component mount
  useEffect(() => {
    const loadShippingFees = async () => {
      try {
        setIsLoadingShipping(true);
        const fees = await shippingService.getAllShippingFees();
        setShippingFees(fees);
        setShippingError(null);
      } catch (error) {
        setShippingError('Failed to load shipping options');
        console.error('Error loading shipping fees:', error);
      } finally {
        setIsLoadingShipping(false);
      }
    };

    loadShippingFees();
  }, []);

  // Calculate shipping fee when country changes
  useEffect(() => {
    if (shippingCountry) {
      const selectedFee = shippingFees.find(fee => fee.country === shippingCountry);
      if (selectedFee) {
        const totalWeight = getTotalWeight()/1000; // Convert grams to kg
        const calculatedFee = selectedFee.baseFee + (selectedFee.perKgRate * totalWeight);
        setShippingFee(calculatedFee);
      }
    } else {
      setShippingFee(0);
    }
  }, [shippingCountry, shippingFees, getTotalWeight]);

  const handleQuantityChange = (productId: string, selectedSize: string, newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 99) {
      updateQuantity(productId, selectedSize, newQuantity);
    }
  };

  const handleRemoveItem = (productId: string, selectedSize: string) => {
    removeFromCart(productId, selectedSize);
  };

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setShippingCountry(event.target.value || null);
  };

  const getTotalWithShipping = () => {
    return getTotalPrice() + shippingFee;
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-empty">
          <h1>{t('cart.title')}</h1>
          <p>{t('cart.empty')}</p>
          <Link to="/products" className="continue-shopping-btn">
            {t('cart.continueShopping')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Giỏ hàng của bạn</h1>
        <p>{getTotalItems()} sản phẩm</p>
      </div>

      <div className="cart-content">        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={`${item.product._id}-${item.selectedSize}`} className="cart-item">
              <div className="cart-item-image">
                <img src={item.product.image} alt={getLocalized(item.product.name)} />
              </div>
              
              <div className="cart-item-details">
                <h3 className="cart-item-name">{getLocalized(item.product.name)}</h3>
                <p className="cart-item-size">Kích thước: {item.selectedSize}</p>
                <p className="cart-item-price">{item.product.price.toLocaleString()}₫</p>
              </div>

              <div className="cart-item-quantity">
                <label>Số lượng:</label>
                <div className="quantity-controls">
                  <button 
                    onClick={() => handleQuantityChange(item.product._id, item.selectedSize, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className='quantity-btn quantity-decrease'
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.product._id, item.selectedSize, parseInt(e.target.value) || 1)}
                    min="1"
                    max="99"
                  />
                  <button 
                    onClick={() => handleQuantityChange(item.product._id, item.selectedSize, item.quantity + 1)}
                    disabled={item.quantity >= 99}
                    className="quantity-btn quantity-increase"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="cart-item-total">
                <p>{(item.product.price * item.quantity).toLocaleString()}₫</p>
              </div>

              <div className="cart-item-actions">
                <button 
                  className="remove-item-btn"
                  onClick={() => handleRemoveItem(item.product._id, item.selectedSize)}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="cart-summary-content">
            <h3>Tóm tắt đơn hàng</h3>
            <div className="summary-row">
              <span>Tổng sản phẩm:</span>
              <span>{getTotalItems()}</span>
            </div>
            <div className="summary-row">
              <span>Tạm tính:</span>
              <span>{getTotalPrice().toLocaleString()}₫</span>
            </div>

            {/* Shipping Selection */}
            <div className="shipping-selection">
              <h4>Chọn quốc gia giao hàng</h4>
              {isLoadingShipping ? (
                <p>Đang tải danh sách quốc gia...</p>
              ) : shippingError ? (
                <p className="error">{shippingError}</p>
              ) : (
                <select 
                  value={shippingCountry || ''} 
                  onChange={handleCountryChange}
                  className="country-select"
                >
                  <option value="">-- Chọn quốc gia --</option>
                  {shippingFees && shippingFees.length > 0 ? (
                    shippingFees.map((fee) => (
                      <option key={fee._id} value={fee.country}>
                        {fee.country}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      Không có quốc gia nào khả dụng
                    </option>
                  )}
                </select>
              )}
              
              {shippingCountry && (
                <div className="shipping-info">
                  <p><strong>Trọng lượng ước tính:</strong> {(getTotalWeight() / 1000).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 0 })} kg</p>
                  <p><strong>Phí cơ bản:</strong> {shippingFees.find(f => f.country === shippingCountry)?.baseFee.toLocaleString()}₫</p>
                  <p><strong>Phí theo kg:</strong> {shippingFees.find(f => f.country === shippingCountry)?.perKgRate.toLocaleString()}₫/kg</p>
                </div>
              )}
            </div>

            <div className="summary-row shipping">
              <span>Phí vận chuyển:</span>
              <span>{shippingCountry ? `${shippingFee.toLocaleString()}₫` : 'Chọn quốc gia'}</span>
            </div>
            <div className="summary-row total">
              <span>Tổng cộng:</span>
              <span>{getTotalWithShipping().toLocaleString()}₫</span>
            </div>
            <div className="cart-actions">
              {user ? (
                <Link 
                  to="/checkout" 
                  className={`checkout-btn ${!shippingCountry ? 'disabled' : ''}`}
                  onClick={(e) => {
                    if (!shippingCountry) {
                      e.preventDefault();
                      alert('Vui lòng chọn quốc gia giao hàng trước khi thanh toán');
                    }
                  }}
                >
                  Tiến hành thanh toán
                </Link>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Link 
                    to="/login" 
                    state={{ from: { pathname: '/checkout' } }}
                    className="checkout-btn"
                  >
                    Đăng nhập để thanh toán
                  </Link>
                  <p style={{ fontSize: '12px', color: '#666', textAlign: 'center', margin: 0 }}>
                    Bạn cần đăng nhập để tiến hành thanh toán
                  </p>
                </div>
              )}
              <Link to="/products" className="continue-shopping-btn">
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
