import { useEffect, useRef } from "react";
import { Section, SectionHeader } from "@/components/common/Section";
import TechTag from "@/components/common/TechTag";
import Reveal from "@/components/effects/Reveal";
import { Badge } from "@/components/ui/badge";
import { experience, type ExperienceItem } from "@/data/resume";
import { seqDelay } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** The rail sits on the left edge of the card column: x = 0 on phones, after the 11rem date column + gap from md. */
const RAIL_X = "left-0 md:left-[13.5rem]";

/**
 * Aceternity-style timeline beam: as the list scrolls past 60% of the viewport, a brand-coloured line fills the
 * rail and each role's node lights up when the line reaches it. Writes CSS variables / data attributes directly
 * (no React state), throttled to one update per frame. Under reduced motion the line is simply drawn full.
 */
function useTimelineProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = ref.current;
    if (!list) return;
    const nodes = () => list.querySelectorAll<HTMLElement>("[data-node]");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      list.style.setProperty("--progress", "1");
      nodes().forEach((node) => (node.dataset.active = "true"));
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const anchor = window.innerHeight * 0.6;
      const rect = list.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (anchor - rect.top) / rect.height));
      list.style.setProperty("--progress", progress.toFixed(4));
      nodes().forEach((node) => (node.dataset.active = String(node.getBoundingClientRect().top < anchor)));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return ref;
}

function ExperienceEntry({ item, last }: { item: ExperienceItem; last: boolean }) {
  let pointIndex = 0;

  return (
    <li className="grid gap-3 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-10">
      {/* the date rides along beside its card on wider screens */}
      <div className="pl-5 sm:pl-8 md:sticky md:top-28 md:self-start md:pt-7 md:pl-0 md:text-right">
        <p className="font-mono text-sm text-muted-foreground">{item.period}</p>
        {item.current ? (
          <Badge variant="outline" className="mt-2 gap-1.5 border-success/40 text-success">
            <span aria-hidden="true" className="size-1.5 animate-pulse-dot rounded-full bg-success" />
            Current role
          </Badge>
        ) : null}
      </div>

      <div className={cn("relative pl-5 sm:pl-8", !last && "pb-10")}>
        {/* node: muted until the beam reaches it, then lit with a soft ring */}
        <span
          data-node
          aria-hidden="true"
          className="absolute top-8 -left-[5px] size-[11px] rounded-full border-2 border-background bg-muted-foreground/40 transition-[background-color,scale] duration-500 data-[active=true]:scale-110 data-[active=true]:animate-[node-ping_1.1s_var(--ease-out-expo)_1] data-[active=true]:bg-brand"
        />
        <Reveal from="right">
          <article className="rounded-xl border bg-card p-5 shadow-card hover-lift hover:border-brand/30 sm:p-7">
            <header>
              <h3 className="text-lg font-semibold tracking-tight sm:text-xl">{item.role}</h3>
              <p className="mt-1 font-medium text-brand">{item.company}</p>
            </header>
            <p className="mt-4 leading-relaxed text-pretty text-muted-foreground">{item.summary}</p>

            <div className="mt-6 space-y-5">
              {item.groups.map((group) => (
                <div key={group.title}>
                  <h4 className="eyebrow text-muted-foreground">{group.title}</h4>
                  <ul className="mt-2.5 space-y-2">
                    {group.points.map((point) => (
                      <li
                        key={point}
                        className="flex seq-item gap-3 text-sm leading-relaxed sm:text-[0.9375rem]"
                        style={seqDelay(150 + pointIndex++ * 70)}
                      >
                        <span aria-hidden="true" className="mt-[0.6em] h-px w-3 shrink-0 bg-brand" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <ul className="mt-6 flex flex-wrap gap-1.5 border-t pt-5" aria-label={`Technologies used at ${item.company}`}>
              {item.stack.map((tech, i) => (
                <li key={tech} className="seq-item" style={seqDelay(300 + pointIndex * 70 + i * 35)}>
                  <TechTag>{tech}</TechTag>
                </li>
              ))}
            </ul>
          </article>
        </Reveal>
      </div>
    </li>
  );
}

export default function Experience() {
  const listRef = useTimelineProgress();

  return (
    <Section id="experience">
      <SectionHeader
        id="experience"
        index="03"
        label="Experience"
        title="Experience"
        lead="Two internships: full-stack Node.js web applications at ProAzure, then backend services and AI-platform work at SharpFlux."
      />
      <div ref={listRef} className="relative mt-12">
        {/* rail + scroll-driven fill */}
        <span aria-hidden="true" className={cn("absolute inset-y-0 w-px bg-border", RAIL_X)} />
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-y-0 w-px origin-top bg-gradient-to-b from-brand via-brand to-brand/10 shadow-[0_0_8px_var(--brand)]",
            RAIL_X,
          )}
          style={{ transform: "scaleY(var(--progress, 0))" }}
        />
        <ol>
          {experience.map((item, i) => (
            <ExperienceEntry key={item.id} item={item} last={i === experience.length - 1} />
          ))}
        </ol>
      </div>
    </Section>
  );
}
