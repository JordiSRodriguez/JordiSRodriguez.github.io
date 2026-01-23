"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

export function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState("");
  const sectionsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      // Total scroll progress
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setScrollProgress(Math.min(progress, 100));

      // Detect current section
      sectionsRef.current.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2) {
          setCurrentSection(section.id || "");
        }
      });
    };

    // Collect all sections
    sectionsRef.current = Array.from(document.querySelectorAll("section[id]"));

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      {/* Progress bar */}
      <div className="h-1 bg-border/50 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-git-branch via-git-clean to-git-modified transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Scroll percentage indicator */}
      <div className="absolute top-4 right-4 font-mono-display text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded border border-border/50">
        {Math.round(scrollProgress)}%
      </div>
    </div>
  );
}
