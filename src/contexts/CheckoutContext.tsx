import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Product } from '../types';
import type { OrderItem } from '../types/order';

export interface CheckoutItem {
  product: Product;
  quantity: number;
  selectedSize: string;
}

interface CheckoutContextType {
  checkoutItems: CheckoutItem[];
  setCheckoutItems: (items: CheckoutItem[]) => void;
  addSingleItemToCheckout: (product: Product, quantity: number, selectedSize: string) => void;
  clearCheckout: () => void;
  getTotalPrice: () => number;
  getOrderItems: () => OrderItem[];
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
};

interface CheckoutProviderProps {
  children: ReactNode;
}

export const CheckoutProvider: React.FC<CheckoutProviderProps> = ({ children }) => {
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);

  const addSingleItemToCheckout = (product: Product, quantity: number, selectedSize: string) => {
    setCheckoutItems([{ product, quantity, selectedSize }]);
  };

  const clearCheckout = () => {
    setCheckoutItems([]);
  };

  const getTotalPrice = () => {
    return checkoutItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const getOrderItems = (): OrderItem[] => {
    return checkoutItems.map(item => ({
      productId: item.product._id,
      productName: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
      selectedSize: item.selectedSize
    }));
  };

  const value = {
    checkoutItems,
    setCheckoutItems,
    addSingleItemToCheckout,
    clearCheckout,
    getTotalPrice,
    getOrderItems
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
};
