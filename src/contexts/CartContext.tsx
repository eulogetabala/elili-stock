"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { LicenseType } from "@/types/asset";
import { MOCK_ASSETS } from "@/lib/mock-data";

export interface CartItem {
  assetId: string;
  licenseType: LicenseType;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (assetId: string, licenseType: LicenseType, quantity?: number) => void;
  removeFromCart: (assetId: string, licenseType: LicenseType) => void;
  updateQuantity: (assetId: string, licenseType: LicenseType, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  isInCart: (assetId: string, licenseType: LicenseType) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "bantushot_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error("Failed to save cart to localStorage:", error);
      }
    }
  }, [items, mounted]);

  const addToCart = useCallback((assetId: string, licenseType: LicenseType, quantity: number = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.assetId === assetId && item.licenseType === licenseType
      );

      if (existingIndex >= 0) {
        // Update quantity if already in cart
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }

      // Add new item
      return [...prev, { assetId, licenseType, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((assetId: string, licenseType: LicenseType) => {
    setItems((prev) =>
      prev.filter((item) => !(item.assetId === assetId && item.licenseType === licenseType))
    );
  }, []);

  const updateQuantity = useCallback((assetId: string, licenseType: LicenseType, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(assetId, licenseType);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.assetId === assetId && item.licenseType === licenseType
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getTotal = useCallback((): number => {
    return items.reduce((total, item) => {
      const asset = MOCK_ASSETS.find((a) => a._id === item.assetId);
      if (!asset) return total;

      const price =
        item.licenseType === LicenseType.COMMERCIAL
          ? asset.priceCommercial
          : asset.priceStandard;

      return total + price * item.quantity;
    }, 0);
  }, [items]);

  const getItemCount = useCallback((): number => {
    return items.reduce((count, item) => count + item.quantity, 0);
  }, [items]);

  const isInCart = useCallback(
    (assetId: string, licenseType: LicenseType): boolean => {
      return items.some(
        (item) => item.assetId === assetId && item.licenseType === licenseType
      );
    },
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
