import Lenis from "lenis";

/*
 * One scroll engine for the whole page.
 *
 * - Desktop (fine pointer, motion allowed): Lenis smooths wheel scrolling. Every scroll-linked effect runs inside
 *   Lenis' own frame, so parallax and progress bars move in lockstep with the page (no one-frame lag).
 * - Touch, reduced motion, or no JS support: native scrolling, effects driven by one rAF-throttled listener.
 *
 * Effects subscribe with `subscribeScroll` (see useScrollEffect) and write styles directly; nothing re-renders.
 */

export interface ScrollState {
  /** Current (smoothed) scroll position. */
  y: number;
  /** Viewport height. */
  vh: number;
  /** 1 = scrolling down, -1 = up, 0 = not moved yet. */
  direction: 1 | -1 | 0;
}

type ScrollListener = (state: ScrollState) => void;

const HEADER_OFFSET = 80;

const listeners = new Set<ScrollListener>();
const layoutListeners = new Set<() => void>();
const state: ScrollState = { y: 0, vh: 0, direction: 0 };

let lenis: Lenis | null = null;
let frame = 0;
let started = false;
let navigating = false;
let navTimer: number | undefined;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const hasFinePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

function emit() {
  frame = 0;
  const y = lenis ? lenis.scroll : window.scrollY;
  if (y !== state.y) state.direction = y > state.y ? 1 : -1;
  state.y = y;
  state.vh = window.innerHeight;
  listeners.forEach((listener) => listener(state));
}

/** Schedule one effects pass on the next frame (coalesces bursts of events). */
export function requestScrollFrame() {
  if (!frame && typeof window !== "undefined") frame = requestAnimationFrame(emit);
}

function relayout() {
  layoutListeners.forEach((listener) => listener());
  requestScrollFrame();
}

function start() {
  if (started || typeof window === "undefined") return;
  started = true;
  state.y = window.scrollY;
  state.vh = window.innerHeight;
  window.addEventListener("scroll", () => !lenis && requestScrollFrame(), { passive: true });
  window.addEventListener("resize", relayout);
  // Content height changes (fonts, images, dialogs closing) shift every cached position.
  new ResizeObserver(relayout).observe(document.body);
  document.fonts?.ready.then(relayout).catch(() => undefined);
}

export function subscribeScroll(listener: ScrollListener): () => void {
  start();
  listeners.add(listener);
  requestScrollFrame();
  return () => listeners.delete(listener);
}

/** Called whenever page layout may have changed; effects re-measure their cached positions. */
export function subscribeLayout(listener: () => void): () => void {
  start();
  layoutListeners.add(listener);
  return () => layoutListeners.delete(listener);
}

/** True while a navigation link is scrolling the page (the header stays visible during it). */
export const isNavigating = () => navigating;

/** Element's top in page coordinates, from layout offsets: transforms (parallax, reveals) never skew it. */
export function pageTop(element: HTMLElement): number {
  let top = 0;
  let node: HTMLElement | null = element;
  while (node) {
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return top;
}

function focusTarget(target: HTMLElement) {
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
}

/** Smooth-scroll to a section by id, then move keyboard focus there. Returns false if there is no such element. */
export function scrollToId(id: string): boolean {
  const target = document.getElementById(id);
  if (!target) return false;

  navigating = true;
  window.clearTimeout(navTimer);
  const done = () => {
    window.clearTimeout(navTimer);
    navigating = false;
    focusTarget(target);
  };

  if (lenis) {
    const distance = Math.abs(target.getBoundingClientRect().top - HEADER_OFFSET);
    // Lenis applies the CSS scroll-padding-top (5rem, clears the sticky header) itself, so no extra offset here.
    lenis.scrollTo(target, {
      duration: Math.min(1.6, Math.max(0.7, distance / 2600)),
      easing: (t) => 1 - Math.pow(1 - t, 4),
      onComplete: done,
    });
    navTimer = window.setTimeout(done, 2200);
  } else {
    target.scrollIntoView({ block: "start", behavior: prefersReducedMotion() ? "auto" : "smooth" });
    navTimer = window.setTimeout(done, 900);
  }
  history.replaceState(null, "", `#${id}`);
  return true;
}

/**
 * Page-level setup, called once from <App>: smooth scrolling where it helps, and in-page links routed through
 * scrollToId so they animate, respect the sticky header and move focus (plain hash jumps don't move focus with Lenis).
 */
export function initScroll(): () => void {
  start();

  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = (event.target as Element | null)?.closest?.('a[href^="#"]');
    const id = link ? decodeURIComponent(link.getAttribute("href")!.slice(1)) : "";
    if (id && scrollToId(id)) event.preventDefault();
  };
  document.addEventListener("click", onClick);

  let lockObserver: MutationObserver | undefined;
  if (!prefersReducedMotion() && hasFinePointer()) {
    lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      smoothWheel: true,
      // dialogs and sheets keep native scrolling for their own content
      prevent: (node: HTMLElement) => !!node.closest?.('[role="dialog"], [data-lenis-prevent]'),
    });
    lenis.on("scroll", () => {
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      emit();
    });
    // Radix marks <body data-scroll-locked> while a dialog or sheet is open: pause smoothing underneath it.
    lockObserver = new MutationObserver(() => (document.body.hasAttribute("data-scroll-locked") ? lenis?.stop() : lenis?.start()));
    lockObserver.observe(document.body, { attributes: true, attributeFilter: ["data-scroll-locked"] });
  }

  return () => {
    document.removeEventListener("click", onClick);
    lockObserver?.disconnect();
    lenis?.destroy();
    lenis = null;
  };
}
