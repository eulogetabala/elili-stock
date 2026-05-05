"use client";

import React, { useState, useRef } from "react";
import { motion, useMotionValue, useAnimation } from "framer-motion";
import { 
  Trees, 
  Building2, 
  Cpu, 
  UserSquare2, 
  Sparkles, 
  Palmtree, 
  Briefcase, 
  Bird 
} from "lucide-react";
import Magnetic from "@/components/ui/Magnetic";

const CATEGORIES = [
  { name: "Nature", icon: Trees },
  { name: "Urbain", icon: Building2 },
  { name: "Technologie", icon: Cpu },
  { name: "Portrait", icon: UserSquare2 },
  { name: "Abstrait", icon: Sparkles },
  { name: "Culture", icon: Palmtree },
  { name: "Business", icon: Briefcase },
  { name: "Faune", icon: Bird },
];

// Duplicate categories for seamless loop
const DUPLICATED_CATEGORIES = [...CATEGORIES, ...CATEGORIES];

const CategoryBar = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  // Infinite scroll animation
  React.useEffect(() => {
    if (!isPaused) {
      controls.start({
        x: ["0%", "-50%"],
        transition: {
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        },
      });
    } else {
      controls.stop();
    }
  }, [isPaused, controls]);

  const handleClick = (categoryName: string) => {
    setActiveCategory(categoryName);
  };

  return (
    <div className="relative z-40 mt-4 mb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="glass-morphism-dark-strong bg-black/40 rounded-[2.4rem] p-4 md:p-5 overflow-hidden shadow-2xl border border-white/10 relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Marquee Container */}
          <div className="relative overflow-hidden">
            <motion.div
              ref={marqueeRef}
              animate={controls}
              className="flex items-center gap-6 md:gap-8"
              style={{ width: "fit-content" }}
            >
              {DUPLICATED_CATEGORIES.map((cat, index) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.name;
                const uniqueKey = `${cat.name}-${index}`;
                
                return (
                  <Magnetic key={uniqueKey} strength={0.1}>
                    <motion.button
                      whileHover={{ scale: 1.08, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleClick(cat.name)}
                      className={`relative flex items-center gap-3 px-6 md:px-8 py-4 md:py-5 rounded-[1.8rem] whitespace-nowrap group transition-all ${
                        isActive ? "text-white" : "text-white/60 hover:text-white/90"
                      }`}
                    >
                      {/* Active Underline */}
                      {isActive && (
                        <motion.div
                          layoutId="activeCategoryMarquee"
                          className="absolute left-4 right-4 bottom-2 h-[2.5px] bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"
                          initial={false}
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}

                      {/* Icon with subtle animation */}
                      <motion.div
                        animate={isActive ? { rotate: [0, 10, -10, 0], scale: 1.1 } : { rotate: 0, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className={`relative z-10 ${
                          isActive ? "text-primary" : "text-white/50 group-hover:text-primary/80"
                        } transition-colors`}
                      >
                        <Icon size={20} />
                      </motion.div>

                      {/* Text */}
                      <motion.span
                        className={`relative z-10 text-[12px] md:text-[13px] font-black uppercase tracking-[0.2em] transition-colors ${
                          isActive 
                            ? "text-white" 
                            : "text-white/70 group-hover:text-white"
                        }`}
                        animate={isActive ? { scale: 1.05 } : { scale: 1 }}
                      >
                        {cat.name}
                      </motion.span>

                      {/* Subtle glow on active */}
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 rounded-[1.8rem] bg-primary/5 blur-sm"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </motion.button>
                  </Magnetic>
                );
              })}
            </motion.div>
          </div>

          {/* Gradient Fade Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black/40 to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black/40 to-transparent pointer-events-none z-10" />
        </motion.div>
      </div>
    </div>
  );
};

export default CategoryBar;
