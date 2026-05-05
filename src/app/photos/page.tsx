"use client";

import React, { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronDown,
  SlidersHorizontal,
  Camera,
  Crown,
  Download,
  TrendingUp,
  Clock,
  DollarSign,
  Sparkles,
  ArrowLeft,
  GitCompare,
  Layout,
  Maximize,
  Palette,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import AssetCard from "@/components/AssetCard";
import AssetPreviewModal from "@/components/AssetPreviewModal";
import PurchaseModal from "@/components/PurchaseModal";
import CompareModal from "@/components/CompareModal";
import SearchBar from "@/components/SearchBar";
import { Asset, AssetType, AssetCategory, LicenseType, FindAssetsParams } from "@/types/asset";
import { searchAssets } from "@/lib/api";
import AnimatedButton from "@/components/ui/AnimatedButton";
import Magnetic from "@/components/ui/Magnetic";
import { useCompare } from "@/contexts/CompareContext";

type Orientation = "landscape" | "portrait" | "square" | "panoramic";
type Resolution = "all" | "hd" | "4k" | "8k";
type AspectRatio = "all" | "16:9" | "4:3" | "3:2" | "1:1" | "21:9";

function PhotosPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // URL params
  const queryParam = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") as AssetCategory | null;
  const isFreeParam = searchParams.get("isFree");
  const sortParam = searchParams.get("sort") || "createdAt";
  const orientationParam = searchParams.get("orientation") as Orientation | null;
  const resolutionParam = searchParams.get("resolution") as Resolution | null;
  const ratioParam = searchParams.get("ratio") as AspectRatio | null;

  // State
  const [assets, setAssets] = useState<Asset[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | null>(categoryParam);
  const [isFreeFilter, setIsFreeFilter] = useState<boolean | undefined>(
    isFreeParam === "true" ? true : isFreeParam === "false" ? false : undefined
  );
  const [sortBy, setSortBy] = useState(sortParam);
  const [orientation, setOrientation] = useState<Orientation | null>(orientationParam);
  const [resolution, setResolution] = useState<Resolution>(resolutionParam || "all");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(ratioParam || "all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setIsFreeFilter(
      isFreeParam === "true" ? true : isFreeParam === "false" ? false : undefined
    );
  }, [isFreeParam]);

  // Modals
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);
  const [purchaseAsset, setPurchaseAsset] = useState<Asset | null>(null);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  
  const { compareItems } = useCompare();

  // Fetch assets (only IMAGE type)
  const fetchAssets = useCallback(async (pageNum: number, append: boolean = false) => {
    if (append) setIsLoadingMore(true);
    else setIsLoading(true);

    try {
      const params: FindAssetsParams = {
        page: pageNum,
        limit: 12,
        search: searchQuery || undefined,
        type: AssetType.IMAGE, // Always filter by IMAGE
        category: selectedCategory || undefined,
        isFree: isFreeFilter,
        sortBy: sortBy,
        sortOrder: "desc",
      };

      const result = await searchAssets(params);

      // Apply client-side filters for orientation, resolution, ratio
      let filtered = result.data;
      
      if (orientation) {
        filtered = filtered.filter((asset) => {
          const { width, height } = asset.technicalMetadata || {};
          if (!width || !height) return false;
          const ratio = width / height;
          
          switch (orientation) {
            case "landscape": return ratio > 1.1;
            case "portrait": return ratio < 0.9;
            case "square": return ratio >= 0.9 && ratio <= 1.1;
            case "panoramic": return ratio > 2;
            default: return true;
          }
        });
      }

      if (resolution !== "all") {
        filtered = filtered.filter((asset) => {
          const { width, height } = asset.technicalMetadata || {};
          if (!width || !height) return false;
          const pixels = width * height;
          
          switch (resolution) {
            case "hd": return pixels >= 1280 * 720 && pixels < 3840 * 2160;
            case "4k": return pixels >= 3840 * 2160 && pixels < 7680 * 4320;
            case "8k": return pixels >= 7680 * 4320;
            default: return true;
          }
        });
      }

      if (aspectRatio !== "all") {
        filtered = filtered.filter((asset) => {
          const { width, height } = asset.technicalMetadata || {};
          if (!width || !height) return false;
          const ratio = width / height;
          const tolerance = 0.1;
          
          switch (aspectRatio) {
            case "16:9": return Math.abs(ratio - 16/9) < tolerance;
            case "4:3": return Math.abs(ratio - 4/3) < tolerance;
            case "3:2": return Math.abs(ratio - 3/2) < tolerance;
            case "1:1": return Math.abs(ratio - 1) < tolerance;
            case "21:9": return Math.abs(ratio - 21/9) < tolerance;
            default: return true;
          }
        });
      }

      if (append) {
        setAssets((prev) => [...prev, ...filtered]);
      } else {
        setAssets(filtered);
      }
      setTotal(filtered.length);
      setTotalPages(Math.ceil(filtered.length / 12));
      setPage(pageNum);
    } catch (error) {
      console.error("Photos fetch error:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [searchQuery, selectedCategory, isFreeFilter, sortBy, orientation, resolution, aspectRatio]);

  // Initial fetch and on filter change
  useEffect(() => {
    fetchAssets(1);
  }, [fetchAssets]);

  // Update URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedCategory) params.set("category", selectedCategory);
    if (isFreeFilter !== undefined) params.set("isFree", String(isFreeFilter));
    if (sortBy !== "createdAt") params.set("sort", sortBy);
    if (orientation) params.set("orientation", orientation);
    if (resolution !== "all") params.set("resolution", resolution);
    if (aspectRatio !== "all") params.set("ratio", aspectRatio);
    
    const newUrl = `/photos${params.toString() ? `?${params.toString()}` : ""}`;
    router.replace(newUrl, { scroll: false });
  }, [searchQuery, selectedCategory, isFreeFilter, sortBy, orientation, resolution, aspectRatio, router]);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore && page < totalPages) {
          fetchAssets(page + 1, true);
        }
      },
      { threshold: 0.5 }
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [page, totalPages, isLoadingMore, fetchAssets]);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
  };

  const handlePreviewNavigate = (direction: "prev" | "next") => {
    if (!previewAsset) return;
    const index = assets.findIndex((a) => a._id === previewAsset._id);
    if (direction === "prev" && index > 0) {
      setPreviewAsset(assets[index - 1]);
    } else if (direction === "next" && index < assets.length - 1) {
      setPreviewAsset(assets[index + 1]);
    }
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setIsFreeFilter(undefined);
    setSortBy("createdAt");
    setOrientation(null);
    setResolution("all");
    setAspectRatio("all");
  };

  const hasActiveFilters = selectedCategory || isFreeFilter !== undefined || sortBy !== "createdAt" || orientation || resolution !== "all" || aspectRatio !== "all";

  const categories = [
    { value: AssetCategory.NATURE, label: "Nature" },
    { value: AssetCategory.PEOPLE, label: "Personnes" },
    { value: AssetCategory.ARCHITECTURE, label: "Architecture" },
    { value: AssetCategory.CULTURE, label: "Culture" },
    { value: AssetCategory.BUSINESS, label: "Business" },
    { value: AssetCategory.STREET, label: "Street" },
  ];

  const sortOptions = [
    { value: "createdAt", label: "Plus récents", icon: <Clock size={12} /> },
    { value: "views", label: "Plus vus", icon: <TrendingUp size={12} /> },
    { value: "downloads", label: "Plus téléchargés", icon: <Download size={12} /> },
    { value: "priceStandard", label: "Prix", icon: <DollarSign size={12} /> },
  ];

  const orientations: { value: Orientation; label: string; icon: React.ReactNode }[] = [
    { value: "landscape", label: "Paysage", icon: <Layout className="rotate-90" size={14} /> },
    { value: "portrait", label: "Portrait", icon: <Layout size={14} /> },
    { value: "square", label: "Carré", icon: <Maximize size={14} /> },
    { value: "panoramic", label: "Panoramique", icon: <Maximize className="scale-x-150" size={14} /> },
  ];

  const resolutions: { value: Resolution; label: string }[] = [
    { value: "all", label: "Toutes" },
    { value: "hd", label: "HD (720p+)" },
    { value: "4k", label: "4K (2160p)" },
    { value: "8k", label: "8K (4320p)" },
  ];

  const ratios: { value: AspectRatio; label: string }[] = [
    { value: "all", label: "Tous" },
    { value: "16:9", label: "16:9" },
    { value: "4:3", label: "4:3" },
    { value: "3:2", label: "3:2" },
    { value: "1:1", label: "1:1" },
    { value: "21:9", label: "21:9" },
  ];

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-28 pb-16">
        <div className="max-w-[1440px] mx-auto px-6">
          {/* Header */}
          <div className="space-y-6 mb-10">
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
                  <Camera size={24} className="text-primary" />
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">Photos</h1>
                </div>
                <p className="text-sm text-slate-500 max-w-2xl">
                  Images <span className="font-bold text-slate-700">gratuites et payantes</span> dans la même bibliothèque — par défaut tout est affiché ; utilisez le filtre Prix pour affiner.
                </p>
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

            {/* Results count & active filters */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <p className="text-sm text-slate-500">
                  <span className="font-black text-slate-900">{total}</span> photos
                  {searchQuery && <> pour <span className="font-black text-primary">&quot;{searchQuery}&quot;</span></>}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-500 transition-colors"
                  >
                    <X size={10} /> Effacer filtres
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Sort */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 cursor-pointer hover:border-slate-200 transition-colors"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>

                {/* Compare Button */}
                {compareItems.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCompareModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border bg-primary text-white border-primary relative"
                  >
                    <GitCompare size={14} />
                    Comparer
                    {compareItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-white text-primary rounded-full flex items-center justify-center px-1 text-[10px] font-black">
                        {compareItems.length}
                      </span>
                    )}
                  </motion.button>
                )}

                {/* Toggle Filters */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${
                    showFilters ? "bg-primary text-white border-primary" : "bg-slate-50 text-slate-600 border-slate-100 hover:border-slate-200"
                  }`}
                >
                  <SlidersHorizontal size={14} />
                  Filtres
                </motion.button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="overflow-hidden mb-8"
              >
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-6">
                  {/* Orientation Filter */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Orientation</span>
                    <div className="flex flex-wrap gap-2">
                      {orientations.map((o) => (
                        <motion.button
                          key={o.value}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setOrientation(orientation === o.value ? null : o.value)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            orientation === o.value
                              ? "bg-primary text-white shadow-md shadow-primary/20"
                              : "bg-white text-slate-600 border border-slate-200 hover:border-primary/30"
                          }`}
                        >
                          {o.icon} {o.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Resolution Filter */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Résolution</span>
                    <div className="flex flex-wrap gap-2">
                      {resolutions.map((r) => (
                        <motion.button
                          key={r.value}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setResolution(r.value)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            resolution === r.value
                              ? "bg-primary text-white shadow-md shadow-primary/20"
                              : "bg-white text-slate-600 border border-slate-200 hover:border-primary/30"
                          }`}
                        >
                          {r.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Aspect Ratio Filter */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ratio</span>
                    <div className="flex flex-wrap gap-2">
                      {ratios.map((r) => (
                        <motion.button
                          key={r.value}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setAspectRatio(r.value)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            aspectRatio === r.value
                              ? "bg-primary text-white shadow-md shadow-primary/20"
                              : "bg-white text-slate-600 border border-slate-200 hover:border-primary/30"
                          }`}
                        >
                          {r.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Catégorie</span>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((c) => (
                        <motion.button
                          key={c.value}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedCategory(selectedCategory === c.value ? null : c.value)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            selectedCategory === c.value
                              ? "bg-primary text-white shadow-md shadow-primary/20"
                              : "bg-white text-slate-600 border border-slate-200 hover:border-primary/30"
                          }`}
                        >
                          {c.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Free/Premium Filter */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Prix</span>
                    <div className="flex flex-wrap gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsFreeFilter(undefined)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          isFreeFilter === undefined
                            ? "bg-slate-900 text-white shadow-md shadow-slate-900/20"
                            : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <Sparkles size={12} /> Tous
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsFreeFilter(true)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          isFreeFilter === true
                            ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                            : "bg-white text-slate-600 border border-slate-200 hover:border-emerald-300"
                        }`}
                      >
                        <Download size={12} /> Gratuit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsFreeFilter(false)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          isFreeFilter === false
                            ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                            : "bg-white text-slate-600 border border-slate-200 hover:border-amber-300"
                        }`}
                      >
                        <Crown size={12} /> Premium
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-slate-100 rounded-[2.5rem] animate-pulse" />
              ))}
            </div>
          ) : assets.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 space-y-6"
            >
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                <Camera size={32} className="text-slate-300" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900">Aucune photo trouvée</h3>
                <p className="text-sm text-slate-500">
                  Essayez de modifier vos filtres ou votre recherche
                </p>
              </div>
              <AnimatedButton
                variant="outline"
                onClick={clearFilters}
                className="inline-flex"
              >
                Réinitialiser les filtres
              </AnimatedButton>
            </motion.div>
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
              {assets.map((asset) => (
                <AssetCard
                  key={asset._id}
                  asset={asset}
                  onClick={() => setPreviewAsset(asset)}
                />
              ))}
            </motion.div>
          )}

          {/* Infinite scroll trigger */}
          <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
            {isLoadingMore && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 text-sm text-slate-400 font-bold"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <Sparkles size={16} className="text-primary" />
                </motion.div>
                Chargement...
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <AssetPreviewModal
        asset={previewAsset}
        isOpen={!!previewAsset}
        onClose={() => setPreviewAsset(null)}
        onNavigate={handlePreviewNavigate}
        onPurchase={(asset) => {
          setPreviewAsset(null);
          setPurchaseAsset(asset);
        }}
        onDownload={(asset) => {
          window.open(asset.url, "_blank");
        }}
      />

      {/* Purchase Modal */}
      <PurchaseModal
        asset={purchaseAsset}
        isOpen={!!purchaseAsset}
        onClose={() => setPurchaseAsset(null)}
        onSuccess={() => setPurchaseAsset(null)}
      />

      {/* Compare Modal */}
      <CompareModal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
      />
    </main>
  );
}

export default function PhotosPage() {
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
      <PhotosPageContent />
    </Suspense>
  );
}
