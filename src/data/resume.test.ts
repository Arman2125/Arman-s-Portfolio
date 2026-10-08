import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { experience, heroStack, profile, projects, skillGroups, skillUsage, socials, usagePlaces } from "./resume";

const isRealUrl = (value: string) => /^https:\/\/[^\s#]+$/.test(value);

describe("links", () => {
  it("only uses real https URLs (or nothing) for social profiles", () => {
    for (const url of Object.values(socials)) {
      if (url) expect(isRealUrl(url), url).toBe(true);
    }
  });

  it("only uses real https URLs (or nothing) for project source and demo links", () => {
    for (const project of projects) {
      for (const url of [project.links.github, project.links.demo]) {
        if (url) expect(isRealUrl(url), `${project.id}: ${url}`).toBe(true);
      }
    }
  });

  it("points the resume button at a file that ships with the site", () => {
    expect(existsSync(`public${profile.resumeFile}`)).toBe(true);
  });
});

describe("accuracy guards", () => {
  it("never lists fundamentals-only skills as project or job technologies", () => {
    const fundamentals = skillGroups
      .flatMap((group) => group.skills)
      .filter((skill) => skill.fundamentals)
      .map((skill) => skill.name.toLowerCase());
    const used = [...projects.flatMap((p) => p.stack), ...experience.flatMap((e) => e.stack), ...skillUsage.map((u) => u.skill)].map(
      (name) => name.toLowerCase(),
    );
    for (const name of fundamentals) expect(used, name).not.toContain(name);
  });

  it("backs every hero stack item with an entry in the usage table", () => {
    for (const tech of heroStack) {
      const backed = skillUsage.some((row) => row.skill.toLowerCase().includes(tech.toLowerCase()) && row.usedIn.length > 0);
      expect(backed, tech).toBe(true);
    }
  });

  it("only references known places in the usage table", () => {
    const ids = new Set<string>(usagePlaces.map((place) => place.id));
    for (const row of skillUsage) {
      expect(row.usedIn.length, row.skill).toBeGreaterThan(0);
      for (const id of row.usedIn) expect(ids.has(id), `${row.skill}: ${id}`).toBe(true);
    }
  });

  it("gives every featured project a details view", () => {
    for (const project of projects.filter((p) => p.featured)) expect(project.details, project.id).toBeDefined();
  });
});
