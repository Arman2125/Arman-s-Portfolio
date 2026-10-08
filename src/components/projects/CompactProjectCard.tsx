import { useRef } from "react";
import ExternalLinkButtons from "@/components/common/ExternalLinkButtons";
import TechTag from "@/components/common/TechTag";
import SpotlightCard from "@/components/effects/SpotlightCard";
import type { Project } from "@/data/resume";
import { useTilt } from "@/lib/pointer";
import ProjectDialog from "./ProjectDialog";
import ProjectPreview from "./ProjectPreview";

/** Smaller project card: the preview tilts toward the cursor and zooms slightly; the card lifts with a spotlight. */
export default function CompactProjectCard({ project }: { project: Project }) {
  const tags = project.stack.length ? project.stack : (project.topics ?? []);
  const paneRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  useTilt(tiltRef, { max: 6, trigger: paneRef });

  return (
    <SpotlightCard className="group flex h-full flex-col overflow-hidden hover-lift">
      <div ref={paneRef} className="overflow-hidden border-b bg-muted/50 p-5 dark:bg-muted/25">
        <div ref={tiltRef} className="[transform-style:preserve-3d]">
          <ProjectPreview kind={project.preview} className="transition-[scale] duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.03]" />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="font-mono text-xs text-muted-foreground">{project.tagline}</p>
        <h3 className="mt-2 text-lg font-semibold tracking-tight">{project.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{project.summary}</p>
        {tags.length ? (
          <ul className="mt-5 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <li key={tag}>
                <TechTag>{tag}</TechTag>
              </li>
            ))}
          </ul>
        ) : null}
        {project.details || project.links.github || project.links.demo ? (
          <div className="mt-6 flex flex-wrap gap-3">
            <ProjectDialog project={project} />
            <ExternalLinkButtons github={project.links.github} demo={project.links.demo} />
          </div>
        ) : null}
      </div>
    </SpotlightCard>
  );
}
