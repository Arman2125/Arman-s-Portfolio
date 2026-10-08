import { Award, GraduationCap } from "lucide-react";
import { Section, SectionHeader } from "@/components/common/Section";
import Reveal from "@/components/effects/Reveal";
import { Badge } from "@/components/ui/badge";
import { certifications, education } from "@/data/resume";
import { seqDelay } from "@/lib/motion";

export default function Education() {
  return (
    <Section id="education">
      <SectionHeader id="education" index="07" label="Education" title="Education & certifications" />

      <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <ol className="space-y-4">
          {education.map((item, i) => (
            <Reveal as="li" key={item.degree} delay={i * 0.06}>
              {/* hover motion lives on an inner element so it doesn't fight the reveal transition */}
              <div className="flex gap-4 rounded-xl border bg-card p-5 shadow-card hover-lift sm:p-6">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand-muted text-brand">
                  <GraduationCap className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <h3 className="font-semibold tracking-tight">{item.degree}</h3>
                    {item.current ? (
                      <Badge variant="outline" className="border-brand/40 text-brand">
                        In progress
                      </Badge>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.school}, {item.place}
                  </p>
                  <p className="mt-2 font-mono text-xs text-muted-foreground">{item.period}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={0.1} className="rounded-xl border bg-card p-5 shadow-card sm:p-6">
          <h3 className="flex items-center gap-2.5 font-semibold tracking-tight">
            <Award className="size-[1.125rem] text-brand" aria-hidden="true" />
            Certifications & training
          </h3>
          <ul className="mt-4 divide-y">
            {certifications.map((cert, i) => (
              <li key={cert.name} className="seq-item py-3 text-sm first:pt-1 last:pb-0" style={seqDelay(150 + i * 70)}>
                <span className="font-medium">{cert.name}</span>
                {cert.issuer ? <span className="mt-0.5 block text-muted-foreground">{cert.issuer}</span> : null}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
