// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  ENDPOINTS: {
    PRODUCTS: '/products',
    ORDERS: '/orders',
    HEALTH: '/health',
    SHIPPING: '/shipping'
  }
};

// Helper function to build full API URLs
export const getApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// API utility functions
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = getApiUrl(endpoint);
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, defaultOptions);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};
