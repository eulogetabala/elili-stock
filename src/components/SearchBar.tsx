"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Clock,
  TrendingUp,
  Image as ImageIcon,
  Video,
  MousePointer2,
  ArrowRight,
  Tag,
  Sparkles,
} from "lucide-react";
import { Asset, AssetType } from "@/types/asset";
import { getSearchSuggestions } from "@/lib/api";
import { POPULAR_TAGS } from "@/lib/mock-data";

interface SearchBarProps {
  variant?: "hero" | "page";
  initialQuery?: string;
  onSearch?: (query: string) => void;
  className?: string;
  autoFocus?: boolean;
}

const SEARCH_HISTORY_KEY = "bantushot_search_history";
const MAX_HISTORY = 8;

const SearchBar: React.FC<SearchBarProps> = ({
  variant = "hero",
  initialQuery = "",
  onSearch,
  className = "",
  autoFocus = false,
}) => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<{ assets: Asset[]; tags: string[] }>({ assets: [], tags: [] });
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Load search history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (saved) setSearchHistory(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  // Save search history to localStorage
  const saveToHistory = useCallback((term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setSearchHistory((prev) => {
      const updated = [trimmed, ...prev.filter((h) => h !== trimmed)].slice(0, MAX_HISTORY);
      try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  // Clear search history
  const clearHistory = () => {
    setSearchHistory([]);
    try {
      localStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch {
      // ignore
    }
  };

  // Debounced search suggestions
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.length < 2) {
      setSuggestions({ assets: [], tags: [] });
      return;
    }

    setIsLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const result = await getSearchSuggestions(query);
        setSuggestions(result);
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearch = (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    saveToHistory(trimmed);
    setIsFocused(false);
    if (onSearch) {
      onSearch(trimmed);
    } else {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const getTypeIcon = (type: AssetType) => {
    switch (type) {
      case AssetType.VIDEO:
        return <Video size={12} className="text-purple-400" />;
      case AssetType.VECTOR:
        return <MousePointer2 size={12} className="text-blue-400" />;
      default:
        return <ImageIcon size={12} className="text-emerald-400" />;
    }
  };

  const showDropdown = isFocused && (query.length >= 2 || searchHistory.length > 0);

  if (variant === "hero") {
    return (
      <div ref={containerRef} className={`relative ${className}`}>
        <form onSubmit={handleSubmit}>
          <div className="relative flex items-center glass-morphism-dark-strong border border-white/10 focus-within:border-primary/50 focus-within:bg-white/10 rounded-[2.5rem] p-2 shadow-2xl transition-all duration-500 overflow-visible">
            <motion.div
              className="flex items-center gap-4 px-4 md:px-8 text-white border-r border-white/5 hidden md:flex flex-shrink-0"
              whileHover={{ scale: 1.1, rotate: 15 }}
            >
              <Search size={24} />
            </motion.div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder="Rechercher Safari, Lagos, Business..."
              className="flex-1 min-w-0 bg-transparent border-none outline-none px-4 md:px-8 py-4 md:py-5 text-base md:text-xl text-white placeholder:text-white/40 font-bold"
              autoFocus={autoFocus}
            />
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                type="button"
                onClick={() => { setQuery(""); inputRef.current?.focus(); }}
                className="p-2 text-white/40 hover:text-white transition-colors mr-2"
              >
                <X size={18} />
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="flex-shrink-0 px-4 md:px-12 py-4 md:py-5 rounded-[2rem] bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 md:gap-4 shadow-lg shadow-primary/20 transition-colors"
            >
              <span className="hidden sm:inline whitespace-nowrap">Rechercher</span>
              <Search size={18} className="md:w-[22px] md:h-[22px]" />
            </motion.button>
          </div>
        </form>

        {/* Dropdown */}
        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute left-0 right-0 top-full mt-3 bg-slate-950/95 backdrop-blur-2xl border border-white/10 rounded-[1.5rem] shadow-2xl overflow-hidden z-50"
            >
              <div className="max-h-[400px] overflow-y-auto p-4 space-y-4">
                {/* Search History */}
                {query.length < 2 && searchHistory.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                        <Clock size={10} /> Recherches récentes
                      </span>
                      <button onClick={clearHistory} className="text-[10px] font-bold text-white/30 hover:text-primary transition-colors">
                        Effacer
                      </button>
                    </div>
                    {searchHistory.map((term) => (
                      <motion.button
                        key={term}
                        whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.05)" }}
                        onClick={() => { setQuery(term); handleSearch(term); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm text-white/70 hover:text-white transition-colors"
                      >
                        <Clock size={14} className="text-white/30 flex-shrink-0" />
                        {term}
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Tag Suggestions */}
                {suggestions.tags.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40 px-2 flex items-center gap-2">
                      <Tag size={10} /> Tags
                    </span>
                    <div className="flex flex-wrap gap-2 px-2">
                      {suggestions.tags.map((tag) => (
                        <motion.button
                          key={tag}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSearch(tag)}
                          className="px-3 py-1.5 bg-white/5 hover:bg-primary/20 text-white/60 hover:text-primary text-xs font-bold rounded-lg transition-colors border border-white/5"
                        >
                          {tag}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Asset Suggestions */}
                {suggestions.assets.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40 px-2 flex items-center gap-2">
                      <Sparkles size={10} /> Résultats
                    </span>
                    {suggestions.assets.map((asset) => (
                      <motion.button
                        key={asset._id}
                        whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.05)" }}
                        onClick={() => handleSearch(asset.title)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 relative">
                          <Image
                            src={asset.thumbnailUrl || asset.url}
                            alt={asset.title}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-bold text-white/80 truncate">{asset.title}</div>
                          <div className="flex items-center gap-2 text-[10px] text-white/40">
                            {getTypeIcon(asset.type)}
                            <span>{asset.photographer.firstName} {asset.photographer.lastName}</span>
                            {asset.isFree && <span className="text-emerald-400 font-bold">Gratuit</span>}
                          </div>
                        </div>
                        <ArrowRight size={14} className="text-white/20 flex-shrink-0" />
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Popular Tags (when no query) */}
                {query.length < 2 && searchHistory.length === 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40 px-2 flex items-center gap-2">
                      <TrendingUp size={10} /> Tendances
                    </span>
                    <div className="flex flex-wrap gap-2 px-2">
                      {POPULAR_TAGS.slice(0, 12).map((tag) => (
                        <motion.button
                          key={tag}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSearch(tag)}
                          className="px-3 py-1.5 bg-white/5 hover:bg-primary/20 text-white/60 hover:text-primary text-xs font-bold rounded-lg transition-colors border border-white/5"
                        >
                          {tag}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Loading */}
                {isLoading && query.length >= 2 && (
                  <div className="flex items-center justify-center py-6">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                      <Search size={18} className="text-primary" />
                    </motion.div>
                  </div>
                )}

                {/* No results */}
                {!isLoading && query.length >= 2 && suggestions.assets.length === 0 && suggestions.tags.length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-sm text-white/40">Aucun résultat pour &quot;{query}&quot;</p>
                    <p className="text-xs text-white/20 mt-1">Essayez un autre terme</p>
                  </div>
                )}
              </div>

              {/* View all results footer */}
              {query.length >= 2 && (suggestions.assets.length > 0 || suggestions.tags.length > 0) && (
                <motion.button
                  whileHover={{ backgroundColor: "rgba(255,107,0,0.1)" }}
                  onClick={() => handleSearch(query)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border-t border-white/5 text-xs font-black uppercase tracking-widest text-primary hover:text-primary transition-colors"
                >
                  Voir tous les résultats
                  <ArrowRight size={14} />
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Page variant (simpler, for search results page)
  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative flex items-center bg-white border-2 border-slate-100 focus-within:border-primary/50 rounded-2xl px-4 py-1 shadow-sm transition-all">
          <Search size={20} className="text-slate-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Rechercher des assets..."
            className="flex-1 min-w-0 bg-transparent border-none outline-none px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 font-bold"
            autoFocus={autoFocus}
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(""); inputRef.current?.focus(); }}
              className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={16} />
            </button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="ml-2 px-6 py-2.5 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors"
          >
            Rechercher
          </motion.button>
        </div>
      </form>

      {/* Dropdown (page variant) */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden z-50"
          >
            <div className="max-h-[350px] overflow-y-auto p-3 space-y-3">
              {/* Asset Suggestions */}
              {suggestions.assets.length > 0 && (
                <div className="space-y-1">
                  {suggestions.assets.map((asset) => (
                    <motion.button
                      key={asset._id}
                      whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                      onClick={() => handleSearch(asset.title)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 relative">
                        <Image
                          src={asset.thumbnailUrl || asset.url}
                          alt={asset.title}
                          fill
                          className="object-cover"
                          sizes="32px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold text-slate-700 truncate">{asset.title}</div>
                      </div>
                      {asset.isFree && <span className="text-emerald-500 text-[9px] font-black">GRATUIT</span>}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Tags */}
              {suggestions.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 px-2">
                  {suggestions.tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleSearch(tag)}
                      className="px-2.5 py-1 bg-slate-50 hover:bg-primary/10 text-slate-500 hover:text-primary text-xs font-bold rounded-md transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
