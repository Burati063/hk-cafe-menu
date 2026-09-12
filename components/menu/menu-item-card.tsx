"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { TagBadge } from "./tag-badge";
import { formatPrice } from "@/lib/utils";
import type { MenuItem, Language } from "@/types/menu";

interface MenuItemCardProps {
  item: MenuItem;
  lang: Language;
  onClick: (item: MenuItem) => void;
}

export function MenuItemCard({ item, lang, onClick }: MenuItemCardProps) {
  const am = lang === "am";
  const name = am ? (item.nameAm ?? item.name) : item.name;
  const description = am ? (item.descriptionAm ?? item.description) : item.description;

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={item.isAvailable ? { y: -2 } : {}}
      transition={{ duration: 0.2 }}
      onClick={() => onClick(item)}
      disabled={!item.isAvailable}
      className="w-full text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
      aria-label={`${am ? "ዝርዝር ይመልከቱ" : "View details for"} ${name}`}
    >
      <div
        className={`bg-card rounded-xl overflow-hidden shadow-sm border border-border transition-all duration-200 h-full
          ${item.isAvailable
            ? "group-hover:shadow-md group-hover:border-accent/30"
            : "opacity-55"
          }`}
      >
        {/* Image */}
        <div className="relative w-full aspect-[4/3] bg-muted overflow-hidden">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-muted">
              <span className="text-3xl sm:text-4xl">🍽️</span>
            </div>
          )}

          {/* Unavailable overlay */}
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Badge className="text-xs bg-gray-800/90 text-white border-0 px-2">
                {am ? "አሁን የለም" : "Unavailable"}
              </Badge>
            </div>
          )}

          {/* Tag badges — top-left, max 2 */}
          {item.isAvailable && item.tags.length > 0 && (
            <div className="absolute top-1.5 left-1.5 flex flex-wrap gap-1">
              {item.tags.slice(0, 2).map((tag) => (
                <TagBadge key={tag} tag={tag} />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-2.5 sm:p-3 flex flex-col gap-1">
          <h3 className="font-semibold text-foreground text-xs sm:text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {name}
          </h3>

          {description && (
            <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-2 leading-relaxed hidden sm:block">
              {description}
            </p>
          )}

          <div className="flex items-center justify-between mt-auto pt-0.5">
            <span className="text-sm sm:text-base font-bold text-accent">
              {formatPrice(item.price)}
            </span>
            {item.isAvailable && (
              <span className="text-[10px] text-primary/60 font-medium opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
                {am ? "ዝርዝር →" : "View →"}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.button>
  );
}
