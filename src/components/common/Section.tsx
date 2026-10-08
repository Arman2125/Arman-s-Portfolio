import type { ReactNode } from "react";
import Reveal from "@/components/effects/Reveal";
import { seqDelay } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Splits a heading into words that rise out of their own masks, one after another. */
function SplitWords({ text, start, step = 45 }: { text: string; start: number; step?: number }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span key={`${word}-${i}`}>
          {i > 0 ? " " : null}
          <span className="-mb-[0.1em] inline-block overflow-hidden pb-[0.1em] align-bottom">
            <span className="seq-rise" style={seqDelay(start + i * step)}>
              {word}
            </span>
          </span>
        </span>
      ))}
    </>
  );
}

interface SectionHeaderProps {
  id: string;
  index: string;
  label: string;
  title: ReactNode;
  lead?: ReactNode;
  className?: string;
}

/**
 * Numbered eyebrow, h2 and an optional lead. The h2 id labels the surrounding <section>.
 * On reveal the hairline draws in, the title rises word by word and the lead follows.
 */
export function SectionHeader({ id, index, label, title, lead, className }: SectionHeaderProps) {
  const words = typeof title === "string" ? title.split(" ").length : 1;
  return (
    <Reveal className={cn("max-w-2xl", className)}>
      <p className="eyebrow flex items-center gap-2.5 text-muted-foreground">
        <span className="text-brand">{index}</span>
        <span aria-hidden="true" className="h-px w-8 seq-grow bg-brand/50" style={seqDelay(120)} />
        {label}
      </p>
      <h2 id={`${id}-title`} className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-balance sm:text-[2.6rem] sm:leading-[1.1]">
        {typeof title === "string" ? <SplitWords text={title} start={80} /> : title}
      </h2>
      {lead ? (
        <p
          className="mt-5 seq-item text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg"
          style={seqDelay(160 + words * 45)}
        >
          {lead}
        </p>
      ) : null}
    </Reveal>
  );
}

interface SectionProps {
  id: string;
  /** Softly tinted band, used on alternate sections for rhythm; it fades in and out rather than starting at a border. */
  band?: boolean;
  className?: string;
  children: ReactNode;
}

export function Section({ id, band, className, children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("relative py-24 sm:py-32", band && "band-fade", className)}>
      <div className="container-page">{children}</div>
    </section>
  );
}
