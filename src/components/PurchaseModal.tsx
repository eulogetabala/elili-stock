"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Crown,
  ShoppingCart,
  CreditCard,
  Check,
  Shield,
  Download,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Asset, LicenseType } from "@/types/asset";
import { createOrder } from "@/lib/api";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { useCart } from "@/contexts/CartContext";
import { StripeCheckout } from "./StripeCheckout";

interface PurchaseModalProps {
  asset: Asset | null;
  initialLicense?: LicenseType;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (asset: Asset) => void;
}

type Step = "license" | "payment" | "success";

const PurchaseModal: React.FC<PurchaseModalProps> = ({
  asset,
  initialLicense = LicenseType.STANDARD,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<Step>("license");
  const [selectedLicense, setSelectedLicense] = useState<LicenseType>(initialLicense);
  const [isProcessing, setIsProcessing] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  
  const { addToCart } = useCart();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setStep("license");
      setSelectedLicense(initialLicense);
      setStripeClientSecret(null);
      setPaymentError(null);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen, initialLicense]);

  const getPrice = () => {
    if (!asset) return 0;
    return selectedLicense === LicenseType.COMMERCIAL
      ? asset.priceCommercial
      : asset.priceStandard;
  };

  const handlePurchase = async () => {
    if (!asset) return;
    setIsProcessing(true);
    setPaymentError(null);
    
    try {
      const result = await createOrder({ assetId: asset._id, licenseType: selectedLicense });
      
      // Si l'asset est gratuit, passer directement au succès
      if (asset.isFree || getPrice() === 0) {
        setStep("success");
        if (onSuccess) onSuccess(asset);
        return;
      }
      
      // Si on a un clientSecret Stripe, afficher le formulaire de paiement
      if (result.clientSecret) {
        setStripeClientSecret(result.clientSecret);
        setStep("payment");
      } else {
        // Pas de paiement requis
        setStep("success");
        if (onSuccess) onSuccess(asset);
      }
    } catch (error: any) {
      setPaymentError(error.message || "Erreur lors de la création de la commande");
      console.error("Purchase error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = () => {
    if (asset) {
      setStep("success");
      if (onSuccess) onSuccess(asset);
    }
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
  };

  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && asset && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9998]"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <ShoppingCart size={18} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-sm">
                      {step === "success" ? "Achat confirmé !" : "Acheter cet asset"}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {step === "license" && "Étape 1 — Licence"}
                      {step === "payment" && "Étape 2 — Paiement"}
                      {step === "success" && "Terminé"}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-red-500 transition-all"
                >
                  <X size={18} />
                </motion.button>
              </div>

              {/* Asset Preview */}
              <div className="px-6 pt-6">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 relative">
                    <Image
                      src={asset.thumbnailUrl || asset.url}
                      alt={asset.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-black text-slate-900 text-sm truncate">{asset.title}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      {asset.photographer.firstName} {asset.photographer.lastName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Step Content */}
              <AnimatePresence mode="wait">
                {step === "license" && (
                  <motion.div
                    key="license"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-6 space-y-4"
                  >
                    <div className="space-y-3">
                      {/* Standard License */}
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setSelectedLicense(LicenseType.STANDARD)}
                        className={`w-full p-5 rounded-2xl border-2 transition-all text-left ${
                          selectedLicense === LicenseType.STANDARD
                            ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                            : "border-slate-100 hover:border-slate-200"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              selectedLicense === LicenseType.STANDARD ? "border-primary bg-primary" : "border-slate-300"
                            }`}>
                              {selectedLicense === LicenseType.STANDARD && <Check size={12} className="text-white" />}
                            </div>
                            <span className="font-black text-sm text-slate-900">Licence Standard</span>
                          </div>
                          <span className="text-xl font-black text-primary">${asset.priceStandard}</span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-slate-500 pl-7">
                          <li className="flex items-center gap-2"><Check size={12} className="text-emerald-500 flex-shrink-0" /> Usage personnel et éditorial</li>
                          <li className="flex items-center gap-2"><Check size={12} className="text-emerald-500 flex-shrink-0" /> Projets numériques (web, réseaux sociaux)</li>
                          <li className="flex items-center gap-2"><Check size={12} className="text-emerald-500 flex-shrink-0" /> Jusqu&apos;à 500 000 impressions</li>
                          <li className="flex items-center gap-2"><X size={12} className="text-slate-300 flex-shrink-0" /> Usage commercial non autorisé</li>
                        </ul>
                      </motion.button>

                      {/* Commercial License */}
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setSelectedLicense(LicenseType.COMMERCIAL)}
                        className={`w-full p-5 rounded-2xl border-2 transition-all text-left relative overflow-hidden ${
                          selectedLicense === LicenseType.COMMERCIAL
                            ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                            : "border-slate-100 hover:border-slate-200"
                        }`}
                      >
                        <div className="absolute top-3 right-3 px-2 py-1 bg-amber-100 text-amber-700 text-[8px] font-black uppercase tracking-widest rounded-md flex items-center gap-1">
                          <Crown size={8} /> Recommandé
                        </div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              selectedLicense === LicenseType.COMMERCIAL ? "border-primary bg-primary" : "border-slate-300"
                            }`}>
                              {selectedLicense === LicenseType.COMMERCIAL && <Check size={12} className="text-white" />}
                            </div>
                            <span className="font-black text-sm text-slate-900">Licence Commerciale</span>
                          </div>
                          <span className="text-xl font-black text-primary">${asset.priceCommercial}</span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-slate-500 pl-7">
                          <li className="flex items-center gap-2"><Check size={12} className="text-emerald-500 flex-shrink-0" /> Tous les droits Standard inclus</li>
                          <li className="flex items-center gap-2"><Check size={12} className="text-emerald-500 flex-shrink-0" /> Usage commercial (publicité, produits)</li>
                          <li className="flex items-center gap-2"><Check size={12} className="text-emerald-500 flex-shrink-0" /> Impressions illimitées</li>
                          <li className="flex items-center gap-2"><Check size={12} className="text-emerald-500 flex-shrink-0" /> Revente sur produits dérivés</li>
                        </ul>
                      </motion.button>
                    </div>

                    <div className="flex gap-3">
                      <AnimatedButton
                        variant="outline"
                        size="lg"
                        className="flex-1 flex items-center justify-center gap-3"
                        onClick={() => {
                          if (asset) {
                            addToCart(asset._id, selectedLicense);
                            setAddedToCart(true);
                            setTimeout(() => {
                              setAddedToCart(false);
                              onClose();
                            }, 1500);
                          }
                        }}
                      >
                        <ShoppingCart size={16} />
                        Au panier
                      </AnimatedButton>
                      <AnimatedButton
                        variant="primary"
                        size="lg"
                        glow
                        className="flex-1 flex items-center justify-center gap-3"
                        onClick={() => setStep("payment")}
                      >
                        Continuer — ${getPrice()}
                        <ArrowRight size={16} />
                      </AnimatedButton>
                    </div>
                    
                    {addedToCart && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 px-4 py-3 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold"
                      >
                        <Check size={14} />
                        Ajouté au panier !
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {step === "payment" && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-6 space-y-5"
                  >
                    {/* Summary */}
                    <div className="p-4 bg-slate-50 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Licence {selectedLicense === LicenseType.COMMERCIAL ? "Commerciale" : "Standard"}</span>
                        <span className="font-black text-slate-900">${getPrice()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Taxes</span>
                        <span className="font-black text-slate-900">$0.00</span>
                      </div>
                      <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
                        <span className="font-black text-slate-900">Total</span>
                        <span className="text-xl font-black text-primary">${getPrice()}</span>
                      </div>
                    </div>

                    {/* Stripe Payment Form */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <CreditCard size={12} />
                        Informations de paiement
                      </div>
                      
                      {stripeClientSecret ? (
                        <StripeCheckout
                          clientSecret={stripeClientSecret}
                          onSuccess={handlePaymentSuccess}
                          onError={handlePaymentError}
                        />
                      ) : (
                        <div className="p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-center space-y-2">
                          <Lock size={24} className="mx-auto text-slate-300" />
                          <p className="text-xs text-slate-400 font-bold">
                            Préparation du paiement...
                          </p>
                        </div>
                      )}
                      
                      {paymentError && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-red-50 border border-red-200 rounded-xl"
                        >
                          <p className="text-red-600 text-sm font-medium">{paymentError}</p>
                        </motion.div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[9px] text-slate-400 font-bold">
                      <Shield size={12} className="text-emerald-500" />
                      Paiement 100% sécurisé • Satisfait ou remboursé 30 jours
                    </div>

                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setStep("license")}
                        className="px-6 py-4 bg-slate-100 text-slate-600 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-colors"
                      >
                        Retour
                      </motion.button>
                      {!stripeClientSecret ? (
                        <AnimatedButton
                          variant="primary"
                          size="lg"
                          glow
                          className="flex-1 flex items-center justify-center gap-3"
                          onClick={handlePurchase}
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                              >
                                <CreditCard size={16} />
                              </motion.div>
                              Préparation...
                            </>
                          ) : (
                            <>
                              <CreditCard size={16} />
                              Payer ${getPrice()}
                            </>
                          )}
                        </AnimatedButton>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setStripeClientSecret(null);
                            setStep("license");
                          }}
                          className="px-6 py-4 bg-slate-100 text-slate-600 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-colors w-full"
                        >
                          Retour
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                )}

                {step === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-6 text-center space-y-6"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                      className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                      >
                        <CheckCircle2 size={40} className="text-emerald-500" />
                      </motion.div>
                    </motion.div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-slate-900">Achat réussi !</h3>
                      <p className="text-sm text-slate-500">
                        Votre licence {selectedLicense === LicenseType.COMMERCIAL ? "Commerciale" : "Standard"} est maintenant active.
                      </p>
                    </div>

                    <AnimatedButton
                      variant="primary"
                      size="lg"
                      glow
                      className="w-full flex items-center justify-center gap-3"
                      onClick={() => {
                        // Simulate download after purchase
                        window.open(asset.url, "_blank");
                        onClose();
                      }}
                    >
                      <Download size={18} />
                      Télécharger maintenant
                    </AnimatedButton>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={onClose}
                      className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      Fermer
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default PurchaseModal;
