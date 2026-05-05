"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Check, ShoppingCart, Crown, Loader2 } from "lucide-react";
import { Asset, LicenseType } from "@/types/asset";
import { downloadAsset } from "@/lib/api";
import AnimatedButton from "@/components/ui/AnimatedButton";

interface DownloadButtonProps {
  asset: Asset;
  onPurchaseClick?: (asset: Asset) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  showPrice?: boolean;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  asset,
  onPurchaseClick,
  size = "md",
  className = "",
  showPrice = true,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const handleFreeDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await downloadAsset(asset._id);
      // Simulate opening the download
      window.open(response.downloadUrl, "_blank");
      setIsDownloaded(true);
      setTimeout(() => setIsDownloaded(false), 3000);
    } catch (error) {
      console.error("Download error:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePremiumClick = () => {
    if (onPurchaseClick) {
      onPurchaseClick(asset);
    }
  };

  if (asset.isFree) {
    return (
      <AnimatedButton
        variant="primary"
        size={size}
        glow
        className={`flex items-center justify-center gap-2 ${className}`}
        onClick={handleFreeDownload}
      >
        <AnimatePresence mode="wait">
          {isDownloading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <Loader2 size={16} />
              </motion.div>
            </motion.div>
          ) : isDownloaded ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Check size={16} />
            </motion.div>
          ) : (
            <motion.div
              key="download"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Download size={16} />
            </motion.div>
          )}
        </AnimatePresence>
        {isDownloading ? "Téléchargement..." : isDownloaded ? "Téléchargé !" : "Télécharger gratuitement"}
      </AnimatedButton>
    );
  }

  return (
    <AnimatedButton
      variant="primary"
      size={size}
      glow
      className={`flex items-center justify-center gap-2 ${className}`}
      onClick={handlePremiumClick}
    >
      <ShoppingCart size={16} />
      {showPrice ? `Acheter — $${asset.priceStandard}` : "Acheter"}
      <Crown size={12} className="text-amber-300" />
    </AnimatedButton>
  );
};

export default DownloadButton;
