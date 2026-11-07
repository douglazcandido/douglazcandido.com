import { useEffect, useState } from "react";
import { prefersReducedMotion } from "../hooks/useReducedMotion";

const GLYPHS = "01/_<>{}[]#$%&*+=-";

function scramble(text: string, resolved: number): string {
  return text
    .split("")
    .map((char, i) => {
      if (char === " " || i < resolved) return char;
      return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    })
    .join("");
}

interface ScrambleTextProps {
  text: string;
  delay?: number;
  className?: string;
}

/** Characters decode left-to-right from noise, like a payload being parsed. */
export default function ScrambleText({ text, delay = 0, className }: ScrambleTextProps) {
  const [output, setOutput] = useState(() => (prefersReducedMotion() ? text : scramble(text, 0)));

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let frame = 0;
    let interval: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      interval = setInterval(() => {
        frame += 1;
        const resolved = Math.floor(frame / 1.6);
        setOutput(scramble(text, resolved));
        if (resolved >= text.length && interval) clearInterval(interval);
      }, 32);
    }, delay);
    return () => {
      clearTimeout(start);
      if (interval) clearInterval(interval);
    };
  }, [text, delay]);

  return (
    <span className={className}>
      <span aria-hidden="true">{output}</span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
