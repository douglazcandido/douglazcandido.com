import { useEffect } from "react";
import Nav from "./components/Nav";
import LazySection from "./components/LazySection";
import Hero from "./sections/Hero";
import About from "./sections/About";
import { useScrollProgress } from "./hooks/useScrollProgress";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import { guardAnchors } from "./lib/anchorGuard";
import { startLazySections } from "./lib/lazySections";

export default function App() {
  useScrollProgress();
  useSmoothScroll();

  // Below the first screen the sections are separate chunks, fetched in idle time right after the first paint.
  useEffect(() => {
    const stop = guardAnchors();
    startLazySections();
    return stop;
  }, []);

  return (
    <div className="relative isolate min-h-screen overflow-x-clip bg-bg text-text">
      <Nav />
      <main className="relative">
        <Hero />
        <About />
        <LazySection id="carreira" name="career" />
        <LazySection id="projetos" name="projects" />
        <LazySection id="skills" name="skills" />
        <LazySection id="contato" name="contact" />
      </main>
    </div>
  );
}
