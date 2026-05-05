"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Filter, Check, ChevronDown, Image as ImageIcon, Video, MousePointer2, Layers, FileCode, Sparkles, Download, Crown, Layout, Maximize, Palette, Calendar, HardDrive } from "lucide-react";
import { AssetType, AssetCategory } from "@/types/asset";

interface ExplorationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    types: AssetType[];
    categories: AssetCategory[];
    isFree: boolean | null;
    isPremium: boolean | null;
    orientation?: string;
    minResolution?: string;
  };
  onFiltersChange: (filters: {
    types: AssetType[];
    categories: AssetCategory[];
    isFree: boolean | null;
    isPremium: boolean | null;
    orientation?: string;
    minResolution?: string;
  }) => void;
}

const ExplorationSidebar: React.FC<ExplorationSidebarProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
}) => {
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({
    type: true,
    price: true,
    category: false,
    advanced: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleTypeToggle = (type: AssetType) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter((t) => t !== type)
      : [type]; // Si on coche un type, on ne garde que celui-ci (filtre exclusif)
    onFiltersChange({ ...filters, types: newTypes });
  };

  const handleCategoryToggle = (category: AssetCategory) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handleFreeToggle = () => {
    onFiltersChange({
      ...filters,
      isFree: filters.isFree === true ? null : true,
      isPremium: filters.isFree === true ? filters.isPremium : null,
    });
  };

  const handlePremiumToggle = () => {
    onFiltersChange({
      ...filters,
      isPremium: filters.isPremium === true ? null : true,
      isFree: filters.isPremium === true ? filters.isFree : null,
    });
  };

  const handleOrientationChange = (orientation: string) => {
    onFiltersChange({
      ...filters,
      orientation: filters.orientation === orientation ? undefined : orientation,
    });
  };

  const handleResolutionChange = (resolution: string) => {
    onFiltersChange({
      ...filters,
      minResolution: filters.minResolution === resolution ? undefined : resolution,
    });
  };

  const typeLabels: Record<AssetType, { label: string; icon: React.ReactNode; color: string }> = {
    [AssetType.IMAGE]: { label: "Photos", icon: <ImageIcon size={18} />, color: "bg-blue-500" },
    [AssetType.VIDEO]: { label: "Vidéos", icon: <Video size={18} />, color: "bg-red-500" },
    [AssetType.VECTOR]: { label: "Vecteurs", icon: <MousePointer2 size={18} />, color: "bg-purple-500" },
    [AssetType.PSD]: { label: "PSD", icon: <Layers size={18} />, color: "bg-indigo-500" },
    [AssetType.AI]: { label: "AI", icon: <FileCode size={18} />, color: "bg-orange-500" },
  };

  const categoryLabels: Record<AssetCategory, { label: string; icon: React.ReactNode }> = {
    [AssetCategory.NATURE]: { label: "Nature", icon: <Sparkles size={14} /> },
    [AssetCategory.PEOPLE]: { label: "Personnes", icon: <Palette size={14} /> },
    [AssetCategory.ARCHITECTURE]: { label: "Architecture", icon: <HardDrive size={14} /> },
    [AssetCategory.CULTURE]: { label: "Culture", icon: <Calendar size={14} /> },
    [AssetCategory.BUSINESS]: { label: "Business", icon: <Crown size={14} /> },
    [AssetCategory.STREET]: { label: "Street", icon: <Maximize size={14} /> },
    [AssetCategory.OTHER]: { label: "Autre", icon: <Sparkles size={14} /> },
  };

  const allTypes = [AssetType.IMAGE, AssetType.VIDEO, AssetType.VECTOR, AssetType.PSD, AssetType.AI];
  const allCategories = Object.values(AssetCategory);

  const orientations = [
    { value: "landscape", label: "Paysage", icon: <Layout className="rotate-90" size={16} /> },
    { value: "portrait", label: "Portrait", icon: <Layout size={16} /> },
    { value: "square", label: "Carré", icon: <Maximize size={16} /> },
  ];

  const resolutions = [
    { value: "1920", label: "Full HD (1920px+)" },
    { value: "3840", label: "4K (3840px+)" },
    { value: "7680", label: "8K (7680px+)" },
  ];

  const hasActiveFilters = filters.types.length > 0 || filters.categories.length > 0 || filters.isFree !== null || filters.isPremium !== null || filters.orientation || filters.minResolution;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[99] lg:hidden"
          onClick={onClose}
        />
      )}
      
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-[200px] bottom-0 w-96 bg-gradient-to-b from-white to-slate-50 border-r border-slate-200 z-[100] overflow-y-auto shadow-2xl"
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Filter size={20} className="text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">Filtres</h2>
                <p className="text-xs text-slate-400 font-medium">Affinez votre recherche</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X size={20} className="text-slate-400" />
            </button>
          </div>

          {/* Type Filters - Exclusive Selection */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection("type")}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group"
            >
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-700">Type de fichier</h3>
              <motion.div
                animate={{ rotate: expandedSections.type ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={16} className="text-slate-400 group-hover:text-primary" />
              </motion.div>
            </button>
            <AnimatePresence>
              {expandedSections.type && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 pl-2">
                    {allTypes.map((type) => {
                      const isChecked = filters.types.includes(type);
                      const typeInfo = typeLabels[type];
                      return (
                        <motion.label
                          key={type}
                          whileHover={{ x: 4, scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all group ${
                            isChecked
                              ? "bg-primary/10 border-2 border-primary shadow-lg"
                              : "bg-white border-2 border-slate-100 hover:border-primary/30 hover:bg-slate-50"
                          }`}
                        >
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleTypeToggle(type)}
                              className="sr-only"
                            />
                            <motion.div
                              animate={{
                                backgroundColor: isChecked ? "#FF6B00" : "#f1f5f9",
                                borderColor: isChecked ? "#FF6B00" : "#e2e8f0",
                                scale: isChecked ? 1.1 : 1,
                              }}
                              className="w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all"
                            >
                              {isChecked && (
                                <motion.div
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                >
                                  <Check size={16} className="text-white font-black" />
                                </motion.div>
                              )}
                            </motion.div>
                          </div>
                          <div className={`p-2 rounded-lg ${typeInfo.color} text-white`}>
                            {typeInfo.icon}
                          </div>
                          <span className={`text-sm font-black flex-1 transition-colors ${
                            isChecked ? "text-primary" : "text-slate-700 group-hover:text-primary"
                          }`}>
                            {typeInfo.label}
                          </span>
                          {isChecked && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 bg-primary rounded-full"
                            />
                          )}
                        </motion.label>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Price Filters */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection("price")}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group"
            >
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-700">Prix</h3>
              <motion.div
                animate={{ rotate: expandedSections.price ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={16} className="text-slate-400 group-hover:text-primary" />
              </motion.div>
            </button>
            <AnimatePresence>
              {expandedSections.price && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 pl-2">
                    <motion.label
                      whileHover={{ x: 4, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all group ${
                        filters.isFree === true
                          ? "bg-emerald-50 border-2 border-emerald-500 shadow-lg"
                          : "bg-white border-2 border-slate-100 hover:border-emerald-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={filters.isFree === true}
                          onChange={handleFreeToggle}
                          className="sr-only"
                        />
                        <motion.div
                          animate={{
                            backgroundColor: filters.isFree === true ? "#22c55e" : "#f1f5f9",
                            borderColor: filters.isFree === true ? "#22c55e" : "#e2e8f0",
                          }}
                          className="w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all"
                        >
                          {filters.isFree === true && (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            >
                              <Check size={16} className="text-white" />
                            </motion.div>
                          )}
                        </motion.div>
                      </div>
                      <div className="p-2 rounded-lg bg-emerald-500 text-white">
                        <Download size={18} />
                      </div>
                      <span className={`text-sm font-black flex-1 transition-colors ${
                        filters.isFree === true ? "text-emerald-600" : "text-slate-700 group-hover:text-emerald-600"
                      }`}>
                        Gratuit
                      </span>
                    </motion.label>

                    <motion.label
                      whileHover={{ x: 4, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all group ${
                        filters.isPremium === true
                          ? "bg-amber-50 border-2 border-amber-500 shadow-lg"
                          : "bg-white border-2 border-slate-100 hover:border-amber-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={filters.isPremium === true}
                          onChange={handlePremiumToggle}
                          className="sr-only"
                        />
                        <motion.div
                          animate={{
                            backgroundColor: filters.isPremium === true ? "#f59e0b" : "#f1f5f9",
                            borderColor: filters.isPremium === true ? "#f59e0b" : "#e2e8f0",
                          }}
                          className="w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all"
                        >
                          {filters.isPremium === true && (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            >
                              <Check size={16} className="text-white" />
                            </motion.div>
                          )}
                        </motion.div>
                      </div>
                      <div className="p-2 rounded-lg bg-amber-500 text-white">
                        <Crown size={18} />
                      </div>
                      <span className={`text-sm font-black flex-1 transition-colors ${
                        filters.isPremium === true ? "text-amber-600" : "text-slate-700 group-hover:text-amber-600"
                      }`}>
                        Payant
                      </span>
                    </motion.label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Category Filters */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection("category")}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group"
            >
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-700">Catégories</h3>
              <motion.div
                animate={{ rotate: expandedSections.category ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={16} className="text-slate-400 group-hover:text-primary" />
              </motion.div>
            </button>
            <AnimatePresence>
              {expandedSections.category && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-2 pl-2">
                    {allCategories.map((category) => {
                      const isChecked = filters.categories.includes(category);
                      const categoryInfo = categoryLabels[category];
                      return (
                        <motion.label
                          key={category}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`flex flex-col items-center gap-2 p-3 rounded-xl cursor-pointer transition-all border-2 ${
                            isChecked
                              ? "bg-primary/10 border-primary shadow-md"
                              : "bg-white border-slate-100 hover:border-primary/30"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleCategoryToggle(category)}
                            className="sr-only"
                          />
                          <div className={`p-2 rounded-lg ${isChecked ? "bg-primary text-white" : "bg-slate-100 text-slate-400"}`}>
                            {categoryInfo.icon}
                          </div>
                          <span className={`text-xs font-black text-center transition-colors ${
                            isChecked ? "text-primary" : "text-slate-600"
                          }`}>
                            {categoryInfo.label}
                          </span>
                        </motion.label>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Advanced Filters */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection("advanced")}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group"
            >
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-700">Filtres avancés</h3>
              <motion.div
                animate={{ rotate: expandedSections.advanced ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={16} className="text-slate-400 group-hover:text-primary" />
              </motion.div>
            </button>
            <AnimatePresence>
              {expandedSections.advanced && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden space-y-4 pl-2"
                >
                  {/* Orientation */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Orientation</h4>
                    <div className="flex gap-2">
                      {orientations.map((o) => (
                        <motion.button
                          key={o.value}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleOrientationChange(o.value)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                            filters.orientation === o.value
                              ? "bg-primary text-white shadow-md"
                              : "bg-white text-slate-600 border border-slate-200 hover:border-primary/30"
                          }`}
                        >
                          {o.icon}
                          {o.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Resolution */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Résolution minimale</h4>
                    <div className="space-y-1">
                      {resolutions.map((r) => (
                        <motion.button
                          key={r.value}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleResolutionChange(r.value)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                            filters.minResolution === r.value
                              ? "bg-primary text-white shadow-md"
                              : "bg-white text-slate-600 border border-slate-200 hover:border-primary/30"
                          }`}
                        >
                          {r.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() =>
                onFiltersChange({
                  types: [],
                  categories: [],
                  isFree: null,
                  isPremium: null,
                  orientation: undefined,
                  minResolution: undefined,
                })
              }
              className="w-full py-4 px-4 bg-gradient-to-r from-slate-100 to-slate-50 hover:from-slate-200 hover:to-slate-100 rounded-xl text-sm font-black uppercase tracking-widest text-slate-600 transition-all border-2 border-slate-200 hover:border-slate-300 shadow-sm"
            >
              Réinitialiser tous les filtres
            </motion.button>
          )}

          {/* Active Filters Count */}
          {hasActiveFilters && (
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Filtres actifs</span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-black">
                  {filters.types.length + filters.categories.length + (filters.isFree !== null ? 1 : 0) + (filters.isPremium !== null ? 1 : 0) + (filters.orientation ? 1 : 0) + (filters.minResolution ? 1 : 0)}
                </span>
              </div>
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
};

export default ExplorationSidebar;
