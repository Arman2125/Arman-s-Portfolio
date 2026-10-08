import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Self-hosted, latin-only subsets. Geist Sans for language, Geist Mono for anything technical.
import "@fontsource/geist-sans/latin-400.css";
import "@fontsource/geist-sans/latin-500.css";
import "@fontsource/geist-sans/latin-600.css";
import "@fontsource/geist-mono/latin-400.css";
import "@fontsource/geist-mono/latin-500.css";
import "lenis/dist/lenis.css";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
