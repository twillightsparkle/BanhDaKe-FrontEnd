import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../contexts/CartContext';
import { useLocalizedContent } from '../hooks/useLocalizedContent';

export default function Cart() {
  const { t } = useTranslation();
  const { getLocalized } = useLocalizedContent();
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useCart();

  const handleQuantityChange = (productId: string, selectedSize: string, newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 99) {
      updateQuantity(productId, selectedSize, newQuantity);
    }
  };

  const handleRemoveItem = (productId: string, selectedSize: string) => {
    removeFromCart(productId, selectedSize);
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
            <div className="summary-row shipping">
              <span>Phí vận chuyển:</span>
              <span>Miễn phí</span>
            </div>
            <div className="summary-row total">
              <span>Tổng cộng:</span>
              <span>{getTotalPrice().toLocaleString()}₫</span>
            </div>
            <div className="cart-actions">
              <Link to="/checkout" className="checkout-btn">
                Tiến hành thanh toán
              </Link>
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
