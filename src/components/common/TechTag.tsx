import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { logoFor } from "@/lib/techLogos";
import TechLogo from "./TechLogo";

interface TechTagProps {
  children: ReactNode;
  /** Dashed outline + label: the resume lists this skill as fundamentals, not production experience. */
  fundamentals?: boolean;
  /** Show the brand mark for this technology, when it has one (logo takes its brand colour on hover). */
  logo?: boolean;
  className?: string;
}

export default function TechTag({ children, fundamentals, logo, className }: TechTagProps) {
  const slug = logo && typeof children === "string" ? logoFor(children) : undefined;
  return (
    <span
      className={cn(
        "group/logo inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-xs leading-5 whitespace-nowrap transition-[border-color,background-color,color] duration-300",
        fundamentals
          ? "border-dashed border-muted-foreground/45 text-muted-foreground"
          : "border-border bg-secondary/70 text-foreground/90 hover:border-foreground/20 hover:bg-card",
        className,
      )}
    >
      {slug ? <TechLogo slug={slug} brandOnHover className="size-3 text-muted-foreground" /> : null}
      {children}
      {fundamentals ? <span className="text-[0.6875rem] tracking-wide text-muted-foreground/90">· fundamentals</span> : null}
    </span>
  );
}
