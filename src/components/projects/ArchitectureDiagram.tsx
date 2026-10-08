import { ArrowDown } from "lucide-react";
import type { ArchitectureLayer } from "@/data/resume";

/** Layers drop in top to bottom, like a request travelling through the stack. */
const stagger = (step: number) => ({ animationDelay: `${120 + step * 110}ms`, animationFillMode: "both" as const });
const IN = "animate-in fade-in-0 slide-in-from-top-2 duration-500";

function Layer({ layer, dashed, step }: { layer: ArchitectureLayer; dashed?: boolean; step: number }) {
  return (
    <div
      style={stagger(step)}
      className={`grid gap-3 rounded-lg border bg-card p-4 sm:grid-cols-[9.5rem_minmax(0,1fr)] sm:items-center ${IN} ${dashed ? "border-dashed" : ""}`}
    >
      <div>
        <p className="eyebrow text-brand">{layer.name}</p>
        <p className="mt-1 text-sm font-medium">{layer.tech}</p>
      </div>
      <ul className="flex flex-wrap gap-1.5">
        {layer.items.map((item) => (
          <li key={item} className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

interface Props {
  layers: ArchitectureLayer[];
  crossCutting?: string[];
  note: string;
}

/** Top-to-bottom request flow, with side services and cross-cutting concerns shown separately. */
export default function ArchitectureDiagram({ layers, crossCutting, note }: Props) {
  const flow = layers.filter((layer) => !layer.side);
  const side = layers.filter((layer) => layer.side);

  return (
    <figure>
      <ol aria-label="Request flow, top to bottom">
        {flow.map((layer, i) => (
          <li key={layer.name}>
            <Layer layer={layer} step={i} />
            {i < flow.length - 1 ? (
              <div aria-hidden="true" className={`flex justify-center py-1.5 text-muted-foreground ${IN}`} style={stagger(i + 0.5)}>
                <ArrowDown className="size-4" />
              </div>
            ) : null}
          </li>
        ))}
      </ol>

      {side.length ? (
        <div className="mt-4">
          <p className="eyebrow mb-2 text-muted-foreground">Alongside</p>
          <div className="space-y-2">
            {side.map((layer, i) => (
              <Layer key={layer.name} layer={layer} dashed step={flow.length + i} />
            ))}
          </div>
        </div>
      ) : null}

      {crossCutting?.length ? (
        <div className={`mt-4 rounded-lg border border-dashed p-4 ${IN}`} style={stagger(flow.length + side.length)}>
          <p className="eyebrow text-muted-foreground">Across every layer</p>
          <p className="mt-2 text-sm">{crossCutting.join(" · ")}</p>
        </div>
      ) : null}

      <figcaption className="mt-4 text-sm text-muted-foreground">{note}</figcaption>
    </figure>
  );
}
