"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Asset, LicenseType } from "@/types/asset";

export interface DownloadRecord {
  _id: string;
  assetId: string;
  asset: Asset;
  licenseType: LicenseType;
  downloadedAt: string;
}

interface DownloadsContextType {
  downloads: DownloadRecord[];
  addDownload: (asset: Asset, licenseType: LicenseType) => void;
  removeDownload: (id: string) => void;
  clearDownloads: () => void;
  getDownload: (assetId: string) => DownloadRecord | undefined;
  isLoading: boolean;
}

const DownloadsContext = createContext<DownloadsContextType | undefined>(undefined);

export const DownloadsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [downloads, setDownloads] = useState<DownloadRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("bantushot_downloads");
      if (stored) {
        const parsed = JSON.parse(stored);
        setDownloads(parsed);
      }
    } catch (error) {
      console.error("Error loading downloads:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem("bantushot_downloads", JSON.stringify(downloads));
      } catch (error) {
        console.error("Error saving downloads:", error);
      }
    }
  }, [downloads, isLoading]);

  const addDownload = useCallback((asset: Asset, licenseType: LicenseType) => {
    const newDownload: DownloadRecord = {
      _id: `dl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      assetId: asset._id,
      asset,
      licenseType,
      downloadedAt: new Date().toISOString(),
    };
    setDownloads((prev) => {
      // Remove existing download for same asset if exists
      const filtered = prev.filter((d) => d.assetId !== asset._id);
      return [newDownload, ...filtered];
    });
  }, []);

  const removeDownload = useCallback((id: string) => {
    setDownloads((prev) => prev.filter((d) => d._id !== id));
  }, []);

  const clearDownloads = useCallback(() => {
    setDownloads([]);
  }, []);

  const getDownload = useCallback((assetId: string) => {
    return downloads.find((d) => d.assetId === assetId);
  }, [downloads]);

  return (
    <DownloadsContext.Provider
      value={{
        downloads,
        addDownload,
        removeDownload,
        clearDownloads,
        getDownload,
        isLoading,
      }}
    >
      {children}
    </DownloadsContext.Provider>
  );
};

export const useDownloads = () => {
  const context = useContext(DownloadsContext);
  if (context === undefined) {
    throw new Error("useDownloads must be used within a DownloadsProvider");
  }
  return context;
};
