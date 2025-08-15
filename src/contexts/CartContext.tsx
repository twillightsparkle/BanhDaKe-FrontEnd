import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Product } from '../types';

export interface CartItem {
  product: Product; // Add price for cart compatibility
  quantity: number;
  price: number;
  selectedColor: string; // In English
  selectedSize: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number, price: number, selectedColor: string, selectedSize: string) => void;
  removeFromCart: (productId: string, selectedSize: string, selectedColor: string) => void;
  updateQuantity: (productId: string, selectedSize: string, selectedColor: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getTotalWeight: () => number;
  shippingCountry: string | null;
  setShippingCountry: (country: string | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shippingCountry, setShippingCountry] = useState<string | null>(null);
  const addToCart = (product: Product, quantity: number, price: number, selectedColor: string, selectedSize: string) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        item => item.product._id === product._id && item.selectedSize === selectedSize && item.selectedColor === selectedColor
      );

      if (existingItemIndex > -1) {
        // Update quantity if item already exists - create new array and new object
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        return updatedItems;
      } else {
        // Add new item
        const newItem: CartItem = { 
          product, 
          quantity, 
          price,
          selectedColor,
          selectedSize 
        };
        return [...prevItems, newItem];
      }
    });
  };

  const removeFromCart = (productId: string, selectedSize: string, selectedColor: string) => {
    setCartItems(prevItems => 
      prevItems.filter(item => 
        !(item.product._id === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor)
      )
    );
  };

  const updateQuantity = (productId: string, selectedSize: string, selectedColor: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize, selectedColor);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.product._id === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalWeight = () => {
    // Calculate total weight using actual product weights (in grams)
    return cartItems.reduce((total, item) => total + (item.product.weight * item.quantity), 0);
  };

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getTotalWeight,
    shippingCountry,
    setShippingCountry,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
