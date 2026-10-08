import { ArrowUp } from "lucide-react";
import { useRef } from "react";
import { contactLinks, profile, socials } from "@/data/resume";
import { clamp01, useScrollEffect } from "@/lib/useScrollEffect";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const markRef = useRef<HTMLParagraphElement>(null);
  const links = [
    { label: "Email", href: contactLinks.email },
    { label: "Resume", href: profile.resumeFile, external: true },
    ...(socials.github ? [{ label: "GitHub", href: socials.github, external: true }] : []),
    ...(socials.linkedin ? [{ label: "LinkedIn", href: socials.linkedin, external: true }] : []),
  ];

  // The closing wordmark rises into place as the footer scrolls into view: the end of the story.
  // 0 when the footer's top edge enters the viewport, 1 once the whole footer is on screen.
  useScrollEffect(footerRef, ({ top, height, vh }) => {
    const p = clamp01((vh - top) / height);
    if (markRef.current) markRef.current.style.transform = `translate3d(0, ${((1 - p) * 45 + 16).toFixed(2)}%, 0)`;
  });

  return (
    <footer ref={footerRef} className="relative overflow-hidden border-t pt-10">
      <div className="container-page flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-tight">{profile.name}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {profile.headline.slice(0, 2).join(" · ")} · {profile.location}
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            © {new Date().getFullYear()} {profile.name}. Built with React, TypeScript, Tailwind CSS and shadcn/ui.
          </p>
        </div>
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}
                className="text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a href="#top" className="group inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground">
              Back to top <ArrowUp className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
            </a>
          </li>
        </ul>
      </div>
      <div aria-hidden="true" className="container-page mt-8 select-none">
        <p
          ref={markRef}
          className="translate-y-[16%] bg-gradient-to-b from-foreground/[0.11] to-foreground/0 bg-clip-text text-[clamp(3.5rem,14.5vw,11.5rem)] leading-[0.8] font-semibold tracking-[-0.06em] whitespace-nowrap text-transparent"
        >
          {profile.name}
        </p>
      </div>
    </footer>
  );
}
