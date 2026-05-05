"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Heart,
  Share2,
  Download,
  ShoppingCart,
  Eye,
  ArrowDownToLine,
  ChevronLeft,
  ChevronRight,
  Crown,
  Check,
  Image as ImageIcon,
  Video,
  MousePointer2,
  MapPin,
  Calendar,
  HardDrive,
  Maximize,
  Clock,
  Tag,
  User,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { Asset, LicenseType, AssetType } from "@/types/asset";
import { formatFileSize, formatNumber, getSimilarAssets } from "@/lib/api";
import AnimatedButton from "@/components/ui/AnimatedButton";
import Magnetic from "@/components/ui/Magnetic";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";

interface AssetPreviewModalProps {
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (direction: "prev" | "next") => void;
  onPurchase?: (asset: Asset, licenseType: LicenseType) => void;
  onDownload?: (asset: Asset) => void;
}

const AssetPreviewModal: React.FC<AssetPreviewModalProps> = ({
  asset,
  isOpen,
  onClose,
  onNavigate,
  onPurchase,
  onDownload,
}) => {
  const [mounted, setMounted] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<LicenseType>(LicenseType.STANDARD);
  const [similarAssets, setSimilarAssets] = useState<Asset[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const isFavorited = asset ? isFavorite(asset._id) : false;

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (asset) {
      getSimilarAssets(asset, 4).then(setSimilarAssets);
    }
  }, [asset]);

  // Navigation clavier
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && onNavigate) onNavigate("prev");
      if (e.key === "ArrowRight" && onNavigate) onNavigate("next");
    },
    [isOpen, onClose, onNavigate]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Bloquer le scroll du body
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

  const handleDownload = async () => {
    if (!asset) return;
    setIsDownloading(true);
    try {
      if (onDownload) onDownload(asset);
      // Simulate download
      await new Promise((r) => setTimeout(r, 1000));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePurchase = () => {
    if (!asset || !onPurchase) return;
    onPurchase(asset, selectedLicense);
  };

  const getTypeIcon = (type: AssetType) => {
    switch (type) {
      case AssetType.VIDEO:
        return <Video size={14} />;
      case AssetType.VECTOR:
        return <MousePointer2 size={14} />;
      default:
        return <ImageIcon size={14} />;
    }
  };

  const getTypeLabel = (type: AssetType) => {
    switch (type) {
      case AssetType.VIDEO:
        return "Vidéo";
      case AssetType.VECTOR:
        return "Vecteur";
      case AssetType.PSD:
        return "PSD";
      case AssetType.AI:
        return "AI";
      default:
        return "Photo";
    }
  };

  const getPrice = () => {
    if (!asset) return 0;
    return selectedLicense === LicenseType.COMMERCIAL
      ? asset.priceCommercial
      : asset.priceStandard;
  };

  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && asset && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9998]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-4 md:inset-8 lg:inset-12 z-[9999] flex flex-col bg-white rounded-[2rem] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                  {getTypeIcon(asset.type)}
                  <span>{getTypeLabel(asset.type)}</span>
                </div>
                {asset.isFree && (
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                    Gratuit
                  </span>
                )}
                {!asset.isFree && (
                  <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5">
                    <Crown size={10} />
                    Premium
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => asset && toggleFavorite(asset._id)}
                  className={`p-2.5 rounded-xl transition-all ${isFavorited ? "bg-red-50 text-red-500" : "bg-slate-50 text-slate-400 hover:text-slate-600"}`}
                >
                  <Heart size={18} fill={isFavorited ? "currentColor" : "none"} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-600 transition-all"
                >
                  <Share2 size={18} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-red-500 transition-all"
                >
                  <X size={18} />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              {/* Left: Image Preview */}
              <div className="flex-1 relative bg-slate-50 flex items-center justify-center overflow-hidden min-h-[300px]">
                {/* Image */}
                <div className="relative w-full h-full">
                  <Image
                    src={asset.watermarkedPreviewUrl || asset.url}
                    alt={asset.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority
                  />

                  {/* Watermark overlay for premium */}
                  {!asset.isFree && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                      <div className="rotate-[-30deg] opacity-[0.08]">
                        <p className="text-[8vw] font-black text-black tracking-[0.2em] uppercase whitespace-nowrap">
                          ELILI STOCK
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation arrows */}
                {onNavigate && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.1, x: -2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onNavigate("prev")}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-slate-600 hover:text-primary transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1, x: 2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onNavigate("next")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-slate-600 hover:text-primary transition-colors"
                    >
                      <ChevronRight size={20} />
                    </motion.button>
                  </>
                )}

                {/* Stats overlay */}
                <div className="absolute bottom-4 left-4 flex items-center gap-4">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-white text-[10px] font-black">
                    <Eye size={12} />
                    {formatNumber(asset.views)}
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-white text-[10px] font-black">
                    <ArrowDownToLine size={12} />
                    {formatNumber(asset.downloads)}
                  </div>
                </div>
              </div>

              {/* Right: Info Panel */}
              <div className="w-full lg:w-[420px] flex flex-col border-l border-slate-100 overflow-y-auto">
                <div className="p-6 space-y-6 flex-1">
                  {/* Title & Author */}
                  <div className="space-y-3">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                      {asset.title}
                    </h2>
                    <Link
                      href={`/search?photographerId=${asset.photographer._id}`}
                      className="flex items-center gap-3 group"
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200">
                        {asset.photographer.avatar && (
                          <img
                            src={asset.photographer.avatar}
                            alt={`${asset.photographer.firstName} ${asset.photographer.lastName}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <span className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors">
                          {asset.photographer.firstName} {asset.photographer.lastName}
                        </span>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Artiste vérifié
                        </p>
                      </div>
                    </Link>
                  </div>

                  {/* Description */}
                  {asset.description && (
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {asset.description}
                    </p>
                  )}

                  {/* Tags */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <Tag size={12} />
                      Tags
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {asset.tags.map((tag) => (
                        <Link
                          key={tag}
                          href={`/search?q=${encodeURIComponent(tag)}`}
                          className="px-3 py-1.5 bg-slate-50 hover:bg-primary/10 text-slate-500 hover:text-primary text-xs font-bold rounded-lg transition-colors"
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Technical Metadata */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <HardDrive size={12} />
                      Détails techniques
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {asset.technicalMetadata?.width && asset.technicalMetadata?.height && (
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Maximize size={12} className="text-slate-400" />
                          {asset.technicalMetadata.width} x {asset.technicalMetadata.height}
                        </div>
                      )}
                      {asset.technicalMetadata?.format && (
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <HardDrive size={12} className="text-slate-400" />
                          {asset.technicalMetadata.format.toUpperCase()}
                        </div>
                      )}
                      {asset.technicalMetadata?.fileSize && (
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <ArrowDownToLine size={12} className="text-slate-400" />
                          {formatFileSize(asset.technicalMetadata.fileSize)}
                        </div>
                      )}
                      {asset.technicalMetadata?.duration && (
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Clock size={12} className="text-slate-400" />
                          {asset.technicalMetadata.duration}s
                        </div>
                      )}
                      {asset.location && (
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <MapPin size={12} className="text-slate-400" />
                          {asset.location}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Calendar size={12} className="text-slate-400" />
                        {new Date(asset.createdAt).toLocaleDateString("fr-FR")}
                      </div>
                    </div>
                  </div>

                  {/* View full page link */}
                  <Link
                    href={`/asset/${asset._id}`}
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors py-2"
                    onClick={onClose}
                  >
                    <ExternalLink size={14} />
                    Voir la page complète
                  </Link>
                </div>

                {/* Action Panel (sticky bottom) */}
                <div className="border-t border-slate-100 p-6 space-y-4 bg-white flex-shrink-0">
                  {/* Success notification */}
                  <AnimatePresence>
                    {showSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 px-4 py-3 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold"
                      >
                        <Check size={14} />
                        Téléchargement lancé avec succès !
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {asset.isFree ? (
                    /* Free asset: Download button */
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-black text-emerald-600">Gratuit</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Licence standard incluse
                        </span>
                      </div>
                      <AnimatedButton
                        variant="primary"
                        size="lg"
                        glow
                        className="w-full flex items-center justify-center gap-3"
                        onClick={handleDownload}
                      >
                        {isDownloading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          >
                            <Download size={18} />
                          </motion.div>
                        ) : (
                          <Download size={18} />
                        )}
                        {isDownloading ? "Téléchargement..." : "Télécharger gratuitement"}
                      </AnimatedButton>
                    </div>
                  ) : (
                    /* Premium asset: License selection + Purchase */
                    <div className="space-y-4">
                      {/* License selection */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Choisir une licence
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedLicense(LicenseType.STANDARD)}
                            className={`p-3 rounded-xl border-2 transition-all text-left ${
                              selectedLicense === LicenseType.STANDARD
                                ? "border-primary bg-primary/5"
                                : "border-slate-100 hover:border-slate-200"
                            }`}
                          >
                            <div className="text-xs font-black text-slate-900">Standard</div>
                            <div className="text-lg font-black text-primary">${asset.priceStandard}</div>
                            <div className="text-[9px] text-slate-400 font-bold mt-1">Usage personnel</div>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedLicense(LicenseType.COMMERCIAL)}
                            className={`p-3 rounded-xl border-2 transition-all text-left ${
                              selectedLicense === LicenseType.COMMERCIAL
                                ? "border-primary bg-primary/5"
                                : "border-slate-100 hover:border-slate-200"
                            }`}
                          >
                            <div className="text-xs font-black text-slate-900 flex items-center gap-1">
                              Commercial <Crown size={10} className="text-amber-500" />
                            </div>
                            <div className="text-lg font-black text-primary">${asset.priceCommercial}</div>
                            <div className="text-[9px] text-slate-400 font-bold mt-1">Usage commercial</div>
                          </motion.button>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <AnimatedButton
                          variant="outline"
                          size="lg"
                          className="flex-1 flex items-center justify-center gap-3"
                          onClick={() => {
                            if (asset) {
                              addToCart(asset._id, selectedLicense);
                              setShowSuccess(true);
                              setTimeout(() => setShowSuccess(false), 3000);
                            }
                          }}
                        >
                          <ShoppingCart size={18} />
                          Au panier
                        </AnimatedButton>
                        <AnimatedButton
                          variant="primary"
                          size="lg"
                          glow
                          className="flex-1 flex items-center justify-center gap-3"
                          onClick={handlePurchase}
                        >
                          Acheter — ${getPrice()}
                        </AnimatedButton>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Similar Assets Bar */}
            {similarAssets.length > 0 && (
              <div className="border-t border-slate-100 p-4 flex-shrink-0 bg-slate-50">
                <div className="flex items-center gap-4 overflow-x-auto pb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap flex items-center gap-2">
                    <Sparkles size={12} className="text-primary" />
                    Similaires
                  </span>
                  {similarAssets.map((sa) => (
                    <motion.div
                      key={sa._id}
                      whileHover={{ scale: 1.05 }}
                      className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer relative border border-slate-200 hover:border-primary/30 transition-colors"
                    >
                      <Image
                        src={sa.thumbnailUrl || sa.url}
                        alt={sa.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                      {sa.isFree && (
                        <div className="absolute top-1 left-1 px-1 py-0.5 bg-emerald-500 text-white text-[7px] font-black rounded">
                          FREE
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default AssetPreviewModal;
