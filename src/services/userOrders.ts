import { API_CONFIG } from '../config/api';

interface Order {
  _id: string;
  products: Array<{
    productId: {
      _id: string;
      name: any;
      image: string;
    };
    productName: string;
    quantity: number;
    price: number;
    selectedSize: string;
  }>;
  total: number;
  shippingFee: number;
  shippingCountry: string;
  totalWeight: number;
  customerInfo: {
    name: string;
    email: string;
    address: string;
    phone?: string;
  };
  status: 'Pending' | 'Shipped' | 'Completed';
  firebaseUid?: string;
  stripeSessionId?: string;
  paymentStatus?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrdersResponse {
  orders: Order[];
  totalPages: number;
  currentPage: number;
  total: number;
  userEmail: string;
}

interface UserOrderStats {
  totalOrders: number;
  pendingOrders: number;
  shippedOrders: number;
  completedOrders: number;
  totalSpent: number;
  recentOrders: Order[];
  userEmail: string;
}

class UserOrderService {
  // Get current user's orders
  async getMyOrders(page: number = 1, limit: number = 10, status?: string): Promise<OrdersResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (status) {
      params.append('status', status);
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}/orders/user/my-orders?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch orders');
    }

    return response.json();
  }

  // Get specific order by ID (only if user owns it)
  async getOrderById(orderId: string): Promise<Order> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/orders/user/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch order');
    }

    return response.json();
  }

  // Get user's order statistics
  async getOrderStats(): Promise<UserOrderStats> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/orders/user/stats/summary`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch order statistics');
    }

    return response.json();
  }

  // Helper method to get Firebase auth token
  private getAuthToken(): string {
    // This should be replaced with your actual Firebase auth token retrieval
    // For example, if you're using Firebase Auth context:
    // return firebase.auth().currentUser?.getIdToken();
    
    // Placeholder - you'll need to implement this based on your Firebase setup
    const token = localStorage.getItem('firebaseToken') || '';
    if (!token) {
      throw new Error('User not authenticated');
    }
    return token;
  }

  // Format price for display
  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  }

  // Format date for display
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Get status color for UI
  getStatusColor(status: string): string {
    switch (status) {
      case 'Pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'Shipped':
        return 'text-blue-600 bg-blue-100';
      case 'Completed':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }
}

export const userOrderService = new UserOrderService();
export type { Order, OrdersResponse, UserOrderStats };
