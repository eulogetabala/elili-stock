"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Crown, Sparkles, Globe, ArrowRight, X } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import AnimatedButton from "@/components/ui/AnimatedButton";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Magnetic from "@/components/ui/Magnetic";

interface Plan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
  color: string;
}

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Gratuit",
    description: "Parfait pour commencer",
    price: { monthly: 0, yearly: 0 },
    features: [
      "10 téléchargements/mois",
      "Assets gratuits uniquement",
      "Licence standard",
      "Résolution standard",
      "Support communautaire",
    ],
    icon: <Globe size={24} />,
    color: "emerald",
  },
  {
    id: "premium",
    name: "Premium",
    description: "Pour les créatifs professionnels",
    price: { monthly: 29, yearly: 290 },
    features: [
      "Téléchargements illimités",
      "Tous les assets (gratuits + premium)",
      "Licence commerciale incluse",
      "Résolution HD/4K",
      "Support prioritaire",
      "Collections personnelles",
      "Pas de watermark",
    ],
    popular: true,
    icon: <Crown size={24} />,
    color: "primary",
  },
  {
    id: "elite",
    name: "Elite",
    description: "Pour les agences et entreprises",
    price: { monthly: 99, yearly: 990 },
    features: [
      "Tout Premium inclus",
      "Résolution 8K",
      "Licence étendue",
      "Support dédié 24/7",
      "API d'accès",
      "Gestion d'équipe",
      "Facturation centralisée",
      "Statistiques avancées",
    ],
    icon: <Sparkles size={24} />,
    color: "purple",
  },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const getColorClasses = (color: string) => {
    switch (color) {
      case "emerald":
        return "bg-emerald-500 text-white";
      case "primary":
        return "bg-primary text-white";
      case "purple":
        return "bg-purple-500 text-white";
      default:
        return "bg-slate-500 text-white";
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <ScrollReveal direction="up" delay={0.1}>
            <div className="text-center mb-16 space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.3em]">
                <Crown size={14} />
                Plans d&apos;abonnement
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 leading-[1.1]">
                Choisissez votre <br />
                <span className="text-gradient-orange italic">plan premium</span>
              </h1>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                Accédez à des millions d&apos;assets africains premium avec des licences commerciales
              </p>

              {/* Billing Toggle */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <span className={`text-sm font-bold ${billingCycle === "monthly" ? "text-slate-900" : "text-slate-400"}`}>
                  Mensuel
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    billingCycle === "yearly" ? "bg-primary" : "bg-slate-200"
                  }`}
                >
                  <motion.div
                    layout
                    className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg"
                    animate={{ x: billingCycle === "yearly" ? 24 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </motion.button>
                <span className={`text-sm font-bold ${billingCycle === "yearly" ? "text-slate-900" : "text-slate-400"}`}>
                  Annuel
                </span>
                {billingCycle === "yearly" && (
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black">
                    Économisez 17%
                  </span>
                )}
              </div>
            </div>
          </ScrollReveal>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {PLANS.map((plan, index) => (
              <ScrollReveal key={plan.id} direction="up" delay={0.1 + index * 0.1}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className={`relative rounded-[2.5rem] overflow-hidden border-2 transition-all duration-500 ${
                    plan.popular
                      ? "border-primary shadow-[0_40px_80px_-15px_rgba(255,107,0,0.3)] scale-105"
                      : "border-slate-100 hover:border-slate-200"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-primary text-white text-center py-2 text-[10px] font-black uppercase tracking-widest">
                      Le plus populaire
                    </div>
                  )}

                  <div className="p-8 space-y-6">
                    {/* Header */}
                    <div className="space-y-3">
                      <div className={`w-16 h-16 ${getColorClasses(plan.color)} rounded-2xl flex items-center justify-center`}>
                        {plan.icon}
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 mb-1">{plan.name}</h3>
                        <p className="text-sm text-slate-500">{plan.description}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-slate-900">
                          ${billingCycle === "monthly" ? plan.price.monthly : plan.price.yearly}
                        </span>
                        {billingCycle === "yearly" && plan.price.yearly > 0 && (
                          <span className="text-sm text-slate-400 line-through">
                            ${plan.price.monthly * 12}
                          </span>
                        )}
                      </div>
                      {plan.price.monthly > 0 && (
                        <p className="text-xs text-slate-400">
                          {billingCycle === "monthly" ? "par mois" : "par an"}
                        </p>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check size={18} className="text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-600">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Magnetic strength={0.15}>
                      <AnimatedButton
                        variant={plan.popular ? "primary" : "outline"}
                        size="lg"
                        className="w-full"
                        glow={plan.popular}
                        onClick={() => setSelectedPlan(plan.id)}
                      >
                        {plan.price.monthly === 0 ? "Commencer gratuitement" : "Choisir ce plan"}
                        <ArrowRight size={16} />
                      </AnimatedButton>
                    </Magnetic>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>

          {/* Comparison Table */}
          <ScrollReveal direction="up" delay={0.4}>
            <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100">
              <h2 className="text-2xl font-black text-slate-900 mb-8 text-center">
                Comparaison des plans
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-4 px-4 text-sm font-black text-slate-900">Fonctionnalités</th>
                      <th className="text-center py-4 px-4 text-sm font-black text-slate-900">Gratuit</th>
                      <th className="text-center py-4 px-4 text-sm font-black text-primary">Premium</th>
                      <th className="text-center py-4 px-4 text-sm font-black text-purple-600">Elite</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { feature: "Téléchargements/mois", free: "10", premium: "Illimité", elite: "Illimité" },
                      { feature: "Assets premium", free: "❌", premium: "✅", elite: "✅" },
                      { feature: "Résolution HD/4K", free: "❌", premium: "✅", elite: "✅" },
                      { feature: "Résolution 8K", free: "❌", premium: "❌", elite: "✅" },
                      { feature: "Licence commerciale", free: "❌", premium: "✅", elite: "✅" },
                      { feature: "Collections personnelles", free: "❌", premium: "✅", elite: "✅" },
                      { feature: "Support prioritaire", free: "❌", premium: "✅", elite: "✅" },
                      { feature: "API d'accès", free: "❌", premium: "❌", elite: "✅" },
                    ].map((row, idx) => (
                      <tr key={idx} className="border-b border-slate-100">
                        <td className="py-4 px-4 text-sm font-bold text-slate-700">{row.feature}</td>
                        <td className="py-4 px-4 text-center text-sm text-slate-500">{row.free}</td>
                        <td className="py-4 px-4 text-center text-sm text-primary font-bold">{row.premium}</td>
                        <td className="py-4 px-4 text-center text-sm text-purple-600 font-bold">{row.elite}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Purchase Modal */}
      <AnimatePresence>
        {selectedPlan && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
              onClick={() => setSelectedPlan(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 md:inset-12 max-w-2xl mx-auto z-[9999] bg-white rounded-[2rem] p-8 overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-slate-900">Finaliser l&apos;abonnement</h2>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedPlan(null)}
                    className="p-2 rounded-xl bg-slate-100 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <X size={20} />
                  </motion.button>
                </div>
                <p className="text-slate-500">
                  La fonctionnalité de paiement sera intégrée avec Stripe. Pour l&apos;instant, cette fonctionnalité est en développement.
                </p>
                <AnimatedButton
                  variant="primary"
                  className="w-full"
                  onClick={() => {
                    alert("Intégration Stripe à venir");
                    setSelectedPlan(null);
                  }}
                >
                  Procéder au paiement
                </AnimatedButton>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
