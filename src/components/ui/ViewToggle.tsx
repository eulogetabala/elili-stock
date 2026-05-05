"use client";

import React from "react";
import { motion } from "framer-motion";
import { Grid3X3, List } from "lucide-react";

export type ViewMode = "grid" | "list";

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  className?: string;
}

const ViewToggle: React.FC<ViewToggleProps> = ({
  viewMode,
  onViewModeChange,
  className = "",
}) => {
  return (
    <div className={`flex items-center gap-2 bg-slate-50 rounded-xl p-1 border border-slate-100 ${className}`}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onViewModeChange("grid")}
        className={`relative flex items-center justify-center w-10 h-10 rounded-lg transition-all ${
          viewMode === "grid"
            ? "bg-primary text-white shadow-md shadow-primary/20"
            : "text-slate-400 hover:text-slate-600"
        }`}
      >
        <Grid3X3 size={16} />
        {viewMode === "grid" && (
          <motion.div
            layoutId="viewToggle"
            className="absolute inset-0 bg-primary rounded-lg"
            initial={false}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onViewModeChange("list")}
        className={`relative flex items-center justify-center w-10 h-10 rounded-lg transition-all ${
          viewMode === "list"
            ? "bg-primary text-white shadow-md shadow-primary/20"
            : "text-slate-400 hover:text-slate-600"
        }`}
      >
        <List size={16} />
        {viewMode === "list" && (
          <motion.div
            layoutId="viewToggle"
            className="absolute inset-0 bg-primary rounded-lg"
            initial={false}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
      </motion.button>
    </div>
  );
};

export default ViewToggle;
