"use client";

import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";

interface CardStackProps {
  children: ReactNode[];
  className?: string;
  stackOffset?: number;
  onSwipe?: (direction: "left" | "right") => void;
}

export function CardStack({ children, className, stackOffset = 20, onSwipe }: CardStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);

  const handleNext = () => {
    if (currentIndex < children.length - 1) {
      setDirection("right");
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setDirection(null);
      }, 300);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection("left");
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
        setDirection(null);
      }, 300);
    }
  };

  return (
    <div className={cn("relative", className)}>
      {children.map((child, index) => {
        const offset = (children.length - 1 - index) * stackOffset;
        const isActive = index === currentIndex;
        const isNext = index === currentIndex + 1;

        return (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-all duration-500 ease-out",
              isActive && "z-10 scale-100",
              isNext && "z-0 scale-95 opacity-70",
              !isActive && !isNext && "z-[-1] scale-90 opacity-40"
            )}
            style={{
              transform: `translateY(${isActive ? 0 : offset}px)`,
            }}
          >
            {child}
          </div>
        );
      })}

      {/* Navigation buttons */}
      <div className="absolute -bottom-16 left-0 right-0 flex justify-center gap-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={cn(
            "px-4 py-2 rounded-lg bg-background border border-border",
            "hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          ← Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === children.length - 1}
          className={cn(
            "px-4 py-2 rounded-lg bg-background border border-border",
            "hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

interface AnimatedCard3DProps {
  children: ReactNode;
  className?: string;
  depth?: number;
}

export function AnimatedCard3D({ children, className, depth = 3 }: AnimatedCard3DProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 20;
    const y = (e.clientY - rect.top - rect.height / 2) / 20;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <div
      className={cn("relative perspective-1000", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="relative transition-transform duration-200 ease-out preserve-3d"
        style={{
          transform: `rotateX(${-mousePosition.y}deg) rotateY(${mousePosition.x}deg)`,
        }}
      >
        {/* Card layers for depth */}
        {Array.from({ length: depth }).map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-xl bg-card border border-border"
            style={{
              transform: `translateZ(${-(i + 1) * 2}px)`,
              opacity: 1 - (i * 0.15),
            }}
          />
        ))}

        {/* Main content */}
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
}
