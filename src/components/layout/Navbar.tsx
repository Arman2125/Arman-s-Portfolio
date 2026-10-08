import { FileText, Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Magnetic from "@/components/effects/Magnetic";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { contactLinks, navItems, profile } from "@/data/resume";
import { isNavigating, scrollToId, subscribeScroll } from "@/lib/scroll";
import { useActiveSection } from "@/lib/useActiveSection";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";

const sectionIds = navItems.map((item) => item.id);
const desktopLinks = navItems.filter((item) => item.id !== "contact");

/** Slide a marker (hover pill or active underline) under a link; `inset` trims it inside the link's padding. */
function placeMarker(marker: HTMLElement | null, link: HTMLElement | null | undefined, inset = 0) {
  if (!marker) return;
  if (!link) {
    marker.style.opacity = "0";
    return;
  }
  marker.style.opacity = "1";
  marker.style.width = `${link.offsetWidth - inset * 2}px`;
  marker.style.transform = `translateX(${link.offsetLeft + inset}px)`;
}

export default function Navbar() {
  const active = useActiveSection(sectionIds);
  const [open, setOpen] = useState(false);
  // The sheet locks page scrolling while open, so a link only scrolls once the sheet has finished closing.
  const pendingTarget = useRef<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const hoverRef = useRef<HTMLSpanElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);

  // Scroll-aware header: tinted once the page moves; slides away while reading downwards, returns on any
  // upward scroll. It stays put during link navigation, while a dialog/sheet is open, and when it has focus (CSS).
  useEffect(
    () =>
      subscribeScroll(({ y, direction }) => {
        const header = headerRef.current;
        if (!header) return;
        header.dataset.scrolled = String(y > 8);
        const hide = y > 200 && direction === 1 && !isNavigating() && !document.body.hasAttribute("data-scroll-locked");
        header.dataset.hidden = String(hide);
      }),
    [],
  );

  // The active-section underline glides between links.
  useEffect(() => {
    const update = () =>
      placeMarker(underlineRef.current, active ? navRef.current?.querySelector<HTMLElement>(`a[href="#${active}"]`) : null, 12);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [active]);

  return (
    <header
      ref={headerRef}
      data-scrolled="false"
      data-hidden="false"
      className={cn(
        "sticky top-0 z-40 border-b border-transparent transition-[translate,background-color,border-color,box-shadow] duration-500 ease-[var(--ease-out-expo)]",
        "data-[scrolled=true]:border-border/70 data-[scrolled=true]:bg-background/80 data-[scrolled=true]:shadow-[0_8px_30px_-20px_rgb(0_0_0/0.25)] data-[scrolled=true]:backdrop-blur-md",
        "data-[hidden=true]:-translate-y-full focus-within:translate-y-0!",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <a href="#top" className="group flex items-center gap-2.5 rounded-md" aria-label={`${profile.name}, back to top`}>
          <span className="grid size-8 place-items-center rounded-md bg-primary font-mono text-[0.8125rem] font-semibold text-primary-foreground transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-rotate-6 group-hover:scale-105">
            AS
          </span>
          <span className="text-sm font-semibold tracking-tight">{profile.name}</span>
        </a>

        {/* links are measured against <nav> (their offsetParent), where both markers live */}
        <nav
          ref={navRef}
          aria-label="Primary"
          className="relative hidden lg:block"
          onPointerLeave={() => placeMarker(hoverRef.current, null)}
        >
          <span
            ref={hoverRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 rounded-md bg-accent opacity-0 transition-[transform,width,opacity] duration-300 ease-[var(--ease-out-expo)]"
          />
          <span
            ref={underlineRef}
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-px left-0 h-0.5 rounded-full bg-brand opacity-0 transition-[transform,width,opacity] duration-500 ease-[var(--ease-out-expo)]"
          />
          <ul className="relative flex items-center gap-1">
            {desktopLinks.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? "location" : undefined}
                    onPointerEnter={(event) => placeMarker(hoverRef.current, event.currentTarget)}
                    className={cn(
                      "relative block rounded-md px-3 py-2 text-sm transition-colors duration-300 hover:text-foreground",
                      isActive ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <a href={profile.resumeFile} target="_blank" rel="noreferrer">
              <FileText /> Resume
            </a>
          </Button>
          <Magnetic className="hidden md:inline-flex">
            <Button asChild size="sm">
              <a href="#contact" aria-current={active === "contact" ? "location" : undefined}>
                Contact me
              </a>
            </Button>
          </Magnetic>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[min(20rem,85vw)] gap-0"
              onCloseAutoFocus={(event) => {
                const id = pendingTarget.current;
                if (!id) return;
                pendingTarget.current = null;
                event.preventDefault();
                scrollToId(id);
              }}
            >
              <SheetHeader className="border-b">
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription className="sr-only">Jump to a section of the portfolio</SheetDescription>
              </SheetHeader>
              <nav aria-label="Mobile" className="flex-1 overflow-y-auto p-2">
                <ul>
                  {navItems.map((item, i) => (
                    <li
                      key={item.id}
                      className="animate-in duration-500 fade-in-0 slide-in-from-right-4"
                      style={{ animationDelay: `${80 + i * 45}ms`, animationFillMode: "both" }}
                    >
                      <a
                        href={`#${item.id}`}
                        aria-current={active === item.id ? "location" : undefined}
                        onClick={(event) => {
                          event.preventDefault();
                          pendingTarget.current = item.id;
                          setOpen(false);
                        }}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-3 text-base transition-colors hover:bg-accent",
                          active === item.id ? "font-medium text-foreground" : "text-muted-foreground",
                        )}
                      >
                        <span className="font-mono text-xs text-brand">{String(i + 1).padStart(2, "0")}</span>
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
              <div
                className="grid animate-in gap-2 border-t p-4 duration-500 fade-in-0 slide-in-from-bottom-2"
                style={{ animationDelay: "380ms", animationFillMode: "both" }}
              >
                <Button asChild variant="outline">
                  <a href={profile.resumeFile} target="_blank" rel="noreferrer">
                    <FileText /> Resume (PDF)
                  </a>
                </Button>
                <Button asChild variant="ghost" className="text-muted-foreground">
                  <a href={contactLinks.email}>{profile.email}</a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
