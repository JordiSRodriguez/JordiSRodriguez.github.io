"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const trailsRef = useRef<HTMLDivElement[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const followerPos = useRef({ x: 0, y: 0 });
  const requestRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Only show custom cursor on desktop
    if (window.innerWidth < 768) return;

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const checkHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        !!target.closest("button") ||
        !!target.closest("a") ||
        target.classList.contains("cursor-pointer");

      setIsHovering(isClickable);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseover", checkHover);

    // Animate cursor
    const animate = () => {
      // Smooth cursor follow
      const ease = 0.15;
      cursorPos.current.x +=
        (mousePos.current.x - cursorPos.current.x) * ease;
      cursorPos.current.y +=
        (mousePos.current.y - cursorPos.current.y) * ease;

      // Follower with delay
      const followerEase = 0.08;
      followerPos.current.x +=
        (mousePos.current.x - followerPos.current.x) * followerEase;
      followerPos.current.y +=
        (mousePos.current.y - followerPos.current.y) * followerEase;

      // Update positions
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorPos.current.x}px, ${cursorPos.current.y}px)`;
      }

      if (followerRef.current) {
        followerRef.current.style.transform = `translate(${followerPos.current.x}px, ${followerPos.current.y}px)`;
      }

      // Animate trails
      trailsRef.current.forEach((trail, i) => {
        const delay = (i + 1) * 0.03;
        const trailX = followerPos.current.x * (1 - delay) + cursorPos.current.x * delay;
        const trailY = followerPos.current.y * (1 - delay) + cursorPos.current.y * delay;

        trail.style.transform = `translate(${trailX}px, ${trailY}px)`;
        trail.style.opacity = `${0.3 - i * 0.05}`;
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseover", checkHover);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Main cursor dot */}
      <div
        ref={cursorRef}
        className={cn(
          "fixed top-0 left-0 w-3 h-3 rounded-full pointer-events-none z-[9999] mix-blend-difference bg-white",
          "transition-transform duration-75",
          isHovering && "scale-150",
          isClicking && "scale-90"
        )}
        style={{
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Follower ring */}
      <div
        ref={followerRef}
        className={cn(
          "fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9998]",
          "border border-white/30 transition-all duration-300",
          isHovering && "w-12 h-12 border-white/50",
          isClicking && "scale-75"
        )}
        style={{
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Trail effects */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) trailsRef.current[i] = el;
          }}
          className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9997] bg-primary/20"
          style={{
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </>
  );
}
