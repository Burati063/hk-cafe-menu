import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const tagConfig: Record<string, { variant: string; emoji: string }> = {
  Popular: { variant: "popular", emoji: "🔥" },
  Spicy: { variant: "spicy", emoji: "🌶️" },
  Vegetarian: { variant: "vegetarian", emoji: "🌿" },
  New: { variant: "new", emoji: "✨" },
};

interface TagBadgeProps {
  tag: string;
  className?: string;
}

export function TagBadge({ tag, className }: TagBadgeProps) {
  const config = tagConfig[tag] ?? { variant: "secondary", emoji: "" };
  return (
    <Badge
      // @ts-expect-error custom variant
      variant={config.variant}
      className={cn("text-xs gap-0.5", className)}
    >
      {config.emoji && <span className="text-[10px]">{config.emoji}</span>}
      {tag}
    </Badge>
  );
}
