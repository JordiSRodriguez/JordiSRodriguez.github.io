"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

export function useParticleExplosion() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
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

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter((p) => p.life > 0);

      particlesRef.current.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.2; // gravity
        particle.life -= 0.02;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace(")", `, ${particle.life})`).replace("rgb", "rgba");
        ctx.fill();
      });

      if (particlesRef.current.length > 0) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    const handleClick = (e: MouseEvent) => {
      const colors = ["rgb(99, 102, 241)", "rgb(34, 197, 94)", "rgb(234, 179, 8)"];

      for (let i = 0; i < 20; i++) {
        const angle = (Math.PI * 2 * i) / 20;
        const velocity = 2 + Math.random() * 4;

        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity - 2,
          life: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 2 + Math.random() * 4,
        });
      }

      if (particlesRef.current.length <= 20) {
        animate();
      }
    };

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("click", handleClick);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return canvasRef;
}

export function ParticleExplosionCanvas() {
  const canvasRef = useParticleExplosion();

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9998]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
