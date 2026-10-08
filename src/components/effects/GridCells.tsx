import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/** Grid coordinates (column, row) of the cells that glow; chosen to sit around, not behind, the hero copy. */
const CELLS: [number, number][] = [
  [3, 1],
  [9, 2],
  [14, 1],
  [18, 3],
  [22, 2],
  [6, 4],
  [12, 5],
  [20, 6],
  [2, 7],
  [16, 8],
  [24, 5],
  [8, 9],
];

/**
 * Magic UI's AnimatedGridPattern, simplified: a handful of cells of the drafting grid (`bg-grid`, 56px)
 * glow and fade on staggered 7s loops. Pure CSS; hidden for reduced motion.
 */
export default function GridCells({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden", className)}>
      {CELLS.map(([col, row], i) => (
        <span
          key={`${col}-${row}`}
          className="absolute size-[55px] animate-cell bg-brand/[0.07] dark:bg-brand/[0.09]"
          style={
            {
              left: col * 56 + 1,
              top: row * 56 + 1,
              animationDelay: `${(i * 1.7) % 7}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
