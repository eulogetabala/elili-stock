"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { X, ZoomIn, ZoomOut, RotateCw, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import Image from "next/image";

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  alt: string;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  onClose,
  imageUrl,
  alt,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
}) => {
  const [mounted, setMounted] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const imageRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { stiffness: 300, damping: 30 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          if (onPrevious && hasPrevious) onPrevious();
          break;
        case "ArrowRight":
          if (onNext && hasNext) onNext();
          break;
        case "+":
        case "=":
          setZoom((prev) => Math.min(prev + 0.25, 5));
          break;
        case "-":
          setZoom((prev) => Math.max(prev - 0.25, 0.5));
          break;
        case "r":
        case "R":
          setRotation((prev) => (prev + 90) % 360);
          break;
        case "0":
          setZoom(1);
          setRotation(0);
          x.set(0);
          y.set(0);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onPrevious, onNext, hasPrevious, hasNext, x, y]);

  // Block body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setZoom(1);
      setRotation(0);
      x.set(0);
      y.set(0);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, x, y]);

  // Fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    x.set(0);
    y.set(0);
  };

  const handleDragStart = () => setIsDragging(true);
  const handleDragEnd = () => setIsDragging(false);

  if (!mounted) return null;

  const lightboxContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[9998]"
            onClick={onClose}
          />

          {/* Lightbox */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-4 md:inset-8 lg:inset-12 z-[9999] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Container */}
            <motion.div
              ref={imageRef}
              drag
              dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
              dragElastic={0.2}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              style={{
                x: springX,
                y: springY,
                rotate: rotation,
                scale: zoom,
              }}
              className="relative w-full h-full flex items-center justify-center cursor-move"
            >
              <div className="relative max-w-full max-h-full">
                <Image
                  src={imageUrl}
                  alt={alt}
                  width={1920}
                  height={1080}
                  className="max-w-full max-h-[90vh] object-contain rounded-lg"
                  style={{ cursor: isDragging ? "grabbing" : "grab" }}
                  priority
                />
              </div>
            </motion.div>

            {/* Controls */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
              {/* Left Controls */}
              <div className="flex items-center gap-2">
                {onPrevious && hasPrevious && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onPrevious}
                    className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </motion.button>
                )}
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.5}
                  className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ZoomOut size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleZoomIn}
                  disabled={zoom >= 5}
                  className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ZoomIn size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleRotate}
                  className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
                >
                  <RotateCw size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleFullscreen}
                  className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
                >
                  {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-red-500/80 transition-colors"
                >
                  <X size={20} />
                </motion.button>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
              {onNext && hasNext && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onNext}
                  className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
                >
                  <ChevronRight size={20} />
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleReset}
                className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-xs font-bold hover:bg-white/20 transition-colors"
              >
                Réinitialiser (0)
              </motion.button>
            </div>

            {/* Zoom Indicator */}
            {zoom !== 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute top-20 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-xs font-bold z-10"
              >
                {Math.round(zoom * 100)}%
              </motion.div>
            )}

            {/* Navigation Hints */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/60 text-[10px] font-bold uppercase tracking-widest text-center z-10">
              <div className="flex items-center gap-4">
                <span>← → Navigation</span>
                <span>+ - Zoom</span>
                <span>R Rotation</span>
                <span>ESC Fermer</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(lightboxContent, document.body);
};

export default Lightbox;
