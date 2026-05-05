"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = "" }) => {
  return (
    <nav className={`flex items-center gap-2 text-sm ${className}`} aria-label="Breadcrumb">
      <Link href="/">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-primary transition-colors"
        >
          <Home size={16} />
        </motion.div>
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={14} className="text-slate-300" />
          {item.href && index < items.length - 1 ? (
            <Link
              href={item.href}
              className="text-slate-400 hover:text-primary transition-colors font-medium"
            >
              {item.label}
            </Link>
          ) : (
            <span className={`${index === items.length - 1 ? "text-slate-900 font-black" : "text-slate-500 font-medium"}`}>
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
