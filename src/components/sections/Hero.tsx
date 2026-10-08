import { ArrowRight, FileText, Mail, MapPin } from "lucide-react";
import { useEffect, useRef } from "react";
import { GithubIcon } from "@/components/common/BrandIcons";
import GridCells from "@/components/effects/GridCells";
import Magnetic from "@/components/effects/Magnetic";
import Spotlight from "@/components/effects/Spotlight";
import SpotlightCard from "@/components/effects/SpotlightCard";
import { Button } from "@/components/ui/button";
import { education, experience, profile, socials } from "@/data/resume";
import { enterDelay as delay } from "@/lib/motion";
import { createFollower, useTilt } from "@/lib/pointer";
import { hasFinePointer, prefersReducedMotion } from "@/lib/scroll";
import { clamp01, useScrollEffect } from "@/lib/useScrollEffect";

/** Portrait with a brand ring that draws itself around it, then the photo opens from the centre. */
function Avatar() {
  return (
    <div className="relative size-14 shrink-0 sm:size-16">
      <svg aria-hidden="true" viewBox="0 0 100 100" className="absolute -inset-[5px] size-[calc(100%+10px)] -rotate-90">
        <circle
          cx="50"
          cy="50"
          r="48"
          pathLength={100}
          className="animate-ring fill-none stroke-brand/70 [stroke-dasharray:100] [stroke-dashoffset:100] [stroke-width:2]"
        />
      </svg>
      <img
        src="/images/arman-shaikh.webp"
        alt="Portrait of Arman Shaikh"
        width={128}
        height={128}
        decoding="async"
        fetchPriority="high"
        className="size-full animate-avatar rounded-full bg-muted object-cover"
      />
    </div>
  );
}

