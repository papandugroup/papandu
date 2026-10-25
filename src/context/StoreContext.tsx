'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ProductItem, isProductOneOfOne, getInventoryKey } from '@/data/fallbackProducts';

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
  colorway?: string;
  inventoryKey?: string;
}

export interface OrderSuccessData {
  reference: string;
  customerEmail: string;
  totalFormatted: string;
  items: CartItem[];
}

export interface InventoryStatusRecord {
  isSoldOut: boolean;
  isReserved: boolean;
}

interface StoreContextType {
  cart: CartItem[];
  addToCart: (product: ProductItem, size?: string, quantity?: number, colorway?: string) => void;
  removeFromCart: (productId: string, size: string, colorway?: string) => void;
  updateQuantity: (productId: string, size: string, delta: number, colorway?: string) => void;
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
  inventoryStatus: Record<string, InventoryStatusRecord>;
  isItemSoldOut: (productSlug: string, colorway?: string | null) => boolean;
  refreshInventory: () => Promise<void>;
  cartToast: string | null;
  clearCartToast: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currency, setCurrencyState] = useState<CurrencyType>('NGN');
  const [orderSuccess, setOrderSuccess] = useState<OrderSuccessData | null>(null);
  const [inventoryStatus, setInventoryStatus] = useState<Record<string, InventoryStatusRecord>>({});
  const [cartToast, setCartToast] = useState<string | null>(null);

  // Free shipping in Lagos on orders over ₦50,000
  const freeShippingThresholdNGN = 50000;

  const refreshInventory = useCallback(async () => {
    try {
      const res = await fetch('/api/inventory', { cache: 'no-store' });
      const data = await res.json();
      if (data?.success && data.inventory) {
        setInventoryStatus(data.inventory);
      }
    } catch (e) {
      console.warn('[StoreContext] Could not fetch real-time inventory');
    }
  }, []);

  // Fetch real-time inventory status on mount
  useEffect(() => {
    refreshInventory();
  }, [refreshInventory]);

  // Check if an item is sold out by slug & colorway
  const isItemSoldOut = useCallback(
    (productSlug: string, colorway?: string | null): boolean => {
      const key = getInventoryKey(productSlug, colorway);
      return Boolean(inventoryStatus[key]?.isSoldOut);
    },
    [inventoryStatus]
  );

  // Hydrate cart and currency from localStorage or auto-detect on first visit
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('papandu_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedCurrency = localStorage.getItem('papandu_currency') as CurrencyType;
      if (savedCurrency && RATES[savedCurrency]) {
        setCurrencyState(savedCurrency);
      } else {
        // Auto-detect visitor currency based on location on first visit
        fetch('/api/geolocation')
          .then((res) => res.json())
          .then((data) => {
            if (data?.currency && RATES[data.currency as CurrencyType]) {
              setCurrencyState(data.currency as CurrencyType);
            }
          })
          .catch(() => {
            // Keep default 'NGN' gracefully
          });
      }
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

  const clearCartToast = () => setCartToast(null);

  const addToCart = (product: ProductItem, size?: string, quantity: number = 1, colorway?: string) => {
    const selectedSize = size || product.sizes[0] || 'M';
    const selectedColorway = colorway || product.colorway;
    const isOneOfOne = isProductOneOfOne(product, selectedColorway);
    const inventoryKey = getInventoryKey(product.slug, selectedColorway);
    const maxPerOrder = product.maxPerOrder || (isOneOfOne ? 1 : 5);

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.colorway === selectedColorway &&
          item.size === selectedSize
      );

      if (existingIndex > -1) {
        if (isOneOfOne) {
          // 1-of-1 pieces cannot be ordered in duplicate
          setCartToast(`This 1-of-1 archive piece is already in your bag.`);
          return prev;
        }
        const updated = [...prev];
        const newQuantity = updated[existingIndex].quantity + quantity;
        if (newQuantity > maxPerOrder) {
          setCartToast(`Maximum ${maxPerOrder} items per order.`);
          return prev;
        }
        updated[existingIndex].quantity = newQuantity;
        return updated;
      } else {
        // Enforce max 1 for 1-of-1 items
        const finalQuantity = isOneOfOne ? 1 : Math.min(quantity, maxPerOrder);
        return [...prev, { product, size: selectedSize, quantity: finalQuantity, colorway: selectedColorway, inventoryKey }];
      }
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, size: string, colorway?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.size === size &&
            (!colorway || item.product.colorway === colorway)
          )
      )
    );
  };

  const updateQuantity = (productId: string, size: string, delta: number, colorway?: string) => {
    setCart((prev) =>
      prev
        .map((item) => {
          const isTarget =
            item.product.id === productId &&
            item.size === size &&
            (!colorway || item.colorway === colorway);

          if (isTarget) {
            const isOneOfOne = isProductOneOfOne(item.product, item.colorway);
            const maxPerOrder = item.product.maxPerOrder || (isOneOfOne ? 1 : 5);

            // 1-of-1 pieces can only be removed, never incremented past 1
            if (isOneOfOne) {
              if (delta < 0) return null; // Remove
              return item; // Keep at 1
            }

            const newQty = item.quantity + delta;
            if (newQty > maxPerOrder) {
              // Cap at maxPerOrder
              return { ...item, quantity: maxPerOrder };
            }
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
        inventoryStatus,
        isItemSoldOut,
        refreshInventory,
        cartToast,
        clearCartToast,
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
