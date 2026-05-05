"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Asset } from "@/types/asset";

export interface Collection {
  _id: string;
  name: string;
  description?: string;
  coverImage?: string;
  assets: string[]; // Asset IDs
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CollectionsContextType {
  collections: Collection[];
  createCollection: (name: string, description?: string, isPublic?: boolean) => string;
  updateCollection: (id: string, updates: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;
  addAssetToCollection: (collectionId: string, assetId: string) => void;
  removeAssetFromCollection: (collectionId: string, assetId: string) => void;
  getCollection: (id: string) => Collection | undefined;
  isLoading: boolean;
}

const CollectionsContext = createContext<CollectionsContextType | undefined>(undefined);

export const CollectionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("bantushot_collections");
      if (stored) {
        setCollections(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading collections:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem("bantushot_collections", JSON.stringify(collections));
      } catch (error) {
        console.error("Error saving collections:", error);
      }
    }
  }, [collections, isLoading]);

  const createCollection = useCallback((name: string, description?: string, isPublic: boolean = false): string => {
    const newCollection: Collection = {
      _id: `col_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      assets: [],
      isPublic,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCollections((prev) => [...prev, newCollection]);
    return newCollection._id;
  }, []);

  const updateCollection = useCallback((id: string, updates: Partial<Collection>) => {
    setCollections((prev) =>
      prev.map((col) =>
        col._id === id
          ? { ...col, ...updates, updatedAt: new Date().toISOString() }
          : col
      )
    );
  }, []);

  const deleteCollection = useCallback((id: string) => {
    setCollections((prev) => prev.filter((col) => col._id !== id));
  }, []);

  const addAssetToCollection = useCallback((collectionId: string, assetId: string) => {
    setCollections((prev) =>
      prev.map((col) => {
        if (col._id === collectionId && !col.assets.includes(assetId)) {
          return {
            ...col,
            assets: [...col.assets, assetId],
            updatedAt: new Date().toISOString(),
          };
        }
        return col;
      })
    );
  }, []);

  const removeAssetFromCollection = useCallback((collectionId: string, assetId: string) => {
    setCollections((prev) =>
      prev.map((col) => {
        if (col._id === collectionId) {
          return {
            ...col,
            assets: col.assets.filter((id) => id !== assetId),
            updatedAt: new Date().toISOString(),
          };
        }
        return col;
      })
    );
  }, []);

  const getCollection = useCallback((id: string) => {
    return collections.find((col) => col._id === id);
  }, [collections]);

  return (
    <CollectionsContext.Provider
      value={{
        collections,
        createCollection,
        updateCollection,
        deleteCollection,
        addAssetToCollection,
        removeAssetFromCollection,
        getCollection,
        isLoading,
      }}
    >
      {children}
    </CollectionsContext.Provider>
  );
};

export const useCollections = () => {
  const context = useContext(CollectionsContext);
  if (context === undefined) {
    throw new Error("useCollections must be used within a CollectionsProvider");
  }
  return context;
};
