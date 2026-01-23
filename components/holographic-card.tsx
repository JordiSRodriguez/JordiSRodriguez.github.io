"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface HolographicCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: "low" | "medium" | "high";
}

export function HolographicCard({ children, className, intensity = "medium" }: HolographicCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const intensityConfig = {
    low: {
      glare: 20,
      rotate: 5,
      scale: 1.02,
      borderColor: "rgba(99, 102, 241, 0.3)",
    },
    medium: {
      glare: 30,
      rotate: 10,
      scale: 1.05,
      borderColor: "rgba(99, 102, 241, 0.5)",
    },
    high: {
      glare: 40,
      rotate: 15,
      scale: 1.08,
      borderColor: "rgba(99, 102, 241, 0.7)",
    },
  };

  const config = intensityConfig[intensity];

  return (
    <div
      className="relative group perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "relative transition-all duration-500 ease-out preserve-3d",
          "hover:shadow-2xl",
          "bg-gradient-to-br from-background via-background to-muted/30",
          "border border-border/50",
          "rounded-xl overflow-hidden",
          className
        )}
        style={{
          transform: isHovered
            ? `perspective(1000px) rotateX(${(mousePosition.y - 50) * config.rotate * 0.1}deg) rotateY(${(mousePosition.x - 50) * config.rotate * 0.1}deg) scale3d(${config.scale}, ${config.scale}, ${config.scale})`
            : "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)",
          boxShadow: isHovered
            ? `0 25px 50px -12px rgba(99, 102, 241, 0.25)`
            : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }}
      >
        {/* Glare effect */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500"
          style={{
            background: `radial-gradient(
              circle at ${mousePosition.x}% ${mousePosition.y}%,
              rgba(255, 255, 255, ${isHovered ? 0.3 : 0}) 0%,
              transparent ${config.glare}%
            )`,
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* Holographic shimmer */}
        <div className="absolute inset-0 pointer-events-none holographic" />

        {/* Scanlines */}
        <div className="absolute inset-0 pointer-events-none scanlines" />

        {/* Border glow */}
        <div
          className="absolute inset-0 rounded-xl pointer-events-none transition-all duration-500"
          style={{
            boxShadow: isHovered
              ? `inset 0 0 20px ${config.borderColor}`
              : "inset 0 0 0px transparent",
          }}
        />

        {/* Corner accents */}
        {isHovered && (
          <>
            <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-git-branch rounded-tl-lg transition-all duration-500" />
            <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-git-clean rounded-tr-lg transition-all duration-500" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-git-modified rounded-bl-lg transition-all duration-500" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-git-branch rounded-br-lg transition-all duration-500" />
          </>
        )}

        {/* Content */}
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
}
