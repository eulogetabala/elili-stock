"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Download, Calendar, Crown, FileText, X, Image as ImageIcon, Video, MousePointer2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import AssetCard from "@/components/AssetCard";
import AssetPreviewModal from "@/components/AssetPreviewModal";
import { useDownloads } from "@/contexts/DownloadsContext";
import { Asset, AssetType, LicenseType } from "@/types/asset";
import { formatNumber } from "@/lib/api";
import AnimatedButton from "@/components/ui/AnimatedButton";

export default function MyDownloadsPage() {
  const { downloads, removeDownload, clearDownloads, isLoading } = useDownloads();
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);
  const [filter, setFilter] = useState<"all" | AssetType>("all");

  const filteredDownloads = filter === "all" 
    ? downloads 
    : downloads.filter((d) => d.asset.type === filter);

  const getTypeIcon = (type: AssetType) => {
    switch (type) {
      case AssetType.VIDEO: return <Video size={14} />;
      case AssetType.VECTOR: return <MousePointer2 size={14} />;
      default: return <ImageIcon size={14} />;
    }
  };

  const getLicenseLabel = (license: LicenseType) => {
    switch (license) {
      case LicenseType.FREE: return "Gratuit";
      case LicenseType.STANDARD: return "Standard";
      case LicenseType.COMMERCIAL: return "Commercial";
      default: return "N/A";
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-28 pb-16 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <Download size={24} className="text-primary" />
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-28 pb-16">
        <div className="max-w-[1440px] mx-auto px-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Mes Téléchargements</h1>
              <p className="text-slate-500">
                {downloads.length} {downloads.length > 1 ? "assets téléchargés" : "asset téléchargé"}
              </p>
            </div>
            {downloads.length > 0 && (
              <AnimatedButton
                variant="outline"
                onClick={clearDownloads}
                className="flex items-center gap-2"
              >
                <X size={16} />
                Tout effacer
              </AnimatedButton>
            )}
          </div>

          {/* Filters */}
          {downloads.length > 0 && (
            <div className="flex items-center gap-2 mb-8">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Filtrer:</span>
              {["all", AssetType.IMAGE, AssetType.VIDEO, AssetType.VECTOR].map((type) => (
                <motion.button
                  key={type}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter(type as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    filter === type
                      ? "bg-primary text-white"
                      : "bg-slate-50 text-slate-600 border border-slate-100"
                  }`}
                >
                  {type === "all" ? "Tous" : getTypeIcon(type as AssetType)}
                </motion.button>
              ))}
            </div>
          )}

          {/* Downloads List */}
          {downloads.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 space-y-6"
            >
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                <Download size={32} className="text-slate-300" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900">Aucun téléchargement</h3>
                <p className="text-sm text-slate-500">
                  Les assets que vous téléchargez apparaîtront ici
                </p>
              </div>
            </motion.div>
          ) : filteredDownloads.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <p className="text-slate-500">Aucun téléchargement pour ce filtre</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredDownloads.map((download) => (
                <div key={download._id} className="relative group">
                  <AssetCard
                    asset={download.asset}
                    onClick={() => setPreviewAsset(download.asset)}
                  />
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Calendar size={12} />
                      {new Date(download.downloadedAt).toLocaleDateString("fr-FR")}
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 bg-slate-50 rounded-lg">
                      {download.licenseType !== LicenseType.FREE && (
                        <Crown size={10} className="text-amber-500" />
                      )}
                      <span className="font-bold text-slate-600">
                        {getLicenseLabel(download.licenseType)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
