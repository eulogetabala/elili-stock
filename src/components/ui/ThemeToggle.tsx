"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import Magnetic from "@/components/ui/Magnetic";

type ThemeToggleProps = {
  /** Bouton conçu pour une barre claire (navbar blanche) */
  variant?: "default" | "onLight";
};

export default function ThemeToggle({ variant = "default" }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();

  const surface =
    variant === "onLight"
      ? "bg-slate-100 hover:bg-slate-200/90 border-slate-200 text-slate-600 hover:text-slate-900"
      : "bg-white/5 hover:bg-white/10 border-white/10 text-white/70 hover:text-white";

  return (
    <Magnetic strength={0.1}>
      <motion.button
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleTheme}
        className={`p-2.5 rounded-xl border transition-all relative overflow-hidden ${surface}`}
        aria-label="Toggle theme"
      >
        <motion.div
          initial={false}
          animate={{
            rotate: resolvedTheme === "dark" ? 0 : 180,
            scale: resolvedTheme === "dark" ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Moon size={18} />
        </motion.div>
        <motion.div
          initial={false}
          animate={{
            rotate: resolvedTheme === "light" ? 0 : -180,
            scale: resolvedTheme === "light" ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Sun size={18} />
        </motion.div>
      </motion.button>
    </Magnetic>
  );
}
