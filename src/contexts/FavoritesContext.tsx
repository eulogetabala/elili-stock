"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface Collection {
  id: string;
  name: string;
  assetIds: string[];
  createdAt: string;
}

interface FavoritesContextType {
  favorites: string[];
  collections: Collection[];
  addFavorite: (assetId: string) => void;
  removeFavorite: (assetId: string) => void;
  toggleFavorite: (assetId: string) => void;
  isFavorite: (assetId: string) => boolean;
  createCollection: (name: string, assetIds?: string[]) => string;
  updateCollection: (collectionId: string, name?: string, assetIds?: string[]) => void;
  deleteCollection: (collectionId: string) => void;
  addToCollection: (collectionId: string, assetId: string) => void;
  removeFromCollection: (collectionId: string, assetId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_STORAGE_KEY = "bantushot_favorites";
const COLLECTIONS_STORAGE_KEY = "bantushot_collections";

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true);
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }

      const storedCollections = localStorage.getItem(COLLECTIONS_STORAGE_KEY);
      if (storedCollections) {
        setCollections(JSON.parse(storedCollections));
      }
    } catch (error) {
      console.error("Failed to load favorites from localStorage:", error);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.error("Failed to save favorites to localStorage:", error);
      }
    }
  }, [favorites, mounted]);

  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(COLLECTIONS_STORAGE_KEY, JSON.stringify(collections));
      } catch (error) {
        console.error("Failed to save collections to localStorage:", error);
      }
    }
  }, [collections, mounted]);

  const addFavorite = useCallback((assetId: string) => {
    setFavorites((prev) => (prev.includes(assetId) ? prev : [...prev, assetId]));
  }, []);

  const removeFavorite = useCallback((assetId: string) => {
    setFavorites((prev) => prev.filter((id) => id !== assetId));
  }, []);

  const toggleFavorite = useCallback((assetId: string) => {
    setFavorites((prev) =>
      prev.includes(assetId)
        ? prev.filter((id) => id !== assetId)
        : [...prev, assetId]
    );
  }, []);

  const isFavorite = useCallback(
    (assetId: string): boolean => {
      return favorites.includes(assetId);
    },
    [favorites]
  );

  const createCollection = useCallback((name: string, assetIds: string[] = []): string => {
    const id = `collection_${Date.now()}`;
    const newCollection: Collection = {
      id,
      name,
      assetIds,
      createdAt: new Date().toISOString(),
    };
    setCollections((prev) => [...prev, newCollection]);
    return id;
  }, []);

  const updateCollection = useCallback(
    (collectionId: string, name?: string, assetIds?: string[]) => {
      setCollections((prev) =>
        prev.map((col) =>
          col.id === collectionId
            ? {
                ...col,
                ...(name !== undefined && { name }),
                ...(assetIds !== undefined && { assetIds }),
              }
            : col
        )
      );
    },
    []
  );

  const deleteCollection = useCallback((collectionId: string) => {
    setCollections((prev) => prev.filter((col) => col.id !== collectionId));
  }, []);

  const addToCollection = useCallback((collectionId: string, assetId: string) => {
    setCollections((prev) =>
      prev.map((col) =>
        col.id === collectionId && !col.assetIds.includes(assetId)
          ? { ...col, assetIds: [...col.assetIds, assetId] }
          : col
      )
    );
  }, []);

  const removeFromCollection = useCallback((collectionId: string, assetId: string) => {
    setCollections((prev) =>
      prev.map((col) =>
        col.id === collectionId
          ? { ...col, assetIds: col.assetIds.filter((id) => id !== assetId) }
          : col
      )
    );
  }, []);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        collections,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
        createCollection,
        updateCollection,
        deleteCollection,
        addToCollection,
        removeFromCollection,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
