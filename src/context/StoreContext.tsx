'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProductItem } from '@/data/fallbackProducts';

export type CurrencyType = 'NGN' | 'USD' | 'GBP';

// Exchange rates relative to NGN
const RATES: Record<CurrencyType, { symbol: string; rate: number }> = {
  NGN: { symbol: '₦', rate: 1 },
  USD: { symbol: '$', rate: 1 / 1600 },
  GBP: { symbol: '£', rate: 1 / 2100 },
};

export interface CartItem {
  product: ProductItem;
  size: string;
  quantity: number;
}

export interface OrderSuccessData {
  reference: string;
  customerEmail: string;
  totalFormatted: string;
  items: CartItem[];
}

interface StoreContextType {
  cart: CartItem[];
  addToCart: (product: ProductItem, size?: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  currency: CurrencyType;
  setCurrency: (c: CurrencyType) => void;
  formatPrice: (priceInNGN: number) => string;
  cartTotalNGN: number;
  freeShippingThresholdNGN: number;
  orderSuccess: OrderSuccessData | null;
  setOrderSuccess: (data: OrderSuccessData | null) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currency, setCurrencyState] = useState<CurrencyType>('NGN');
  const [orderSuccess, setOrderSuccess] = useState<OrderSuccessData | null>(null);

  // Free shipping in Lagos on orders over ₦50,000
  const freeShippingThresholdNGN = 50000;

  // Hydrate cart and currency from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('papandu_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedCurrency = localStorage.getItem('papandu_currency') as CurrencyType;
      if (savedCurrency && RATES[savedCurrency]) setCurrencyState(savedCurrency);
    } catch (e) {
      console.warn('Could not read from localStorage');
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('papandu_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  const setCurrency = (c: CurrencyType) => {
    setCurrencyState(c);
    try {
      localStorage.setItem('papandu_currency', c);
    } catch (e) {}
  };

  const addToCart = (product: ProductItem, size?: string, quantity: number = 1) => {
    const selectedSize = size || product.sizes[0] || 'M';

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.size === selectedSize
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, size: selectedSize, quantity }];
      }
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart((prev) => prev.filter((item) => !(item.product.id === productId && item.size === size)));
  };

  const updateQuantity = (productId: string, size: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId && item.size === size) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const formatPrice = (priceInNGN: number): string => {
    const { symbol, rate } = RATES[currency];
    const converted = priceInNGN * rate;

    if (currency === 'NGN') {
      return `${symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${symbol}${converted.toFixed(2)}`;
  };

  const cartTotalNGN = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        currency,
        setCurrency,
        formatPrice,
        cartTotalNGN,
        freeShippingThresholdNGN,
        orderSuccess,
        setOrderSuccess,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
