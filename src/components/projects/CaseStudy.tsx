import { Check } from "lucide-react";
import { useRef, type PointerEvent } from "react";
import ExternalLinkButtons from "@/components/common/ExternalLinkButtons";
import TechTag from "@/components/common/TechTag";
import Magnetic from "@/components/effects/Magnetic";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/data/resume";
import { seqDelay } from "@/lib/motion";
import { useTilt } from "@/lib/pointer";
import { useScrollEffect } from "@/lib/useScrollEffect";
import { cn } from "@/lib/utils";
import ProjectDialog from "./ProjectDialog";
import ProjectPreview from "./ProjectPreview";

/**
 * A featured project as a two-column case study (`flip` alternates the preview side).
 * Motion, from outside in: the preview drifts against the scroll (parallax), tilts toward the cursor with its
 * layers at different depths, and zooms a touch on hover; the card lifts, a soft light follows the cursor and a
 * beam runs round the border. The text column builds in once on reveal (seq-* utilities).
 */
export default function CaseStudy({ project, flip }: { project: Project; flip: boolean }) {
  const articleRef = useRef<HTMLElement>(null);
  const paneRef = useRef<HTMLDivElement>(null);
  const driftRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  useTilt(tiltRef, { max: 7, trigger: paneRef });

  // -1 while the card's centre is below the viewport centre, +1 above it: the preview moves against the scroll.
  useScrollEffect(articleRef, ({ top, height, vh }) => {
    const t = Math.max(-1, Math.min(1, (vh / 2 - (top + height / 2)) / (vh / 2 + height / 2)));
    if (driftRef.current) driftRef.current.style.transform = `translate3d(0, ${(-t * 26).toFixed(2)}px, 0)`;
  });

  const trackLight = (event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };

  return (
    <article
      ref={articleRef}
      id={`project-${project.id}`}
      aria-labelledby={`project-${project.id}-title`}
      onPointerMove={trackLight}
      className="group relative overflow-hidden rounded-2xl border border-beam bg-card shadow-card transition-[box-shadow,translate] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:shadow-lift"
    >
      {/* cursor light across the whole card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 [background:radial-gradient(520px_circle_at_var(--mx,50%)_var(--my,50%),color-mix(in_srgb,var(--brand)_7%,transparent),transparent_65%)]"
      />
      <div className="relative grid lg:grid-cols-2">
        <div
          ref={paneRef}
          className={cn(
            "relative flex items-center overflow-hidden border-b bg-muted/50 p-5 sm:p-10 lg:border-b-0 dark:bg-muted/25",
            flip ? "lg:order-2 lg:border-l" : "lg:border-r",
          )}
        >
          <div aria-hidden="true" className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_at_center,#000,transparent_75%)]" />
          <div ref={driftRef} className="relative w-full">
            <div ref={tiltRef} className="[transform-style:preserve-3d]">
              <ProjectPreview
                kind={project.preview}
                className="transition-[scale] duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.025]"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col p-5 sm:p-8 lg:p-10">
          <div className="flex seq-item flex-wrap items-center gap-x-3 gap-y-2" style={seqDelay(80)}>
            <Badge variant="outline" className="border-brand/40 text-brand">
              {project.tagline}
            </Badge>
            <span className="font-mono text-xs text-muted-foreground">{project.context}</span>
          </div>
          <h3 id={`project-${project.id}-title`} className="mt-4 seq-item text-2xl font-semibold tracking-tight text-balance sm:text-[1.7rem]" style={seqDelay(140)}>
            {project.title}
          </h3>
          <p className="mt-3 seq-item leading-relaxed text-pretty text-muted-foreground" style={seqDelay(200)}>
            {project.summary}
          </p>

          <ul className="mt-6 space-y-2.5">
            {project.highlights.map((highlight, i) => (
              <li key={highlight} className="flex seq-item gap-3 text-sm leading-relaxed" style={seqDelay(280 + i * 80)}>
                <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 seq-draw text-brand" style={seqDelay(400 + i * 80)} />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>

          <ul className="mt-6 flex flex-wrap gap-1.5" aria-label={`Technologies used in ${project.title}`}>
            {project.stack.map((tech, i) => (
              <li key={tech} className="seq-item" style={seqDelay(620 + i * 35)}>
                <TechTag>{tech}</TechTag>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex seq-item flex-wrap items-center gap-3 lg:mt-auto lg:pt-8" style={seqDelay(760)}>
            <Magnetic>
              <ProjectDialog project={project} />
            </Magnetic>
            <ExternalLinkButtons github={project.links.github} demo={project.links.demo} size="default" />
          </div>
        </div>
      </div>
    </article>
  );
}
