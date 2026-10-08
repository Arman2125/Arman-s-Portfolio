import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import App from "./App";
import { navItems, projects } from "./data/resume";

describe("page structure", () => {
  const html = renderToString(<App />);
  const count = (pattern: RegExp) => html.match(pattern)?.length ?? 0;

  it("renders exactly one h1, with the name", () => {
    expect(count(/<h1[\s>]/g)).toBe(1);
    const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? "";
    expect(h1.replace(/<[^>]+>/g, "").replace(/<!-- -->/g, "")).toBe("Arman Shaikh");
  });

  it("renders a labelled section for every navigation item", () => {
    for (const item of navItems) {
      expect(html, item.id).toContain(`id="${item.id}"`);
      expect(html, item.id).toContain(`aria-labelledby="${item.id}-title"`);
      expect(html, item.id).toContain(`id="${item.id}-title"`);
    }
  });

  it("has no placeholder links", () => {
    expect(html).not.toMatch(/href="#"/);
    expect(html).not.toMatch(/href=""/);
  });

  it("shows every project from the resume", () => {
    for (const project of projects) expect(html).toContain(project.title.replace(/&/g, "&amp;"));
  });

  it("opens external links safely", () => {
    for (const [tag] of html.matchAll(/<a[^>]+target="_blank"[^>]*>/g)) expect(tag).toContain('rel="noreferrer"');
  });
});
