"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
  Crown,
  Download,
  CreditCard,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import PurchaseModal from "@/components/PurchaseModal";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { useCart } from "@/contexts/CartContext";
import { LicenseType } from "@/types/asset";
import { MOCK_ASSETS } from "@/lib/mock-data";
import { formatFileSize } from "@/lib/api";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, getTotal } = useCart();
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Get full asset data for each cart item
  const cartItemsWithAssets = items.map((item) => {
    const asset = MOCK_ASSETS.find((a) => a._id === item.assetId);
    return { ...item, asset };
  }).filter((item) => item.asset); // Filter out any missing assets

  const total = getTotal();

  const handleQuantityChange = (assetId: string, licenseType: LicenseType, delta: number) => {
    const item = items.find((i) => i.assetId === assetId && i.licenseType === licenseType);
    if (item) {
      updateQuantity(assetId, licenseType, item.quantity + delta);
    }
  };

  const handleCheckout = () => {
    // For now, we'll handle checkout item by item
    // In a real app, you'd create a grouped order
    if (cartItemsWithAssets.length > 0) {
      setPurchaseModalOpen(true);
    }
  };

  if (cartItemsWithAssets.length === 0) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-28 pb-16">
          <div className="max-w-4xl mx-auto px-6">
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05, x: -3 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors mb-8"
              >
                <ArrowLeft size={18} />
                <span className="text-sm font-bold">Retour</span>
              </motion.button>
            </Link>

            <div className="text-center py-20 space-y-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto"
              >
                <ShoppingCart size={40} className="text-slate-300" />
              </motion.div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  Votre panier est vide
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Ajoutez des assets pour commencer
                </p>
              </div>
              <Link href="/">
                <AnimatedButton variant="primary" glow>
                  Découvrir des assets
                </AnimatedButton>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05, x: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary transition-all"
                >
                  <ArrowLeft size={18} />
                </motion.button>
              </Link>
              <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                  Panier
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {items.length} {items.length === 1 ? "article" : "articles"}
                </p>
              </div>
            </div>
            {items.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearCart}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-500 hover:text-red-600 transition-colors"
              >
                <Trash2 size={16} />
                Vider le panier
              </motion.button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence mode="popLayout">
                {cartItemsWithAssets.map((item, index) => {
                  const { asset, assetId, licenseType, quantity } = item;
                  if (!asset) return null;

                  const price =
                    licenseType === LicenseType.COMMERCIAL
                      ? asset.priceCommercial
                      : asset.priceStandard;
                  const itemTotal = price * quantity;

                  return (
                    <motion.div
                      key={`${assetId}-${licenseType}`}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex flex-col sm:flex-row gap-4 p-6 bg-white border border-slate-100 rounded-2xl hover:border-primary/30 transition-all"
                    >
                      {/* Image */}
                      <Link href={`/asset/${asset._id}`}>
                        <div className="relative w-full sm:w-32 h-32 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer group">
                          <Image
                            src={asset.thumbnailUrl || asset.url}
                            alt={asset.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            sizes="128px"
                          />
                          {asset.isFree && (
                            <div className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-black rounded">
                              FREE
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Details */}
                      <div className="flex-1 min-w-0 space-y-3">
                        <div>
                          <Link href={`/asset/${asset._id}`}>
                            <h3 className="font-black text-slate-900 dark:text-white text-lg hover:text-primary transition-colors line-clamp-1">
                              {asset.title}
                            </h3>
                          </Link>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                            {asset.photographer.firstName} {asset.photographer.lastName}
                          </p>
                        </div>

                        {/* License Selection */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Licence:
                          </span>
                          <div className="flex items-center gap-1 px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            {licenseType === LicenseType.COMMERCIAL ? (
                              <>
                                <Crown size={12} className="text-amber-500" />
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                  Commercial
                                </span>
                              </>
                            ) : (
                              <>
                                <Download size={12} className="text-primary" />
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                  Standard
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                              Quantité:
                            </span>
                            <div className="flex items-center gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleQuantityChange(assetId, licenseType, -1)}
                                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white transition-colors"
                              >
                                <Minus size={14} />
                              </motion.button>
                              <span className="w-12 text-center font-black text-slate-900 dark:text-white">
                                {quantity}
                              </span>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleQuantityChange(assetId, licenseType, 1)}
                                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white transition-colors"
                              >
                                <Plus size={14} />
                              </motion.button>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-black text-primary">
                              ${itemTotal.toFixed(2)}
                            </div>
                            <div className="text-xs text-slate-400">
                              ${price.toFixed(2)} / unité
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeFromCart(assetId, licenseType)}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors self-start sm:self-center"
                      >
                        <X size={18} />
                      </motion.button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 p-6 bg-white border border-slate-100 rounded-2xl space-y-6">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <Sparkles size={12} className="text-primary" />
                  Résumé
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">
                      Sous-total ({items.reduce((sum, item) => sum + item.quantity, 0)} articles)
                    </span>
                    <span className="font-black text-slate-900 dark:text-white">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Taxes</span>
                    <span className="font-black text-slate-900 dark:text-white">$0.00</span>
                  </div>
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-3 flex items-center justify-between">
                    <span className="font-black text-slate-900 dark:text-white">Total</span>
                    <span className="text-2xl font-black text-primary">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <AnimatedButton
                  variant="primary"
                  size="lg"
                  glow
                  className="w-full flex items-center justify-center gap-3"
                  onClick={handleCheckout}
                >
                  <CreditCard size={18} />
                  Procéder au paiement
                </AnimatedButton>

                <Link href="/">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-6 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
                  >
                    Continuer les achats
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Modal - Note: This will need to be adapted for multi-item checkout */}
      {cartItemsWithAssets.length > 0 && (
        <PurchaseModal
          asset={cartItemsWithAssets[0].asset || null}
          isOpen={purchaseModalOpen}
          onClose={() => setPurchaseModalOpen(false)}
          onSuccess={() => {
            setPurchaseModalOpen(false);
            // In a real app, you'd clear the cart after successful payment
          }}
        />
      )}
    </main>
  );
}
