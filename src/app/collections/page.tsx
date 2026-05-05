"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Sparkles,
  Heart,
  Eye,
  Download,
  Users,
  Calendar,
  Image as ImageIcon,
  Video,
  MousePointer2,
  Crown,
  Lock,
  Globe,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import AssetCard from "@/components/AssetCard";
import AssetPreviewModal from "@/components/AssetPreviewModal";
import SearchBar from "@/components/SearchBar";
import AnimatedButton from "@/components/ui/AnimatedButton";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Asset, AssetType, AssetCategory } from "@/types/asset";
import { MOCK_ASSETS } from "@/lib/mock-data";
import { formatNumber } from "@/lib/api";

// Mock collections data - will be replaced with API call
interface Collection {
  _id: string;
  name: string;
  description: string;
  coverImage: string;
  assets: Asset[];
  isPublic: boolean;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  views: number;
  likes: number;
  createdAt: string;
}

const MOCK_COLLECTIONS: Collection[] = [
  {
    _id: "col1",
    name: "Safari & Nature Africaine",
    description: "Une collection complète de photos et vidéos de la faune et flore africaine",
    coverImage: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=1200",
    assets: MOCK_ASSETS.filter((a) => a.category === AssetCategory.NATURE).slice(0, 6),
    isPublic: true,
    author: {
      _id: "p1",
      firstName: "Amadi",
      lastName: "Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&fit=crop&crop=faces",
    },
    views: 12500,
    likes: 340,
    createdAt: "2025-01-15T10:30:00Z",
  },
  {
    _id: "col2",
    name: "Architecture Moderne",
    description: "Les plus beaux bâtiments et structures modernes d'Afrique",
    coverImage: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?q=80&w=1200",
    assets: MOCK_ASSETS.filter((a) => a.category === AssetCategory.ARCHITECTURE).slice(0, 6),
    isPublic: true,
    author: {
      _id: "p2",
      firstName: "Zainab",
      lastName: "Okafor",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&fit=crop&crop=faces",
    },
    views: 8900,
    likes: 210,
    createdAt: "2025-01-10T14:20:00Z",
  },
  {
    _id: "col3",
    name: "Culture & Traditions",
    description: "Célébrer le patrimoine culturel africain à travers l'art et les traditions",
    coverImage: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?q=80&w=1200",
    assets: MOCK_ASSETS.filter((a) => a.category === AssetCategory.CULTURE).slice(0, 6),
    isPublic: true,
    author: {
      _id: "p3",
      firstName: "Kofi",
      lastName: "Mensah",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&fit=crop&crop=faces",
    },
    views: 15200,
    likes: 450,
    createdAt: "2025-01-05T09:15:00Z",
  },
];

function CollectionsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryParam = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);

  const filteredCollections = MOCK_COLLECTIONS.filter((col) =>
    col.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    col.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (q: string) => {
    setSearchQuery(q);
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

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-28 pb-16">
        <div className="max-w-[1440px] mx-auto px-6">
          {/* Header */}
          <div className="space-y-6 mb-12">
            <div className="flex items-center gap-4">
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05, x: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-primary transition-all"
                >
                  <ArrowLeft size={18} />
                </motion.button>
              </Link>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles size={24} className="text-primary" />
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">Collections</h1>
                </div>
                <p className="text-sm text-slate-500">Découvrez des collections curatées d&apos;assets premium</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <SearchBar
                  variant="page"
                  initialQuery={queryParam}
                  onSearch={handleSearch}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <p className="text-sm text-slate-500">
                <span className="font-black text-slate-900">{filteredCollections.length}</span> collections
                {searchQuery && <> pour <span className="font-black text-primary">&quot;{searchQuery}&quot;</span></>}
              </p>
            </div>
          </div>

          {/* Collections Grid */}
          {filteredCollections.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 space-y-6"
            >
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                <Sparkles size={32} className="text-slate-300" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900">Aucune collection trouvée</h3>
                <p className="text-sm text-slate-500">
                  Essayez de modifier votre recherche
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredCollections.map((collection, index) => (
                <ScrollReveal key={collection._id} direction="up" delay={index * 0.1}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="group relative bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:border-primary/20 transition-all duration-500 hover:shadow-[0_40px_80px_-15px_rgba(255,107,0,0.15)] cursor-pointer"
                    onClick={() => setSelectedCollection(collection)}
                  >
                    {/* Cover Image */}
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={collection.coverImage}
                        alt={collection.name}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      {/* Badge */}
                      <div className="absolute top-4 right-4 flex items-center gap-2">
                        {collection.isPublic ? (
                          <div className="px-3 py-1.5 bg-emerald-500/90 backdrop-blur-md rounded-full text-white text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                            <Globe size={10} />
                            Public
                          </div>
                        ) : (
                          <div className="px-3 py-1.5 bg-slate-900/60 backdrop-blur-md rounded-full text-white text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                            <Lock size={10} />
                            Privé
                          </div>
                        )}
                      </div>

                      {/* Title & Author */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-2xl font-black text-white mb-2 tracking-tight">
                          {collection.name}
                        </h3>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 border-2 border-white/20">
                            {collection.author.avatar && (
                              <img
                                src={collection.author.avatar}
                                alt={`${collection.author.firstName} ${collection.author.lastName}`}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-black text-white">
                              {collection.author.firstName} {collection.author.lastName}
                            </p>
                            <p className="text-[9px] font-bold text-white/60 uppercase tracking-widest">
                              Collection
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-white/80 line-clamp-2 mb-4">
                          {collection.description}
                        </p>
                        <div className="flex items-center gap-4 text-[10px] text-white/60 font-bold">
                          <span className="flex items-center gap-1">
                            <Eye size={12} />
                            {formatNumber(collection.views)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart size={12} />
                            {formatNumber(collection.likes)}
                          </span>
                          <span className="flex items-center gap-1">
                            <ImageIcon size={12} />
                            {collection.assets.length} assets
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Assets Preview Grid */}
                    <div className="p-6 bg-slate-50">
                      <div className="grid grid-cols-3 gap-3">
                        {collection.assets.slice(0, 6).map((asset, idx) => (
                          <div
                            key={asset._id}
                            className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group/asset"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewAsset(asset);
                            }}
                          >
                            <Image
                              src={asset.thumbnailUrl || asset.url}
                              alt={asset.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover/asset:scale-110"
                              sizes="(max-width: 1024px) 33vw, 16vw"
                            />
                            <div className="absolute top-1 right-1 p-1 bg-black/60 backdrop-blur-sm rounded text-white">
                              {getTypeIcon(asset.type)}
                            </div>
                            {asset.isFree ? (
                              <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-emerald-500 text-white text-[7px] font-black rounded">
                                FREE
                              </div>
                            ) : (
                              <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-amber-500 text-white text-[7px] font-black rounded flex items-center gap-0.5">
                                <Crown size={8} />
                                PREM
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      {collection.assets.length > 6 && (
                        <div className="mt-4 text-center">
                          <p className="text-xs font-bold text-slate-500">
                            +{collection.assets.length - 6} autres assets
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Collection Detail Modal */}
      <AnimatePresence>
        {selectedCollection && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9998]"
              onClick={() => setSelectedCollection(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 md:inset-8 lg:inset-12 z-[9999] bg-white rounded-[2rem] overflow-hidden shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={selectedCollection.coverImage}
                  alt={selectedCollection.name}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-6 left-6 right-6 flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-3xl font-black text-white mb-2">
                      {selectedCollection.name}
                    </h2>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 border-2 border-white/20">
                        {selectedCollection.author.avatar && (
                          <img
                            src={selectedCollection.author.avatar}
                            alt={`${selectedCollection.author.firstName} ${selectedCollection.author.lastName}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-black text-white">
                          {selectedCollection.author.firstName} {selectedCollection.author.lastName}
                        </p>
                        <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                          Collection
                        </p>
                      </div>
                    </div>
                    <p className="text-base text-white/90 max-w-2xl">
                      {selectedCollection.description}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedCollection(null)}
                    className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
                  >
                    <ArrowLeft size={20} />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {selectedCollection.assets.map((asset) => (
                    <AssetCard
                      key={asset._id}
                      asset={asset}
                      onClick={() => {
                        setSelectedCollection(null);
                        setPreviewAsset(asset);
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AssetPreviewModal
        asset={previewAsset}
        isOpen={!!previewAsset}
        onClose={() => setPreviewAsset(null)}
        onPurchase={(asset) => {
          setPreviewAsset(null);
        }}
        onDownload={(asset) => {
          window.open(asset.url, "_blank");
        }}
      />
    </main>
  );
}

export default function CollectionsPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Sparkles size={24} className="text-primary" />
        </motion.div>
      </main>
    }>
      <CollectionsPageContent />
    </Suspense>
  );
}
