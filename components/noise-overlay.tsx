"use client";

import { cn } from "@/lib/utils";

interface NoiseOverlayProps {
  className?: string;
  opacity?: number;
}

export function NoiseOverlay({ className, opacity = 0.03 }: NoiseOverlayProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 pointer-events-none z-[100]",
        "bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2Ij48ZmlsdGVyIGlkPSJnoiPjxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjY1IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI24pIiBvcGFjaXR5PSIwLjUiLz48L3N2Zz4=')]",
        "mix-blend-overlay opacity-50",
        className
      )}
      style={{
        opacity,
        animation: "noise-scroll 8s steps(10) infinite",
      }}
    />
  );
}

export function Scanlines({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "fixed inset-0 pointer-events-none z-[99]",
        "bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.01)_2px,rgba(0,0,0,0.01)_4px)]",
        className
      )}
    />
  );
}
