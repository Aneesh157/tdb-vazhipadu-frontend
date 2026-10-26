import { useState, useEffect, useCallback } from 'react';
import { CartItem, Offering } from '../types';

const STORAGE_KEY = 'tdb_vazhipadu_cart_v1';

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      // LocalStorage error or corrupted JSON fallback
    }
    return [];
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // LocalStorage write error fallback
    }
  }, [items]);

  const addToCart = useCallback((offering: Offering) => {
    if (!offering.active) return; // Do not add inactive offerings
    setItems((prevItems) => {
      const existing = prevItems.find((i) => i.offering.id === offering.id);
      if (existing) {
        return prevItems.map((i) =>
          i.offering.id === offering.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prevItems, { offering, quantity: 1 }];
    });
  }, []);

  const updateQuantity = useCallback((offeringId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.offering.id !== offeringId));
    } else {
      setItems((prev) =>
        prev.map((i) =>
          i.offering.id === offeringId ? { ...i, quantity } : i
        )
      );
    }
  }, []);

  const removeFromCart = useCallback((offeringId: string) => {
    setItems((prev) => prev.filter((i) => i.offering.id !== offeringId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalAmount = items.reduce(
    (sum, item) => sum + item.offering.price * item.quantity,
    0
  );

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const cartQuantities = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.offering.id] = item.quantity;
    return acc;
  }, {});

  return {
    items,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalAmount,
    totalCount,
    cartQuantities,
  };
}
