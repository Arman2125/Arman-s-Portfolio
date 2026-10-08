import { Bug, Layers, ShieldCheck, Sparkles, type LucideIcon } from "lucide-react";
import { Section, SectionHeader } from "@/components/common/Section";
import Reveal from "@/components/effects/Reveal";
import ScrollText from "@/components/effects/ScrollText";
import { aboutParagraphs, workingPrinciples } from "@/data/resume";

const principleIcons: LucideIcon[] = [Layers, ShieldCheck, Bug, Sparkles];

export default function About() {
  const [intro, ...rest] = aboutParagraphs;

  return (
    <Section id="about">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeader id="about" index="01" label="About" title="I build the whole feature: interface, API and data." />
        </div>

        <div>
          {/* the introduction lights up word by word as it scrolls into the reading zone */}
          <ScrollText text={intro} className="text-xl leading-snug font-medium tracking-[-0.015em] text-pretty sm:text-[1.6rem] sm:leading-[1.4]" />

          <Reveal className="mt-8 space-y-5 text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
            {rest.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </Reveal>

          <h3 className="mt-14 eyebrow text-muted-foreground">How I work</h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {workingPrinciples.map((principle, i) => {
              const Icon = principleIcons[i % principleIcons.length];
              return (
                <Reveal as="li" key={principle.title} delay={(i % 2) * 0.08 + Math.floor(i / 2) * 0.06}>
                  {/* hover motion lives on an inner element so it doesn't fight the reveal transition */}
                  <div className="group h-full rounded-xl border bg-card p-5 shadow-card hover-lift">
                    <span className="grid size-9 place-items-center rounded-lg bg-brand-muted text-brand transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon
                        className="size-[1.125rem] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-110 group-hover:-rotate-6"
                        aria-hidden="true"
                      />
                    </span>
                    <p className="mt-4 font-medium">{principle.title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{principle.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </div>
    </Section>
  );
}
