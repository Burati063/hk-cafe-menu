"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Phone, MapPin, Moon, Sun, ChevronUp, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MenuItemCard } from "@/components/menu/menu-item-card";
import { ItemModal } from "@/components/menu/item-modal";
import type { Category, MenuItem, Settings, Language } from "@/types/menu";

interface MenuPageClientProps {
  categories: Category[];
  settings: Settings;
}

export function MenuPageClient({ categories, settings }: MenuPageClientProps) {
  const [lang, setLang] = useState<Language>("en");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const categoryNavRef = useRef<HTMLDivElement>(null);

  const am = lang === "am";

  const cafeName = am
    ? (settings.cafe_name_am ?? settings.cafe_name ?? "HK ካፌ")
    : (settings.cafe_name ?? "HK Cafe");

  const cafeTagline = am
    ? (settings.cafe_tagline_am ?? settings.cafe_tagline ?? "ከ1979 ጀምሮ ዋና የሆንግ ኮንግ ጣዕሞች")
    : (settings.cafe_tagline ?? "Authentic Hong Kong Flavours Since 1979");

  const cafeDescription = am
    ? (settings.cafe_description_am ?? settings.cafe_description ?? "")
    : (settings.cafe_description ?? "");

  const openingHours = settings.opening_hours ?? "";
  const phone = settings.phone ?? "";
  const address = settings.address ?? "";

  const totalItems = categories.reduce((acc, c) => acc + c.items.length, 0);

  // Dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Scroll spy
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
      let current: string | null = null;
      for (const cat of categories) {
        const el = sectionRefs.current[cat.slug];
        if (el && el.getBoundingClientRect().top <= 130) current = cat.slug;
      }
      setActiveCategory(current ?? (categories[0]?.slug ?? null));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categories]);

  const scrollToCategory = useCallback((slug: string) => {
    const el = sectionRefs.current[slug];
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 100, behavior: "smooth" });
    }
    categoryNavRef.current
      ?.querySelector(`[data-slug="${slug}"]`)
      ?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, []);

  const getCategoryName = (cat: Category) =>
    am ? (cat.nameAm ?? cat.name) : cat.name;

  const getCategoryDescription = (cat: Category) =>
    am ? (cat.descriptionAm ?? cat.description) : cat.description;

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">

      {/* ── HERO ── */}
      <header className="relative overflow-hidden bg-primary text-primary-foreground">
        {/* subtle grid pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="hk-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M40 0L0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hk-grid)" />
          </svg>
        </div>

        {/* Top-right controls */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {/* Language toggle */}
          <button
            onClick={() => setLang(am ? "en" : "am")}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 transition-colors text-xs font-semibold"
            aria-label="Toggle language"
          >
            <Globe className="w-3 h-3" />
            <span>{am ? "EN" : "አማ"}</span>
          </button>
          {/* Dark mode */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-1.5 rounded-full bg-white/15 hover:bg-white/25 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 py-10 sm:py-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-center space-y-2"
          >
            {/* Logo */}
            <div className="flex justify-center mb-3">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-accent flex items-center justify-center shadow-xl border-4 border-white/20 w-[72px] h-[72px]">
                <span className="text-4xl">🍵</span>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 text-accent/80 text-[10px] sm:text-xs font-semibold tracking-widest uppercase">
              <span className="block w-6 sm:w-8 h-px bg-accent/60" />
              {am ? "ሻ ቻን ቴንግ" : "Cha Chaan Teng"}
              <span className="block w-6 sm:w-8 h-px bg-accent/60" />
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              {cafeName}
            </h1>
            <p className="text-primary-foreground/80 text-xs sm:text-sm font-medium tracking-wide px-4">
              {cafeTagline}
            </p>
            {cafeDescription && (
              <p className="text-primary-foreground/60 text-xs sm:text-sm max-w-sm sm:max-w-md mx-auto leading-relaxed px-4">
                {cafeDescription}
              </p>
            )}

            {/* Info chips — scrollable on mobile */}
            <div className="flex flex-wrap justify-center gap-2 pt-2 px-2">
              {openingHours && (
                <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-2.5 py-1 text-[11px] sm:text-xs flex-shrink-0">
                  <Clock className="w-3 h-3 text-accent flex-shrink-0" />
                  <span className="text-primary-foreground/80">{openingHours.split("\n")[0]}</span>
                </div>
              )}
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-1.5 bg-white/10 rounded-full px-2.5 py-1 text-[11px] sm:text-xs flex-shrink-0 hover:bg-white/20 transition-colors"
                >
                  <Phone className="w-3 h-3 text-accent flex-shrink-0" />
                  <span className="text-primary-foreground/80">{phone}</span>
                </a>
              )}
              {address && (
                <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-2.5 py-1 text-[11px] sm:text-xs max-w-[200px] sm:max-w-none">
                  <MapPin className="w-3 h-3 text-accent flex-shrink-0" />
                  <span className="text-primary-foreground/80 truncate">{address}</span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-8 pt-1">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-accent">{categories.length}</div>
                <div className="text-[10px] sm:text-xs text-primary-foreground/60">
                  {am ? "ምድቦች" : "Categories"}
                </div>
              </div>
              <div className="w-px bg-white/20" />
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-accent">{totalItems}</div>
                <div className="text-[10px] sm:text-xs text-primary-foreground/60">
                  {am ? "ምግቦች" : "Items"}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* ── STICKY CATEGORY NAV ── */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
        <div
          ref={categoryNavRef}
          className="max-w-5xl mx-auto flex gap-2 px-3 py-2.5 overflow-x-auto scrollbar-hide"
          role="navigation"
          aria-label={am ? "የምናሌ ምድቦች" : "Menu categories"}
        >
          {categories.map((cat) => (
            <button
              key={cat.slug}
              data-slug={cat.slug}
              onClick={() => scrollToCategory(cat.slug)}
              className={`flex-shrink-0 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                activeCategory === cat.slug
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
              }`}
              aria-current={activeCategory === cat.slug ? "true" : undefined}
            >
              {getCategoryName(cat)}
            </button>
          ))}
        </div>
      </div>

      {/* ── MENU SECTIONS ── */}
      <main className="max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-10 sm:space-y-12" id="menu">
        {categories.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <div className="text-5xl">🍽️</div>
            <h3 className="text-lg font-semibold">
              {am ? "ምናሌ ገና አልተዘጋጀም" : "Menu coming soon"}
            </h3>
            <p className="text-muted-foreground text-sm">
              {am ? "እባክዎ ቆይ ይጠብቁ" : "Please check back later"}
            </p>
          </div>
        ) : (
          categories.map((category, ci) => (
            <motion.section
              key={category.id}
              ref={(el) => { sectionRefs.current[category.slug] = el; }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: ci * 0.04 }}
              id={`category-${category.slug}`}
              aria-labelledby={`heading-${category.slug}`}
            >
              {/* Section header */}
              <div className="flex items-end justify-between mb-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <h2
                      id={`heading-${category.slug}`}
                      className="text-lg sm:text-2xl font-bold text-foreground"
                    >
                      {getCategoryName(category)}
                    </h2>
                    <Badge variant="secondary" className="text-xs h-5 flex-shrink-0">
                      {category.items.length}
                    </Badge>
                  </div>
                  {getCategoryDescription(category) && (
                    <p className="text-xs sm:text-sm text-muted-foreground truncate max-w-xs sm:max-w-none">
                      {getCategoryDescription(category)}
                    </p>
                  )}
                </div>
                <div className="flex-1 ml-3 h-px bg-gradient-to-r from-accent/40 to-transparent hidden sm:block" />
              </div>

              {/* Item grid — 2 cols on mobile, 3 on sm, 4 on lg */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {category.items.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    lang={lang}
                    onClick={setSelectedItem}
                  />
                ))}
              </div>
            </motion.section>
          ))
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border bg-card mt-8">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg sm:text-xl">🍵</span>
            <span className="font-bold text-foreground text-sm sm:text-base">{cafeName}</span>
          </div>
          <p className="text-xs text-muted-foreground">{cafeTagline}</p>
          {address && <p className="text-xs text-muted-foreground">{address}</p>}
          <p className="text-[10px] sm:text-xs text-muted-foreground/50 pt-1">
            {am ? "ሁሉም ዋጋዎች HKD ሲሆኑ ሊለወጡ ይችላሉ" : "All prices in HKD · Subject to change"}
          </p>
        </div>
      </footer>

      {/* ── SCROLL TO TOP ── */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-5 right-4 z-40 p-2.5 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
            aria-label={am ? "ወደ ላይ ሂድ" : "Scroll to top"}
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── ITEM MODAL ── */}
      <ItemModal item={selectedItem} lang={lang} onClose={() => setSelectedItem(null)} />
    </div>
  );
}
