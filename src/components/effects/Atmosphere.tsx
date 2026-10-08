import { useEffect, useRef } from "react";
import { createFollower } from "@/lib/pointer";
import { hasFinePointer, prefersReducedMotion } from "@/lib/scroll";

/**
 * The page's background depth, kept deliberately quiet:
 * - three very soft warm blobs that drift over ~a minute (static under reduced motion),
 * - a cursor-following light for mouse users (fades out when the pointer leaves the window),
 * - a fine grain texture over everything.
 * All fixed, transform-only layers: scrolling never repaints them.
 */
export default function Atmosphere() {
  const lightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const light = lightRef.current;
    if (!light || !hasFinePointer() || prefersReducedMotion()) return;

    // normalised viewport coordinates, so the follower settles at sub-pixel precision quickly
    const follower = createFollower((x, y) => {
      light.style.transform = `translate3d(${x * window.innerWidth}px, ${y * window.innerHeight}px, 0) translate(-50%, -50%)`;
    }, 0.1);
    let seen = false;
    const move = (event: PointerEvent) => {
      const x = event.clientX / window.innerWidth;
      const y = event.clientY / window.innerHeight;
      if (!seen) {
        seen = true;
        light.style.opacity = "1";
      }
      follower.to(x, y);
    };
    const hide = () => {
      seen = false;
      light.style.opacity = "0";
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", hide);
    return () => {
      follower.stop();
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", hide);
    };
  }, []);

  return (
    <>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="atmo-blob [--drift-dx:6vw] [--drift-dy:7vh] [--drift-t:46s] -top-[18vmax] -left-[14vmax] size-[62vmax] [--blob:var(--blob-1)]" />
        <div className="atmo-blob [--drift-dx:-7vw] [--drift-dy:-6vh] [--drift-t:58s] top-[28vh] -right-[22vmax] size-[56vmax] [--blob:var(--blob-2)]" />
        <div className="atmo-blob [--drift-dx:8vw] [--drift-dy:-5vh] [--drift-t:52s] -bottom-[26vmax] left-[8vw] size-[50vmax] [--blob:var(--blob-3)] max-md:hidden" />
        <div
          ref={lightRef}
          className="absolute top-0 left-0 size-[640px] rounded-full opacity-0 transition-opacity duration-700 [background:radial-gradient(closest-side,var(--cursor-light),transparent)]"
        />
      </div>
      <div aria-hidden="true" className="grain pointer-events-none fixed inset-0 z-[60]" />
    </>
  );
}
