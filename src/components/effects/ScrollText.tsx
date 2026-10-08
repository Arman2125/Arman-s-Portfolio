import { useRef, useState, type CSSProperties } from "react";
import { prefersReducedMotion } from "@/lib/scroll";
import { clamp01, useScrollEffect } from "@/lib/useScrollEffect";
import { cn } from "@/lib/utils";

/**
 * Magic UI-style TextReveal: the words of a paragraph light up in reading order as it scrolls through the
 * viewport (from 85% down to 55%). One CSS variable is written per frame; each word derives its own opacity
 * (`scroll-word` utility). The text is always fully present for assistive tech, and fully lit without JS or
 * under reduced motion.
 */
export default function ScrollText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");
  // Start dimmed only when the reveal will actually run, so the first paint matches the first scroll frame.
  // (Without JS or under reduced motion the CSS default keeps every word lit.)
  const [startDimmed] = useState(() => typeof window !== "undefined" && !prefersReducedMotion());

  useScrollEffect(
    ref,
    ({ top, height, vh }) => {
      const start = vh * 0.85;
      const end = vh * 0.55;
      const p = clamp01((start - top) / (start - end + height * 0.6));
      ref.current?.style.setProperty("--p", p.toFixed(4));
    },
    { onReduced: () => ref.current?.style.setProperty("--p", "1") },
  );

  return (
    <p ref={ref} className={cn(className)} style={{ "--n": words.length, ...(startDimmed ? { "--p": 0 } : {}) } as CSSProperties}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="scroll-word transition-opacity duration-200" style={{ "--i": i } as CSSProperties}>
          {word}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
