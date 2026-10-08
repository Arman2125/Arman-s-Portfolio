import { useEffect, type RefObject } from "react";
import { hasFinePointer, prefersReducedMotion } from "./scroll";

/**
 * Critically-damped follower: eases two values toward a target on rAF and stops when settled.
 * Frame-rate independent (same feel at 60 and 120 Hz).
 */
export function createFollower(apply: (x: number, y: number) => void, responsiveness = 0.18) {
  let x = 0;
  let y = 0;
  let targetX = 0;
  let targetY = 0;
  let raf = 0;
  let last = 0;

  const step = (now: number) => {
    const dt = last ? Math.min(64, now - last) : 16.67;
    last = now;
    const k = 1 - Math.pow(1 - responsiveness, dt / 16.67);
    x += (targetX - x) * k;
    y += (targetY - y) * k;
    const settled = Math.abs(targetX - x) < 0.0005 && Math.abs(targetY - y) < 0.0005;
    if (settled) {
      x = targetX;
      y = targetY;
    }
    apply(x, y);
    if (settled) {
      raf = 0;
      last = 0;
    } else raf = requestAnimationFrame(step);
  };

  return {
    to(nextX: number, nextY: number) {
      targetX = nextX;
      targetY = nextY;
      if (!raf) raf = requestAnimationFrame(step);
    },
    stop() {
      cancelAnimationFrame(raf);
      raf = 0;
    },
  };
}

/** Pointer position over an element, normalised to -1…1 on each axis. */
function relative(event: PointerEvent, element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
    y: ((event.clientY - rect.top) / rect.height) * 2 - 1,
  };
}

const interactive = () => hasFinePointer() && !prefersReducedMotion();

/**
 * Magnetic hover: the element leans toward the cursor (at most `max` px) and settles back on leave.
 * Mouse/trackpad only; touch and reduced-motion visitors get the plain element.
 */
export function useMagnetic(ref: RefObject<HTMLElement | null>, strength = 0.35, max = 8) {
  useEffect(() => {
    const element = ref.current;
    if (!element || !interactive()) return;
    const follower = createFollower((x, y) => {
      element.style.translate = `${x * max}px ${y * max}px`;
    }, 0.2);
    const move = (event: PointerEvent) => {
      const p = relative(event, element);
      follower.to(p.x * strength * 2, p.y * strength * 2);
    };
    const leave = () => follower.to(0, 0);
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerleave", leave);
    return () => {
      follower.stop();
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", leave);
      element.style.translate = "";
    };
  }, [ref, strength, max]);
}

/**
 * Subtle 3D tilt toward the cursor. Also exposes --tilt-x / --tilt-y (-1…1) so inner layers can parallax
 * at different depths. `trigger` is the element that listens (defaults to the tilted element itself).
 */
export function useTilt(ref: RefObject<HTMLElement | null>, options: { max?: number; trigger?: RefObject<HTMLElement | null> } = {}) {
  const { max = 6, trigger } = options;
  useEffect(() => {
    const element = ref.current;
    const source = trigger?.current ?? element;
    if (!element || !source || !interactive()) return;
    const follower = createFollower((x, y) => {
      element.style.transform = `perspective(1000px) rotateX(${(-y * max).toFixed(3)}deg) rotateY(${(x * max).toFixed(3)}deg)`;
      element.style.setProperty("--tilt-x", x.toFixed(4));
      element.style.setProperty("--tilt-y", y.toFixed(4));
    }, 0.14);
    const move = (event: PointerEvent) => {
      const p = relative(event, source);
      follower.to(p.x, p.y);
    };
    const leave = () => follower.to(0, 0);
    source.addEventListener("pointermove", move);
    source.addEventListener("pointerleave", leave);
    return () => {
      follower.stop();
      source.removeEventListener("pointermove", move);
      source.removeEventListener("pointerleave", leave);
      element.style.transform = "";
    };
  }, [ref, trigger, max]);
}
