"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { TagBadge } from "./tag-badge";
import { formatPrice } from "@/lib/utils";
import type { MenuItem, Language } from "@/types/menu";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";

interface ItemModalProps {
  item: MenuItem | null;
  lang: Language;
  onClose: () => void;
}

export function ItemModal({ item, lang, onClose }: ItemModalProps) {
  const am = lang === "am";

  const name = item
    ? am ? (item.nameAm ?? item.name) : item.name
    : "";
  const description = item
    ? am ? (item.descriptionAm ?? item.description) : item.description
    : "";

  return (
    <Dialog open={!!item} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="p-0 overflow-hidden max-w-md w-[calc(100vw-2rem)] mx-auto rounded-2xl max-h-[92dvh] overflow-y-auto">
        <AnimatePresence>
          {item && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.18 }}
            >
              {/* Image */}
              <div className="relative w-full h-52 sm:h-64 bg-muted">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 480px) 100vw, 480px"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-muted">
                    <span className="text-6xl">🍽️</span>
                  </div>
                )}

                {/* gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

                {/* Unavailable */}
                {!item.isAvailable && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge className="text-sm px-4 py-1.5 bg-gray-700 text-white border-0">
                      {am ? "አሁን አይቀርብም" : "Currently Unavailable"}
                    </Badge>
                  </div>
                )}

                {/* Close */}
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 rounded-full bg-black/40 hover:bg-black/60 text-white p-1.5 transition-colors z-10"
                  aria-label={am ? "ዝጋ" : "Close"}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6">
                <DialogTitle className="text-xl sm:text-2xl font-bold text-foreground mb-2 leading-snug">
                  {name}
                </DialogTitle>

                {/* Tags */}
                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {item.tags.map((tag) => (
                      <TagBadge key={tag} tag={tag} />
                    ))}
                  </div>
                )}

                {/* Description */}
                {description && (
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {description}
                  </p>
                )}

                {/* Price row */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <span className="text-sm text-muted-foreground font-medium">
                    {am ? "ዋጋ" : "Price"}
                  </span>
                  <span className="text-2xl font-bold text-accent">
                    {formatPrice(item.price)}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
