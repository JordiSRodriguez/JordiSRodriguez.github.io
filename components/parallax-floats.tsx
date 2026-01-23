"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface FloatingElement {
  id: string;
  icon: string;
  x: number;
  y: number;
  size: number;
  speed: number;
  delay: number;
}

export function ParallaxFloats() {
  const [scrollY, setScrollY] = useState(0);
  const elements = useRef<FloatingElement[]>([
    { id: "1", icon: "{ }", x: 10, y: 20, size: 24, speed: 0.1, delay: 0 },
    { id: "2", icon: "</>", x: 85, y: 30, size: 20, speed: 0.15, delay: 1 },
    { id: "3", icon: "=>", x: 15, y: 60, size: 18, speed: 0.08, delay: 2 },
    { id: "4", icon: "&&", x: 90, y: 70, size: 22, speed: 0.12, delay: 0.5 },
    { id: "5", icon: "npm", x: 75, y: 45, size: 16, speed: 0.2, delay: 1.5 },
    { id: "6", icon: "git", x: 25, y: 85, size: 20, speed: 0.1, delay: 2.5 },
    { id: "7", icon: "01", x: 60, y: 15, size: 18, speed: 0.18, delay: 0.8 },
    { id: "8", icon: "TS", x: 45, y: 90, size: 22, speed: 0.14, delay: 1.2 },
  ]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.current.map((el) => (
        <div
          key={el.id}
          className={cn(
            "absolute font-mono-display font-bold text-muted-foreground/10",
            "animate-float"
          )}
          style={{
            left: `${el.x}%`,
            top: `${el.y}%`,
            fontSize: `${el.size}px`,
            transform: `translateY(${scrollY * el.speed}px)`,
            animationDelay: `${el.delay}s`,
            animationDuration: `${3 + el.speed * 10}s`,
          }}
        >
          {el.icon}
        </div>
      ))}
    </div>
  );
}

export function GradientOrbs() {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Large gradient orb that follows mouse */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
        style={{
          background: "radial-gradient(circle, var(--git-branch) 0%, transparent 70%)",
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`,
          transform: "translate(-50%, -50%)",
          transition: "all 0.5s ease-out",
        }}
      />

      {/* Secondary orb with different color */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-15 blur-3xl"
        style={{
          background: "radial-gradient(circle, var(--git-clean) 0%, transparent 70%)",
          left: `${100 - mousePosition.x}%`,
          top: `${100 - mousePosition.y}%`,
          transform: "translate(-50%, -50%)",
          transition: "all 0.7s ease-out",
        }}
      />

      {/* Animated gradient background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          background: "linear-gradient(45deg, var(--git-branch), var(--git-clean), var(--git-modified))",
          backgroundSize: "400% 400%",
          animation: "gradient-shift 15s ease infinite",
        }}
      />
    </div>
  );
}
