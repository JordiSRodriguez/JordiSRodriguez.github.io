"use client";

import { useEffect, useRef } from "react";

interface ConfettiPiece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  size: number;
  wobble: number;
  wobbleSpeed: number;
}

export function useConfetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const piecesRef = useRef<ConfettiPiece[]>([]);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const colors = [
      "#6366f1", // git-branch
      "#22c55e", // git-clean
      "#eab308", // git-modified
      "#ec4899", // pink
      "#06b6d4", // cyan
    ];

    const createConfetti = (x: number, y: number) => {
      for (let i = 0; i < 100; i++) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = 5 + Math.random() * 10;

        piecesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity - 5,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 10,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 5 + Math.random() * 10,
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: 0.1 + Math.random() * 0.2,
        });
      }

      if (!animationRef.current) {
        animate();
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      piecesRef.current = piecesRef.current.filter((piece) => {
        piece.x += piece.vx;
        piece.y += piece.vy;
        piece.vy += 0.3; // gravity
        piece.rotation += piece.rotationSpeed;
        piece.wobble += piece.wobbleSpeed;

        const wobbleOffset = Math.sin(piece.wobble) * 2;

        ctx.save();
        ctx.translate(piece.x + wobbleOffset, piece.y);
        ctx.rotate((piece.rotation * Math.PI) / 180);
        ctx.fillStyle = piece.color;
        ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
        ctx.restore();

        return piece.y < canvas.height + 50;
      });

      if (piecesRef.current.length > 0) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        animationRef.current = undefined;
      }
    };

    // Expose confetti function globally
    (window as any).confetti = createConfetti;

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return canvasRef;
}

export function ConfettiCanvas() {
  const canvasRef = useConfetti();

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
    />
  );
}

// Hook to trigger confetti programmatically
export function useConfettiTrigger() {
  return () => {
    if (typeof window !== "undefined" && (window as any).confetti) {
      const x = window.innerWidth / 2;
      const y = window.innerHeight / 2;
      (window as any).confetti(x, y);
    }
  };
}
