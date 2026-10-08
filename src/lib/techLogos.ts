import type { TechIconSlug } from "@/data/techIcons";

/** Which brand mark goes with which skill name (only real brands; generic skills get none). */
const LOGO_FOR: Record<string, TechIconSlug> = {
  typescript: "typescript",
  javascript: "javascript",
  python: "python",
  "python / fastapi": "fastapi",
  fastapi: "fastapi",
  c: "c",
  "java 17": "openjdk",
  "node.js": "nodedotjs",
  "express.js": "express",
  "react.js": "react",
  postgresql: "postgresql",
  mongodb: "mongodb",
  git: "git",
  github: "github",
  postman: "postman",
  npm: "npm",
  vite: "vite",
  docker: "docker",
  html5: "html5",
  html: "html5",
  css3: "css",
  css: "css",
  mcp: "modelcontextprotocol",
  whatsapp: "whatsapp",
};

export const logoFor = (name: string): TechIconSlug | undefined => LOGO_FOR[name.toLowerCase()];
