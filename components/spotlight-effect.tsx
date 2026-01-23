"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface SpotlightProps {
  className?: string;
  size?: number;
  color?: string;
}

export function Spotlight({ className, size = 600, color = "rgba(99, 102, 241, 0.15)" }: SpotlightProps) {
  const [position, setPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setPosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className={cn("fixed inset-0 pointer-events-none z-0", className)}
      style={{
        background: `radial-gradient(
          circle ${size}px at ${position.x}% ${position.y}%,
          ${color} 0%,
          transparent 70%
        )`,
        transition: "background 0.1s ease-out",
      }}
    />
  );
}

interface CardSpotlightProps {
  children: React.ReactNode;
  className?: string;
  spotlightSize?: number;
}

export function CardSpotlight({ children, className, spotlightSize = 200 }: CardSpotlightProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      className={cn("relative rounded-xl overflow-hidden", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(
              circle ${spotlightSize}px at ${mousePosition.x}px ${mousePosition.y}px,
              rgba(255, 255, 255, 0.1) 0%,
              transparent 70%
            )`,
          }}
        />
      )}
    </div>
  );
}
