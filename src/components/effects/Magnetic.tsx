import { useRef, type ReactNode } from "react";
import { useMagnetic } from "@/lib/pointer";
import { cn } from "@/lib/utils";

/** Wrap a button or link to give it a gentle magnetic pull toward the cursor (mouse only). */
export default function Magnetic({ children, className, strength }: { children: ReactNode; className?: string; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useMagnetic(ref, strength);
  return (
    <span ref={ref} className={cn("inline-flex", className)}>
      {children}
    </span>
  );
}
