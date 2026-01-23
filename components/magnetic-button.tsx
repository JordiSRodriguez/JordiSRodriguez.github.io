"use client";

import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

export function MagneticButton({
  children,
  strength = 20,
  className,
  ...props
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [transform, setTransform] = useState("");
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const moveX = (x / rect.width) * strength;
    const moveY = (y / rect.height) * strength;

    setTransform(`translate(${moveX}px, ${moveY}px)`);
  };

  const handleMouseLeave = () => {
    setTransform("");
    setIsHovering(false);
  };

  return (
    <button
      ref={buttonRef}
      className={cn(
        "relative inline-flex items-center justify-center gap-2",
        "transition-transform duration-200 ease-out",
        "hover:scale-105 active:scale-95",
        className
      )}
      style={{ transform }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovering(true)}
      {...props}
    >
      {/* Content - must be first for proper stacking */}
      <span className="relative z-20">{children}</span>

      {/* Ripple effect */}
      {isHovering && (
        <span
          className={cn(
            "absolute inset-0 rounded-full z-0",
            "bg-primary/20 animate-ping",
            "pointer-events-none"
          )}
        />
      )}

      {/* Glow effect */}
      {isHovering && (
        <span
          className={cn(
            "absolute inset-0 rounded-lg z-0",
            "bg-gradient-to-r from-git-branch/20 to-git-clean/20",
            "blur-xl pointer-events-none"
          )}
        />
      )}
    </button>
  );
}
