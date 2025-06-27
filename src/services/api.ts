import { apiRequest, API_CONFIG } from '../config/api';
import type { Product, CreateOrderRequest, Order } from '../types';

// Product API services
export const productService = {
  // Get all products
  getAllProducts: async () => {
    return apiRequest(API_CONFIG.ENDPOINTS.PRODUCTS);
  },

  // Get single product by ID
  getProductById: async (id: string): Promise<Product> => {
    return apiRequest(`${API_CONFIG.ENDPOINTS.PRODUCTS}/${id}`);
  },

  // Create new product (admin functionality)
  createProduct: async (productData: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>) => {
    return apiRequest(API_CONFIG.ENDPOINTS.PRODUCTS, {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  // Update product (admin functionality)
  updateProduct: async (id: string, productData: Partial<Product>) => {
    return apiRequest(`${API_CONFIG.ENDPOINTS.PRODUCTS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  // Delete product (admin functionality)
  deleteProduct: async (id: string) => {
    return apiRequest(`${API_CONFIG.ENDPOINTS.PRODUCTS}/${id}`, {
      method: 'DELETE',
    });
  },
};

// Order API services (for future use)
export const orderService = {
  // Get all orders
  getAllOrders: async () => {
    return apiRequest(API_CONFIG.ENDPOINTS.ORDERS);
  },
  // Create new order
  createOrder: async (orderData: CreateOrderRequest): Promise<Order> => {
    return apiRequest(API_CONFIG.ENDPOINTS.ORDERS, {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  // Get order by ID
  getOrderById: async (id: string) => {
    return apiRequest(`${API_CONFIG.ENDPOINTS.ORDERS}/${id}`);
  },
};

// Health check service
export const healthService = {
  checkHealth: async () => {
    return apiRequest(API_CONFIG.ENDPOINTS.HEALTH);
  },
};
