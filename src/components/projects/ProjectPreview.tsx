import { Check, Paperclip, Sprout, Star, Utensils } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import type { PreviewKind } from "@/data/resume";
import { seqDelay } from "@/lib/motion";
import { cn } from "@/lib/utils";

/*
 * Schematic previews: simplified drawings of each project's main flow, built from the theme tokens.
 * They are illustrations of the features the resume describes, not screenshots, and carry no data.
 * When the card scrolls into view each one plays a short sequence (seq-* utilities, keyed off the
 * surrounding <Reveal>): a conversation turning into tool calls, products and meals arriving.
 */

function Bar({ w, className, style }: { w: string; className?: string; style?: CSSProperties }) {
  return <span className={cn("block h-1.5 rounded-full bg-foreground/12", className)} style={{ width: w, ...style }} />;
}

function Frame({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("tilt-layer overflow-hidden rounded-lg border bg-background shadow-card [--depth:-6]", className)}>
      <div className="flex items-center gap-1.5 border-b bg-muted/70 px-3 py-2">
        <span className="size-2 rounded-full bg-foreground/15" />
        <span className="size-2 rounded-full bg-foreground/15" />
        <span className="size-2 rounded-full bg-foreground/15" />
        <span className="ml-2 font-mono text-[0.6875rem] text-muted-foreground">{title}</span>
      </div>
      <div className="p-3 sm:p-4">{children}</div>
    </div>
  );
}

function Bubble({ side, children, delay }: { side: "in" | "out"; children: ReactNode; delay: number }) {
  return (
    <div className={cn("flex seq-item", side === "out" && "justify-end")} style={seqDelay(delay)}>
      <div
        className={cn(
          "w-[62%] space-y-1.5 rounded-lg px-2.5 py-2",
          side === "in" ? "rounded-bl-sm border bg-card" : "rounded-br-sm bg-brand-muted",
        )}
      >
        {children}
      </div>
    </div>
  );
}

const trace: [string, string][] = [
  ["recv", "message · deduped"],
  ["mcp", "tools/list"],
  ["mcp", "tools/call"],
  ["state", "conversation saved"],
];

function SugamPreview() {
  return (
    <Frame title="Conversation">
      <div className="space-y-2">
        <Bubble side="in" delay={250}>
          <Bar w="85%" />
          <Bar w="55%" />
        </Bubble>
        <Bubble side="out" delay={700}>
          <Bar w="75%" className="bg-brand/30" />
        </Bubble>
        <Bubble side="in" delay={1100}>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Paperclip className="size-3" />
            <Bar w="60%" />
          </div>
        </Bubble>
      </div>
      {/* the workflow log fills in line by line, each step ticking off */}
      <div className="tilt-layer mt-3 rounded-md border bg-card p-2.5 font-mono text-[0.6875rem] leading-5 shadow-card [--depth:16]">
        {trace.map(([kind, label], i) => (
          <div key={label} className="flex seq-item items-center gap-2" style={seqDelay(1450 + i * 260)}>
            <span className="w-10 shrink-0 text-brand">{kind}</span>
            <span className="truncate text-foreground/80">{label}</span>
            <Check className="ml-auto size-3 shrink-0 seq-pop text-success" style={seqDelay(1600 + i * 260)} />
          </div>
        ))}
      </div>
    </Frame>
  );
}

function FarmersPreview() {
  return (
    <Frame title="Fertilizers">
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="seq-item rounded-md border bg-card p-2" style={seqDelay(250 + i * 130)}>
            <div className="grid aspect-[4/3] place-items-center rounded bg-gradient-to-br from-lime-100 to-emerald-50 dark:from-emerald-950 dark:to-stone-800">
              <Sprout className="size-5 text-emerald-700/70 dark:text-emerald-400/70" />
            </div>
            <Bar w="75%" className="mt-2" />
            <div className="mt-2 rounded bg-primary py-1 text-center text-[0.625rem] font-medium text-primary-foreground">Buy</div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

function MealsPreview() {
  return (
    <Frame title="Meals">
      <div className="flex gap-1.5">
        {["w-14", "w-10", "w-12"].map((w, i) => (
          <span
            key={w}
            className={cn("flex h-5 seq-item items-center rounded-full border px-2", i === 0 ? "border-brand/50 bg-brand-muted" : "bg-card")}
            style={seqDelay(200 + i * 90)}
          >
            <span className={cn("block h-1.5 rounded-full", w, i === 0 ? "bg-brand/50" : "bg-foreground/12")} />
          </span>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {[0, 1].map((i) => (
          <div key={i} className="flex seq-item gap-2 rounded-md border bg-card p-2" style={seqDelay(500 + i * 130)}>
            <div className="grid size-9 shrink-0 place-items-center rounded bg-gradient-to-br from-amber-100 to-orange-50 dark:from-amber-950 dark:to-stone-800">
              <Utensils className="size-4 text-amber-700/70 dark:text-amber-400/70" />
            </div>
            <div className="flex-1 space-y-1.5 pt-1">
              <Bar w="90%" />
              <Bar w="60%" className="bg-foreground/8" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-0.5 rounded-md border bg-card p-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star
            key={i}
            className={cn("size-3 seq-pop", i < 4 ? "fill-brand text-brand" : "text-foreground/25")}
            style={seqDelay(850 + i * 90)}
          />
        ))}
        <Bar w="40%" className="ml-2" />
      </div>
    </Frame>
  );
}

const previews: Record<PreviewKind, () => ReactNode> = {
  sugam: SugamPreview,
  farmers: FarmersPreview,
  meals: MealsPreview,
};

export default function ProjectPreview({ kind, className }: { kind: PreviewKind; className?: string }) {
  const Preview = previews[kind];
  return (
    <div aria-hidden="true" className={cn("select-none", className)}>
      <Preview />
    </div>
  );
}
