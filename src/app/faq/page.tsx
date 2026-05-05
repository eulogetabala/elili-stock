"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronDown, HelpCircle } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "Qu'est-ce qu'Elili Stock ?",
    answer: "Elili Stock est une marketplace de stock créatif : photos, vidéos, vecteurs, fichiers PSD et Adobe Illustrator (AI), en offres gratuites et premium, pour les créateurs et les marques.",
  },
  {
    question: "Comment télécharger des assets gratuits ?",
    answer: "Les assets gratuits peuvent être téléchargés directement après création d'un compte. Aucun paiement n'est requis pour les assets marqués 'Gratuit'.",
  },
  {
    question: "Quelle est la différence entre licence Standard et Commerciale ?",
    answer: "La licence Standard est pour usage personnel et éditorial. La licence Commerciale permet l'usage commercial, publicitaire et marketing sans restrictions.",
  },
  {
    question: "Puis-je annuler mon abonnement à tout moment ?",
    answer: "Oui, vous pouvez annuler votre abonnement à tout moment depuis votre compte. L'accès premium restera actif jusqu'à la fin de la période payée.",
  },
  {
    question: "Comment devenir contributeur ?",
    answer: "Les photographes et créateurs peuvent soumettre leurs assets via notre plateforme. Après vérification, vos contenus seront disponibles sur Elili Stock.",
  },
  {
    question: "Quels formats sont supportés ?",
    answer: "Nous supportons les images (JPG, PNG), vidéos (MP4), vecteurs (SVG, EPS, AI) et fichiers sources (PSD, AI).",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Back Button */}
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05, x: -3 }}
              whileTap={{ scale: 0.95 }}
              className="mb-8 p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-primary transition-all"
            >
              <ArrowLeft size={18} />
            </motion.button>
          </Link>

          {/* Header */}
          <ScrollReveal direction="up" delay={0.1}>
            <div className="text-center mb-16 space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.3em]">
                <HelpCircle size={14} />
                Questions fréquentes
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 leading-[1.1]">
                FAQ
              </h1>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                Trouvez les réponses à vos questions
              </p>
            </div>
          </ScrollReveal>

          {/* FAQ Items */}
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, index) => (
              <ScrollReveal key={index} direction="up" delay={0.1 + index * 0.05}>
                <motion.div
                  whileHover={{ y: -2 }}
                  className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden"
                >
                  <motion.button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full p-6 flex items-center justify-between text-left"
                  >
                    <span className="text-lg font-black text-slate-900 pr-8">{item.question}</span>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown size={20} className="text-slate-400 flex-shrink-0" />
                    </motion.div>
                  </motion.button>
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
