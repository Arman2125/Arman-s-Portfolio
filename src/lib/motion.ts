import type { CSSProperties } from "react";

/** Inline `--d` for the seq-* motion utilities in index.css: the item's delay after its section reveals. */
export const seqDelay = (ms: number) => ({ "--d": `${Math.round(ms)}ms` }) as CSSProperties;

/** Inline animation delay for mount animations (animate-enter, animate-rise). */
export const enterDelay = (ms: number): CSSProperties => ({ animationDelay: `${Math.round(ms)}ms` });
