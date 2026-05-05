"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, Image as ImageIcon, X, Search } from "lucide-react";
import AnimatedButton from "@/components/ui/AnimatedButton";

interface VisualSearchProps {
  onSearch: (imageFile: File) => void;
  className?: string;
}

const VisualSearch: React.FC<VisualSearchProps> = ({ onSearch, className = "" }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleSearch = () => {
    if (fileInputRef.current?.files?.[0]) {
      onSearch(fileInputRef.current.files[0]);
    }
  };

  const handleClear = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-2xl p-8 transition-all ${
          isDragging
            ? "border-primary bg-primary/5"
            : preview
            ? "border-slate-200 bg-slate-50"
            : "border-slate-200 bg-white hover:border-primary/30"
        }`}
      >
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-64 object-cover rounded-xl"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClear}
              className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full text-slate-600 hover:text-red-500 transition-colors"
            >
              <X size={18} />
            </motion.button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <ImageIcon size={32} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-900 mb-1">
                Glissez une image ici ou cliquez pour uploader
              </p>
              <p className="text-xs text-slate-500">
                Formats supportés: JPG, PNG, WebP
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
            <AnimatedButton
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex"
            >
              <Upload size={16} />
              Choisir une image
            </AnimatedButton>
          </div>
        )}
      </div>

      {preview && (
        <AnimatedButton
          variant="primary"
          size="lg"
          className="w-full"
          glow
          onClick={handleSearch}
        >
          <Search size={18} />
          Rechercher des assets similaires
        </AnimatedButton>
      )}
    </div>
  );
};

export default VisualSearch;
