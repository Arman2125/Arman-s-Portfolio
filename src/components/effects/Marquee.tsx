import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  /** Seconds per loop. */
  duration?: number;
}

/**
 * Magic UI-style marquee: the track is rendered twice and slides by one track width, so the loop is
 * seamless. Pauses on hover/focus; under reduced motion it stops and the strip simply scrolls sideways.
 * The duplicate copy is hidden from assistive tech.
 */
export default function Marquee({ children, className, duration = 45 }: MarqueeProps) {
  return (
    <div
      className={cn(
        "group flex gap-(--marquee-gap) overflow-hidden mask-fade-x [--marquee-gap:0.75rem] motion-reduce:overflow-x-auto",
        className,
      )}
      style={{ ["--marquee-duration" as string]: `${duration}s` }}
    >
      {[0, 1].map((copy) => (
        <div
          key={copy}
          aria-hidden={copy === 1 ? true : undefined}
          className={cn(
            "flex shrink-0 items-center gap-(--marquee-gap) animate-marquee group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] motion-reduce:animate-none",
            copy === 1 && "motion-reduce:hidden",
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
