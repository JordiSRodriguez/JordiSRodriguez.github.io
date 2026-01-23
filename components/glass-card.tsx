"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  intensity?: "low" | "medium" | "high";
  hover?: boolean;
}

export function GlassCard({ children, className, intensity = "medium", hover = true }: GlassCardProps) {
  const intensityStyles = {
    low: {
      background: "rgba(255, 255, 255, 0.05)",
      backdropFilter: "blur(8px)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
    },
    medium: {
      background: "rgba(255, 255, 255, 0.08)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(255, 255, 255, 0.15)",
    },
    high: {
      background: "rgba(255, 255, 255, 0.12)",
      backdropFilter: "blur(16px)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
    },
  };

  const styles = intensityStyles[intensity];

  return (
    <div
      className={cn(
        "rounded-xl relative overflow-hidden",
        hover && "transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]",
        className
      )}
      style={styles}
    >
      {/* Animated gradient border */}
      <div className="absolute inset-0 rounded-xl">
        <div
          className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-500"
          style={{
            background: "linear-gradient(45deg, var(--git-branch), var(--git-clean), var(--git-modified))",
            padding: "1px",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />
      </div>

      {/* Inner glow */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
