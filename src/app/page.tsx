"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategoryBar from "@/components/CategoryBar";
import AssetCard from "@/components/AssetCard";
import AssetPreviewModal from "@/components/AssetPreviewModal";
import PurchaseModal from "@/components/PurchaseModal";
import ExplorationSidebar from "@/components/ui/ExplorationSidebar";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Magnetic from "@/components/ui/Magnetic";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { ArrowRight, Sparkles, Filter as FilterIcon, Users, Globe, Award, Mail, Send, CheckCircle2, Crown, Download, Video, Music, Image as ImageIcon, FileText, ChevronDown, Play, FileCheck, MousePointer2, Instagram, Facebook, Linkedin } from "lucide-react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { Asset, LicenseType, AssetCategory, AssetType } from "@/types/asset";
import { MOCK_ASSETS } from "@/lib/mock-data";

const RESOURCE_HUB = [
  {
    href: "/photos",
    title: "Images",
    description:
      "Accédez à plus de 70 millions de photos, images vectorielles et illustrations libres de droits, d'une qualité inégalée.",
    icon: ImageIcon,
    accent: "from-amber-500/25 via-orange-500/10 to-transparent",
    ring: "group-hover:ring-amber-500/30",
  },
  {
    href: "/videos",
    title: "Vidéos",
    description:
      "Découvrez plus de 12 millions de clips 4K, HD et SD, libres de droits et de qualité cinématographique, pour les films, la télévision, les publicités, etc.",
    icon: Video,
    accent: "from-violet-500/25 via-fuchsia-500/10 to-transparent",
    ring: "group-hover:ring-violet-500/30",
  },
  {
    href: "/vectors",
    title: "Vecteurs",
    description:
      "SVG, EPS, PDF, fichiers PSD, projets Adobe Illustrator (AI) et autres sources vectorielles — tout pour le print, le digital et l'identité visuelle.",
    icon: MousePointer2,
    accent: "from-sky-500/25 via-cyan-500/10 to-transparent",
    ring: "group-hover:ring-sky-500/30",
  },
] as const;

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [displayCount, setDisplayCount] = useState(12);
  const { scrollYProgress } = useScroll();
  
  // Filters state
  const [filters, setFilters] = useState<{
    types: AssetType[];
    categories: AssetCategory[];
    isFree: boolean | null;
    isPremium: boolean | null;
    orientation?: string;
    minResolution?: string;
  }>({
    types: [],
    categories: [],
    isFree: null,
    isPremium: null,
    orientation: undefined,
    minResolution: undefined,
  });
  
  // Modals
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);
  const [purchaseAsset, setPurchaseAsset] = useState<Asset | null>(null);

  // Filtered assets based on filters
  const filteredAssets = useMemo(() => {
    let result = MOCK_ASSETS;

    // Filter by type (exclusive: if one type is selected, show only that type)
    if (filters.types.length > 0) {
      result = result.filter((a) => filters.types.includes(a.type));
    }

    // Filter by category
    if (filters.categories.length > 0) {
      result = result.filter((a) => filters.categories.includes(a.category));
    }

    // Filter by price
    if (filters.isFree === true) {
      result = result.filter((a) => a.isFree);
    } else if (filters.isPremium === true) {
      result = result.filter((a) => !a.isFree);
    }

    // Filter by orientation
    if (filters.orientation) {
      result = result.filter((a) => {
        const { width, height } = a.technicalMetadata || {};
        if (!width || !height) return false;
        
        const aspectRatio = width / height;
        if (filters.orientation === "landscape") return aspectRatio > 1;
        if (filters.orientation === "portrait") return aspectRatio < 1;
        if (filters.orientation === "square") return Math.abs(aspectRatio - 1) < 0.1;
        return true;
      });
    }

    // Filter by minimum resolution
    if (filters.minResolution) {
      const minWidth = parseInt(filters.minResolution);
      result = result.filter((a) => {
        const { width } = a.technicalMetadata || {};
        return width && width >= minWidth;
      });
    }

    return result;
  }, [filters]);

  const displayedAssets = useMemo(() => {
    return filteredAssets.slice(0, displayCount);
  }, [filteredAssets, displayCount]);

  const handleLoadMore = useCallback(() => {
    setDisplayCount((prev) => Math.min(prev + 6, filteredAssets.length));
  }, [filteredAssets.length]);

  const handlePreviewNavigate = useCallback((direction: "prev" | "next") => {
    if (!previewAsset) return;
    const index = displayedAssets.findIndex((a) => a._id === previewAsset._id);
    if (direction === "prev" && index > 0) {
      setPreviewAsset(displayedAssets[index - 1]);
    } else if (direction === "next" && index < displayedAssets.length - 1) {
      setPreviewAsset(displayedAssets[index + 1]);
    }
  }, [previewAsset, displayedAssets]);
  
  // Parallax effects for different sections
  const statsY = useTransform(scrollYProgress, [0.3, 0.7], [0, -100]);
  const collectionsY = useTransform(scrollYProgress, [0.5, 0.9], [0, -80]);
  
  // Count-up animation for stats
  const [stats, setStats] = useState([
    { label: "Assets Elite", value: 0, target: 2400000, sub: "+50k / mois", suffix: "" },
    { label: "Artistes Pro", value: 0, target: 15000, sub: "Curatés", suffix: "K" },
    { label: "Pays", value: 0, target: 54, sub: "Pan-Afrique", suffix: "" },
    { label: "Clients", value: 0, target: 120000, sub: "Monde", suffix: "K" },
  ]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            stats.forEach((stat, index) => {
              const duration = 2000;
              const steps = 60;
              const increment = stat.target / steps;
              let current = 0;
              
              const timer = setInterval(() => {
                current += increment;
                if (current >= stat.target) {
                  current = stat.target;
                  clearInterval(timer);
                }
                setStats((prev) => {
                  const newStats = [...prev];
                  newStats[index].value = Math.floor(current);
                  return newStats;
                });
              }, duration / steps);
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    const statsElement = document.getElementById("stats-section");
    if (statsElement) observer.observe(statsElement);

    return () => observer.disconnect();
  }, []);

  const formatNumber = (num: number, suffix: string) => {
    if (suffix === "K") {
      return num >= 1000 ? `${(num / 1000).toFixed(0)}${suffix}` : num.toString();
    }
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`;
    }
    return num.toString();
  };

  return (
    <main className="flex min-h-screen flex-col bg-white text-slate-900">
      <Navbar />
      <Hero />

      {/* Exploration Sidebar */}
      <ExplorationSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Main Content Area */}
      <div className={`max-w-[1440px] mx-auto w-full px-6 flex flex-col gap-10 py-16 relative z-10 transition-all duration-300 ${isSidebarOpen ? "lg:ml-80" : ""}`}>
        <div className="flex-1 space-y-12">
          {/* Section Header - Elite Minimalist with Scroll Reveal */}
          <ScrollReveal direction="up" delay={0.2}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 pb-16">
            <div className="space-y-6 max-w-2xl">
              <div className="flex items-center gap-3 text-primary font-black tracking-[0.4em] uppercase text-[10px]">
                <div className="w-8 h-[1px] bg-primary/30" />
                  <span>Exploration</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 leading-[1.1] font-syne">
                Ressources <br/><span className="text-gradient-orange italic">artistiques</span>
              </h2>
            </div>
            
              {/* Filter Toggle Button */}
              <Magnetic strength={0.15}>
                <AnimatedButton
                  variant="outline"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="flex items-center gap-3 relative z-10"
               >
                 <FilterIcon size={16} className="text-primary" />
                  Filtres
                </AnimatedButton>
              </Magnetic>
            </div>
          </ScrollReveal>

          {/* Hub — Images · Vidéos · Vecteurs (gratuit & premium) */}
          <ScrollReveal direction="up" delay={0.15}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {RESOURCE_HUB.map((item, index) => {
                const HubIcon = item.icon;
                return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, type: "spring", stiffness: 120, damping: 18 }}
                >
                  <Link
                    href={item.href}
                    className={`group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200/60 ring-1 ring-transparent ${item.ring}`}
                  >
                    <div
                      className={`pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-gradient-to-br ${item.accent} blur-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-70`}
                      aria-hidden
                    />
                    <div className="relative flex flex-1 flex-col gap-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                          <HubIcon size={26} strokeWidth={1.75} />
                        </div>
                        <span className="rounded-full border border-slate-100 bg-slate-50/80 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                          Gratuit &amp; premium
                        </span>
                      </div>
                      <div className="space-y-3">
                        <h3 className="font-syne text-2xl font-black tracking-tight text-slate-900 md:text-[1.65rem]">
                          {item.title}
                        </h3>
                        <p className="text-sm font-medium leading-relaxed text-slate-500 md:text-[0.9375rem]">
                          {item.description}
                        </p>
                      </div>
                      <div className="mt-auto flex items-center gap-2 pt-4 text-[10px] font-black uppercase tracking-[0.35em] text-primary">
                        Explorer
                        <ArrowRight
                          size={14}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                          aria-hidden
                        />
                      </div>
                    </div>
                  </Link>
                </motion.div>
                );
              })}
            </div>
          </ScrollReveal>

          {/* Asset Grid - Reduced Size Layout */}
          <motion.div 
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.05
                }
              }
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          >
            {displayedAssets.map((asset) => (
              <AssetCard
                key={asset._id}
                asset={asset}
                onClick={() => setPreviewAsset(asset)}
                size="compact"
              />
            ))}
          </motion.div>

          {/* Load More Button - Animated with Magnetic */}
          {displayCount < filteredAssets.length && (
            <ScrollReveal direction="up" delay={0.3}>
              <div className="flex justify-center pt-12">
                <Magnetic strength={0.1}>
                  <AnimatedButton
                    variant="outline"
                    size="lg"
                    glow
                    className="px-16 py-6"
                    onClick={handleLoadMore}
                  >
                    Afficher plus de pépites
                  </AnimatedButton>
                </Magnetic>
          </div>
            </ScrollReveal>
          )}
        </div>
      </div>

      {/* Section Impact Visionnaire - Haute Couture Stats with Parallax */}
      <motion.section 
        id="stats-section"
        style={{ y: statsY }}
        className="py-40 relative overflow-hidden bg-white"
      >
        {/* Infinite Marquee - Background Layer */}
        <div className="absolute top-20 left-0 w-full overflow-hidden whitespace-nowrap opacity-[0.03] select-none pointer-events-none">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            className="flex gap-20 text-[20vw] font-black uppercase tracking-tighter"
          >
            <span>Elili Stock</span>
            <span>Elili Stock</span>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <ScrollReveal direction="right" delay={0.2}>
            <div className="space-y-12">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-primary font-black tracking-[0.4em] uppercase text-[10px]">
                  <div className="w-8 h-[1px] bg-primary/30" />
                  <span>Impact Pro 2026</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 leading-[1.1] font-syne">
                  La force du <br/> <span className="text-gradient-orange italic">nombre</span>
                </h2>
              </div>
              <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-md">
                Elili Stock n&apos;est pas qu&apos;une banque d&apos;images : c&apos;est une vitrine du talent visuel et des créateurs. Nos chiffres parlent d&apos;excellence.
              </p>
              
              <div className="pt-8 flex flex-wrap gap-4">
                  <Magnetic strength={0.15}>
                    <AnimatedButton variant="primary" size="lg" glow>
                      Souscrire à un abonnement
                    </AnimatedButton>
                  </Magnetic>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="px-8 py-5 border border-slate-100 rounded-2xl flex items-center gap-4"
                  >
                    <div className="flex -space-x-3">
                      {[1,2,3,4].map((i, idx) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.1 }}
                          className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden"
                        >
                          <img src={`https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&h=100&fit=crop&crop=faces&sig=${i}`} alt="user" />
                        </motion.div>
                       ))}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">+15k membres</span>
                  </motion.div>
                 </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="left" delay={0.3}>
            <div className="grid grid-cols-2 gap-8 md:gap-12">
                {stats.map((stat, i) => (
                <motion.div 
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                    transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                  className="space-y-2 group"
                >
                    <motion.div
                      className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter group-hover:text-primary transition-colors duration-500"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                    >
                      {formatNumber(stat.value, stat.suffix)}
                    </motion.div>
                    <motion.div
                      className="h-1 bg-slate-100 rounded-full overflow-hidden"
                      initial={{ width: 48 }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + 0.3, duration: 0.7 }}
                    >
                      <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 + 0.5, duration: 0.5 }}
                      />
                    </motion.div>
                  <div className="pt-2">
                    <div className="text-[11px] font-black text-slate-900 uppercase tracking-widest leading-none">{stat.label}</div>
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">{stat.sub}</div>
                  </div>
                </motion.div>
              ))}
            </div>
            </ScrollReveal>
          </div>
        </div>
      </motion.section>

      {/* Section Collections Thématiques - Gallery Vogue with Parallax */}
      <motion.section 
        style={{ y: collectionsY }}
        className="py-40 bg-black relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[180px] rounded-full pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-24">
            <div className="space-y-6">
              <span className="text-primary font-black tracking-[0.5em] text-[10px] font-syne uppercase">Collections Thématiques</span>
              <h2 className="text-5xl md:text-6xl font-black text-white leading-[1.1] tracking-tighter font-syne">
                Séries <br/> <span className="text-gradient-orange italic">curatées</span>
              </h2>
              <p className="text-white/40 text-base font-medium max-w-xl font-outfit leading-relaxed">
                Découvrez nos collections organisées par thème. Des séries complètes d&apos;assets pour vos projets créatifs.
              </p>
            </div>
            <Magnetic strength={0.15}>
              <Link href="/explorer">
                <AnimatedButton
                  variant="secondary"
                  size="lg"
                  glow
                  className="px-14 py-6"
                >
                  Explorer toutes les collections
                </AnimatedButton>
              </Link>
            </Magnetic>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Collection principale - Safari & Nature */}
            <div className="lg:col-span-7 group relative aspect-[16/10] rounded-[3.5rem] overflow-hidden border border-white/10 shadow-3xl cursor-pointer">
              <Link href="/search?category=nature">
                <div className="relative w-full h-full">
                  <Image
                    src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=1200"
                    alt="Safari & Nature"
                    fill
                    className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                    sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-12">
                 <div className="glass-morphism-dark p-12 rounded-[2.5rem] border border-white/5 backdrop-blur-3xl max-w-md">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="px-3 py-1.5 bg-primary/20 border border-primary/30 rounded-lg">
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                            {MOCK_ASSETS.filter((a) => a.category === AssetCategory.NATURE).length} Assets
                          </span>
                        </div>
                      </div>
                      <h3 className="text-2xl font-black text-white mb-3 font-syne">Safari & Nature</h3>
                    <p className="text-white/40 text-sm font-medium mb-6 leading-relaxed font-outfit">
                        Une immersion dans les paysages majestueux et la faune sauvage de l&apos;Afrique. Des safaris aux cascades, explorez la nature dans toute sa splendeur.
                    </p>
                    <div className="flex items-center gap-4 text-white font-black uppercase tracking-widest text-[10px] font-syne group-hover:gap-6 transition-all">
                        Voir la collection <ArrowRight size={16} className="text-primary" />
                      </div>
                    </div>
                 </div>
              </div>
              </Link>
            </div>

            {/* Collections secondaires */}
            <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8">
              {/* Collection Culture */}
              <Link href="/search?category=culture">
                <div className="group cursor-pointer flex gap-8 items-center bg-white/5 p-6 rounded-[2.5rem] border border-white/5 hover:border-primary/30 transition-all duration-500">
                  <div className="w-32 h-32 rounded-3xl overflow-hidden flex-shrink-0 border border-white/10 relative">
                    <Image
                      src="https://images.unsplash.com/photo-1582562124811-c09040d0a901?q=80&w=600"
                      alt="Culture & Traditions"
                      fill
                      className="object-cover group-hover:scale-125 transition-transform duration-1000"
                      sizes="128px"
                    />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-black text-white text-xl font-syne tracking-tight group-hover:text-primary transition-colors">
                      Culture & Traditions
                    </h4>
                    <p className="text-[10px] text-white/30 font-medium font-outfit leading-relaxed max-w-[150px]">
                      Art, musique, danse et patrimoine africain.
                    </p>
                    <div className="text-[9px] text-primary font-black uppercase tracking-widest pt-2 font-syne">
                      {MOCK_ASSETS.filter((a) => a.category === AssetCategory.CULTURE).length} Assets
                    </div>
                  </div>
                </div>
              </Link>

              {/* Collection Architecture */}
              <Link href="/search?category=architecture">
                <div className="group cursor-pointer flex gap-8 items-center bg-white/5 p-6 rounded-[2.5rem] border border-white/5 hover:border-primary/30 transition-all duration-500">
                  <div className="w-32 h-32 rounded-3xl overflow-hidden flex-shrink-0 border border-white/10 relative">
                    <Image
                      src="https://images.unsplash.com/photo-1523805009345-7448845a9e53?q=80&w=600"
                      alt="Villes & Architecture"
                      fill
                      className="object-cover group-hover:scale-125 transition-transform duration-1000"
                      sizes="128px"
                    />
                   </div>
                   <div className="space-y-2">
                    <h4 className="font-black text-white text-xl font-syne tracking-tight group-hover:text-primary transition-colors">
                      Villes & Architecture
                    </h4>
                    <p className="text-[10px] text-white/30 font-medium font-outfit leading-relaxed max-w-[150px]">
                      Skylines modernes et bâtiments emblématiques.
                    </p>
                    <div className="text-[9px] text-primary font-black uppercase tracking-widest pt-2 font-syne">
                      {MOCK_ASSETS.filter((a) => a.category === AssetCategory.ARCHITECTURE).length} Assets
                    </div>
                   </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Section Creators Spotlight - Editorial Layout with Scroll Reveal */}
      <section className="py-40 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal direction="up" delay={0.2}>
          <div className="flex flex-col items-center text-center gap-8 mb-32 max-w-3xl mx-auto">
            <span className="text-primary font-black uppercase tracking-[0.5em] text-[10px] font-syne">Portraits d'artistes</span>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 leading-[1.1] font-syne">
              Le talent à <br/><span className="text-gradient-orange italic">l'état pur</span>
            </h2>
            <p className="text-slate-500 font-medium text-lg leading-relaxed font-outfit">
              Rencontrez les visionnaires qui capturent l'instant. Nos créateurs sont le moteur de l'excellence visuelle africaine.
            </p>
          </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24">
            {[
              { name: "Euloge TABALA", role: "Photographe de Nature", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&fit=crop&crop=faces", bio: "Spécialiste des paysages d'Afrique de l'Est." },
              { name: "Euloge TABALA", role: "Vidéaste Urbain", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&h=400&fit=crop&crop=faces", bio: "Capture l'énergie brute des métropoles africaines." },
              { name: "Euloge TABALA", role: "Artiste Digital", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&h=400&fit=crop&crop=faces", bio: "Réinvente les motifs traditionnels en 3D." },
            ].map((creator, i) => (
              <motion.div 
                key={creator.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="group flex flex-col items-center text-center"
              >
                <div className="w-full aspect-[3/4] rounded-[4rem] overflow-hidden border border-slate-100 mb-10 relative shadow-2xl group-hover:border-primary/50 transition-all duration-700">
                  <img src={creator.img} alt={creator.name} className="w-full h-full object-cover transition-all duration-[1.5s] grayscale group-hover:grayscale-0 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="space-y-4">
                  <h4 className="text-2xl font-black text-slate-900 font-syne tracking-tight group-hover:text-primary transition-colors">{creator.name}</h4>
                  <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px] font-syne">{creator.role}</p>
                  <p className="text-slate-400 text-sm font-medium font-outfit px-6">{creator.bio}</p>
                  <div className="pt-6">
                    <Magnetic strength={0.1}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-3 text-slate-900 font-black text-[10px] uppercase tracking-widest font-syne border-b-2 border-primary/20 hover:border-primary transition-all pb-1 mx-auto group-hover:gap-6"
                      >
                      Découvrir <ArrowRight size={14} className="text-primary" />
                      </motion.button>
                    </Magnetic>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Abonnement Illimité */}
      <section className="py-40 relative bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal direction="up" delay={0.1}>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 text-center mb-16 font-syne">
              Pourquoi choisir un abonnement illimité?
            </h2>
          </ScrollReveal>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {[
              {
                icon: <Download className="w-8 h-8 text-blue-500" />,
                title: "Des téléchargements illimités",
                description: "Téléchargez toutes les ressources qu'il vous faut, quand vous le souhaitez.",
                bgColor: "bg-blue-50",
                iconBg: "bg-blue-100"
              },
              {
                icon: (
                  <div className="relative w-12 h-12">
                    <Video className="absolute top-0 left-0 w-5 h-5 text-red-500" />
                    <Music className="absolute top-2 right-0 w-4 h-4 text-blue-500" />
                    <ImageIcon className="absolute bottom-0 left-2 w-5 h-5 text-green-500" />
                  </div>
                ),
                title: "Une vaste bibliothèque de contenus sélectionnés par nos experts",
                description: "Nos meilleurs clips vidéo, images, titres de musique, illustrations, images vectorielles, etc. se comptent par dizaines de millions. Vous trouverez toujours ce que vous cherchez.",
                bgColor: "bg-purple-50",
                iconBg: "bg-purple-100"
              },
              {
                icon: <FileText className="w-8 h-8 text-purple-500" />,
                title: "Des licences commerciales",
                description: "Utilisez des contenus libres de droits dans vos projets créatifs grâce à la couverture offerte par notre licence Standard.",
                bgColor: "bg-purple-50",
                iconBg: "bg-purple-100"
              },
              {
                icon: <ImageIcon className="w-8 h-8 text-blue-500" />,
                title: "Une infinité de résultats",
                description: "Jour après jour, nos contributeurs de renommée mondiale mettent en ligne des contenus plus remarquables les uns que les autres.",
                bgColor: "bg-blue-50",
                iconBg: "bg-blue-100"
              },
            ].map((feature, index) => (
              <ScrollReveal key={index} direction="up" delay={0.2 + index * 0.1}>
                <div className={`${feature.bgColor} rounded-2xl p-6 h-full flex flex-col`}>
                  <div className={`${feature.iconBg} w-16 h-16 rounded-xl flex items-center justify-center mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-3 font-syne">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-outfit flex-1">
                    {feature.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <ScrollReveal direction="up" delay={0.3}>
                <h3 className="text-3xl font-black text-slate-900 mb-8 font-syne">FAQ</h3>
                <div className="space-y-4">
                  {[
                    "L'abonnement Téléchargements illimités est-il soumis à des limites de téléchargement?",
                    "Quels sont les types de ressources inclus dans l'abonnement Téléchargements illimités?",
                    "Toutes les ressources sont-elles incluses dans l'abonnement Téléchargements illimités ?",
                    "Est-il possible de résilier un abonnement?",
                    "Comment passer d'une formule ressource seule à un abonnement Téléchargements illimités?",
                    "L'abonnement Téléchargements illimités couvre-t-il l'utilisation dans le cadre de la télédiffusion/radiodiffusion, du cinéma ou des applications?",
                  ].map((question, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="border-b border-slate-200 pb-4"
                    >
                      <div className="flex items-center justify-between cursor-pointer group">
                        <p className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors font-outfit">
                          {question}
                        </p>
                        <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-8">
                  <p className="text-sm text-slate-600 font-outfit">
                    Vous avez d'autres questions?{" "}
                    <Link href="/contact" className="text-primary font-bold hover:underline">
                      Contactez-nous
                    </Link>
                  </p>
                </div>
              </ScrollReveal>
            </div>

            {/* Promotional Image */}
            <div className="lg:col-span-1">
              <ScrollReveal direction="left" delay={0.5}>
                <div className="relative h-full min-h-[500px] rounded-3xl overflow-hidden bg-gradient-to-br from-orange-400 via-orange-300 to-green-400">
                  <div className="absolute inset-0 flex items-end justify-center">
                    <div className="relative w-full h-4/5">
                      <Image
                        src="https://images.unsplash.com/photo-1523805009345-7448845a9e53?q=80&w=800"
                        alt="Abonnement illimité"
                        fill
                        className="object-contain object-bottom"
                        sizes="(max-width: 1024px) 100vw, 33vw"
                      />
                    </div>
              </div>
                  {/* Decorative bubbles */}
                  <div className="absolute top-10 left-10 w-20 h-20 bg-orange-300/30 rounded-full blur-xl" />
                  <div className="absolute top-32 right-16 w-16 h-16 bg-green-300/30 rounded-full blur-xl" />
                  <div className="absolute bottom-20 left-16 w-12 h-12 bg-orange-200/40 rounded-full blur-lg" />
              </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Artistique - Elite Dark */}
      <footer className="py-14 px-6 bg-[#030303] border-t border-white/5 relative">
         <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-10">
                <div className="space-y-5 max-w-sm">
                  <div className="flex items-center gap-4">
                     <div className="relative h-14 w-14 rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 box-glow-orange bg-white">
                        <Image
                          src="/logo-elili-stock.jpg"
                          alt="Elili Stock"
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                     </div>
                     <span className="text-2xl font-black tracking-tighter text-white font-syne">Elili <span className="text-primary italic">Stock</span></span>
                  </div>
                  <p className="text-white/30 font-medium text-base leading-relaxed font-outfit">
                     L'excellence visuelle africaine, curatée pour les esprits créatifs les plus exigeants du monde entier.
                  </p>
                  <div className="flex gap-3">
                    {[
                      { icon: Instagram, label: "Instagram" },
                      { icon: Facebook, label: "Facebook" },
                      { icon: Linkedin, label: "LinkedIn" },
                    ].map(({ icon: Icon, label }) => (
                      <div
                        key={label}
                        className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white/90 hover:bg-primary hover:border-primary hover:text-white transition-all cursor-pointer"
                        aria-label={label}
                      >
                        <Icon size={16} />
                      </div>
                    ))}
                  </div>
               </div>
               
               <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                  <div className="space-y-6">
                     <h4 className="font-black text-[10px] uppercase tracking-[0.4em] text-primary font-syne">Découvrir</h4>
                     <ul className="space-y-4 text-sm font-black tracking-tight text-white/40 font-syne">
                        <li className="hover:text-white cursor-pointer transition-all">Collections vedettes</li>
                        <li className="hover:text-white cursor-pointer transition-all">Talents émergents</li>
                        <li className="hover:text-white cursor-pointer transition-all">Licence premium</li>
                     </ul>
                  </div>
                  <div className="space-y-6">
                     <h4 className="font-black text-[10px] uppercase tracking-[0.4em] text-primary font-syne">Plateforme</h4>
                     <ul className="space-y-4 text-sm font-black tracking-tight text-white/40 font-syne">
                        <li className="hover:text-white cursor-pointer transition-all">À propos de nous</li>
                        <li className="hover:text-white cursor-pointer transition-all">Tarifs & packs</li>
                        <li className="hover:text-white cursor-pointer transition-all">Support elite</li>
                     </ul>
                  </div>
               </div>
            </div>
            
            <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
               <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.4em]">
                  © 2026 Elili Stock. Tous droits réservés.
               </p>
               <div className="flex gap-10">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-all cursor-pointer">Confidentialité</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-all cursor-pointer">Conditions d'usage</span>
               </div>
            </div>
         </div>
      </footer>

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
    </main>
  );
}
