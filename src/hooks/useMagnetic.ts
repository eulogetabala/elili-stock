"use client";

import { useRef, useState, useCallback } from "react";
import { useMotionValue, useSpring, useTransform } from "framer-motion";

interface UseMagneticOptions {
  strength?: number;
  disabled?: boolean;
}

export const useMagnetic = ({ strength = 0.3, disabled = false }: UseMagneticOptions = {}) => {
  const ref = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const scale = useTransform(xSpring, [-50, 0, 50], [1.05, 1, 1.05]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (disabled || !ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = (e.clientX - centerX) * strength;
      const distanceY = (e.clientY - centerY) * strength;

      x.set(distanceX);
      y.set(distanceY);
    },
    [strength, disabled, x, y]
  );

  const handleMouseLeave = useCallback(() => {
    if (disabled) return;
    x.set(0);
    y.set(0);
    setIsHovered(false);
  }, [disabled, x, y]);

  const handleMouseEnter = useCallback(() => {
    if (disabled) return;
    setIsHovered(true);
  }, [disabled]);

  return {
    ref,
    x: xSpring,
    y: ySpring,
    scale,
    isHovered,
    handleMouseMove,
    handleMouseLeave,
    handleMouseEnter,
  };
};