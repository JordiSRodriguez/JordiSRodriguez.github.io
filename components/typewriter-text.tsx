"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TypewriterTextProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  cursor?: boolean;
  loop?: boolean;
  onDelete?: () => void;
  onComplete?: () => void;
}

export function TypewriterText({
  text,
  className,
  speed = 100,
  delay = 0,
  cursor = true,
  loop = false,
  onDelete,
  onComplete,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          setCurrentIndex(currentIndex + 1);
        } else if (loop) {
          setTimeout(() => setIsDeleting(true), 2000);
        } else {
          onComplete?.();
        }
      } else {
        // Deleting
        if (currentIndex > 0) {
          setDisplayedText(text.slice(0, currentIndex - 1));
          setCurrentIndex(currentIndex - 1);
        } else {
          setIsDeleting(false);
          onDelete?.();
        }
      }
    }, delay + (isDeleting ? speed / 2 : speed));

    return () => clearTimeout(timeout);
  }, [currentIndex, isDeleting, text, speed, delay, loop, onComplete, onDelete]);

  return (
    <span className={cn("font-mono-display", className)}>
      {displayedText}
      {cursor && (
        <span className="inline-block w-0.5 h-4 bg-current ml-1 animate-pulse" />
      )}
    </span>
  );
}

interface ScrambleTextProps {
  text: string;
  className?: string;
  speed?: number;
}

export function ScrambleText({ text, className, speed = 50 }: ScrambleTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const chars = "!<>-_\\/[]{}—=+*^?#________";

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayedText(
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }

      iteration += 1 / 3;
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return <span className={cn("font-mono-display", className)}>{displayedText}</span>;
}
