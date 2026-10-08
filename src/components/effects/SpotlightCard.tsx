import type { ComponentProps, PointerEvent } from "react";
import { cn } from "@/lib/utils";

/**
 * A card surface whose border and background light up under the pointer (Magic UI "MagicCard").
 * The effect is pure CSS (`spotlight-card` utility); this only feeds it the pointer position.
 */
export default function SpotlightCard({ className, onPointerMove, ...props }: ComponentProps<"div">) {
  const track = (event: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event);
    if (event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    event.currentTarget.style.setProperty("--mx", `${x}px`);
    event.currentTarget.style.setProperty("--my", `${y}px`);
    // the same position as fractions (0…1), for cursor-relative drift of inner elements
    event.currentTarget.style.setProperty("--px", (x / rect.width).toFixed(3));
    event.currentTarget.style.setProperty("--py", (y / rect.height).toFixed(3));
  };

  return (
    <div
      onPointerMove={track}
      className={cn("spotlight-card rounded-xl border bg-card text-card-foreground shadow-card", className)}
      {...props}
    />
  );
}
