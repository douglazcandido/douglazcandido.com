import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../hooks/useReducedMotion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

export interface ExperienceAxis {
  subject: string;
  value: number;
  fullMark: number;
}

const ACCENT = "var(--color-accent)";
const GRID = "var(--color-neutral-800)";
const LABEL = "var(--color-neutral-200)";
const SCALE_LABEL = "var(--color-neutral-700)";
const FONT_MONO = '"JetBrains Mono", ui-monospace, monospace';

interface ExperienceRadarProps {
  data: ExperienceAxis[];
}

interface AxisTickProps {
  x?: number | string;
  y?: number | string;
  index?: number;
  payload?: { value: string };
  textAnchor?: string;
  fontSize?: number;
}

interface DotRenderProps {
  cx?: number;
  cy?: number;
  index?: number;
}

function splitLabel(label: string, textAnchor?: string): string[] {
  // "Automation & Integration" / "Automatización e Integración" -> two lines, joiner kept on the first.
  const joined = label.match(/^(.+?) (&|y|e) (.+)$/);
  if (label.length > 14 && joined) {
    return [`${joined[1]} ${joined[2]}`, joined[3]];
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

interface AxisLabelProps extends AxisTickProps {
  score: number;
  fullMark: number;
  active: boolean;
  onEnter: () => void;
  onLeave: () => void;
}

/** Axis label: turns accent on hover and reveals its score underneath. */
function AxisLabel({
  x = 0,
  y = 0,
  payload,
  textAnchor,
  fontSize = 11.5,
  score,
  fullMark,
  active,
  onEnter,
  onLeave,
}: AxisLabelProps) {
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
      // transparent stroke widens the hit area to the gaps between glyphs and lines
      stroke="transparent"
      strokeWidth={12}
      pointerEvents="all"
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      style={{ fill: active ? ACCENT : LABEL, transition: "fill 0.3s ease" }}
    >
      {lines.map((line, i) => (
        <tspan key={line} x={x} dy={i === 0 ? startDy : lineHeight}>
          {line}
        </tspan>
      ))}
      <tspan
        x={x}
        dy={lineHeight}
        style={{
          fill: ACCENT,
          opacity: active ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        {score}/{fullMark}
      </tspan>
    </text>
  );
}

interface AxisDotProps extends DotRenderProps {
  active: boolean;
  dimmed: boolean;
  reveal: number;
  onEnter: () => void;
  onLeave: () => void;
}

/** Vertex marker: grows with a pulsing ring on hover. */
function AxisDot({ cx = 0, cy = 0, active, dimmed, reveal, onEnter, onLeave }: AxisDotProps) {
  return (
    <g onPointerEnter={onEnter} onPointerLeave={onLeave}>
      {active && <circle className="radar-pulse" cx={cx} cy={cy} r={5} fill="none" stroke={ACCENT} strokeWidth={1.5} />}
      <circle
        cx={cx}
        cy={cy}
        fill={ACCENT}
        style={{
          r: active ? 6 : 3,
          opacity: reveal * (dimmed ? 0.3 : 1),
          transition: "r 0.35s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.3s ease",
        }}
      />
      {/* generous invisible hit target */}
      <circle cx={cx} cy={cy} r={22} fill="transparent" pointerEvents="all" />
    </g>
  );
}

/** Gentle deceleration: fast start, long soft landing. */
const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

const AXIS_STAGGER_MS = 110; // each axis starts a touch after the previous one
const AXIS_DURATION_MS = 1300; // time each axis takes to reach its value

export default function ExperienceRadar({ data }: ExperienceRadarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(400);
  // Elapsed ms since the reveal started (null until the chart scrolls into view).
  const [elapsed, setElapsed] = useState<number | null>(prefersReducedMotion() ? Infinity : null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [chartHover, setChartHover] = useState(false);

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

  // One continuous rAF-driven reveal: every axis eases out toward its value on
  // an overlapping, staggered timeline, so the polygon "blooms" smoothly instead
  // of stepping from point to point.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || prefersReducedMotion()) return;

    let raf = 0;
    const total = AXIS_DURATION_MS + AXIS_STAGGER_MS * (data.length - 1);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const ms = Math.min(now - start, total);
          setElapsed(ms);
          if (ms < total) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [data.length]);

  const total = AXIS_DURATION_MS + AXIS_STAGGER_MS * (data.length - 1);
  const chartData = data.map((axis, index) => {
    const local = elapsed === null ? 0 : Math.min(1, Math.max(0, (elapsed - index * AXIS_STAGGER_MS) / AXIS_DURATION_MS));
    return { ...axis, value: axis.value * easeOutQuart(local) };
  });
  const overall = elapsed === null ? 0 : Math.min(1, elapsed / total);
  const revealed = overall >= 1;

  const compact = width < 340;
  const fontSize = compact ? 9 : 10.5;
  const margin = compact ? 8 : 10;

  // Hover only reacts once the polygon has finished blooming.
  const focus = revealed ? hovered : null;
  const fillOpacity = 0.22 * Math.min(1, overall * 1.6) * (focus !== null ? 1.7 : chartHover && revealed ? 1.35 : 1);

  return (
    <div
      ref={containerRef}
      onPointerEnter={() => setChartHover(true)}
      onPointerLeave={() => {
        setChartHover(false);
        setHovered(null);
      }}
      className="mx-auto aspect-square w-full max-w-[360px] md:max-w-[460px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart
          data={chartData}
          outerRadius={compact ? "46%" : "52%"}
          margin={{ top: margin, right: margin, bottom: margin, left: margin }}
          accessibilityLayer={false}
        >
          <PolarGrid stroke={GRID} strokeOpacity={0.8} />
          <PolarAngleAxis
            dataKey="subject"
            tick={(props) => {
              const tick = props as AxisTickProps;
              const index = tick.index ?? 0;
              return (
                <AxisLabel
                  {...tick}
                  fontSize={fontSize}
                  score={data[index]?.value ?? 0}
                  fullMark={data[index]?.fullMark ?? 10}
                  active={focus === index}
                  onEnter={() => setHovered(index)}
                  onLeave={() => setHovered(null)}
                />
              );
            }}
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
            strokeWidth={focus !== null || (chartHover && revealed) ? 2.75 : 2}
            strokeOpacity={Math.min(1, overall * 4)}
            fill={ACCENT}
            fillOpacity={fillOpacity}
            dot={(props: unknown) => {
              const dot = props as DotRenderProps;
              const index = dot.index ?? 0;
              return (
                <AxisDot
                  {...dot}
                  active={focus === index}
                  dimmed={focus !== null && focus !== index}
                  reveal={Math.min(1, overall * 3)}
                  onEnter={() => setHovered(index)}
                  onLeave={() => setHovered(null)}
                />
              );
            }}
            activeDot={false}
            isAnimationActive={false}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
