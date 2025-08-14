import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userOrderService } from '../services/userOrders';
import type { Order } from '../services/userOrders';
import { useTranslation } from '../hooks/useTranslation';

const OrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && orderId) {
      fetchOrderDetail();
    } else if (!user) {
      navigate('/login');
    }
  }, [user, orderId, navigate]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!orderId) {
        throw new Error('Order ID not provided');
      }

      // Get Firebase ID token
      const token = await user?.getIdToken();
      if (!token) {
        throw new Error('User not authenticated');
      }

      // Store token for the service to use
      localStorage.setItem('firebaseToken', token);

      const orderData = await userOrderService.getOrderById(orderId);
      setOrder(orderData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch order details');
      console.error('Error fetching order details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">
            {t('loginRequired', 'Please log in to view order details')}
          </h1>
          <Link 
            to="/login" 
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            {t('login', 'Login')}
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">{t('loadingOrderDetails', 'Loading order details...')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-red-50 p-8 rounded-lg">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-red-700 mb-4">
            {t('error', 'Error')}
          </h1>
          <p className="text-red-600 mb-6">{error}</p>
          <div className="space-x-4">
            <button 
              onClick={fetchOrderDetail}
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors"
            >
              {t('tryAgain', 'Try Again')}
            </button>
            <Link 
              to="/orders"
              className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              {t('backToOrders', 'Back to Orders')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-700">
            {t('orderNotFound', 'Order not found')}
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/orders"
            className="text-blue-600 hover:text-blue-700 mb-4 inline-flex items-center"
          >
            ← {t('backToOrders', 'Back to Orders')}
          </Link>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t('orderDetails', 'Order Details')}
              </h1>
              <p className="text-gray-600">
                {t('orderNumber', 'Order')} #{order._id}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${userOrderService.getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                {t('orderedItems', 'Ordered Items')}
              </h2>
              <div className="space-y-4">
                {order.products.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 border-b pb-4 last:border-b-0">
                    {item.productId?.image && (
                      <img 
                        src={item.productId.image} 
                        alt={item.productName}
                        className="w-20 h-20 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {item.productId?.name?.en || item.productId?.name?.vi || item.productName}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {t('size', 'Size')}: {item.selectedSize}
                      </p>
                      <p className="text-sm text-gray-600">
                        {t('quantity', 'Quantity')}: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-600">
                        {t('pricePerItem', 'Price per item')}: {userOrderService.formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">
                        {userOrderService.formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                {t('orderTimeline', 'Order Timeline')}
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">{t('orderPlaced', 'Order Placed')}</p>
                    <p className="text-sm text-gray-600">
                      {userOrderService.formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>
                
                {order.status === 'Shipped' || order.status === 'Completed' ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">{t('orderShipped', 'Order Shipped')}</p>
                      <p className="text-sm text-gray-600">
                        {t('trackingAvailable', 'Tracking information will be provided')}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <div>
                      <p className="text-gray-500">{t('orderShipped', 'Order Shipped')}</p>
                      <p className="text-sm text-gray-400">
                        {t('waitingForShipment', 'Waiting for shipment')}
                      </p>
                    </div>
                  </div>
                )}
                
                {order.status === 'Completed' ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">{t('orderDelivered', 'Order Delivered')}</p>
                      <p className="text-sm text-gray-600">
                        {t('orderCompleted', 'Order completed successfully')}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <div>
                      <p className="text-gray-500">{t('orderDelivered', 'Order Delivered')}</p>
                      <p className="text-sm text-gray-400">
                        {t('waitingForDelivery', 'Waiting for delivery')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary & Customer Info */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                {t('orderSummary', 'Order Summary')}
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('subtotal', 'Subtotal')}:</span>
                  <span>{userOrderService.formatPrice(order.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('shipping', 'Shipping')} ({order.shippingCountry}):</span>
                  <span>{userOrderService.formatPrice(order.shippingFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('weight', 'Total Weight')}:</span>
                  <span>{(order.totalWeight / 1000).toFixed(2)} kg</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t pt-3">
                  <span>{t('total', 'Total')}:</span>
                  <span>{userOrderService.formatPrice(order.total + order.shippingFee)}</span>
                </div>
                {order.paymentStatus && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('paymentStatus', 'Payment Status')}:</span>
                    <span className={`font-medium ${
                      order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {order.paymentStatus === 'paid' ? t('paid', 'Paid') : t('pending', 'Pending')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                {t('customerInformation', 'Customer Information')}
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">{t('name', 'Name')}</p>
                  <p className="font-medium">{order.customerInfo.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('email', 'Email')}</p>
                  <p className="font-medium">{order.customerInfo.email}</p>
                </div>
                {order.customerInfo.phone && (
                  <div>
                    <p className="text-sm text-gray-600">{t('phone', 'Phone')}</p>
                    <p className="font-medium">{order.customerInfo.phone}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">{t('shippingAddress', 'Shipping Address')}</p>
                  <p className="font-medium">{order.customerInfo.address}</p>
                </div>
              </div>
            </div>

            {/* Order Date */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                {t('orderDate', 'Order Date')}
              </h2>
              <p className="text-gray-600">
                {userOrderService.formatDate(order.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
