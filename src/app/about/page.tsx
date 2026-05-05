"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Globe, Users, Award, Sparkles } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ScrollReveal from "@/components/ui/ScrollReveal";
import AnimatedButton from "@/components/ui/AnimatedButton";

export default function AboutPage() {
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
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 leading-[1.1]">
                À propos de <br />
                <span className="text-gradient-orange italic">Elili Stock</span>
              </h1>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                La marketplace premium d&apos;assets visuels africains
              </p>
            </div>
          </ScrollReveal>

          {/* Mission */}
          <ScrollReveal direction="up" delay={0.2}>
            <div className="space-y-6 mb-16">
              <h2 className="text-3xl font-black text-slate-900">Notre Mission</h2>
              <p className="text-slate-600 leading-relaxed">
                Elili Stock est né d&apos;une vision : offrir une bibliothèque moderne et accessible de visuels et de sources créatives pour tous les projets. 
                Nous connectons les créateurs africains avec le monde entier, offrant des assets premium de qualité professionnelle.
              </p>
            </div>
          </ScrollReveal>

          {/* Values */}
          <ScrollReveal direction="up" delay={0.3}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {[
                { icon: <Globe size={32} />, title: "Pan-Africain", desc: "Représentation de tous les pays africains" },
                { icon: <Users size={32} />, title: "Communauté", desc: "Support aux artistes et créateurs locaux" },
                { icon: <Award size={32} />, title: "Qualité", desc: "Assets premium curatés et vérifiés" },
              ].map((value, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -8 }}
                  className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center"
                >
                  <div className="text-primary mb-4 flex justify-center">{value.icon}</div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">{value.title}</h3>
                  <p className="text-sm text-slate-500">{value.desc}</p>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>

          {/* Stats */}
          <ScrollReveal direction="up" delay={0.4}>
            <div className="bg-slate-50 rounded-[2.5rem] p-12 border border-slate-100 mb-16">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {[
                  { label: "Assets", value: "2.4M+" },
                  { label: "Artistes", value: "15K+" },
                  { label: "Pays", value: "54" },
                  { label: "Clients", value: "120K+" },
                ].map((stat, idx) => (
                  <div key={idx}>
                    <div className="text-3xl font-black text-primary mb-2">{stat.value}</div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* CTA */}
          <ScrollReveal direction="up" delay={0.5}>
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-black text-slate-900">Rejoignez-nous</h2>
              <p className="text-slate-500">
                Que vous soyez créateur ou utilisateur, Elili Stock est fait pour vous
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link href="/explorer">
                  <AnimatedButton variant="primary" glow>
                    Explorer les assets
                  </AnimatedButton>
                </Link>
                <Link href="/contact">
                  <AnimatedButton variant="outline">
                    Nous contacter
                  </AnimatedButton>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </main>
  );
}
