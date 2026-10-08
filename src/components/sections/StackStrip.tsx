import TechLogo from "@/components/common/TechLogo";
import { logoFor } from "@/lib/techLogos";
import Marquee from "@/components/effects/Marquee";
import { heroStack } from "@/data/resume";

/** The hands-on stack as a slow marquee of logo chips between the hero and About (pauses on hover). */
export default function StackStrip() {
  return (
    <div className="relative border-y border-border/70 bg-card/60 backdrop-blur-sm">
      <div className="container-page flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:gap-8">
        <p className="eyebrow shrink-0 text-muted-foreground">
          Hands-on with<span className="sr-only">: {heroStack.join(", ")}</span>
        </p>
        <div aria-hidden="true" className="min-w-0 flex-1">
          <Marquee duration={50}>
            {heroStack.map((tech) => {
              const slug = logoFor(tech);
              return (
                <span
                  key={tech}
                  className="group/logo flex items-center gap-2 rounded-full border border-border/80 bg-background/70 px-3 py-1.5 font-mono text-[0.8125rem] whitespace-nowrap text-foreground/80 transition-colors duration-300 hover:border-foreground/20 hover:text-foreground"
                >
                  {slug ? (
                    <TechLogo slug={slug} brandOnHover className="size-3.5 text-foreground/60" />
                  ) : (
                    <span className="size-1.5 rounded-full bg-brand/70" />
                  )}
                  {tech}
                </span>
              );
            })}
          </Marquee>
        </div>
      </div>
    </div>
  );
}
