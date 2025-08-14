import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userOrderService } from '../services/userOrders';
import type { Order, OrdersResponse } from '../services/userOrders';
import { useTranslation } from '../hooks/useTranslation';

const MyOrders: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, currentPage, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get Firebase ID token
      const token = await user?.getIdToken();
      if (!token) {
        throw new Error('User not authenticated');
      }
      
      // Store token for the service to use
      localStorage.setItem('firebaseToken', token);
      
      const response: OrdersResponse = await userOrderService.getMyOrders(
        currentPage, 
        10, 
        statusFilter || undefined
      );
      
      setOrders(response.orders);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">
            {t('loginRequired', 'Please log in to view your orders')}
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
          <p className="mt-4 text-lg">{t('loadingOrders', 'Loading your orders...')}</p>
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
          <button 
            onClick={fetchOrders}
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors"
          >
            {t('tryAgain', 'Try Again')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('myOrders', 'My Orders')}
          </h1>
          <p className="text-gray-600">
            {t('orderHistory', 'View and track your order history')}
          </p>
        </div>

        {/* Status Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleStatusChange('')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === '' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 border hover:bg-gray-50'
              }`}
            >
              {t('allOrders', 'All Orders')}
            </button>
            <button
              onClick={() => handleStatusChange('Pending')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === 'Pending' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-white text-gray-700 border hover:bg-gray-50'
              }`}
            >
              {t('pending', 'Pending')}
            </button>
            <button
              onClick={() => handleStatusChange('Shipped')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === 'Shipped' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 border hover:bg-gray-50'
              }`}
            >
              {t('shipped', 'Shipped')}
            </button>
            <button
              onClick={() => handleStatusChange('Completed')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === 'Completed' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-white text-gray-700 border hover:bg-gray-50'
              }`}
            >
              {t('completed', 'Completed')}
            </button>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              {statusFilter 
                ? t('noOrdersWithStatus', `No ${statusFilter.toLowerCase()} orders found`)
                : t('noOrders', 'No orders found')
              }
            </h2>
            <p className="text-gray-500 mb-6">
              {t('startShopping', 'Start shopping to see your orders here')}
            </p>
            <Link 
              to="/products"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              {t('startShopping', 'Start Shopping')}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
                {/* Order Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {t('orderNumber', 'Order')} #{order._id.slice(-8)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {userOrderService.formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${userOrderService.getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {order.products.slice(0, 2).map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      {item.productId?.image && (
                        <img 
                          src={item.productId.image} 
                          alt={item.productName}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {item.productId?.name?.en || item.productId?.name?.vi || item.productName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {t('size', 'Size')}: {item.selectedSize} | 
                          {t('quantity', 'Quantity')}: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {userOrderService.formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {order.products.length > 2 && (
                    <p className="text-sm text-gray-500">
                      {t('andMoreItems', `+${order.products.length - 2} more items`)}
                    </p>
                  )}
                </div>

                {/* Order Summary */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">{t('subtotal', 'Subtotal')}:</span>
                    <span>{userOrderService.formatPrice(order.total)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">{t('shipping', 'Shipping')}:</span>
                    <span>{userOrderService.formatPrice(order.shippingFee)}</span>
                  </div>
                  <div className="flex justify-between items-center font-semibold text-lg border-t pt-2">
                    <span>{t('total', 'Total')}:</span>
                    <span>{userOrderService.formatPrice(order.total + order.shippingFee)}</span>
                  </div>
                </div>

                {/* Order Actions */}
                <div className="mt-4 flex justify-end">
                  <Link 
                    to={`/orders/${order._id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    {t('viewDetails', 'View Details')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 rounded transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
