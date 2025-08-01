import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { orderService } from '../services/api';
import { useLocalizedContent } from '../hooks/useLocalizedContent';
import type { CustomerInfo, CreateOrderRequest } from '../types';

export default function Checkout() {
  const navigate = useNavigate();
  const { getLocalized } = useLocalizedContent();
  const { cartItems, clearCart, getTotalPrice, shippingCountry } = useCart();
  const { user } = useAuth();
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if no items to checkout
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/products');
    }
  }, [cartItems, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      if (!customerInfo.name.trim() || !customerInfo.email.trim() || !customerInfo.address.trim()) {
        throw new Error('Please fill in all required fields');
      }

      // Prepare order items from cart
      const orderItems = cartItems.map(item => ({
        productId: item.product._id,
        productName: getLocalized(item.product.name),
        quantity: item.quantity,
        price: item.product.price,
        selectedSize: item.selectedSize
      }));

      // Create order request
      const orderRequest: CreateOrderRequest = {
        products: orderItems,
        customerInfo: {
          name: customerInfo.name.trim(),
          email: customerInfo.email.trim(),
          phone: customerInfo.phone?.trim(),
          address: customerInfo.address.trim()
        },
        shippingCountry: shippingCountry || 'VN' // Use selected country from cart or default to VN
      };

      // Submit order
      const order = await orderService.createOrder(orderRequest);
      
      // Clear cart items
      clearCart();

      // Show success message and redirect
      alert(`Order placed successfully! Order ID: ${order._id}`);
      navigate('/');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
      console.error('Error placing order:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-container">
        <div className="empty-checkout">
          <h1>No items to checkout</h1>
          <p>Your checkout is empty. Please add items to cart or use buy now.</p>
          <Link to="/products" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>Checkout</h1>
        <p>Complete your order from cart</p>
      </div>

      <div className="checkout-content">
        {/* Order Summary */}
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="order-items">
            {cartItems.map((item, index) => (
              <div key={`${item.product._id}-${item.selectedSize}-${index}`} className="order-item">
                <img src={item.product.image} alt={getLocalized(item.product.name)} className="item-image" />
                <div className="item-details">
                  <h3>{getLocalized(item.product.name)}</h3>
                  <p>Size: {item.selectedSize}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p className="item-price">{(item.product.price * item.quantity).toLocaleString()}₫</p>
                </div>
              </div>
            ))}
          </div>
          <div className="order-total">
            <h3>Total: {getTotalPrice().toLocaleString()}₫</h3>
          </div>
        </div>

        {/* Customer Information Form */}
        <div className="customer-form">
          <h2>Customer Information</h2>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={customerInfo.name}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={customerInfo.email}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={customerInfo.phone}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address *</label>
              <textarea
                id="address"
                name="address"
                value={customerInfo.address}
                onChange={handleInputChange}
                required
                rows={3}
                disabled={isSubmitting}
              />
            </div>

            <div className="form-actions">
              <Link to="/cart" className="back-button">
                ← Back to Cart
              </Link>
              <button type="submit" className="place-order-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
