"use client";

import React from "react";
import { motion } from "framer-motion";
import { Layout, Maximize, Calendar, Palette, X } from "lucide-react";

export type Orientation = "landscape" | "portrait" | "square" | "panoramic" | null;
export type Resolution = "all" | "hd" | "4k" | "8k";
export type AspectRatio = "all" | "16:9" | "4:3" | "3:2" | "1:1" | "21:9";
export type DateRange = "all" | "today" | "week" | "month" | "year";

interface AdvancedFiltersProps {
  orientation: Orientation;
  onOrientationChange: (orientation: Orientation) => void;
  resolution: Resolution;
  onResolutionChange: (resolution: Resolution) => void;
  aspectRatio: AspectRatio;
  onAspectRatioChange: (ratio: AspectRatio) => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  onClear: () => void;
  className?: string;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  orientation,
  onOrientationChange,
  resolution,
  onResolutionChange,
  aspectRatio,
  onAspectRatioChange,
  dateRange,
  onDateRangeChange,
  onClear,
  className = "",
}) => {
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

  const dateRanges: { value: DateRange; label: string }[] = [
    { value: "all", label: "Toutes" },
    { value: "today", label: "Aujourd'hui" },
    { value: "week", label: "Cette semaine" },
    { value: "month", label: "Ce mois" },
    { value: "year", label: "Cette année" },
  ];

  const hasActiveFilters = orientation || resolution !== "all" || aspectRatio !== "all" || dateRange !== "all";

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Filtres Avancés</h3>
        {hasActiveFilters && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClear}
            className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-500 transition-colors"
          >
            <X size={10} /> Effacer
          </motion.button>
        )}
      </div>

      {/* Orientation Filter */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <Layout size={12} />
          Orientation
        </div>
        <div className="flex flex-wrap gap-2">
          {orientations.map((o) => (
            <motion.button
              key={o.value || "null"}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onOrientationChange(orientation === o.value ? null : o.value)}
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
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <Maximize size={12} />
          Résolution
        </div>
        <div className="flex flex-wrap gap-2">
          {resolutions.map((r) => (
            <motion.button
              key={r.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onResolutionChange(r.value)}
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
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <Maximize size={12} />
          Ratio
        </div>
        <div className="flex flex-wrap gap-2">
          {ratios.map((r) => (
            <motion.button
              key={r.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onAspectRatioChange(r.value)}
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

      {/* Date Range Filter */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <Calendar size={12} />
          Date
        </div>
        <div className="flex flex-wrap gap-2">
          {dateRanges.map((d) => (
            <motion.button
              key={d.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDateRangeChange(d.value)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                dateRange === d.value
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-primary/30"
              }`}
            >
              {d.label}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;
