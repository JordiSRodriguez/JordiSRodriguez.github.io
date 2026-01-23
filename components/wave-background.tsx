"use client";

import { cn } from "@/lib/utils";

interface WaveBackgroundProps {
  className?: string;
  waveCount?: number;
  colors?: string[];
}

export function WaveBackground({ className, waveCount = 3, colors }: WaveBackgroundProps) {
  const defaultColors = [
    "rgba(99, 102, 241, 0.1)",
    "rgba(34, 197, 94, 0.08)",
    "rgba(234, 179, 8, 0.06)",
  ];

  const waveColors = colors || defaultColors;

  return (
    <div className={cn("fixed inset-0 pointer-events-none z-0 overflow-hidden", className)}>
      {Array.from({ length: waveCount }).map((_, i) => (
        <div
          key={i}
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: `${100 + i * 50}px`,
            animation: `wave ${8 + i * 2}s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
            opacity: 1 - i * 0.2,
          }}
        >
          <svg
            viewBox="0 0 1440 320"
            className="absolute bottom-0 w-full"
            preserveAspectRatio="none"
            style={{ height: "100%" }}
          >
            <path
              fill={waveColors[i % waveColors.length]}
              d={`M0,${192 + i * 20} C${[
                [240, 160 + i * 10],
                [480, 180 + i * 15],
                [720, 140 + i * 20],
                [960, 170 + i * 10],
                [1200, 150 + i * 15],
                [1440, 130 + i * 20],
              ]
                .map(([x, y]) => `${x},${y}`)
                .join(" L")} V320 H0 Z`}
            />
          </svg>
        </div>
      ))}
    </div>
  );
}

interface FloatingShapesProps {
  className?: string;
}

export function FloatingShapes({ className }: FloatingShapesProps) {
  return (
    <div className={cn("fixed inset-0 pointer-events-none z-0 overflow-hidden", className)}>
      {/* Morphing blob 1 */}
      <div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{
          background: "linear-gradient(45deg, var(--git-branch), var(--git-clean))",
          top: "10%",
          left: "10%",
          animation: "float-morph 20s ease-in-out infinite",
        }}
      />

      {/* Morphing blob 2 */}
      <div
        className="absolute w-80 h-80 rounded-full blur-3xl opacity-15"
        style={{
          background: "linear-gradient(135deg, var(--git-clean), var(--git-modified))",
          top: "60%",
          right: "15%",
          animation: "float-morph 15s ease-in-out infinite reverse",
        }}
      />

      {/* Morphing blob 3 */}
      <div
        className="absolute w-64 h-64 rounded-full blur-3xl opacity-10"
        style={{
          background: "linear-gradient(225deg, var(--git-modified), var(--git-branch))",
          bottom: "20%",
          left: "60%",
          animation: "float-morph 18s ease-in-out infinite",
        }}
      />
    </div>
  );
}
