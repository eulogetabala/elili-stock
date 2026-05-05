"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { Search, Camera, Video, MousePointer2, Sparkles, Image as ImageIcon } from "lucide-react";
import ParticleBackground from "@/components/ui/ParticleBackground";
import FloatingElements from "@/components/ui/FloatingElements";
import Magnetic from "@/components/ui/Magnetic";
import SearchBar from "@/components/SearchBar";
import { useReducedMotion } from "framer-motion";

const CATEGORIES = [
  { id: "all", label: "Toutes les ressources", icon: <Sparkles size={16} /> },
  { id: "photo", label: "Photos", icon: <Camera size={16} /> },
  { id: "vector", label: "Vecteurs", icon: <MousePointer2 size={16} /> },
  { id: "video", label: "Vidéos", icon: <Video size={16} /> },
];

const Hero = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const { scrollYProgress } = useScroll();
  const prefersReducedMotion = useReducedMotion();
  const videoY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? ["0%", "0%"] : ["0%", "50%"]);

  const handleTagClick = (tag: string) => {
    router.push(`/search?q=${encodeURIComponent(tag)}`);
  };

  return (
    <section className="relative h-[85vh] min-h-[700px] flex flex-col items-center justify-center pt-20 pb-16 px-6 overflow-hidden bg-[#050505]">
      {/* Particle Background */}
      {!prefersReducedMotion && (
        <ParticleBackground particleCount={60} color="rgba(255, 127, 0, 0.2)" />
      )}

      {/* Floating Elements */}
      {!prefersReducedMotion && (
        <FloatingElements
          elements={[
            { icon: ImageIcon, x: 10, y: 20, delay: 0, duration: 8, size: 80, opacity: 0.15 },
            { icon: Video, x: 85, y: 30, delay: 2, duration: 10, size: 70, opacity: 0.15 },
            { icon: Camera, x: 15, y: 70, delay: 4, duration: 12, size: 60, opacity: 0.1 },
            { icon: MousePointer2, x: 80, y: 75, delay: 1, duration: 9, size: 65, opacity: 0.12 },
          ]}
        />
      )}

      {/* Background Video Layer with Parallax */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y: videoY }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/90 via-transparent to-[#050505] z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505] z-10" />
        <div className="absolute inset-0 bg-gradient-mesh z-10" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-70 scale-105"
        >
          <source src="/assets/videos/safari.mp4" type="video/mp4" />
        </video>
      </motion.div>

      <div className="relative z-20 max-w-5xl mx-auto w-full text-center space-y-8">
        {/* Elite Headline with Stagger Animation */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
              },
            },
          }}
          className="space-y-4"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20, scale: 0.9 },
              visible: { 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                },
              },
            }}
            className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.3em] animate-glow-pulse"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles size={14} />
            </motion.div>
            <span>L'Excellence Visuelle Africaine</span>
          </motion.div>
          
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 100,
                  damping: 12,
                },
              },
            }}
            className="text-4xl md:text-7xl font-black tracking-tighter text-white leading-[0.95] uppercase"
          >
            Libérez votre <br />
            <motion.span
              className="text-gradient-orange italic inline-block"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              créativité
            </motion.span>
          </motion.h1>
          
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: {
                  delay: 0.4,
                  duration: 0.8,
                },
              },
            }}
            className="text-base md:text-lg text-white font-medium max-w-2xl mx-auto tracking-wide"
          >
            La marketplace premium d'assets visuels africains. <br /> 
            Des millions de photos, vidéos et vecteurs exclusifs.
          </motion.p>
        </motion.div>

        {/* Ultra-Glass Search Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.5,
              },
            },
          }}
          className="space-y-6"
        >
           {/* Glass Tabs with Magnetic Effect */}
           <motion.div 
             variants={{
               hidden: { opacity: 0, y: 20 },
               visible: { opacity: 1, y: 0 },
             }}
             className="flex flex-wrap justify-center gap-3"
           >
              {CATEGORIES.map((cat, index) => (
                <Magnetic key={cat.id} strength={0.2}>
                  <motion.button
                    variants={{
                      hidden: { opacity: 0, scale: 0.8 },
                      visible: { 
                        opacity: 1, 
                        scale: 1,
                        transition: {
                          delay: index * 0.1,
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                        },
                      },
                    }}
                    onClick={() => setActiveTab(cat.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all relative overflow-hidden ${
                      activeTab === cat.id 
                        ? "bg-primary text-white shadow-2xl shadow-primary/40 ring-2 ring-primary/20" 
                        : "bg-white/5 text-white hover:bg-white/10 border border-white/5"
                    }`}
                  >
                    <motion.div
                      animate={activeTab === cat.id ? { rotate: 360 } : { rotate: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {cat.icon}
                    </motion.div>
                    {cat.label}
                    {activeTab === cat.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-primary rounded-full -z-10"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.button>
                </Magnetic>
              ))}
           </motion.div>

           {/* Dynamic Search Bar */}
           <motion.div
             variants={{
               hidden: { opacity: 0, scale: 0.9, y: 20 },
               visible: { 
                 opacity: 1, 
                 scale: 1, 
                 y: 0,
                 transition: {
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                },
              },
             }}
             className="relative max-w-4xl mx-auto px-4"
           >
             <motion.div
               className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-orange-500/30 rounded-[2.5rem] blur-2xl opacity-0 group-focus-within:opacity-100 transition duration-1000 pointer-events-none"
               animate={{
                 backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
               }}
               transition={{
                 duration: 3,
                 repeat: Infinity,
                 ease: "linear",
               }}
             />
             <SearchBar variant="hero" />
           </motion.div>

           {/* Popular Tags with Enhanced Interactions */}
           <motion.div
             variants={{
               hidden: { opacity: 0 },
               visible: {
                 opacity: 1,
                 transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.7,
                },
              },
             }}
             className="flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-white"
           >
              <motion.span
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 },
                }}
              >
                Tendance :
              </motion.span>
              {["Safari", "Startup", "Vintage", "Luxe", "Culture"].map((tag, index) => (
                <Magnetic key={tag} strength={0.1}>
                  <motion.button
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { 
                        opacity: 1, 
                        y: 0,
                        transition: {
                          delay: index * 0.1,
                        },
                      },
                    }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    onClick={() => handleTagClick(tag)}
                    className="hover:text-primary transition-colors cursor-pointer border-b-2 border-transparent hover:border-primary pb-1 relative group"
                  >
                    {tag}
                    <motion.div
                      className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary"
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                </Magnetic>
              ))}
           </motion.div>
        </motion.div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 0.3, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-30"
      >
        <motion.span
          className="text-[10px] font-black uppercase tracking-[0.5em] text-white"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Scroll
        </motion.span>
        <motion.div
          className="w-px h-12 bg-gradient-to-b from-white to-transparent"
          animate={{ 
            height: [48, 32, 48],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
};

export default Hero;