/** A compact fact sheet: what a recruiter wants to know in the first five seconds. */
function AtAGlance() {
  const [current, previous] = experience;
  const degree = education[0];
  const rows = [
    { label: "Now", value: current.role, sub: current.company },
    { label: "Before", value: previous.role, sub: previous.company },
    { label: "Studying", value: degree.degree, sub: `${degree.school} · ${degree.period.toLowerCase()}` },
  ];

  return (
    <SpotlightCard className="p-5 shadow-lift sm:p-7">
      <div className="flex items-center gap-4">
        <Avatar />
        <div className="min-w-0 animate-enter" style={delay(700)}>
          <p className="eyebrow text-muted-foreground">At a glance</p>
          <p className="mt-1 font-semibold tracking-tight">{profile.name}</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
            {profile.location}
          </p>
        </div>
      </div>
      <dl className="mt-5 divide-y border-t">
        {rows.map((row, i) => (
          <div
            key={row.label}
            style={delay(820 + i * 90)}
            className="grid animate-enter grid-cols-[5.5rem_minmax(0,1fr)] gap-4 py-3.5 last:pb-0"
          >
            <dt className="pt-0.5 font-mono text-xs text-muted-foreground">{row.label}</dt>
            <dd>
              <span className="block text-sm font-medium">{row.value}</span>
              {row.sub ? <span className="mt-0.5 block text-sm text-muted-foreground">{row.sub}</span> : null}
            </dd>
          </div>
        ))}
      </dl>
    </SpotlightCard>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  useTilt(tiltRef, { max: 5 });

  // Leaving the hero: three depths. The copy lifts and fades a little, the card lifts faster, the grid lags behind.
  useScrollEffect(sectionRef, ({ top, height }) => {
    const p = clamp01(-top / height);
    if (copyRef.current) {
      copyRef.current.style.transform = `translate3d(0, ${(-p * 64).toFixed(2)}px, 0)`;
      copyRef.current.style.opacity = (1 - p * 0.7).toFixed(3);
    }
    if (visualRef.current) visualRef.current.style.transform = `translate3d(0, ${(-p * 120).toFixed(2)}px, 0)`;
    if (backdropRef.current) backdropRef.current.style.transform = `translate3d(0, ${(p * 100).toFixed(2)}px, 0)`;
  });

  // Cursor parallax across the hero (mouse only): writes --hx / --hy (-1…1); layers translate by different amounts.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !hasFinePointer() || prefersReducedMotion()) return;
    const follower = createFollower((x, y) => {
      section.style.setProperty("--hx", x.toFixed(4));
      section.style.setProperty("--hy", y.toFixed(4));
    }, 0.07);
    const move = (event: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      follower.to(((event.clientX - rect.left) / rect.width) * 2 - 1, ((event.clientY - rect.top) / rect.height) * 2 - 1);
    };
    const leave = () => follower.to(0, 0);
    section.addEventListener("pointermove", move);
    section.addEventListener("pointerleave", leave);
    return () => {
      follower.stop();
      section.removeEventListener("pointermove", move);
      section.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-24 lg:pt-20"
    >
      {/* drafting grid with a few softly glowing cells; both share one origin so the cells sit on the lines */}
      <div ref={backdropRef} aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 mask-radial [translate:calc(var(--hx,0)*-10px)_calc(var(--hy,0)*-8px)]">
          <div className="absolute inset-0 bg-grid" />
          <GridCells />
        </div>
      </div>
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" />

      <div className="relative z-10 container-page grid grid-cols-[minmax(0,1fr)] items-center gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-16">
        <div ref={copyRef}>
          <a
            style={delay(0)}
            href="#experience"
            className="group inline-flex max-w-full animate-enter items-center gap-2 rounded-full border bg-card/80 px-3 py-1.5 text-xs text-muted-foreground shadow-card backdrop-blur transition-colors duration-300 hover:border-foreground/20 hover:text-foreground sm:text-[0.8125rem]"
          >
            <span aria-hidden="true" className="relative flex size-2 shrink-0">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success/60 [animation-duration:2.4s]" />
              <span className="relative inline-flex size-2 rounded-full bg-success" />
            </span>
            <span>
              <span className="sm:hidden">Intern at </span>
              <span className="hidden sm:inline">Currently a Software Engineering Intern at </span>
              <span className="text-foreground">{profile.currentCompany}</span>
            </span>
            <ArrowRight className="size-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5" />
          </a>

          {/* each word rises out of its own masked line box */}
          <h1 id="hero-title" className="mt-6 text-[clamp(2.75rem,7.2vw,4.75rem)] leading-[1.02] font-semibold tracking-[-0.045em]">
            {profile.name.split(" ").map((word, i) => (
              <span key={word}>
                {i > 0 ? " " : null}
                <span className="inline-block overflow-hidden pb-[0.07em] align-bottom">
                  <span
                    className="inline-block animate-rise bg-gradient-to-b from-foreground from-40% to-foreground/70 bg-clip-text text-transparent"
                    style={delay(90 + i * 110)}
                  >
                    {word}
                  </span>
                </span>
              </span>
            ))}
          </h1>

          <p className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-lg font-medium tracking-tight sm:text-xl">
            {profile.headline.map((title, i) => (
              <span key={title} style={delay(320 + i * 110)} className="flex animate-blur-in items-center gap-3">
                {title}
                {i < profile.headline.length - 1 ? (
                  <span aria-hidden="true" className="text-brand">
                    /
                  </span>
                ) : null}
              </span>
            ))}
          </p>

          <p style={delay(560)} className="mt-6 max-w-xl animate-enter text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
            {profile.intro}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Magnetic strength={0.4}>
              <span style={delay(660)} className="inline-flex animate-enter">
                <Button asChild size="lg">
                  <a href="#projects">
                    View projects <ArrowRight />
                  </a>
                </Button>
              </span>
            </Magnetic>
            <Magnetic>
              <span style={delay(730)} className="inline-flex animate-enter">
                <Button asChild size="lg" variant="outline">
                  <a href="#contact">
                    <Mail /> Contact me
                  </a>
                </Button>
              </span>
            </Magnetic>
            {socials.github ? (
              <span style={delay(800)} className="inline-flex animate-enter">
                <Button asChild size="lg" variant="ghost">
                  <a href={socials.github} target="_blank" rel="noreferrer">
                    <GithubIcon size={16} /> GitHub
                  </a>
                </Button>
              </span>
            ) : null}
            <span style={delay(860)} className="inline-flex animate-enter">
              <Button asChild size="lg" variant="ghost">
                <a href={profile.resumeFile} target="_blank" rel="noreferrer">
                  <FileText /> Resume
                </a>
              </Button>
            </span>
          </div>
        </div>

        {/* scroll lift (inline transform) + cursor drift (translate), then entrance, idle float and tilt on separate layers */}
        <div ref={visualRef} className="relative [translate:calc(var(--hx,0)*12px)_calc(var(--hy,0)*10px)]">
          <div
            aria-hidden="true"
            className="absolute -inset-8 -z-10 rounded-[3rem] bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--brand)_16%,transparent),transparent)] blur-2xl [translate:calc(var(--hx,0)*22px)_calc(var(--hy,0)*18px)]"
          />
          <div style={delay(380)} className="animate-enter-scale">
            <div className="animate-float">
              <div ref={tiltRef} className="will-change-transform">
                <AtAGlance />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
