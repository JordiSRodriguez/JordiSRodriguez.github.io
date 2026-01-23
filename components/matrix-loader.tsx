"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface MatrixLoaderProps {
  onComplete?: () => void;
  minDuration?: number;
}

export function MatrixLoader({ onComplete, minDuration = 2000 }: MatrixLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);
  const [bootText, setBootText] = useState<string[]>([]);

  const bootSequence = [
    "> Initializing portfolio core...",
    "> Loading design system...",
    "> Mounting components...",
    "> Connecting to Supabase...",
    "> Fetching GitHub data...",
    "> Compiling experience...",
    "> Optimizing performance...",
    "> Ready."
  ];

  useEffect(() => {
    const startTime = Date.now();
    let hasCompleted = false;

    const bootInterval = setInterval(() => {
      setBootText((prev) => {
        if (currentLine < bootSequence.length) {
          const newText = [...prev, bootSequence[currentLine]];
          setCurrentLine(currentLine + 1);
          return newText;
        }
        return prev;
      });
    }, 300);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = Math.min(prev + Math.random() * 15, 100);

        if (newProgress >= 100 && !hasCompleted) {
          const elapsed = Date.now() - startTime;
          const remaining = Math.max(0, minDuration - elapsed);

          if (remaining <= 0) {
            hasCompleted = true;
            clearInterval(progressInterval);
            clearInterval(bootInterval);
            setTimeout(() => onComplete?.(), 500);
          }
        }

        return newProgress;
      });
    }, 200);

    return () => {
      clearInterval(bootInterval);
      clearInterval(progressInterval);
    };
  }, [currentLine, minDuration, onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center font-mono-display">
      {/* Matrix rain background */}
      <div className="absolute inset-0 opacity-20">
        <canvas
          ref={(canvas) => {
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const fontSize = 14;
            const columns = canvas.width / fontSize;
            const drops: number[] = [];

            for (let i = 0; i < columns; i++) {
              drops[i] = Math.random() * -100;
            }

            const draw = () => {
              ctx.fillStyle = "rgba(15, 23, 42, 0.05)";
              ctx.fillRect(0, 0, canvas.width, canvas.height);

              ctx.fillStyle = "#22c55e";
              ctx.font = `${fontSize}px monospace`;

              for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                const x = i * fontSize;
                const y = drops[i] * fontSize;

                ctx.fillText(text, x, y);

                if (y > canvas.height && Math.random() > 0.975) {
                  drops[i] = 0;
                }

                drops[i]++;
              }
            };

            const interval = setInterval(draw, 33);

            return () => clearInterval(interval);
          }}
          className="w-full h-full"
        />
      </div>

      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(34,197,94,0.03)_2px,rgba(34,197,94,0.03)_4px)]" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-8">
        {/* Boot sequence */}
        <div className="mb-8 space-y-1 text-sm sm:text-base">
          {bootText.map((line, index) => (
            <div
              key={index}
              className="text-green-500 opacity-0"
              style={{
                animation: `fadeInUp 0.3s ease-out ${index * 0.3}s forwards`,
              }}
            >
              {line}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="space-y-2 opacity-0" style={{ animation: "fadeInUp 0.3s ease-out 2.5s forwards" }}>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>LOADING EXPERIENCE</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-git-branch via-git-clean to-git-modified transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            >
              <div className="h-full w-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent bg-[length:200%_100%]" />
            </div>
          </div>
        </div>

        {/* Loading animation */}
        <div className="mt-8 flex items-center justify-center gap-2 opacity-0" style={{ animation: "fadeInUp 0.3s ease-out 2.7s forwards" }}>
          <div className="w-2 h-2 bg-git-branch rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-git-clean rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
          <div className="w-2 h-2 bg-git-modified rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
