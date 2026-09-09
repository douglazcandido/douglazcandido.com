import { useEffect, useRef, useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import type { ExperienceAxis } from "../data/projects";

const ACCENT = "#4d8ff0";
const GRID = "#292b31";
const LABEL = "#e4e7f5";
const SCALE_LABEL = "#595d6c";
const FONT_MONO = '"JetBrains Mono", ui-monospace, monospace';

interface ExperienceRadarProps {
  data: ExperienceAxis[];
}

interface AxisTickProps {
  x?: number | string;
  y?: number | string;
  payload?: { value: string };
  textAnchor?: string;
  fontSize?: number;
}

function splitLabel(label: string, textAnchor?: string): string[] {
  if (label.length > 14 && label.includes(" & ")) {
    const [first, ...rest] = label.split(" & ");
    return [`${first} &`, rest.join(" & ")];
  }
  if (textAnchor !== "middle" && label.length > 15) {
    const mid = Math.floor(label.length / 2);
    const splitIndex = label.lastIndexOf(" ", mid);
    if (splitIndex !== -1) {
      return [label.slice(0, splitIndex), label.slice(splitIndex + 1)];
    }
  }
  return [label];
}

function AxisTick({ x = 0, y = 0, payload, textAnchor, fontSize = 11.5 }: AxisTickProps) {
  const lines = splitLabel(payload?.value ?? "", textAnchor);
  const lineHeight = fontSize + 3;
  const startDy = lines.length > 1 ? -((lines.length - 1) * lineHeight) / 2 : 0;

  return (
    <text
      x={x}
      y={y}
      textAnchor={textAnchor as "inherit" | "start" | "middle" | "end" | undefined}
      fontFamily={FONT_MONO}
      fontSize={fontSize}
      fill={LABEL}
    >
      {lines.map((line, i) => (
        <tspan key={line} x={x} dy={i === 0 ? startDy : lineHeight}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

export default function ExperienceRadar({ data }: ExperienceRadarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(400);
  const [revealedCount, setRevealedCount] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const measured = entries[0]?.contentRect.width;
      if (measured) setWidth(measured);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Walks the axes one by one once the chart scrolls into view: each tick
  // reveals the next point's real value (recharts tweens it out from 0),
  // so the polygon and its fill build up point by point instead of all at once.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let interval: ReturnType<typeof setInterval> | undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        observer.unobserve(el);
        interval = setInterval(() => {
          setRevealedCount((count) => {
            if (count >= data.length) {
              if (interval) clearInterval(interval);
              return count;
            }
            return count + 1;
          });
        }, 260);
      }
    }, { threshold: 0.4 });

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (interval) clearInterval(interval);
    };
  }, [data.length]);

  const chartData = data.map((axis, index) => ({
    ...axis,
    value: index < revealedCount ? axis.value : 0,
  }));

  const compact = width < 340;
  const fontSize = compact ? 9 : 10.5;
  const margin = compact ? 8 : 10;

  return (
    <div ref={containerRef} className="mx-auto aspect-square w-full max-w-[300px] md:max-w-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart
          data={chartData}
          outerRadius={compact ? "50%" : "60%"}
          margin={{ top: margin, right: margin, bottom: margin, left: margin }}
        >
          <PolarGrid stroke={GRID} strokeOpacity={0.8} />
          <PolarAngleAxis
            dataKey="subject"
            tick={(props) => <AxisTick {...(props as AxisTickProps)} fontSize={fontSize} />}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 10]}
            tickCount={6}
            axisLine={false}
            tick={{ fill: SCALE_LABEL, fontSize: 8.5 }}
          />
          <Radar
            dataKey="value"
            stroke={ACCENT}
            strokeWidth={2}
            fill={ACCENT}
            fillOpacity={0.18}
            dot={{ r: 3, fill: ACCENT, strokeWidth: 0 }}
            isAnimationActive
            animationDuration={450}
            animationEasing="ease-out"
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
