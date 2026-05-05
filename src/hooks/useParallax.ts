"use client";

import { useEffect, useState } from "react";
import { useScroll, useTransform, MotionValue } from "framer-motion";

interface UseParallaxOptions {
  speed?: number;
  offset?: number;
}

export const useParallax = (
  scrollYProgress: MotionValue<number>,
  options: UseParallaxOptions = {}
) => {
  const { speed = 0.5, offset = 0 } = options;

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [offset, offset - speed * 100]
  );

  return y;
};

export const useParallaxScroll = (speed: number = 0.5) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -speed * 1000]);

  return y;
};

export const useScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setProgress(latest);
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  return { scrollYProgress, progress };
};