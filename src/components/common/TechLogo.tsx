import type { CSSProperties } from "react";
import { techIcons, type TechIconSlug } from "@/data/techIcons";
import { cn } from "@/lib/utils";

/**
 * A brand mark drawn in currentColor. With `brandOnHover`, it takes the brand's own colour while an ancestor
 * `.group/logo` is hovered (skipped for marks whose brand colour would disappear on our backgrounds).
 */
export default function TechLogo({ slug, className, brandOnHover }: { slug: TechIconSlug; className?: string; brandOnHover?: boolean }) {
  const icon = techIcons[slug];
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={cn(
        "size-3.5 shrink-0 fill-current transition-colors duration-300",
        brandOnHover && icon.color && "group-hover/logo:text-(--logo)",
        className,
      )}
      style={icon.color ? ({ "--logo": icon.color } as CSSProperties) : undefined}
    >
      <path d={icon.path} />
    </svg>
  );
}
