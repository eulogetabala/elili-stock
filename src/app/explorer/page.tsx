"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Image as ImageIcon,
  Video,
  MousePointer2,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Crown,
  Download,
  Camera,
  Building2,
  Users,
  Palette,
  Briefcase,
  MapPin,
  Heart,
  ShoppingCart,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import AssetCard from "@/components/AssetCard";
import AssetPreviewModal from "@/components/AssetPreviewModal";
import ScrollReveal from "@/components/ui/ScrollReveal";
import AnimatedButton from "@/components/ui/AnimatedButton";
import Magnetic from "@/components/ui/Magnetic";
import { Asset, AssetType, AssetCategory } from "@/types/asset";
import { MOCK_ASSETS } from "@/lib/mock-data";
import { formatNumber } from "@/lib/api";

const CATEGORIES = [
  {
    id: AssetCategory.NATURE,
    name: "Nature",
    icon: <Sparkles size={24} />,
    description: "Paysages, animaux, végétation",
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=800",
    count: MOCK_ASSETS.filter((a) => a.category === AssetCategory.NATURE).length,
  },
  {
    id: AssetCategory.PEOPLE,
    name: "Personnes",
    icon: <Users size={24} />,
    description: "Portraits, mode, lifestyle",
    image: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?q=80&w=800",
    count: MOCK_ASSETS.filter((a) => a.category === AssetCategory.PEOPLE).length,
  },
  {
    id: AssetCategory.ARCHITECTURE,
    name: "Architecture",
    icon: <Building2 size={24} />,
    description: "Bâtiments, urbain, design",
    image: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?q=80&w=800",
    count: MOCK_ASSETS.filter((a) => a.category === AssetCategory.ARCHITECTURE).length,
  },
  {
    id: AssetCategory.CULTURE,
    name: "Culture",
    icon: <Palette size={24} />,
    description: "Art, traditions, patrimoine",
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?q=80&w=800",
    count: MOCK_ASSETS.filter((a) => a.category === AssetCategory.CULTURE).length,
  },
  {
    id: AssetCategory.BUSINESS,
    name: "Business",
    icon: <Briefcase size={24} />,
    description: "Entreprise, startup, tech",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800",
    count: MOCK_ASSETS.filter((a) => a.category === AssetCategory.BUSINESS).length,
  },
  {
    id: AssetCategory.STREET,
    name: "Street",
    icon: <MapPin size={24} />,
    description: "Vie urbaine, scènes de rue",
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=800",
    count: MOCK_ASSETS.filter((a) => a.category === AssetCategory.STREET).length,
  },
];

const TYPE_SECTIONS = [
  {
    type: AssetType.IMAGE,
    name: "Photos",
    icon: <Camera size={20} />,
    bgClass: "bg-emerald-100 dark:bg-emerald-900/20",
    iconClass: "text-emerald-500",
    assets: MOCK_ASSETS.filter((a) => a.type === AssetType.IMAGE).slice(0, 8),
  },
  {
    type: AssetType.VIDEO,
    name: "Vidéos",
    icon: <Video size={20} />,
    bgClass: "bg-purple-100 dark:bg-purple-900/20",
    iconClass: "text-purple-500",
    assets: MOCK_ASSETS.filter((a) => a.type === AssetType.VIDEO).slice(0, 8),
  },
  {
    type: AssetType.VECTOR,
    name: "Vecteurs",
    icon: <MousePointer2 size={20} />,
    bgClass: "bg-blue-100 dark:bg-blue-900/20",
    iconClass: "text-blue-500",
    assets: MOCK_ASSETS.filter((a) => a.type === AssetType.VECTOR).slice(0, 8),
  },
];

