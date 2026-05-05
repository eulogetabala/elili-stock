"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  Share2,
  Flag,
  Eye,
  ArrowDownToLine,
  Crown,
  Download,
  Image as ImageIcon,
  Video,
  MousePointer2,
  MapPin,
  Calendar,
  HardDrive,
  Maximize,
  Clock,
  Tag,
  Check,
  X,
  User,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import AssetCard from "@/components/AssetCard";
import AssetPreviewModal from "@/components/AssetPreviewModal";
import PurchaseModal from "@/components/PurchaseModal";
import DownloadButton from "@/components/DownloadButton";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Magnetic from "@/components/ui/Magnetic";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { Asset, LicenseType, AssetType } from "@/types/asset";
import { getAssetById, getSimilarAssets, getPhotographerAssets, formatFileSize, formatNumber } from "@/lib/api";

export default function AssetDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [asset, setAsset] = useState<Asset | null>(null);
  const [similarAssets, setSimilarAssets] = useState<Asset[]>([]);
  const [photographerAssets, setPhotographerAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<LicenseType>(LicenseType.STANDARD);
  const [isZoomed, setIsZoomed] = useState(false);

  // Modals
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);
  const [purchaseAsset, setPurchaseAsset] = useState<Asset | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const assetData = await getAssetById(id);
      if (assetData) {
        setAsset(assetData);
        const [similar, photographer] = await Promise.all([
          getSimilarAssets(assetData, 6),
          getPhotographerAssets(assetData.photographer._id, assetData._id, 4),
        ]);
        setSimilarAssets(similar);
        setPhotographerAssets(photographer);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [id]);

  const getTypeIcon = (type: AssetType) => {
    switch (type) {
      case AssetType.VIDEO: return <Video size={16} />;
      case AssetType.VECTOR: return <MousePointer2 size={16} />;
      default: return <ImageIcon size={16} />;
    }
  };

  const getTypeLabel = (type: AssetType) => {
    switch (type) {
      case AssetType.VIDEO: return "Vidéo";
      case AssetType.VECTOR: return "Vecteur";
      default: return "Photo";
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-28 pb-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
              <div className="lg:col-span-3 aspect-[4/3] bg-slate-100 rounded-[2.5rem] animate-pulse" />
              <div className="lg:col-span-2 space-y-4">
                <div className="h-8 bg-slate-100 rounded-xl animate-pulse w-3/4" />
                <div className="h-4 bg-slate-100 rounded-xl animate-pulse w-1/2" />
                <div className="h-32 bg-slate-100 rounded-2xl animate-pulse mt-8" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!asset) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-28 pb-16 text-center">
          <div className="max-w-md mx-auto space-y-6">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
              <ImageIcon size={32} className="text-slate-300" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Asset introuvable</h2>
            <p className="text-sm text-slate-500">Cet asset n&apos;existe pas ou a été supprimé.</p>
            <Link href="/">
              <AnimatedButton variant="primary" glow>Retour à l&apos;accueil</AnimatedButton>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-3 mb-8">
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05, x: -3 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-primary transition-all"
              >
                <ArrowLeft size={18} />
              </motion.button>
            </Link>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
              <span>/</span>
              <Link href={`/search?type=${asset.type}`} className="hover:text-primary transition-colors">
                {getTypeLabel(asset.type)}s
              </Link>
              <span>/</span>
              <span className="text-slate-600 font-bold truncate max-w-[200px]">{asset.title}</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Left: Image */}
            <div className="lg:col-span-3">
              <motion.div
                className="relative rounded-[2.5rem] overflow-hidden bg-slate-50 cursor-zoom-in group"
                onClick={() => setIsZoomed(!isZoomed)}
                layout
              >
                <div className={`relative transition-all duration-500 ${isZoomed ? "aspect-auto min-h-[600px]" : "aspect-[4/3]"}`}>
                  <Image
                    src={asset.url}
                    alt={asset.title}
                    fill
                    className={`object-contain transition-transform duration-500 ${isZoomed ? "scale-110" : "group-hover:scale-105"}`}
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority
                  />

                  {/* Watermark for premium */}
                  {!asset.isFree && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                      <div className="rotate-[-30deg] opacity-[0.06]">
                        <p className="text-[8vw] font-black text-black tracking-[0.2em] uppercase whitespace-nowrap">
                          ELILI STOCK
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Stats overlay */}
                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-white text-[10px] font-black">
                    <Eye size={12} /> {formatNumber(asset.views)} vues
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-white text-[10px] font-black">
                    <ArrowDownToLine size={12} /> {formatNumber(asset.downloads)}
                  </div>
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-white text-[10px] font-black">
                    {getTypeIcon(asset.type)} {getTypeLabel(asset.type)}
                  </div>
                  {asset.isFree ? (
                    <div className="px-3 py-1.5 bg-emerald-500/90 backdrop-blur-md rounded-full text-white text-[10px] font-black flex items-center gap-1">
                      <Download size={10} /> Gratuit
                    </div>
                  ) : (
                    <div className="px-3 py-1.5 bg-amber-500/90 backdrop-blur-md rounded-full text-white text-[10px] font-black flex items-center gap-1">
                      <Crown size={10} /> Premium
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Action buttons below image */}
              <div className="flex items-center gap-3 mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsFavorited(!isFavorited)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-xs font-bold ${
                    isFavorited ? "bg-red-50 border-red-200 text-red-500" : "bg-slate-50 border-slate-100 text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Heart size={14} fill={isFavorited ? "currentColor" : "none"} />
                  Favori
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 hover:text-slate-700 transition-all text-xs font-bold"
                >
                  <Share2 size={14} />
                  Partager
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 hover:text-slate-700 transition-all text-xs font-bold"
                >
                  <Flag size={14} />
                  Signaler
                </motion.button>
              </div>
            </div>

            {/* Right: Info Panel */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title & Author */}
              <div className="space-y-4">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  {asset.title}
                </h1>
                <Link
                  href={`/search?photographerId=${asset.photographer._id}`}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 border-2 border-slate-100">
                    {asset.photographer.avatar && (
                      <img
                        src={asset.photographer.avatar}
                        alt={`${asset.photographer.firstName} ${asset.photographer.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-black text-slate-700 group-hover:text-primary transition-colors">
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

              {/* License & Download/Purchase Panel */}
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-5">
                {asset.isFree ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-black text-emerald-600">Gratuit</span>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                          Licence standard incluse
                        </p>
                      </div>
                      <div className="p-2 bg-emerald-50 rounded-xl">
                        <Download size={20} className="text-emerald-500" />
                      </div>
                    </div>
                    <DownloadButton asset={asset} size="lg" className="w-full" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Choisir une licence
                    </span>

                    {/* Standard */}
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedLicense(LicenseType.STANDARD)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        selectedLicense === LicenseType.STANDARD
                          ? "border-primary bg-primary/5"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            selectedLicense === LicenseType.STANDARD ? "border-primary bg-primary" : "border-slate-300"
                          }`}>
                            {selectedLicense === LicenseType.STANDARD && <Check size={10} className="text-white" />}
                          </div>
                          <span className="font-black text-xs text-slate-900">Standard</span>
                        </div>
                        <span className="text-lg font-black text-primary">${asset.priceStandard}</span>
                      </div>
                      <p className="text-[9px] text-slate-400 font-bold mt-1 pl-6">Usage personnel & éditorial</p>
                    </motion.button>

                    {/* Commercial */}
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedLicense(LicenseType.COMMERCIAL)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left relative ${
                        selectedLicense === LicenseType.COMMERCIAL
                          ? "border-primary bg-primary/5"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[7px] font-black rounded">
                        PRO
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            selectedLicense === LicenseType.COMMERCIAL ? "border-primary bg-primary" : "border-slate-300"
                          }`}>
                            {selectedLicense === LicenseType.COMMERCIAL && <Check size={10} className="text-white" />}
                          </div>
                          <span className="font-black text-xs text-slate-900 flex items-center gap-1">
                            Commercial <Crown size={10} className="text-amber-500" />
                          </span>
                        </div>
                        <span className="text-lg font-black text-primary">${asset.priceCommercial}</span>
                      </div>
                      <p className="text-[9px] text-slate-400 font-bold mt-1 pl-6">Usage commercial illimité</p>
                    </motion.button>

                    <AnimatedButton
                      variant="primary"
                      size="lg"
                      glow
                      className="w-full flex items-center justify-center gap-3"
                      onClick={() => setPurchaseAsset(asset)}
                    >
                      Acheter — ${selectedLicense === LicenseType.COMMERCIAL ? asset.priceCommercial : asset.priceStandard}
                    </AnimatedButton>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <Tag size={12} /> Tags
                </div>
                <div className="flex flex-wrap gap-2">
                  {asset.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/search?q=${encodeURIComponent(tag)}`}
                      className="px-3 py-1.5 bg-slate-50 hover:bg-primary/10 text-slate-500 hover:text-primary text-xs font-bold rounded-lg transition-colors border border-slate-100"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Technical Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <HardDrive size={12} /> Détails techniques
                </div>
                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl">
                  {asset.technicalMetadata?.width && asset.technicalMetadata?.height && (
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Maximize size={14} className="text-slate-400" />
                      <div>
                        <div className="font-bold">{asset.technicalMetadata.width} x {asset.technicalMetadata.height}</div>
                        <div className="text-[9px] text-slate-400">Résolution</div>
                      </div>
                    </div>
                  )}
                  {asset.technicalMetadata?.format && (
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <HardDrive size={14} className="text-slate-400" />
                      <div>
                        <div className="font-bold">{asset.technicalMetadata.format.toUpperCase()}</div>
                        <div className="text-[9px] text-slate-400">Format</div>
                      </div>
                    </div>
                  )}
                  {asset.technicalMetadata?.fileSize && (
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <ArrowDownToLine size={14} className="text-slate-400" />
                      <div>
                        <div className="font-bold">{formatFileSize(asset.technicalMetadata.fileSize)}</div>
                        <div className="text-[9px] text-slate-400">Taille</div>
                      </div>
                    </div>
                  )}
                  {asset.technicalMetadata?.duration && (
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Clock size={14} className="text-slate-400" />
                      <div>
                        <div className="font-bold">{asset.technicalMetadata.duration}s</div>
                        <div className="text-[9px] text-slate-400">Durée</div>
                      </div>
                    </div>
                  )}
                  {asset.location && (
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <MapPin size={14} className="text-slate-400" />
                      <div>
                        <div className="font-bold">{asset.location}</div>
                        <div className="text-[9px] text-slate-400">Lieu</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Calendar size={14} className="text-slate-400" />
                    <div>
                      <div className="font-bold">{new Date(asset.createdAt).toLocaleDateString("fr-FR")}</div>
                      <div className="text-[9px] text-slate-400">Ajouté le</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Photographer's other assets */}
          {photographerAssets.length > 0 && (
            <ScrollReveal direction="up" delay={0.2}>
              <div className="mt-20 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                      <User size={12} /> Du même artiste
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                      Plus de {asset.photographer.firstName} {asset.photographer.lastName}
                    </h3>
                  </div>
                  <Link href={`/search?photographerId=${asset.photographer._id}`}>
                    <AnimatedButton variant="outline" size="sm">
                      Voir tout
                    </AnimatedButton>
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {photographerAssets.map((a) => (
                    <AssetCard key={a._id} asset={a} onClick={() => setPreviewAsset(a)} />
                  ))}
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* Similar assets */}
          {similarAssets.length > 0 && (
            <ScrollReveal direction="up" delay={0.3}>
              <div className="mt-20 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                      <Sparkles size={12} /> Assets similaires
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                      Vous aimerez aussi
                    </h3>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {similarAssets.map((a) => (
                    <AssetCard key={a._id} asset={a} onClick={() => setPreviewAsset(a)} />
                  ))}
                </div>
              </div>
            </ScrollReveal>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      <AssetPreviewModal
        asset={previewAsset}
        isOpen={!!previewAsset}
        onClose={() => setPreviewAsset(null)}
        onPurchase={(a) => {
          setPreviewAsset(null);
          setPurchaseAsset(a);
        }}
        onDownload={(a) => {
          window.open(a.url, "_blank");
        }}
      />

      {/* Purchase Modal */}
      <PurchaseModal
        asset={purchaseAsset}
        isOpen={!!purchaseAsset}
        onClose={() => setPurchaseAsset(null)}
        onSuccess={() => setPurchaseAsset(null)}
      />
    </main>
  );
}
