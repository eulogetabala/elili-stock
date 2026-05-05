"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FloatingElement {
  icon: LucideIcon;
  x: number;
  y: number;
  delay: number;
  duration: number;
  size?: number;
  opacity?: number;
}

interface FloatingElementsProps {
  elements: FloatingElement[];
  className?: string;
}

const FloatingElements: React.FC<FloatingElementsProps> = ({ 
  elements, 
  className = "" 
}) => {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {elements.map((element, index) => {
        const Icon = element.icon;
        return (
          <motion.div
            key={index}
            className="absolute"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              opacity: element.opacity || 0.2,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, -15, 0],
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: element.duration || 8,
              delay: element.delay || 0,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Icon size={element.size || 60} className="text-primary/20" />
          </motion.div>
        );
      })}
    </div>
  );
};

export default FloatingElements;