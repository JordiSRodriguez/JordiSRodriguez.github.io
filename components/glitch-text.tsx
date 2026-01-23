"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface GlitchTextProps {
  children: string;
  className?: string;
  intensity?: "low" | "medium" | "high";
}

export function GlitchText({ children, className, intensity = "medium" }: GlitchTextProps) {
  const [isHovering, setIsHovering] = useState(false);

  const glitchChars = "!<>-_\\/[]{}—=+*^?#________";

  const glitchIntensity = {
    low: { amount: 2, speed: 300 },
    medium: { amount: 5, speed: 200 },
    high: { amount: 10, speed: 100 },
  };

  const settings = glitchIntensity[intensity];

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  return (
    <span
      className={cn("inline-block relative", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Original text */}
      <span className={cn("relative z-10 transition-opacity", isHovering && "opacity-0")}>
        {children}
      </span>

      {/* Glitch effect */}
      {isHovering && (
        <>
          {/* Red channel offset */}
          <span
            className="absolute top-0 left-0 z-20 text-git-modified mix-blend-screen"
            style={{
              animation: `glitch-${intensity}-1 ${settings.speed}ms infinite`,
            }}
          >
            {children}
          </span>

          {/* Blue channel offset */}
          <span
            className="absolute top-0 left-0 z-20 text-git-branch mix-blend-screen"
            style={{
              animation: `glitch-${intensity}-2 ${settings.speed}ms infinite`,
            }}
          >
            {children}
          </span>
        </>
      )}
    </span>
  );
}
