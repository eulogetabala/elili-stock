"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Camera, Video, MousePointer2, Eye, Download, Globe, Award, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import AssetCard from "@/components/AssetCard";
import AssetPreviewModal from "@/components/AssetPreviewModal";
import { Asset, AssetType } from "@/types/asset";
import { MOCK_ASSETS } from "@/lib/mock-data";
import { formatNumber } from "@/lib/api";
import AnimatedButton from "@/components/ui/AnimatedButton";
import ScrollReveal from "@/components/ui/ScrollReveal";

// Mock function - replace with API call
function getPhotographerAssets(photographerId: string): Asset[] {
  return MOCK_ASSETS.filter((a) => a.photographer._id === photographerId);
}

function getPhotographerInfo(photographerId: string) {
  const assets = getPhotographerAssets(photographerId);
  if (assets.length === 0) return null;
  
  const photographer = assets[0].photographer;
  const totalViews = assets.reduce((sum, a) => sum + a.views, 0);
  const totalDownloads = assets.reduce((sum, a) => sum + a.downloads, 0);
  
  return {
    ...photographer,
    assets,
    totalViews,
    totalDownloads,
    assetCount: assets.length,
  };
}

export default function ArtistProfilePage() {
  const params = useParams();
  const id = params.id as string;
  
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);
  const [selectedType, setSelectedType] = useState<AssetType | "all">("all");
  
  const photographerInfo = getPhotographerInfo(id);
  
  if (!photographerInfo) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-28 pb-16 text-center">
          <div className="max-w-md mx-auto space-y-6">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
              <Camera size={32} className="text-slate-300" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Artiste introuvable</h2>
            <p className="text-sm text-slate-500">Cet artiste n&apos;existe pas ou n&apos;a pas encore publié d&apos;assets.</p>
            <Link href="/">
              <AnimatedButton variant="primary" glow>Retour à l&apos;accueil</AnimatedButton>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const filteredAssets = selectedType === "all"
    ? photographerInfo.assets
    : photographerInfo.assets.filter((a) => a.type === selectedType);

  const getTypeIcon = (type: AssetType) => {
    switch (type) {
      case AssetType.VIDEO: return <Video size={16} />;
      case AssetType.VECTOR: return <MousePointer2 size={16} />;
      default: return <Camera size={16} />;
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-28 pb-16">
        <div className="max-w-[1440px] mx-auto px-6">
          {/* Back Button */}
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05, x: -3 }}
              whileTap={{ scale: 0.95 }}
              className="mb-8 p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-primary transition-all"
            >
              <ArrowLeft size={18} />
            </motion.button>
          </Link>

          {/* Profile Header */}
          <ScrollReveal direction="up" delay={0.1}>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-12">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20">
                {photographerInfo.avatar ? (
                  <Image
                    src={photographerInfo.avatar}
                    alt={`${photographerInfo.firstName} ${photographerInfo.lastName}`}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white text-4xl font-black">
                    {photographerInfo.firstName[0]}{photographerInfo.lastName[0]}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                    {photographerInfo.firstName} {photographerInfo.lastName}
                  </h1>
                  <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                    <Award size={10} />
                    Vérifié
                  </div>
                </div>
                <p className="text-slate-500 mb-6">Photographe professionnel • Membre depuis 2024</p>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Camera size={18} className="text-primary" />
                    <div>
                      <div className="text-lg font-black text-slate-900">{photographerInfo.assetCount}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assets</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye size={18} className="text-primary" />
                    <div>
                      <div className="text-lg font-black text-slate-900">{formatNumber(photographerInfo.totalViews)}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vues</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download size={18} className="text-primary" />
                    <div>
                      <div className="text-lg font-black text-slate-900">{formatNumber(photographerInfo.totalDownloads)}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Téléchargements</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Type Filter */}
          <ScrollReveal direction="up" delay={0.2}>
            <div className="flex items-center gap-2 mb-8">
              {[
                { value: "all" as const, label: "Tous", icon: <Globe size={14} /> },
                { value: AssetType.IMAGE, label: "Photos", icon: <Camera size={14} /> },
                { value: AssetType.VIDEO, label: "Vidéos", icon: <Video size={14} /> },
                { value: AssetType.VECTOR, label: "Vecteurs", icon: <MousePointer2 size={14} /> },
              ].map((type) => (
                <motion.button
                  key={type.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedType(type.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedType === type.value
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "bg-slate-50 text-slate-600 border border-slate-100 hover:border-primary/30"
                  }`}
                >
                  {type.icon} {type.label}
                </motion.button>
              ))}
            </div>
          </ScrollReveal>

          {/* Assets Grid */}
          <ScrollReveal direction="up" delay={0.3}>
            {filteredAssets.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-slate-500">Aucun asset de ce type</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredAssets.map((asset, index) => (
                  <motion.div
                    key={asset._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <AssetCard
                      asset={asset}
                      onClick={() => setPreviewAsset(asset)}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </ScrollReveal>
        </div>
      </div>

      {/* Preview Modal */}
      <AssetPreviewModal
        asset={previewAsset}
        isOpen={!!previewAsset}
        onClose={() => setPreviewAsset(null)}
        onPurchase={() => setPreviewAsset(null)}
        onDownload={(asset) => {
          window.open(asset.url, "_blank");
        }}
      />
    </main>
  );
}
