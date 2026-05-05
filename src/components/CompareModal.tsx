"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ShoppingCart,
  Crown,
  Download,
  Check,
  X as XIcon,
  Image as ImageIcon,
  Video,
  MousePointer2,
  Maximize,
  HardDrive,
  Clock,
  MapPin,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { Asset, LicenseType, AssetType } from "@/types/asset";
import { MOCK_ASSETS } from "@/lib/mock-data";
import { formatFileSize, formatNumber } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import { useCompare } from "@/contexts/CompareContext";
import AnimatedButton from "@/components/ui/AnimatedButton";
import DownloadButton from "@/components/DownloadButton";

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CompareModal: React.FC<CompareModalProps> = ({ isOpen, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const { compareItems, removeFromCompare } = useCompare();
  const { addToCart } = useCart();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Get full asset data
  const assets = MOCK_ASSETS.filter((asset) => compareItems.includes(asset._id));

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Block body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const getTypeIcon = (type: AssetType) => {
    switch (type) {
      case AssetType.VIDEO:
        return <Video size={14} className="text-purple-400" />;
      case AssetType.VECTOR:
        return <MousePointer2 size={14} className="text-blue-400" />;
      default:
        return <ImageIcon size={14} className="text-emerald-400" />;
    }
  };

  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && assets.length > 0 && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9998]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-4 md:inset-8 lg:inset-12 z-[9999] flex flex-col bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Maximize size={18} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white text-sm">
                    Comparer les assets
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {assets.length} {assets.length === 1 ? "asset" : "assets"}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 transition-all"
              >
                <X size={18} />
              </motion.button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className={`grid gap-6 ${assets.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3"}`}>
                {assets.map((asset) => (
                  <motion.div
                    key={asset._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {/* Image */}
                    <Link href={`/asset/${asset._id}`}>
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800 cursor-pointer group">
                        <Image
                          src={asset.thumbnailUrl || asset.url}
                          alt={asset.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        {asset.isFree && (
                          <div className="absolute top-3 left-3 px-2 py-1 bg-emerald-500 text-white text-[8px] font-black rounded">
                            GRATUIT
                          </div>
                        )}
                        {!asset.isFree && (
                          <div className="absolute top-3 right-3 px-2 py-1 bg-amber-500 text-white text-[8px] font-black rounded flex items-center gap-1">
                            <Crown size={8} /> PREMIUM
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Title & Author */}
                    <div>
                      <Link href={`/asset/${asset._id}`}>
                        <h4 className="font-black text-slate-900 dark:text-white text-lg hover:text-primary transition-colors line-clamp-2">
                          {asset.title}
                        </h4>
                      </Link>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                        {asset.photographer.firstName} {asset.photographer.lastName}
                      </p>
                    </div>

                    {/* Type & Category */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300">
                        {getTypeIcon(asset.type)}
                        {asset.type}
                      </div>
                      <div className="px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300">
                        {asset.category}
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                          Standard
                        </span>
                        <span className="font-black text-slate-900 dark:text-white">
                          ${asset.priceStandard}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          Commercial <Crown size={10} className="text-amber-500" />
                        </span>
                        <span className="font-black text-slate-900 dark:text-white">
                          ${asset.priceCommercial}
                        </span>
                      </div>
                    </div>

                    {/* Technical Details */}
                    {asset.technicalMetadata && (
                      <div className="space-y-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                          Détails techniques
                        </div>
                        {asset.technicalMetadata.width && asset.technicalMetadata.height && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                              <Maximize size={12} />
                              Résolution
                            </span>
                            <span className="font-bold text-slate-700 dark:text-slate-300">
                              {asset.technicalMetadata.width} x {asset.technicalMetadata.height}
                            </span>
                          </div>
                        )}
                        {asset.technicalMetadata.format && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                              <HardDrive size={12} />
                              Format
                            </span>
                            <span className="font-bold text-slate-700 dark:text-slate-300">
                              {asset.technicalMetadata.format.toUpperCase()}
                            </span>
                          </div>
                        )}
                        {asset.technicalMetadata.fileSize && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                              <Download size={12} />
                              Taille
                            </span>
                            <span className="font-bold text-slate-700 dark:text-slate-300">
                              {formatFileSize(asset.technicalMetadata.fileSize)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      {asset.isFree ? (
                        <DownloadButton asset={asset} size="sm" className="w-full" />
                      ) : (
                        <>
                          <AnimatedButton
                            variant="primary"
                            size="sm"
                            glow
                            className="w-full flex items-center justify-center gap-2"
                            onClick={() => {
                              addToCart(asset._id, LicenseType.STANDARD);
                            }}
                          >
                            <ShoppingCart size={14} />
                            Standard - ${asset.priceStandard}
                          </AnimatedButton>
                          <AnimatedButton
                            variant="outline"
                            size="sm"
                            className="w-full flex items-center justify-center gap-2"
                            onClick={() => {
                              addToCart(asset._id, LicenseType.COMMERCIAL);
                            }}
                          >
                            <Crown size={14} />
                            Commercial - ${asset.priceCommercial}
                          </AnimatedButton>
                        </>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => removeFromCompare(asset._id)}
                        className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
                      >
                        <XIcon size={14} />
                        Retirer
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 dark:border-slate-800 p-6 flex items-center justify-between flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                Fermer
              </motion.button>
              <Link href="/search">
                <AnimatedButton variant="outline" size="sm">
                  Voir plus d&apos;assets
                  <ArrowRight size={14} />
                </AnimatedButton>
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default CompareModal;
