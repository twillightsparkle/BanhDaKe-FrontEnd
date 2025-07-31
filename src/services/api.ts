import { apiRequest, API_CONFIG } from '../config/api';
import type { Product, Order, CreateOrderRequest, ShippingFee } from '../types';

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

// Order API services
export const orderService = {
  // Create new order
  createOrder: async (orderData: CreateOrderRequest): Promise<Order> => {
    return apiRequest(API_CONFIG.ENDPOINTS.ORDERS, {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },
};

// Health check service
export const healthService = {
  checkHealth: async () => {
    return apiRequest(API_CONFIG.ENDPOINTS.HEALTH);
  },
};

// Shipping API services
export const shippingService = {
  // Get all shipping fees (for users)
  getAllShippingFees: async (): Promise<ShippingFee[]> => {
    return apiRequest(`${API_CONFIG.ENDPOINTS.SHIPPING}/fees`);
  },

  // Get list of available shipping countries
  getCountries: async (): Promise<string[]> => {
    return apiRequest(`${API_CONFIG.ENDPOINTS.SHIPPING}/countries`);
  },

  // Get shipping rates for a specific country
  getRatesForCountry: async (country: string): Promise<ShippingFee> => {
    return apiRequest(`${API_CONFIG.ENDPOINTS.SHIPPING}/rates/${country}`);
  },
};
