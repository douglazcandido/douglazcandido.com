import Nav from "./components/Nav";
import ScrollRail from "./components/ScrollRail";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Career from "./sections/Career";
import Projects from "./sections/Projects";
import Skills from "./sections/Skills";
import Education from "./sections/Education";
import Contact from "./sections/Contact";
import { useScrollProgress } from "./hooks/useScrollProgress";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import { useDocumentTitle } from "./hooks/useDocumentTitle";

export default function App() {
  useScrollProgress();
  useSmoothScroll();
  useDocumentTitle();

  return (
    <div className="relative isolate min-h-screen overflow-x-clip bg-bg text-text">
      <Nav />
      <ScrollRail />
      <main className="relative">
        <Hero />
        <About />
        <Career />
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </main>
    </div>
  );
}
