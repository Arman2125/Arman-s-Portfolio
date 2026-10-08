import { useEffect, useRef } from "react";
import { subscribeScroll } from "@/lib/scroll";

/** A 2px brand line pinned to the top of the window: how far down the page you are. Stays when the header hides. */
export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(
    () =>
      subscribeScroll(({ y, vh }) => {
        const max = document.documentElement.scrollHeight - vh;
        ref.current?.style.setProperty("transform", `scaleX(${max > 0 ? Math.min(1, Math.max(0, y / max)) : 0})`);
      }),
    [],
  );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[55] h-0.5 origin-left scale-x-0 bg-gradient-to-r from-brand/50 via-brand to-brand"
    />
  );
}
