export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  selectedSize: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone?: string;
  address: string;
}

export interface Order {
  _id?: string;
  products: OrderItem[];
  total: number;
  shippingFee: number;
  shippingCountry: string;
  customerInfo: CustomerInfo;
  status?: 'Pending' | 'Shipped' | 'Completed';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrderRequest {
  products: OrderItem[];
  customerInfo: CustomerInfo;
  shippingCountry: string;
}
