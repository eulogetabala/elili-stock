"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Clock, Crown, Download, ArrowRight, Image as ImageIcon, Video, MousePointer2 } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import AssetCard from "@/components/AssetCard";
import AssetPreviewModal from "@/components/AssetPreviewModal";
import ScrollReveal from "@/components/ui/ScrollReveal";
import AnimatedButton from "@/components/ui/AnimatedButton";
import Magnetic from "@/components/ui/Magnetic";
import { Asset, AssetType } from "@/types/asset";
import { MOCK_ASSETS } from "@/lib/mock-data";
import { formatNumber } from "@/lib/api";

export default function DiscoverPage() {
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);
  const [selectedTab, setSelectedTab] = useState<"trending" | "new" | "free" | "premium">("trending");

  // Trending assets (most viewed/downloaded)
  const trendingAssets = [...MOCK_ASSETS]
    .sort((a, b) => (b.views + b.downloads) - (a.views + a.downloads))
    .slice(0, 12);

  // New assets (most recent)
  const newAssets = [...MOCK_ASSETS]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 12);

  // Free assets
  const freeAssets = MOCK_ASSETS.filter((a) => a.isFree).slice(0, 12);

  // Premium assets
  const premiumAssets = MOCK_ASSETS.filter((a) => !a.isFree).slice(0, 12);

  const getCurrentAssets = () => {
    switch (selectedTab) {
      case "trending": return trendingAssets;
      case "new": return newAssets;
      case "free": return freeAssets;
      case "premium": return premiumAssets;
      default: return trendingAssets;
    }
  };

  const tabs = [
    { id: "trending" as const, label: "Tendances", icon: <TrendingUp size={16} /> },
    { id: "new" as const, label: "Nouveautés", icon: <Clock size={16} /> },
    { id: "free" as const, label: "Gratuits", icon: <Download size={16} /> },
    { id: "premium" as const, label: "Premium", icon: <Crown size={16} /> },
  ];

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-28 pb-16">
        <div className="max-w-[1440px] mx-auto px-6">
          {/* Header */}
          <ScrollReveal direction="up" delay={0.1}>
            <div className="text-center mb-16 space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.3em]">
                <Sparkles size={14} />
                Découvrir
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 leading-[1.1]">
                Explorez les <br />
                <span className="text-gradient-orange italic">meilleurs assets</span>
              </h1>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                Découvrez les tendances, nouveautés et recommandations personnalisées
              </p>
            </div>
          </ScrollReveal>

          {/* Tabs */}
          <ScrollReveal direction="up" delay={0.2}>
            <div className="flex items-center justify-center gap-2 mb-12 overflow-x-auto pb-4">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                    selectedTab === tab.id
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "bg-slate-50 text-slate-600 border border-slate-100 hover:border-primary/30"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </motion.button>
              ))}
            </div>
          </ScrollReveal>

          {/* Stats */}
          <ScrollReveal direction="up" delay={0.3}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              {[
                { label: "Assets totaux", value: formatNumber(MOCK_ASSETS.length), icon: <ImageIcon size={20} /> },
                { label: "Téléchargements", value: formatNumber(MOCK_ASSETS.reduce((sum, a) => sum + a.downloads, 0)), icon: <Download size={20} /> },
                { label: "Artistes", value: formatNumber(new Set(MOCK_ASSETS.map((a) => a.photographer._id)).size), icon: <Crown size={20} /> },
                { label: "Nouveaux/mois", value: "+500", icon: <TrendingUp size={20} /> },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center"
                >
                  <div className="flex items-center justify-center gap-2 text-primary mb-2">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-black text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>

          {/* Assets Grid */}
          <ScrollReveal direction="up" delay={0.4}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
              {getCurrentAssets().map((asset, index) => (
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
          </ScrollReveal>

          {/* CTA */}
          <ScrollReveal direction="up" delay={0.5}>
            <div className="text-center">
              <Link href="/search">
                <Magnetic strength={0.15}>
                  <AnimatedButton variant="primary" size="lg" glow className="inline-flex">
                    Explorer tous les assets
                    <ArrowRight size={18} />
                  </AnimatedButton>
                </Magnetic>
              </Link>
            </div>
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
