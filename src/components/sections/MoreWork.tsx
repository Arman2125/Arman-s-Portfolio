import { ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/common/BrandIcons";
import { Section, SectionHeader } from "@/components/common/Section";
import Reveal from "@/components/effects/Reveal";
import SpotlightCard from "@/components/effects/SpotlightCard";
import CompactProjectCard from "@/components/projects/CompactProjectCard";
import { projects, socials } from "@/data/resume";
import { cn } from "@/lib/utils";

/** Earlier projects, plus a way into everything else on GitHub (only when a GitHub URL is set). */
export default function MoreWork() {
  const others = projects.filter((project) => !project.featured);
  if (!others.length) return null;

  return (
    <Section id="more-work" band>
      <SectionHeader id="more-work" index="06" label="More work" title="More projects" lead="Earlier web projects, and the rest of my code on GitHub." />

      <ul className={cn("mt-12 grid gap-6 md:grid-cols-2", socials.github && "lg:grid-cols-3")}>
        {others.map((project, i) => (
          <Reveal as="li" key={project.id} delay={i * 0.08}>
            <CompactProjectCard project={project} />
          </Reveal>
        ))}
        {socials.github ? (
          <Reveal as="li" delay={others.length * 0.08} className="md:col-span-2 lg:col-span-1">
            <a href={socials.github} target="_blank" rel="noreferrer" className="block h-full rounded-xl">
              <SpotlightCard className="group flex h-full flex-col justify-between gap-10 overflow-hidden p-6 hover-lift sm:p-8">
                {/* oversized mark, drifting against the cursor like the skill cards' watermarks */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-10 -right-12 -z-10 text-foreground/[0.04] transition-[rotate,scale,color] duration-700 ease-[var(--ease-out-expo)] [translate:calc((var(--px,0.5)-0.5)*-22px)_calc((var(--py,0.5)-0.5)*-22px)] group-hover:-rotate-6 group-hover:scale-105 group-hover:text-brand/[0.07]"
                >
                  <GithubIcon size={240} />
                </span>
                <span className="grid size-12 place-items-center rounded-xl border bg-background shadow-card transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-110 group-hover:-rotate-6">
                  <GithubIcon size={22} />
                </span>
                <span>
                  <span className="block text-lg font-semibold tracking-tight">More on GitHub</span>
                  <span className="mt-1.5 block text-sm leading-relaxed text-muted-foreground">Browse my public repositories.</span>
                  <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-sm text-brand">
                    {socials.github.replace(/^https:\/\//, "")}
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </span>
              </SpotlightCard>
            </a>
          </Reveal>
        ) : null}
      </ul>
    </Section>
  );
}
