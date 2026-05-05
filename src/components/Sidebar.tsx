"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Filter, 
  X, 
  ChevronRight, 
  ChevronDown,
  Image as ImageIcon, 
  Video, 
  Box, 
  MousePointer2, 
  CreditCard, 
  CheckCircle2, 
  Layout, 
  Maximize, 
  Sparkles,
  Layers,
  CircleDollarSign
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [openSections, setOpenSections] = useState<string[]>(["Format d'Asset", "Licence"]);
  const [isEliteOnly, setIsEliteOnly] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const toggleSection = (title: string) => {
    setOpenSections(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const filterSections = [
    {
      title: "Format d'Asset",
      items: [
        { label: "Vecteurs", icon: <MousePointer2 size={16} /> },
        { label: "Photos", icon: <ImageIcon size={16} /> },
        { label: "Vidéos", icon: <Video size={16} /> },
        { label: "Fichiers PSD", icon: <Layers size={16} /> },
        { label: "Modèles 3D", icon: <Box size={16} /> }
      ]
    },
    {
      title: "Orientation",
      items: [
        { label: "Paysage", icon: <Layout className="rotate-90" size={16} /> },
        { label: "Portrait", icon: <Layout size={16} /> },
        { label: "Carré", icon: <Maximize size={16} /> },
        { label: "Panoramique", icon: <Maximize className="scale-x-150" size={16} /> }
      ]
    },
    {
      title: "Prix",
      isPrice: true,
      items: []
    },
    {
      title: "Licence & Usage",
      items: [
        { label: "Gratuit", icon: <CheckCircle2 size={16} /> },
        { label: "Premium / Elite", icon: <Sparkles size={16} /> },
        { label: "Éditorial", icon: <CreditCard size={16} /> }
      ]
    }
  ];

  const sidebarContent = (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md cursor-pointer"
            style={{ zIndex: 99998 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="fixed top-0 right-0 h-full w-[400px] max-w-[90vw] bg-white shadow-[0_0_100px_rgba(0,0,0,0.2)] overflow-y-auto"
            style={{ zIndex: 99999 }}
          >
        <div className="p-10 flex flex-col min-h-full relative" style={{ zIndex: 99999 }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="flex items-center justify-between mb-12"
          >
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary glow-primary"
              >
                <Filter size={20} />
              </motion.div>
              <h2 className="text-xl font-black tracking-tighter text-slate-900">
                Filtres <span className="text-primary italic">pro</span>
              </h2>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-3 hover:bg-slate-50 rounded-2xl transition-all group"
            >
              <X size={20} className="text-slate-400 group-hover:text-slate-900" />
            </motion.button>
          </motion.div>

          {/* ELITE TOGGLE - Premium Aesthetic with Enhanced Glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-12 p-1.5 bg-slate-50 rounded-[2.2rem] border border-slate-100 flex items-center relative overflow-hidden"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsEliteOnly(false)}
              className={`flex-1 py-4 text-[10px] font-black tracking-[0.2em] relative z-10 transition-colors duration-500 ${!isEliteOnly ? "text-white" : "text-slate-400 hover:text-slate-600"}`}
            >
              Tous
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsEliteOnly(true)}
              className={`flex-1 py-4 text-[10px] font-black tracking-[0.2em] relative z-10 transition-colors duration-500 flex items-center justify-center gap-2 ${isEliteOnly ? "text-white" : "text-slate-400 hover:text-slate-600"}`}
            >
              {isEliteOnly && (
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles size={12} className="animate-pulse" />
                </motion.div>
              )}
              Elite
            </motion.button>
            <motion.div
              layout
              className="absolute inset-y-1.5 w-[calc(50%-6px)] rounded-[1.8rem] shadow-xl"
              initial={false}
              animate={{
                x: isEliteOnly ? "100%" : "0%",
                background: isEliteOnly
                  ? "linear-gradient(to right, #FF6B00, #FFB800)"
                  : "#0f172a",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
            {isEliteOnly && (
              <motion.div
                className="absolute inset-y-1.5 w-[calc(50%-6px)] rounded-[1.8rem] right-[3px] glow-primary-strong"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            )}
          </motion.div>

          <motion.div
            initial="closed"
            animate="open"
            variants={{
              open: {
                transition: { staggerChildren: 0.1, delayChildren: 0.3 },
              },
            }}
            className="space-y-8"
          >
            {filterSections.map((section, sectionIndex) => {
              const isOpen = openSections.includes(section.title);
              return (
                <motion.div
                  key={section.title}
                  variants={{
                    closed: { opacity: 0, y: 20 },
                    open: { opacity: 1, y: 0 },
                  }}
                  className="space-y-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleSection(section.title)}
                    className="w-full flex items-center justify-between px-2 group relative"
                  >
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-800 group-hover:text-primary transition-colors relative z-10">
                      {section.title}
                    </h3>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="text-slate-400 group-hover:text-primary transition-colors relative z-10"
                    >
                      <ChevronDown size={14} />
                    </motion.div>
                    {isOpen && (
                      <motion.div
                        layoutId={`section-${section.title}`}
                        className="absolute inset-0 bg-primary/5 rounded-xl"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0, y: -10 }}
                        animate={{ height: "auto", opacity: 1, y: 0 }}
                        exit={{ height: 0, opacity: 0, y: -10 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                        className="overflow-hidden"
                      >
                        {section.isPrice ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="px-4 py-4 space-y-6"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-slate-500">$0</span>
                              <span className="text-[10px] font-black text-primary">$1500+</span>
                            </div>
                            <div className="h-1 bg-slate-100 rounded-full relative">
                              <motion.div
                                className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-primary/50 to-primary rounded-full shadow-[0_0_10px_rgba(255,107,0,0.3)] glow-primary"
                                initial={{ width: 0 }}
                                animate={{ width: "66.66%" }}
                                transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                              />
                              <motion.div
                                drag="x"
                                dragConstraints={{ left: 0, right: 200 }}
                                className="absolute top-1/2 left-2/3 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full shadow-lg cursor-pointer glow-primary"
                                whileHover={{ scale: 1.3 }}
                                whileTap={{ scale: 1.1 }}
                                animate={{
                                  boxShadow: [
                                    "0 0 0px rgba(255, 127, 0, 0.4)",
                                    "0 0 10px rgba(255, 127, 0, 0.6)",
                                    "0 0 0px rgba(255, 127, 0, 0.4)",
                                  ],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                }}
                              />
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            initial="closed"
                            animate="open"
                            variants={{
                              open: {
                                transition: { staggerChildren: 0.05 },
                              },
                            }}
                            className="space-y-1 px-1"
                          >
                            {section.items.map((item: any, itemIndex: number) => (
                              <motion.button
                                key={item.label}
                                variants={{
                                  closed: { opacity: 0, x: -10 },
                                  open: { opacity: 1, x: 0 },
                                }}
                                whileHover={{ scale: 1.02, x: 5 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full flex items-center justify-between group transition-all duration-300 px-4 py-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 relative overflow-hidden"
                              >
                                {isOpen && (
                                  <motion.div
                                    className="absolute inset-0 bg-primary/5 rounded-2xl"
                                    initial={{ x: "-100%" }}
                                    animate={{ x: "0%" }}
                                    transition={{ delay: itemIndex * 0.05, duration: 0.3 }}
                                  />
                                )}
                                <div className="flex items-center gap-4 relative z-10">
                                  <motion.span
                                    whileHover={{ rotate: 15, scale: 1.2 }}
                                    className="text-slate-600 group-hover:text-primary transition-colors"
                                  >
                                    {item.icon}
                                  </motion.span>
                                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-900 group-hover:text-slate-900 transition-colors">
                                    {item.label}
                                  </span>
                                </div>
                                <motion.div
                                  initial={{ opacity: 0, x: -10 }}
                                  whileHover={{ opacity: 1, x: 0 }}
                                  className="relative z-10"
                                >
                                  <ChevronRight size={12} className="text-primary" />
                                </motion.div>
                              </motion.button>
                            ))}
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            className="mt-auto pt-12 space-y-4"
          >
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-5 bg-slate-900 text-white rounded-[1.8rem] font-black text-[10px] hover:bg-primary transition-all shadow-2xl shadow-slate-200 hover:shadow-primary/30 uppercase tracking-[0.2em] duration-300 flex items-center justify-center gap-3 glow-primary"
            >
              Appliquer les Filtres
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 text-[9px] font-black uppercase tracking-widest text-slate-300 hover:text-primary transition-colors"
            >
              Effacer tout
            </motion.button>
          </motion.div>
        </div>
      </motion.aside>
        )}
      </AnimatePresence>
    </>
  );

  if (!mounted) return null;

  return createPortal(sidebarContent, document.body);
};

export default Sidebar;
