"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Send, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ScrollReveal from "@/components/ui/ScrollReveal";
import AnimatedButton from "@/components/ui/AnimatedButton";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Message envoyé ! (Fonctionnalité à intégrer avec backend)");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

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
                Contactez-nous
              </h1>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                Une question ? Une suggestion ? Nous sommes là pour vous aider
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <ScrollReveal direction="up" delay={0.2}>
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 mb-6">Informations de contact</h2>
                  <div className="space-y-6">
                    {[
                      { icon: <Mail size={20} />, label: "Email", value: "contact@elilistock.com" },
                      { icon: <Phone size={20} />, label: "Téléphone", value: "+33 1 23 45 67 89" },
                      { icon: <MapPin size={20} />, label: "Adresse", value: "Paris, France" },
                    ].map((info, idx) => (
                      <div key={idx} className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded-xl text-primary">
                          {info.icon}
                        </div>
                        <div>
                          <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">
                            {info.label}
                          </div>
                          <div className="text-sm font-bold text-slate-900">{info.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Contact Form */}
            <ScrollReveal direction="up" delay={0.3}>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:outline-none"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:outline-none"
                    placeholder="votre@email.com"
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">
                    Sujet
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:outline-none"
                    placeholder="Sujet de votre message"
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">
                    Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:outline-none resize-none"
                    placeholder="Votre message..."
                  />
                </div>
                <AnimatedButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  glow
                >
                  <Send size={18} />
                  Envoyer le message
                </AnimatedButton>
              </form>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </main>
  );
}
