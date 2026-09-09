import BackgroundEffects from "./components/BackgroundEffects";
import CustomCursor from "./components/CustomCursor";
import Nav from "./components/Nav";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Projects from "./sections/Projects";
import Skills from "./sections/Skills";
import Education from "./sections/Education";
import Contact from "./sections/Contact";

export default function App() {
  return (
    <div className="relative isolate min-h-screen overflow-x-hidden bg-bg text-text">
      <CustomCursor />
      <BackgroundEffects />
      <div className="relative z-1 mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-[clamp(16px,4vw,40px)]">
        <Nav />
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </div>
    </div>
  );
}
