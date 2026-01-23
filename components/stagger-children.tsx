"use client";

import { ReactNode, useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface StaggerChildrenProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  initialDelay?: number;
  animation?: "fade-in-up" | "fade-in" | "slide-in-left" | "slide-in-right" | "scale-in";
}

export function StaggerChildren({
  children,
  className,
  staggerDelay = 100,
  initialDelay = 0,
  animation = "fade-in-up",
}: StaggerChildrenProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const animations = {
    "fade-in-up": "translate-y-8 opacity-0",
    "fade-in": "opacity-0",
    "slide-in-left": "-translate-x-8 opacity-0",
    "slide-in-right": "translate-x-8 opacity-0",
    "scale-in": "scale-95 opacity-0",
  };

  const childArray = Array.isArray(children) ? children : [children];

  return (
    <div ref={ref} className={className}>
      {childArray.map((child, index) => (
        <div
          key={index}
          className={cn(
            "transition-all duration-700 ease-out",
            !isVisible && animations[animation],
            isVisible && "opacity-100 translate-x-0 translate-y-0 scale-100"
          )}
          style={{
            transitionDelay: `${initialDelay + index * staggerDelay}ms`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export function AnimatedText({ text, className, delay = 0 }: AnimatedTextProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <span className={cn("inline-block", className)}>
      {text.split("").map((char, index) => (
        <span
          key={index}
          className={cn(
            "inline-block transition-all duration-300",
            !isVisible && "opacity-0 translate-y-4",
            isVisible && "opacity-100 translate-y-0"
          )}
          style={{
            transitionDelay: `${index * 30}ms`,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}
