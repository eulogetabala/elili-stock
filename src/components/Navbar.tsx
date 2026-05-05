"use client";

import React, { useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { Menu, X, ShoppingCart, Sparkles, Globe, Heart, GitCompare, Camera, Video, MousePointer2, ChevronDown, TrendingUp } from "lucide-react";
import Magnetic from "@/components/ui/Magnetic";
import AnimatedButton from "@/components/ui/AnimatedButton";
import ThemeToggle from "@/components/ui/ThemeToggle";
import MegaMenu from "@/components/ui/MegaMenu";
import { useCart } from "@/contexts/CartContext";
import { useCompare } from "@/contexts/CompareContext";
import { AssetCategory, AssetType } from "@/types/asset";
import { MOCK_ASSETS } from "@/lib/mock-data";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { scrollY } = useScroll();
  const { getItemCount } = useCart();
  const { compareItems } = useCompare();
  
  const cartCount = getItemCount();
  const compareCount = compareItems.length;
  
  // Barre claire : léger verre blanc, un peu plus dense au scroll
  const blurValue = useTransform(scrollY, [0, 120], [6, 14]);
  const bgOpacity = useTransform(scrollY, [0, 100], isHomePage ? [0.94, 0.99] : [0.98, 1]);
  const backdropBlur = useMotionTemplate`blur(${blurValue}px)`;
  const backgroundColor = useMotionTemplate`rgba(255, 255, 255, ${bgOpacity})`;

  const handleMenuEnter = (menuName: string) => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
    }
    setOpenMenu(menuName);
  };

  const handleMenuLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setOpenMenu(null);
    }, 200);
  };

  // Menu structure with subcategories (style Freepik)
  const menuItems = [
    {
      name: "Photos",
      href: "/photos",
      icon: Camera,
      megaMenu: {
        sections: [
          {
            title: "Catégories",
            items: [
              { name: "Nature", href: "/photos?category=nature", count: MOCK_ASSETS.filter(a => a.category === AssetCategory.NATURE && a.type === AssetType.IMAGE).length, trending: true },
              { name: "Personnes", href: "/photos?category=people", count: MOCK_ASSETS.filter(a => a.category === AssetCategory.PEOPLE && a.type === AssetType.IMAGE).length },
              { name: "Architecture", href: "/photos?category=architecture", count: MOCK_ASSETS.filter(a => a.category === AssetCategory.ARCHITECTURE && a.type === AssetType.IMAGE).length },
              { name: "Culture", href: "/photos?category=culture", count: MOCK_ASSETS.filter(a => a.category === AssetCategory.CULTURE && a.type === AssetType.IMAGE).length },
              { name: "Business", href: "/photos?category=business", count: MOCK_ASSETS.filter(a => a.category === AssetCategory.BUSINESS && a.type === AssetType.IMAGE).length },
              { name: "Street", href: "/photos?category=street", count: MOCK_ASSETS.filter(a => a.category === AssetCategory.STREET && a.type === AssetType.IMAGE).length },
            ],
          },
          {
            title: "Populaires",
            items: [
              { name: "Tout le catalogue", href: "/photos", trending: true },
              { name: "Gratuites", href: "/photos?isFree=true" },
              { name: "Premium", href: "/photos?isFree=false" },
              { name: "Tendances", href: "/photos?sort=views", trending: true },
              { name: "Nouveautés", href: "/photos?sort=createdAt" },
            ],
          },
        ],
        featuredImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=600",
        featuredTitle: "Photos Premium",
        featuredHref: "/photos",
      },
    },
    {
      name: "Vidéos",
      href: "/videos",
      icon: Video,
      megaMenu: {
        sections: [
          {
            title: "Catégories",
            items: [
              { name: "Nature", href: "/videos?category=nature", count: MOCK_ASSETS.filter(a => a.category === AssetCategory.NATURE && a.type === AssetType.VIDEO).length },
              { name: "Personnes", href: "/videos?category=people", count: MOCK_ASSETS.filter(a => a.category === AssetCategory.PEOPLE && a.type === AssetType.VIDEO).length },
              { name: "Architecture", href: "/videos?category=architecture", count: MOCK_ASSETS.filter(a => a.category === AssetCategory.ARCHITECTURE && a.type === AssetType.VIDEO).length },
              { name: "Culture", href: "/videos?category=culture", count: MOCK_ASSETS.filter(a => a.category === AssetCategory.CULTURE && a.type === AssetType.VIDEO).length },
            ],
          },
          {
            title: "Prix",
            items: [
              { name: "Tout (gratuit + payant)", href: "/videos", trending: true },
              { name: "Gratuites", href: "/videos?isFree=true" },
              { name: "Premium", href: "/videos?isFree=false" },
            ],
          },
          {
            title: "Durée",
            items: [
              { name: "Court (≤30s)", href: "/videos?duration=short" },
              { name: "Moyen (30s-2min)", href: "/videos?duration=medium" },
              { name: "Long (>2min)", href: "/videos?duration=long" },
            ],
          },
        ],
        featuredImage: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=600",
        featuredTitle: "Vidéos HD & 4K",
        featuredHref: "/videos",
      },
    },
    {
      name: "Vecteurs",
      href: "/vectors",
      icon: MousePointer2,
      megaMenu: {
        sections: [
          {
            title: "Catégories",
            items: [
              { name: "Nature", href: "/vectors?category=nature", count: MOCK_ASSETS.filter(a => a.category === AssetCategory.NATURE && a.type === AssetType.VECTOR).length },
              { name: "Personnes", href: "/vectors?category=people", count: MOCK_ASSETS.filter(a => a.category === AssetCategory.PEOPLE && a.type === AssetType.VECTOR).length },
              { name: "Architecture", href: "/vectors?category=architecture", count: MOCK_ASSETS.filter(a => a.category === AssetCategory.ARCHITECTURE && a.type === AssetType.VECTOR).length },
              { name: "Culture", href: "/vectors?category=culture", count: MOCK_ASSETS.filter(a => a.category === AssetCategory.CULTURE && a.type === AssetType.VECTOR).length },
            ],
          },
          {
            title: "Prix",
            items: [
              { name: "Tout (gratuit + payant)", href: "/vectors", trending: true },
              { name: "Gratuites", href: "/vectors?isFree=true" },
              { name: "Premium", href: "/vectors?isFree=false" },
            ],
          },
          {
            title: "Formats",
            items: [
              { name: "SVG", href: "/vectors?format=svg" },
              { name: "EPS", href: "/vectors?format=eps" },
              { name: "AI", href: "/vectors?format=ai" },
              { name: "PSD", href: "/vectors?format=psd" },
              { name: "PDF", href: "/vectors?format=pdf" },
            ],
          },
        ],
        featuredImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600",
        featuredTitle: "Vecteurs Premium",
        featuredHref: "/vectors",
      },
    },
    {
      name: "Collections",
      href: "/collections",
      icon: Sparkles,
      megaMenu: {
        sections: [
          {
            title: "Découvrir",
            items: [
              { name: "Toutes les collections", href: "/collections" },
              { name: "Collections populaires", href: "/collections?sort=popular", trending: true },
              { name: "Nouveautés", href: "/collections?sort=new" },
            ],
          },
          {
            title: "Par thème",
            items: [
              { name: "Safari & Nature", href: "/collections?theme=safari" },
              { name: "Villes Africaines", href: "/collections?theme=cities" },
              { name: "Culture & Traditions", href: "/collections?theme=culture" },
            ],
          },
        ],
        featuredImage: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?q=80&w=600",
        featuredTitle: "Collections Premium",
        featuredHref: "/collections",
      },
    },
    {
      name: "Explorer",
      href: "/explorer",
      icon: TrendingUp,
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full">
      <motion.div
        style={{
          backdropFilter: backdropBlur,
          WebkitBackdropFilter: backdropBlur,
          backgroundColor,
        }}
        className="w-full border-b border-slate-200/90 shadow-[0_4px_24px_rgba(15,23,42,0.06)]"
      >
        {/* Accent brand — fine ligne orange full width */}
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-90" aria-hidden="true" />

        <div className="mx-auto flex w-full max-w-[1920px] items-center gap-3 sm:gap-5 lg:gap-8 px-4 sm:px-6 lg:px-10 xl:px-12 py-2.5 md:py-3.5">
        {/* Logo with Magnetic Effect */}
        <Magnetic strength={0.15}>
          <Link href="/" className="flex items-center group shrink-0">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative h-11 w-[min(68vw,13rem)] sm:h-12 sm:w-[15rem] md:h-[3.25rem] md:w-[17rem] lg:h-14 lg:w-[18.5rem] xl:h-16 xl:w-[20rem] rounded-xl bg-white px-2 sm:px-2.5 py-1 sm:py-1.5 shadow-sm border border-slate-200/80"
            >
              <Image
                src="/logo-elili-stock.jpg"
                alt="Elili Stock"
                fill
                className="object-contain object-center"
                sizes="(max-width: 640px) 208px, (max-width: 1024px) 280px, 320px"
                priority
              />
            </motion.div>
          </Link>
        </Magnetic>

        {/* Desktop Navigation — disposition linéaire, liens en pastilles au survol */}
        <div className="hidden lg:flex flex-1 min-w-0 items-center justify-start gap-1 xl:gap-2 relative pl-2 xl:pl-6 border-l border-slate-200/80 ml-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const hasMegaMenu = !!item.megaMenu;
            const isOpen = openMenu === item.name;

            return (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => hasMegaMenu && handleMenuEnter(item.name)}
                onMouseLeave={handleMenuLeave}
              >
                <Magnetic strength={0.1}>
                  <Link
                    href={item.href}
                    className="relative flex items-center gap-2 rounded-xl px-3 py-2.5 text-[11px] xl:text-xs font-black uppercase tracking-[0.12em] text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 group whitespace-nowrap"
                  >
                    <Icon size={15} className="text-primary shrink-0 opacity-90 group-hover:opacity-100" />
                    <motion.span
                      whileHover={{ y: -1 }}
                      className="relative z-10"
                    >
                      {item.name}
                    </motion.span>
                    {hasMegaMenu && (
                      <ChevronDown
                        size={12}
                        className={`text-slate-400 transition-transform shrink-0 ${isOpen ? "rotate-180 text-primary" : ""}`}
                      />
                    )}
                  </Link>
                </Magnetic>

                {/* Mega Menu */}
                {hasMegaMenu && item.megaMenu && (
                  <MegaMenu
                    isOpen={isOpen}
                    onClose={() => setOpenMenu(null)}
                    sections={item.megaMenu.sections}
                    featuredImage={item.megaMenu.featuredImage}
                    featuredTitle={item.megaMenu.featuredTitle}
                    featuredHref={item.megaMenu.featuredHref}
                    className="left-0"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Actions — groupe isolé à droite */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 shrink-0 ml-auto">
          <Magnetic strength={0.1}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200/80 rounded-xl border border-slate-200/90 transition-all cursor-pointer group"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Globe size={14} className="text-primary" />
              </motion.div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">FR</span>
            </motion.div>
          </Magnetic>
          
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Compare Button */}
            {compareCount > 0 && (
              <Magnetic strength={0.1}>
                <Link href="/search">
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2.5 text-slate-600 hover:text-primary transition-all relative"
                  >
                    <GitCompare size={20} />
                    {compareCount > 0 && (
                      <motion.span
                        className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-primary rounded-full flex items-center justify-center px-1 text-[10px] font-black text-white"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {compareCount}
                      </motion.span>
                    )}
                  </motion.button>
                </Link>
              </Magnetic>
            )}
            
            {/* Favorites Button */}
            <Magnetic strength={0.1}>
              <Link href="/favorites">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2.5 text-slate-600 hover:text-primary transition-all"
                >
                  <Heart size={20} />
                </motion.button>
              </Link>
            </Magnetic>
            
            {/* Cart Button */}
            <Magnetic strength={0.1}>
              <Link href="/cart">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2.5 text-slate-600 hover:text-primary transition-all relative"
                >
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <motion.span
                      className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-primary rounded-full flex items-center justify-center px-1 text-[10px] font-black text-white"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {cartCount > 9 ? "9+" : cartCount}
                    </motion.span>
                  )}
                </motion.button>
              </Link>
            </Magnetic>
            
            {/* Theme Toggle */}
            <ThemeToggle variant="onLight" />
            
            <Magnetic strength={0.15}>
              <AnimatedButton
                variant="primary"
                size="sm"
                glow
                className="hidden sm:flex"
                asChild
              >
                <Link href="/login">
                  Connexion
                </Link>
              </AnimatedButton>
            </Magnetic>
            
            {/* Enhanced Mobile Menu Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="lg:hidden p-2.5 text-slate-800 hover:text-primary transition-colors relative"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
        </div>
      </motion.div>

      {/* Enhanced Mobile Menu with Morphing Animation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20, rotateX: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20, rotateX: 15 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-full left-6 right-6 mt-4 p-8 bg-white rounded-[2.5rem] border border-slate-200/90 shadow-[0_24px_48px_rgba(15,23,42,0.12)] lg:hidden z-50"
            >
              <motion.div
                initial="closed"
                animate="open"
                variants={{
                  open: {
                    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
                  },
                }}
                className="flex flex-col gap-4"
              >
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  const isExpanded = expandedMobileMenu === item.name;
                  
                  return (
                    <motion.div
                      key={item.name}
                      variants={{
                        closed: { opacity: 0, x: -20 },
                        open: { opacity: 1, x: 0 },
                      }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <Link
                            href={item.href}
                            className="flex items-center gap-3 text-xl font-black text-slate-800 hover:text-primary transition-colors tracking-tighter py-2"
                            onClick={() => !item.megaMenu && setIsMobileMenuOpen(false)}
                          >
                            <Icon size={18} className="text-slate-400" />
                            <span>{item.name}</span>
                          </Link>
                          {item.megaMenu && (
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setExpandedMobileMenu(isExpanded ? null : item.name)}
                              className="p-2 text-slate-400 hover:text-primary transition-colors"
                            >
                              <motion.div
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <ChevronDown size={18} />
                              </motion.div>
                            </motion.button>
                          )}
                        </div>
                        {item.megaMenu && (
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="pl-8 pt-2 space-y-4">
                                  {item.megaMenu.sections.map((section, sectionIdx) => (
                                    <div key={sectionIdx} className="space-y-2">
                                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
                                        {section.title}
                                      </h4>
                                      <ul className="space-y-1">
                                        {section.items.map((subItem, subIdx) => (
                                          <li key={subIdx}>
                                            <Link
                                              href={subItem.href}
                                              className="block text-sm text-slate-600 hover:text-primary transition-colors py-1"
                                              onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                              {subItem.name}
                                              {subItem.trending && (
                                                <span className="ml-2 px-1.5 py-0.5 bg-primary/20 text-primary text-[9px] font-black rounded">
                                                  HOT
                                                </span>
                                              )}
                                            </Link>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
                <motion.hr
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5 }}
                  className="border-slate-200 my-2"
                />
                <motion.div
                  variants={{
                    closed: { opacity: 0, y: 20 },
                    open: { opacity: 1, y: 0 },
                  }}
                  transition={{ delay: 0.6 }}
                >
                  <AnimatedButton
                    variant="primary"
                    size="lg"
                    glow
                    className="w-full flex items-center justify-center gap-3"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      router.push("/explorer");
                    }}
                  >
                    Découvrir Elili Stock
                    <Sparkles size={16} />
                  </AnimatedButton>
                </motion.div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
