import { useEffect, useRef, type RefObject } from "react";
import { pageTop, prefersReducedMotion, subscribeLayout, subscribeScroll } from "./scroll";

export interface ScrollFrame {
  /** Element top relative to the viewport (cached layout position minus scroll; transforms ignored). */
  top: number;
  height: number;
  vh: number;
  y: number;
}

/**
 * Runs `effect` on every scroll frame while the element is within ~1 viewport of the screen.
 * Positions are measured from layout once (and on layout changes), never per frame, so effects can freely
 * transform the element or its children without feedback loops. Skipped entirely under reduced motion;
 * `onReduced` lets an effect set its resting state instead.
 */
export function useScrollEffect(
  ref: RefObject<HTMLElement | null>,
  effect: (frame: ScrollFrame) => void,
  options: { onReduced?: () => void; disabled?: boolean } = {},
) {
  const effectRef = useRef(effect);
  const reducedRef = useRef(options.onReduced);
  useEffect(() => {
    effectRef.current = effect;
    reducedRef.current = options.onReduced;
  });

  useEffect(() => {
    const element = ref.current;
    if (!element || options.disabled) return;
    if (prefersReducedMotion()) {
      reducedRef.current?.();
      return;
    }

    let top = 0;
    let height = 0;
    let near = true;
    const measure = () => {
      top = pageTop(element);
      height = element.offsetHeight;
    };
    measure();

    const observer = new IntersectionObserver(([entry]) => (near = entry.isIntersecting), { rootMargin: "100% 0px" });
    observer.observe(element);
    const offLayout = subscribeLayout(measure);
    const offScroll = subscribeScroll((state) => {
      if (near) effectRef.current({ top: top - state.y, height, vh: state.vh, y: state.y });
    });

    return () => {
      observer.disconnect();
      offLayout();
      offScroll();
    };
  }, [ref, options.disabled]);
}

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
