"use client";

import React, { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  X,
  ChevronDown,
  Grid3X3,
  LayoutGrid,
  SlidersHorizontal,
  Image as ImageIcon,
  Video,
  MousePointer2,
  Crown,
  Download,
  TrendingUp,
  Clock,
  DollarSign,
  Sparkles,
  ArrowLeft,
  GitCompare,
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

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // URL params
  const queryParam = searchParams.get("q") || "";
  const typeParam = searchParams.get("type") as AssetType | null;
  const categoryParam = searchParams.get("category") as AssetCategory | null;
  const isFreeParam = searchParams.get("isFree");
  const sortParam = searchParams.get("sort") || "createdAt";

  // State
  const [assets, setAssets] = useState<Asset[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedType, setSelectedType] = useState<AssetType | null>(typeParam);
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | null>(categoryParam);
  const [isFreeFilter, setIsFreeFilter] = useState<boolean | undefined>(
    isFreeParam === "true" ? true : isFreeParam === "false" ? false : undefined
  );
  const [sortBy, setSortBy] = useState(sortParam);
  const [showFilters, setShowFilters] = useState(false);

  // Modals
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);
  const [purchaseAsset, setPurchaseAsset] = useState<Asset | null>(null);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  
  const { compareItems } = useCompare();

  // Fetch assets
  const fetchAssets = useCallback(async (pageNum: number, append: boolean = false) => {
    if (append) setIsLoadingMore(true);
    else setIsLoading(true);

    try {
      const params: FindAssetsParams = {
        page: pageNum,
        limit: 12,
        search: searchQuery || undefined,
        type: selectedType || undefined,
        category: selectedCategory || undefined,
        isFree: isFreeFilter,
        sortBy: sortBy,
        sortOrder: "desc",
      };

      const result = await searchAssets(params);

      if (append) {
        setAssets((prev) => [...prev, ...result.data]);
      } else {
        setAssets(result.data);
      }
      setTotal(result.total);
      setTotalPages(result.totalPages);
      setPage(pageNum);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [searchQuery, selectedType, selectedCategory, isFreeFilter, sortBy]);

  // Initial fetch and on filter change
  useEffect(() => {
    fetchAssets(1);
  }, [fetchAssets]);

  // Update URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedType) params.set("type", selectedType);
    if (selectedCategory) params.set("category", selectedCategory);
    if (isFreeFilter !== undefined) params.set("isFree", String(isFreeFilter));
    if (sortBy !== "createdAt") params.set("sort", sortBy);
    
    const newUrl = `/search${params.toString() ? `?${params.toString()}` : ""}`;
    router.replace(newUrl, { scroll: false });
  }, [searchQuery, selectedType, selectedCategory, isFreeFilter, sortBy, router]);

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
    setSelectedType(null);
    setSelectedCategory(null);
    setIsFreeFilter(undefined);
    setSortBy("createdAt");
  };

  const hasActiveFilters = selectedType || selectedCategory || isFreeFilter !== undefined || sortBy !== "createdAt";

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

  const sortOptions = [
    { value: "createdAt", label: "Plus récents", icon: <Clock size={12} /> },
    { value: "views", label: "Plus vus", icon: <TrendingUp size={12} /> },
    { value: "downloads", label: "Plus téléchargés", icon: <Download size={12} /> },
    { value: "priceStandard", label: "Prix", icon: <DollarSign size={12} /> },
  ];

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-28 pb-16">
        <div className="max-w-[1440px] mx-auto px-6">
          {/* Search Header */}
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
                  <span className="font-black text-slate-900">{total}</span> résultats
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
                  {/* Type Filter */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Type</span>
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
                              : "bg-white text-slate-600 border border-slate-200 hover:border-primary/30"
                          }`}
                        >
                          {t.icon} {t.label}
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
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsFreeFilter(isFreeFilter === true ? undefined : true)}
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
                        onClick={() => setIsFreeFilter(isFreeFilter === false ? undefined : false)}
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
                <ImageIcon size={32} className="text-slate-300" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900">Aucun résultat</h3>
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

export default function SearchPage() {
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
      <SearchPageContent />
    </Suspense>
  );
}
