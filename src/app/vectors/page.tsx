"use client";

import React, { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronDown,
  SlidersHorizontal,
  MousePointer2,
  Crown,
  Download,
  TrendingUp,
  Clock,
  DollarSign,
  Sparkles,
  ArrowLeft,
  GitCompare,
  FileText,
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

type VectorFormat = "all" | "svg" | "eps" | "ai" | "pdf" | "psd";

const VECTOR_FAMILY_TYPES = [AssetType.VECTOR, AssetType.PSD, AssetType.AI] as const;

function VectorsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // URL params
  const queryParam = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") as AssetCategory | null;
  const isFreeParam = searchParams.get("isFree");
  const sortParam = searchParams.get("sort") || "createdAt";
  const formatParam = searchParams.get("format") as VectorFormat | null;

  // State
  const [assets, setAssets] = useState<Asset[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [previewVector, setPreviewVector] = useState<Asset | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | null>(categoryParam);
  const [isFreeFilter, setIsFreeFilter] = useState<boolean | undefined>(
    isFreeParam === "true" ? true : isFreeParam === "false" ? false : undefined
  );
  const [sortBy, setSortBy] = useState(sortParam);
  const [format, setFormat] = useState<VectorFormat>(formatParam || "all");
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

  // Fetch assets: vecteurs + PSD + Illustrator (AI), fusionnés par date
  const fetchAssets = useCallback(async (pageNum: number, append: boolean = false) => {
    if (append) setIsLoadingMore(true);
    else setIsLoading(true);

    try {
      const perTypeLimit = 8;
      const baseParams = {
        page: pageNum,
        limit: perTypeLimit,
        search: searchQuery || undefined,
        category: selectedCategory || undefined,
        isFree: isFreeFilter,
        sortBy: sortBy,
        sortOrder: "desc" as const,
      };

      const results = await Promise.all(
        VECTOR_FAMILY_TYPES.map((type) =>
          searchAssets({ ...baseParams, type } as FindAssetsParams)
        )
      );

      const seen = new Set<string>();
      let merged: Asset[] = [];
      for (const r of results) {
        for (const a of r.data) {
          if (!seen.has(a._id)) {
            seen.add(a._id);
            merged.push(a);
          }
        }
      }
      merged.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      merged = merged.slice(0, 12);

      let filtered = merged;

      if (format !== "all") {
        filtered = merged.filter((asset) => {
          const assetFormat = asset.technicalMetadata?.format?.toLowerCase() || "";
          switch (format) {
            case "svg":
              return assetFormat === "svg";
            case "eps":
              return assetFormat === "eps";
            case "ai":
              return (
                asset.type === AssetType.AI || assetFormat === "ai"
              );
            case "pdf":
              return assetFormat === "pdf";
            case "psd":
              return (
                asset.type === AssetType.PSD || assetFormat === "psd"
              );
            default:
              return true;
          }
        });
      }

      if (append) {
        setAssets((prev) => {
          const ids = new Set(prev.map((a) => a._id));
          const extra = filtered.filter((a) => !ids.has(a._id));
          return [...prev, ...extra];
        });
      } else {
        setAssets(filtered);
      }

      const combinedTotal = results.reduce((sum, r) => sum + (r.total || 0), 0);
      const maxPages = Math.max(
        ...results.map((r) => r.totalPages || 1),
        1
      );
      setTotal(combinedTotal);
      setTotalPages(maxPages);
      setPage(pageNum);
    } catch (error) {
      console.error("Vectors fetch error:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [searchQuery, selectedCategory, isFreeFilter, sortBy, format]);

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
    if (format !== "all") params.set("format", format);
    
    const newUrl = `/vectors${params.toString() ? `?${params.toString()}` : ""}`;
    router.replace(newUrl, { scroll: false });
  }, [searchQuery, selectedCategory, isFreeFilter, sortBy, format, router]);

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
    setFormat("all");
  };

  const hasActiveFilters = selectedCategory || isFreeFilter !== undefined || sortBy !== "createdAt" || format !== "all";

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

  const formats: { value: VectorFormat; label: string }[] = [
    { value: "all", label: "Tous" },
    { value: "svg", label: "SVG" },
    { value: "eps", label: "EPS" },
    { value: "pdf", label: "PDF" },
    { value: "psd", label: "PSD" },
    { value: "ai", label: "Illustrator" },
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
                  <MousePointer2 size={24} className="text-primary" />
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">Vecteurs &amp; sources</h1>
                </div>
                <p className="text-sm text-slate-500 max-w-2xl">
                  Vecteurs, PSD et Illustrator (AI) — ressources <span className="font-bold text-slate-700">gratuites et payantes</span> dans le même catalogue. Par défaut tout s&apos;affiche ; utilisez le filtre Prix pour isoler les gratuits ou le premium.
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
                  <span className="font-black text-slate-900">{total}</span> ressources vectorielles &amp; sources
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
                  {/* Format Filter */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Format</span>
                    <div className="flex flex-wrap gap-2">
                      {formats.map((f) => (
                        <motion.button
                          key={f.value}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setFormat(f.value)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            format === f.value
                              ? "bg-primary text-white shadow-md shadow-primary/20"
                              : "bg-white text-slate-600 border border-slate-200 hover:border-primary/30"
                          }`}
                        >
                          <FileText size={14} /> {f.label}
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

          {/* Vector Preview Modal */}
          <AnimatePresence>
            {previewVector && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/90 backdrop-blur-md z-[9998]"
                  onClick={() => setPreviewVector(null)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="fixed inset-4 md:inset-12 z-[9999] flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative w-full h-full max-w-4xl bg-white rounded-[2rem] p-8 overflow-auto">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setPreviewVector(null)}
                      className="absolute top-4 right-4 p-3 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                      <X size={20} />
                    </motion.button>
                    <div className="flex flex-col items-center justify-center h-full">
                      <img
                        src={previewVector.url}
                        alt={previewVector.title}
                        className="max-w-full max-h-[80vh] object-contain"
                      />
                      <div className="mt-6 text-center">
                        <h3 className="text-xl font-black text-slate-900 mb-2">{previewVector.title}</h3>
                        <p className="text-sm text-slate-500">
                          Format: {previewVector.technicalMetadata?.format?.toUpperCase() || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
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
                <MousePointer2 size={32} className="text-slate-300" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900">Aucune ressource trouvée</h3>
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
                <div key={asset._id} className="relative group">
                  <AssetCard
                    asset={asset}
                    onClick={() => setPreviewAsset(asset)}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPreviewVector(asset)}
                    className="absolute top-4 left-4 p-3 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-black/80 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <MousePointer2 size={16} />
                  </motion.button>
                </div>
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

export default function VectorsPage() {
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
      <VectorsPageContent />
    </Suspense>
  );
}
