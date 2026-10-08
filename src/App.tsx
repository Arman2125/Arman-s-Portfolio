import { useEffect } from "react";
import Atmosphere from "@/components/effects/Atmosphere";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import ScrollProgress from "@/components/layout/ScrollProgress";
import About from "@/components/sections/About";
import AiSection from "@/components/sections/AiSection";
import Contact from "@/components/sections/Contact";
import Education from "@/components/sections/Education";
import Experience from "@/components/sections/Experience";
import Hero from "@/components/sections/Hero";
import MoreWork from "@/components/sections/MoreWork";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import StackStrip from "@/components/sections/StackStrip";
import { TooltipProvider } from "@/components/ui/tooltip";
import { initScroll } from "@/lib/scroll";

export default function App() {
  // smooth scrolling (desktop) + in-page link handling for the whole page
  useEffect(() => initScroll(), []);

  return (
    <TooltipProvider delayDuration={300}>
      {/* `isolate`: the fixed atmosphere layers sit above <body>'s background but below every section */}
      <div className="relative isolate">
        <Atmosphere />
        <ScrollProgress />
        <a
          href="#main"
          className="sr-only z-50 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <Navbar />
        {/* the story: who → what I know → where I used it → what I built → the AI focus → more → background → contact */}
        <main id="main" tabIndex={-1} className="outline-none">
          <Hero />
          <StackStrip />
          <About />
          <Skills />
          <Experience />
          <Projects />
          <AiSection />
          <MoreWork />
          <Education />
          <Contact />
        </main>
        <Footer />
      </div>
    </TooltipProvider>
  );
}
