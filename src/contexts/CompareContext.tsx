"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface CompareContextType {
  compareItems: string[];
  addToCompare: (assetId: string) => void;
  removeFromCompare: (assetId: string) => void;
  clearCompare: () => void;
  isInCompare: (assetId: string) => boolean;
  canAddMore: () => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const COMPARE_STORAGE_KEY = "bantushot_compare";
const MAX_COMPARE_ITEMS = 3;

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareItems, setCompareItems] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(COMPARE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure we don't exceed max items
        setCompareItems(parsed.slice(0, MAX_COMPARE_ITEMS));
      }
    } catch (error) {
      console.error("Failed to load compare from localStorage:", error);
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(compareItems));
      } catch (error) {
        console.error("Failed to save compare to localStorage:", error);
      }
    }
  }, [compareItems, mounted]);

  const addToCompare = useCallback(
    (assetId: string) => {
      setCompareItems((prev) => {
        if (prev.includes(assetId)) {
          return prev; // Already in compare
        }
        if (prev.length >= MAX_COMPARE_ITEMS) {
          return prev; // Max items reached
        }
        return [...prev, assetId];
      });
    },
    []
  );

  const removeFromCompare = useCallback((assetId: string) => {
    setCompareItems((prev) => prev.filter((id) => id !== assetId));
  }, []);

  const clearCompare = useCallback(() => {
    setCompareItems([]);
  }, []);

  const isInCompare = useCallback(
    (assetId: string): boolean => {
      return compareItems.includes(assetId);
    },
    [compareItems]
  );

  const canAddMore = useCallback((): boolean => {
    return compareItems.length < MAX_COMPARE_ITEMS;
  }, [compareItems.length]);

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        canAddMore,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}
