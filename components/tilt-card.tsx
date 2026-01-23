"use client";

import { useState, useRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
  scale?: number;
  glare?: boolean;
}

export function TiltCard({ children, className, intensity = 15, scale = 1.05, glare = true }: TiltCardProps) {
  const [transform, setTransform] = useState("");
  const [glarePosition, setGlarePosition] = useState({ x: "-100%", y: "-100%" });
  const [glareOpacity, setGlareOpacity] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -intensity;
    const rotateY = ((x - centerX) / centerX) * intensity;

    setTransform(
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`
    );

    if (glare) {
      setGlarePosition({ x: `${x}px`, y: `${y}px` });
      setGlareOpacity(1);
    }
  };

  const handleMouseLeave = () => {
    setTransform("perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)");
    setGlareOpacity(0);
  };

  return (
    <div
      ref={ref}
      className={cn("relative transition-transform duration-100 ease-out", className)}
      style={{ transform }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {glare && (
        <div
          className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden"
          style={{
            background: `radial-gradient(
              circle at ${glarePosition.x} ${glarePosition.y},
              rgba(255, 255, 255, 0.3) 0%,
              transparent 50%
            )`,
            opacity: glareOpacity,
            transition: "opacity 0.3s ease-out",
          }}
        />
      )}
      {children}
    </div>
  );
}
