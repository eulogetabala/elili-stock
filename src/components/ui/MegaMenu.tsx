"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Image as ImageIcon, Video, MousePointer2, Layers, Sparkles, TrendingUp } from "lucide-react";
import { AssetCategory } from "@/types/asset";

interface SubCategory {
  name: string;
  href: string;
  count?: number;
  trending?: boolean;
}

interface MegaMenuSection {
  title: string;
  items: SubCategory[];
}

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  sections: MegaMenuSection[];
  featuredImage?: string;
  featuredTitle?: string;
  featuredHref?: string;
  className?: string;
}

const MegaMenu: React.FC<MegaMenuProps> = ({
  isOpen,
  onClose,
  sections,
  featuredImage,
  featuredTitle,
  featuredHref,
  className = "",
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] pointer-events-none"
          />
          
          {/* Mega Menu */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className={`absolute top-full ${className || "left-0"} mt-2 w-[900px] max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[70]`}
            onMouseLeave={onClose}
          >
            <div className={featuredImage ? "grid grid-cols-12 gap-0" : ""}>
              {/* Main Content */}
              <div className={featuredImage ? "col-span-8 p-8" : "p-8"}>
                <div className="grid grid-cols-2 gap-8">
                  {sections.map((section, sectionIdx) => (
                    <div key={sectionIdx} className="space-y-4">
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
                        {section.title}
                      </h3>
                      <ul className="space-y-2">
                        {section.items.map((item, itemIdx) => (
                          <li key={itemIdx}>
                            <Link
                              href={item.href}
                              className="group flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors"
                              onClick={onClose}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors">
                                  {item.name}
                                </span>
                                {item.trending && (
                                  <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[9px] font-black rounded">
                                    HOT
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {item.count !== undefined && (
                                  <span className="text-xs text-slate-400 font-bold">
                                    {item.count}
                                  </span>
                                )}
                                <ChevronRight size={14} className="text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured Section */}
              {featuredImage && (
                <div className="col-span-4 relative overflow-hidden bg-slate-50">
                  {featuredHref ? (
                    <Link href={featuredHref} onClick={onClose}>
                      <div className="relative h-full">
                        <Image
                          src={featuredImage}
                          alt={featuredTitle || "Featured"}
                          fill
                          className="object-cover"
                          sizes="300px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                          <h4 className="text-white font-black text-lg mb-2">{featuredTitle}</h4>
                          <span className="text-xs text-white/80 font-bold uppercase tracking-widest">
                            Découvrir →
                          </span>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="relative h-full">
                      <Image
                        src={featuredImage}
                        alt={featuredTitle || "Featured"}
                        fill
                        className="object-cover"
                        sizes="300px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                        <h4 className="text-white font-black text-lg mb-2">{featuredTitle}</h4>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MegaMenu;