export default function ExplorerPage() {
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | null>(null);

  // Trending assets (most viewed/downloaded)
  const trendingAssets = [...MOCK_ASSETS]
    .sort((a, b) => (b.views + b.downloads) - (a.views + a.downloads))
    .slice(0, 12);

  // Free assets
  const freeAssets = MOCK_ASSETS.filter((a) => a.isFree).slice(0, 8);

  // Premium assets
  const premiumAssets = MOCK_ASSETS.filter((a) => !a.isFree).slice(0, 8);

  // Filtered assets by category
  const categoryAssets = selectedCategory
    ? MOCK_ASSETS.filter((a) => a.category === selectedCategory).slice(0, 12)
    : [];

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar />

      <div className="pt-28 pb-16">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 mb-20">
          <ScrollReveal direction="up" delay={0.1}>
            <div className="text-center space-y-6 mb-16">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.3em]">
                <Sparkles size={14} />
                Découvrez l&apos;excellence visuelle
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-[1.1]">
                Explorer les <br />
                <span className="text-gradient-orange italic">ressources</span>
              </h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                Parcourez notre collection premium d&apos;assets visuels africains. 
                Des millions de photos, vidéos et vecteurs pour vos projets créatifs.
              </p>
            </div>
          </ScrollReveal>

          {/* Categories Grid */}
          <ScrollReveal direction="up" delay={0.2}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
              {CATEGORIES.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative overflow-hidden rounded-[2.5rem] bg-slate-100 dark:bg-slate-800 aspect-[4/3] cursor-pointer"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className="absolute inset-0">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                  </div>
                  
                  <div className="absolute inset-0 flex flex-col justify-end p-8 z-10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-3 bg-primary/20 backdrop-blur-md rounded-xl border border-primary/30">
                        <div className="text-primary">{category.icon}</div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-black text-white mb-1">
                          {category.name}
                        </h3>
                        <p className="text-sm text-white/70 font-medium">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-white/60 uppercase tracking-widest">
                        {category.count} assets
                      </span>
                      <motion.div
                        whileHover={{ x: 4 }}
                        className="flex items-center gap-2 text-primary font-black text-sm"
                      >
                        Explorer <ArrowRight size={16} />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </div>

        {/* Category Filter View */}
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="max-w-7xl mx-auto px-6 mb-20"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                  {CATEGORIES.find((c) => c.id === selectedCategory)?.name}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {categoryAssets.length} assets disponibles
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(null)}
                className="px-4 py-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-primary transition-colors"
              >
                Voir tout
              </motion.button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {categoryAssets.map((asset) => (
                <AssetCard
                  key={asset._id}
                  asset={asset}
                  onClick={() => setPreviewAsset(asset)}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Trending Section */}
        {!selectedCategory && (
          <div className="max-w-7xl mx-auto px-6 mb-20">
            <ScrollReveal direction="up" delay={0.2}>
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <TrendingUp size={24} className="text-primary" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                      Tendance
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Les assets les plus populaires
                    </p>
                  </div>
                </div>
                <Link href="/search?sort=views">
                  <AnimatedButton variant="outline" size="sm">
                    Voir tout
                    <ArrowRight size={14} />
                  </AnimatedButton>
                </Link>
              </div>
            </ScrollReveal>

            <motion.div
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.05 } },
              }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {trendingAssets.map((asset) => (
                <AssetCard
                  key={asset._id}
                  asset={asset}
                  onClick={() => setPreviewAsset(asset)}
                />
              ))}
            </motion.div>
          </div>
        )}

        {/* Type Sections */}
        {!selectedCategory && (
          <div className="space-y-20">
            {TYPE_SECTIONS.map((section, sectionIndex) => (
              <div key={section.type} className="max-w-7xl mx-auto px-6">
                <ScrollReveal direction="up" delay={0.1 + sectionIndex * 0.1}>
                  <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 ${section.bgClass} rounded-xl`}>
                      <div className={section.iconClass}>{section.icon}</div>
                    </div>
                      <div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                          {section.name}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          {section.assets.length} assets sélectionnés
                        </p>
                      </div>
                    </div>
                    <Link href={`/search?type=${section.type}`}>
                      <AnimatedButton variant="outline" size="sm">
                        Voir tout
                        <ArrowRight size={14} />
                      </AnimatedButton>
                    </Link>
                  </div>
                </ScrollReveal>

                <motion.div
                  variants={{
                    hidden: { opacity: 0 },
                    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
                  }}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                >
                  {section.assets.map((asset) => (
                    <AssetCard
                      key={asset._id}
                      asset={asset}
                      onClick={() => setPreviewAsset(asset)}
                    />
                  ))}
                </motion.div>
              </div>
            ))}
          </div>
        )}

        {/* Free vs Premium */}
        {!selectedCategory && (
          <div className="max-w-7xl mx-auto px-6 mt-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Free Section */}
              <ScrollReveal direction="right" delay={0.2}>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-xl">
                      <Download size={24} className="text-emerald-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                        Assets Gratuits
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Téléchargez sans limite
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {freeAssets.slice(0, 4).map((asset) => (
                      <AssetCard
                        key={asset._id}
                        asset={asset}
                        onClick={() => setPreviewAsset(asset)}
                      />
                    ))}
                  </div>
                  <Link href="/search?isFree=true">
                    <AnimatedButton variant="outline" className="w-full">
                      Voir tous les assets gratuits
                      <ArrowRight size={14} />
                    </AnimatedButton>
                  </Link>
                </div>
              </ScrollReveal>

              {/* Premium Section */}
              <ScrollReveal direction="left" delay={0.3}>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-xl">
                      <Crown size={24} className="text-amber-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                        Assets Premium
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Qualité professionnelle
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {premiumAssets.slice(0, 4).map((asset) => (
                      <AssetCard
                        key={asset._id}
                        asset={asset}
                        onClick={() => setPreviewAsset(asset)}
                      />
                    ))}
                  </div>
                  <Link href="/search?isFree=false">
                    <AnimatedButton variant="primary" glow className="w-full">
                      Explorer Premium
                      <ArrowRight size={14} />
                    </AnimatedButton>
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        )}
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
