import { AppWindow, Boxes, Braces, Check, Database, FlaskConical, Server, Sparkles, Wrench, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { Section, SectionHeader } from "@/components/common/Section";
import TechTag from "@/components/common/TechTag";
import Reveal from "@/components/effects/Reveal";
import SpotlightCard from "@/components/effects/SpotlightCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { skillGroups, skillUsage, usagePlaces, type SkillGroup, type SkillGroupId, type UsagePlaceId } from "@/data/resume";
import { seqDelay } from "@/lib/motion";
import { cn } from "@/lib/utils";

const groupIcons: Record<SkillGroupId, LucideIcon> = {
  frontend: AppWindow,
  programming: Braces,
  backend: Server,
  ai: Sparkles,
  databases: Database,
  testing: FlaskConical,
  tools: Wrench,
  practices: Boxes,
};

/** Bento spans: the AI group (the longest list) gets the wide tile so rows of three (two on tablets) stay even. */
const groupSpans: Partial<Record<SkillGroupId, string>> = {
  ai: "lg:col-span-2",
};

function SkillGroupCard({ group }: { group: SkillGroup }) {
  const Icon = groupIcons[group.id];
  return (
    <SpotlightCard className="group h-full overflow-hidden p-5 hover-lift sm:p-6">
      {/* oversized watermark of the group icon: drifts against the cursor and turns slightly on hover */}
      <Icon
        aria-hidden="true"
        strokeWidth={1}
        className="pointer-events-none absolute -right-6 -bottom-6 -z-10 size-36 text-foreground/[0.035] transition-[rotate,scale,color] duration-700 ease-[var(--ease-out-expo)] [translate:calc((var(--px,0.5)-0.5)*-18px)_calc((var(--py,0.5)-0.5)*-18px)] group-hover:-rotate-12 group-hover:scale-110 group-hover:text-brand/[0.07]"
      />
      <div className="flex items-start gap-3.5">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-muted text-brand transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="size-[1.125rem] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-110" aria-hidden="true" />
        </span>
        <div>
          <h3 className="font-semibold tracking-tight">{group.label}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{group.blurb}</p>
        </div>
      </div>
      <ul className="mt-5 flex flex-wrap gap-1.5" aria-label={`${group.label} skills`}>
        {group.skills.map((skill, i) => (
          <li key={skill.name} className="seq-item" style={seqDelay(160 + i * 35)}>
            <TechTag fundamentals={skill.fundamentals} logo>
              {skill.name}
            </TechTag>
          </li>
        ))}
      </ul>
    </SpotlightCard>
  );
}

/** "Where I've used it": pointing at a column (or any of its cells) highlights that place's whole column. */
function UsageTable() {
  const [place, setPlace] = useState<UsagePlaceId | null>(null);
  const cellTone = (id: UsagePlaceId) =>
    cn("transition-[background-color,opacity] duration-300", place === id && "bg-brand-muted/70", place && place !== id && "opacity-55");

  return (
    <div className="mt-20">
      <Reveal className="max-w-2xl">
        <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">Where I&rsquo;ve used it</h3>
        <p className="mt-2 text-muted-foreground">
          Each mark comes from an experience or project entry on my resume. Point at a column to trace it.
        </p>
      </Reveal>

      <Reveal from="scale" className="mt-6 overflow-hidden rounded-xl border bg-card shadow-card">
        <Table className="text-sm" onPointerLeave={() => setPlace(null)}>
          <caption className="sr-only">Skills and where each was used: SharpFlux and ProAzure</caption>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-auto py-3 pl-3 sm:pl-6">Skill</TableHead>
              {usagePlaces.map((p) => (
                <TableHead
                  key={p.id}
                  onPointerEnter={() => setPlace(p.id)}
                  className={cn("h-auto px-1.5 py-3 text-center sm:px-2", cellTone(p.id))}
                >
                  <span className="block font-medium text-foreground">{p.label}</span>
                  <span className="hidden font-mono text-[0.6875rem] font-normal text-muted-foreground sm:block">{p.detail}</span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {skillUsage.map((row, i) => (
              <TableRow key={row.skill}>
                <TableCell className="py-2.5 pl-3 font-medium whitespace-normal sm:pl-6">
                  <span className="block seq-item" style={seqDelay(i * 35)}>
                    {row.skill}
                  </span>
                </TableCell>
                {usagePlaces.map((p) => {
                  const used = row.usedIn.includes(p.id);
                  return (
                    <TableCell
                      key={p.id}
                      onPointerEnter={() => setPlace(p.id)}
                      className={cn("px-1.5 py-2.5 text-center sm:px-2", cellTone(p.id))}
                    >
                      {used ? (
                        <Check className="mx-auto size-4 seq-draw text-brand" style={seqDelay(i * 35 + 220)} aria-label={`Used at ${p.label}`} />
                      ) : (
                        <span className="text-muted-foreground/50" aria-label={`Not listed for ${p.label}`}>
                          &middot;
                        </span>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Reveal>
    </div>
  );
}

export default function Skills() {
  return (
    <Section id="skills" band>
      <SectionHeader
        id="skills"
        index="02"
        label="Skills"
        title="Technical skills"
        lead={
          <>
            Grouped by area. <span className="text-foreground">Dashed tags are fundamentals</span>: working knowledge I&rsquo;m
            building on, not claimed as production experience.
          </>
        }
      />

      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, i) => (
          <Reveal key={group.id} delay={(i % 3) * 0.07} className={cn(groupSpans[group.id])}>
            <SkillGroupCard group={group} />
          </Reveal>
        ))}
      </div>

      <UsageTable />
    </Section>
  );
}
