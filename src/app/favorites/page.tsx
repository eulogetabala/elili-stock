"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  Filter,
  Grid3X3,
  List,
  X,
  Image as ImageIcon,
  Video,
  MousePointer2,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import AssetCard from "@/components/AssetCard";
import AssetPreviewModal from "@/components/AssetPreviewModal";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Asset, AssetType, AssetCategory } from "@/types/asset";
import { MOCK_ASSETS } from "@/lib/mock-data";
import AnimatedButton from "@/components/ui/AnimatedButton";

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);
  const [selectedType, setSelectedType] = useState<AssetType | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Get full asset data for favorites
  const favoriteAssets = useMemo(() => {
    return MOCK_ASSETS.filter((asset) => favorites.includes(asset._id));
  }, [favorites]);

  // Filter assets
  const filteredAssets = useMemo(() => {
    return favoriteAssets.filter((asset) => {
      if (selectedType && asset.type !== selectedType) return false;
      if (selectedCategory && asset.category !== selectedCategory) return false;
      return true;
    });
  }, [favoriteAssets, selectedType, selectedCategory]);

  const types = [
    { value: AssetType.IMAGE, label: "Photos", icon: <ImageIcon size={14} /> },
    { value: AssetType.VIDEO, label: "Vidéos", icon: <Video size={14} /> },
    { value: AssetType.VECTOR, label: "Vecteurs", icon: <MousePointer2 size={14} /> },
  ];

  const categories = [
    { value: AssetCategory.NATURE, label: "Nature" },
    { value: AssetCategory.PEOPLE, label: "Personnes" },
    { value: AssetCategory.ARCHITECTURE, label: "Architecture" },
    { value: AssetCategory.CULTURE, label: "Culture" },
    { value: AssetCategory.BUSINESS, label: "Business" },
    { value: AssetCategory.STREET, label: "Street" },
  ];

  const clearFilters = () => {
    setSelectedType(null);
    setSelectedCategory(null);
  };

  const hasActiveFilters = selectedType || selectedCategory;

  if (favorites.length === 0) {
    return (
      <main className="min-h-screen bg-white dark:bg-slate-950">
        <Navbar />
        <div className="pt-28 pb-16">
          <div className="max-w-4xl mx-auto px-6">
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05, x: -3 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors mb-8"
              >
                <ArrowLeft size={18} />
                <span className="text-sm font-bold">Retour</span>
              </motion.button>
            </Link>

            <div className="text-center py-20 space-y-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto"
              >
                <Heart size={40} className="text-slate-300" />
              </motion.div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  Aucun favori
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Commencez à ajouter des assets à vos favoris
                </p>
              </div>
              <Link href="/">
                <AnimatedButton variant="primary" glow>
                  Découvrir des assets
                </AnimatedButton>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar />
      <div className="pt-28 pb-16">
        <div className="max-w-[1440px] mx-auto px-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05, x: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary transition-all"
                >
                  <ArrowLeft size={18} />
                </motion.button>
              </Link>
              <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                  Mes favoris
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {filteredAssets.length} {filteredAssets.length === 1 ? "asset" : "assets"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {hasActiveFilters && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
                >
                  <X size={14} />
                  Effacer filtres
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${
                  showFilters
                    ? "bg-primary text-white border-primary"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-100 dark:border-slate-700 hover:border-slate-200"
                }`}
              >
                <Filter size={14} />
                Filtres
              </motion.button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="overflow-hidden mb-8"
            >
              <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-6">
                {/* Type Filter */}
                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Type
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {types.map((t) => (
                      <motion.button
                        key={t.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedType(selectedType === t.value ? null : t.value)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          selectedType === t.value
                            ? "bg-primary text-white shadow-md shadow-primary/20"
                            : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary/30"
                        }`}
                      >
                        {t.icon} {t.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Catégorie
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((c) => (
                      <motion.button
                        key={c.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          setSelectedCategory(selectedCategory === c.value ? null : c.value)
                        }
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          selectedCategory === c.value
                            ? "bg-primary text-white shadow-md shadow-primary/20"
                            : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary/30"
                        }`}
                      >
                        {c.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Assets Grid */}
          {filteredAssets.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <ImageIcon size={32} className="text-slate-300" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                Aucun résultat
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Essayez de modifier vos filtres
              </p>
            </div>
          ) : (
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.05 } },
              }}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {filteredAssets.map((asset) => (
                <AssetCard
                  key={asset._id}
                  asset={asset}
                  onClick={() => setPreviewAsset(asset)}
                />
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      <AssetPreviewModal
        asset={previewAsset}
        isOpen={!!previewAsset}
        onClose={() => setPreviewAsset(null)}
        onDownload={(asset) => {
          window.open(asset.url, "_blank");
        }}
      />
    </main>
  );
}
