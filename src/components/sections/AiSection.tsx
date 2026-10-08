import { Award, Boxes, Code2, MessagesSquare, Plug, ShieldCheck, Sparkles, type LucideIcon } from "lucide-react";
import { Fragment, useEffect, useRef, type CSSProperties } from "react";
import { Section, SectionHeader } from "@/components/common/Section";
import TechLogo from "@/components/common/TechLogo";
import TechTag from "@/components/common/TechTag";
import Reveal from "@/components/effects/Reveal";
import SpotlightCard from "@/components/effects/SpotlightCard";
import { aiCapabilities, aiFlow, aiFoundation, type AiFlowIcon } from "@/data/resume";
import { seqDelay } from "@/lib/motion";
import { cn } from "@/lib/utils";

function FlowIcon({ id }: { id: AiFlowIcon }) {
  if (id === "whatsapp") return <TechLogo slug="whatsapp" className="size-6" />;
  if (id === "mcp") return <TechLogo slug="modelcontextprotocol" className="size-6" />;
  const Icon = { state: MessagesSquare, llm: Sparkles, apps: Boxes }[id];
  return <Icon className={cn("size-6", id === "llm" && "size-7")} aria-hidden="true" />;
}

const capabilityIcons: LucideIcon[] = [Sparkles, Plug, MessagesSquare, ShieldCheck];

/**
 * The request path as a pipeline (Magic UI AnimatedBeam-style): nodes pop in, connectors appear, then light
 * pulses run along them in sequence. Horizontal from lg, vertical below. Pulses only animate while the
 * diagram is on screen and never under reduced motion.
 */
function AiFlowDiagram() {
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = ref.current;
    if (!list) return;
    const observer = new IntersectionObserver(([entry]) => (list.dataset.play = String(entry.isIntersecting)));
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  return (
    <ol ref={ref} data-play="false" aria-label="How a request flows through the AI workflows I work on" className="flex flex-col lg:flex-row lg:items-start">
      {aiFlow.map((node, i) => {
        const core = node.id === "llm";
        return (
          <Fragment key={node.id}>
            <li className="flex items-center gap-4 lg:w-36 lg:shrink-0 lg:flex-col lg:gap-3 lg:text-center">
              <span
                className={cn(
                  "relative grid size-14 shrink-0 seq-pop place-items-center rounded-2xl border bg-background text-foreground/85 shadow-card",
                  core && "size-16 border-brand/40 text-brand shadow-[0_0_0_6px_var(--brand-muted),0_12px_32px_-12px_color-mix(in_srgb,var(--brand)_60%,transparent)]",
                )}
                style={seqDelay(i * 140)}
              >
                <FlowIcon id={node.id} />
              </span>
              <span className="block seq-item" style={seqDelay(i * 140 + 90)}>
                <span className={cn("block text-sm font-semibold tracking-tight", core && "text-brand")}>{node.label}</span>
                <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">{node.detail}</span>
              </span>
            </li>
            {i < aiFlow.length - 1 ? (
              <li
                aria-hidden="true"
                className="relative my-1.5 ml-[27px] h-9 w-0.5 seq-item overflow-hidden rounded-full bg-border lg:mx-1 lg:my-0 lg:mt-[27px] lg:h-0.5 lg:w-auto lg:min-w-6 lg:flex-1"
                style={{ ...seqDelay(i * 140 + 160), "--beam-delay": `${i * 0.45}s` } as CSSProperties}
              >
                <span className="beam-x absolute inset-y-0 left-0 hidden w-2/5 rounded-full bg-gradient-to-r from-transparent via-brand to-transparent lg:block" />
                <span className="beam-y absolute inset-x-0 top-0 h-3/5 rounded-full bg-gradient-to-b from-transparent via-brand to-transparent lg:hidden" />
              </li>
            ) : null}
          </Fragment>
        );
      })}
    </ol>
  );
}

export default function AiSection() {
  return (
    <Section id="ai">
      <SectionHeader
        id="ai"
        index="05"
        label="AI"
        title="AI application development"
        lead="How I put LLMs to work inside real applications, from my work on Playground and Sugam AI OS at SharpFlux Technologies."
      />

      <Reveal from="scale" className="relative mt-12 overflow-hidden rounded-2xl border bg-card p-6 shadow-card sm:p-10">
        <div aria-hidden="true" className="absolute inset-0 bg-grid opacity-70 [mask-image:radial-gradient(ellipse_at_center,#000,transparent_75%)]" />
        <div className="relative">
          <p className="eyebrow mb-8 text-muted-foreground">How a request flows · simplified</p>
          <AiFlowDiagram />
        </div>
      </Reveal>

      <ul className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {aiCapabilities.map((capability, i) => {
          const Icon = capabilityIcons[i % capabilityIcons.length];
          return (
            <Reveal as="li" key={capability.title} delay={i * 0.07}>
              <SpotlightCard className="group flex h-full flex-col p-5 hover-lift sm:p-6">
                <span className="grid size-9 place-items-center rounded-lg bg-brand-muted text-brand transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-[1.125rem] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-110" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-semibold tracking-tight">{capability.title}</h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">{capability.text}</p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {capability.tags.map((tag) => (
                    <li key={tag}>
                      <TechTag logo>{tag}</TechTag>
                    </li>
                  ))}
                </ul>
              </SpotlightCard>
            </Reveal>
          );
        })}
      </ul>

      <Reveal className="mt-6 flex flex-col gap-3 rounded-xl border border-dashed px-5 py-4 text-sm sm:flex-row sm:items-center sm:gap-8">
        <span className="flex items-center gap-2.5">
          <Code2 className="size-4 shrink-0 text-brand" aria-hidden="true" />
          {aiFoundation.practice}
        </span>
        <span className="flex items-center gap-2.5">
          <Award className="size-4 shrink-0 text-brand" aria-hidden="true" />
          Certification: {aiFoundation.certification}
        </span>
      </Reveal>
    </Section>
  );
}
