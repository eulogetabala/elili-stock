"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Download, Heart, ShoppingCart, Play, Maximize2, Video, MousePointer2, Image as LucideImage, Crown, Eye, ArrowDownToLine, GitCompare } from "lucide-react";
import Magnetic from "@/components/ui/Magnetic";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { Asset, AssetType, LicenseType } from "@/types/asset";
import { formatNumber } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useCompare } from "@/contexts/CompareContext";

interface AssetCardProps {
  asset: Asset;
  onClick?: (asset: Asset) => void;
  size?: "default" | "compact";
}

const AssetCard: React.FC<AssetCardProps> = ({ asset, onClick, size = "default" }) => {
  const { _id: id, title, type, image, isFree, priceStandard } = {
    ...asset,
    image: asset.thumbnailUrl || asset.url,
  };
  const author = `${asset.photographer.firstName} ${asset.photographer.lastName}`;
  const isPremium = !isFree;
  const [isHovered, setIsHovered] = useState(false);
  
  
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInCompare, addToCompare, removeFromCompare, canAddMore } = useCompare();
  
  const favorited = isFavorite(asset._id);
  const inCompare = isInCompare(asset._id);
  const canCompare = canAddMore() || inCompare;
  
  // 3D Tilt Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!e.currentTarget) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = (e.clientX - centerX) / (rect.width / 2);
    const distanceY = (e.clientY - centerY) / (rect.height / 2);
    x.set(distanceX);
    y.set(distanceY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const handleClick = () => {
    if (onClick) onClick(asset);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      style={{ 
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`group relative bg-white overflow-hidden border border-slate-100 transition-all duration-500 hover:border-primary/20 hover:shadow-[0_40px_80px_-15px_rgba(255,107,0,0.15)] depth-3d cursor-pointer ${
        size === "compact" ? "rounded-xl" : "rounded-[2.5rem]"
      }`}
      onClick={handleClick}
    >
      {/* Shine Effect */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 z-30 pointer-events-none"
          initial={{ x: "-100%", y: "-100%" }}
          animate={{ x: "200%", y: "200%" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <div className="w-full h-full bg-gradient-to-br from-transparent via-white/20 to-transparent rotate-45" />
        </motion.div>
      )}

      {/* Image & Overlay Container */}
      <div className={`relative overflow-hidden group/image ${size === "compact" ? "aspect-square" : "aspect-[4/5]"}`}>
        <motion.div
          className="absolute inset-0"
          animate={isHovered ? { scale: 1.15, rotate: 2 } : { scale: 1, rotate: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover/image:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </motion.div>
        
        {/* Enhanced Glass Hover Overlay */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={isHovered ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          className="absolute inset-x-3 bottom-3 z-20"
        >
          <div className="glass-morphism-dark-strong rounded-[1.8rem] p-5 shadow-2xl border border-white/10 backdrop-blur-3xl overflow-hidden">
            <div className="flex flex-col gap-3.5 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ delay: 0.1 }}
                className="flex justify-between items-start"
              >
                <div className="space-y-1 flex-1 min-w-0 pr-2">
                  <h3 className="text-white font-black text-sm tracking-tight leading-tight line-clamp-1">
                    {title}
                  </h3>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
                    par <span className="text-primary">{author}</span>
                  </p>
                </div>
                <motion.div
                  animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
                  className="text-primary font-black text-sm italic flex-shrink-0"
                >
                  {isFree ? (
                    <span className="text-emerald-400">Gratuit</span>
                  ) : (
                    <span>${priceStandard}</span>
                  )}
                </motion.div>
              </motion.div>
              
              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.15 }}
                className="flex items-center gap-3 text-[9px] text-white/40 font-bold"
              >
                <span className="flex items-center gap-1"><Eye size={10} />{formatNumber(asset.views)}</span>
                <span className="flex items-center gap-1"><ArrowDownToLine size={10} />{formatNumber(asset.downloads)}</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 pt-3 border-t border-white/5"
              >
                <AnimatedButton
                  variant="primary"
                  size="sm"
                  className="flex-1 text-[10px]"
                  glow
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                  }}
                >
                  {isFree ? "Télécharger" : "Acheter"}
                </AnimatedButton>
                <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
                  <Magnetic strength={0.2}>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-2 rounded-lg transition-all border flex-shrink-0 ${
                        favorited
                          ? "bg-red-500 hover:bg-red-600 text-white border-red-400"
                          : "bg-white/5 hover:bg-white hover:text-black text-white border-white/10"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(asset._id);
                      }}
                    >
                      <Heart size={14} fill={favorited ? "currentColor" : "none"} />
                    </motion.button>
                  </Magnetic>
                  <Magnetic strength={0.2}>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 bg-white/5 hover:bg-white hover:text-black text-white rounded-lg transition-all border border-white/10 flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(asset._id, LicenseType.STANDARD);
                      }}
                    >
                      <ShoppingCart size={14} />
                    </motion.button>
                  </Magnetic>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Floating Badges with Micro-animations */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="absolute top-5 left-5 flex flex-col gap-2 z-20"
        >
          <Magnetic strength={0.15}>
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="p-3 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 text-white shadow-2xl group-hover:bg-primary transition-colors duration-500 glow-primary"
            >
              <motion.div
                animate={isHovered ? { rotate: [0, 15, -15, 0] } : { rotate: 0 }}
                transition={{ duration: 0.5 }}
              >
                {type === AssetType.VIDEO ? <Video size={16} /> : type === AssetType.VECTOR ? <MousePointer2 size={16} /> : <LucideImage size={16} />}
              </motion.div>
            </motion.div>
          </Magnetic>
        </motion.div>

        {/* Free Badge */}
        {isFree && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, x: 20 }}
            whileInView={{ scale: 1, opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="absolute top-5 right-5 z-20"
          >
            <div className="px-4 py-2 bg-emerald-500/90 backdrop-blur-xl border border-emerald-400/30 text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-xl shadow-2xl flex items-center gap-2">
              <Download size={12} />
              Gratuit
            </div>
          </motion.div>
        )}

        {/* Premium Badge */}
        {isPremium && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, x: 20 }}
            whileInView={{ scale: 1, opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="absolute top-5 right-5 z-20"
          >
            <Magnetic strength={0.15}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 bg-slate-900/40 backdrop-blur-xl border border-white/10 text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-xl shadow-2xl flex items-center gap-2 group-hover:bg-primary transition-all duration-500 overflow-hidden relative glow-primary-strong"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                  <Crown size={12} className="text-orange-400 group-hover:text-white" />
                </motion.div>
                Premium
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={isHovered ? { x: ["-100%", "200%"] } : { x: "-100%" }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                />
              </motion.div>
            </Magnetic>
          </motion.div>
        )}

        {/* Enhanced Ambient Overlay Layer */}
        <motion.div
          animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"
        />
        
        {/* Glow Effect on Hover */}
        <motion.div
          animate={isHovered ? { opacity: 0.3 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute -inset-1 bg-primary/20 blur-xl rounded-[2.5rem] pointer-events-none -z-10"
        />
      </div>
    </motion.div>
  );
};

export default AssetCard;
