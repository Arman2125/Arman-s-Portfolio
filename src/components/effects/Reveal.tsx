import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  /** Seconds. */
  delay?: number;
  className?: string;
  as?: "div" | "li";
  /** Entrance direction: rise (default), slide in from a side, or scale up. */
  from?: "right" | "left" | "scale";
}

/**
 * Scroll-triggered entrance in the style of Magic UI's BlurFade: a short rise with a little blur,
 * played once when the element enters the viewport. The motion itself is CSS (`reveal` utility),
 * and it is skipped entirely for reduced motion or without IntersectionObserver.
 */
export default function Reveal({ children, delay = 0, className, as = "div", from }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  // Nothing to animate (reduced motion, or no observer to tell us when): render in place from the start.
  const [shown, setShown] = useState(
    () =>
      typeof window !== "undefined" &&
      (typeof IntersectionObserver === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches),
  );

  useEffect(() => {
    const node = ref.current;
    if (!node || shown) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -60px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [shown]);

  const props = {
    "data-reveal": shown ? "in" : "out",
    "data-from": from,
    className: cn("reveal", className),
    style: delay ? ({ transitionDelay: `${delay}s` } as CSSProperties) : undefined,
  };

  return as === "li" ? (
    <li ref={(node) => void (ref.current = node)} {...props}>
      {children}
    </li>
  ) : (
    <div ref={(node) => void (ref.current = node)} {...props}>
      {children}
    </div>
  );
}
