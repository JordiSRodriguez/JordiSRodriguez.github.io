"use client";

import { useEffect, useRef } from "react";

export function ParticleSystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<any[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Particle colors
    const colors = [
      'rgba(99, 102, 241, 0.6)',   // git-branch
      'rgba(34, 197, 94, 0.6)',    // git-clean
      'rgba(234, 179, 8, 0.6)',   // git-modified
      'rgba(139, 92, 246, 0.6)',  // purple
      'rgba(236, 72, 153, 0.6)',  // pink
    ];

    // Create particles
    const particleCount = 80;
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        baseRadius: Math.random() * 2 + 1,
        angle: Math.random() * Math.PI * 2,
        oscillationSpeed: Math.random() * 0.02 + 0.01,
        oscillationAmount: Math.random() * 0.5,
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Mouse attraction
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 200;

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          const angle = Math.atan2(dy, dx);
          particle.vx += Math.cos(angle) * force * 0.02;
          particle.vy += Math.sin(angle) * force * 0.02;

          // Grow near mouse
          particle.radius = particle.baseRadius * (1 + force * 2);
        } else {
          particle.radius = particle.baseRadius;
        }

        // Oscillation
        particle.angle += particle.oscillationSpeed;
        const oscillationX = Math.cos(particle.angle) * particle.oscillationAmount;
        const oscillationY = Math.sin(particle.angle) * particle.oscillationAmount;

        // Draw particle
        ctx.beginPath();
        ctx.arc(
          particle.x + oscillationX,
          particle.y + oscillationY,
          particle.radius,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Draw connections between nearby particles
        particlesRef.current.forEach((otherParticle, otherIndex) => {
          if (index === otherIndex) return;

          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxConnectionDistance = 100;

          if (distance < maxConnectionDistance) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${(1 - distance / maxConnectionDistance) * 0.2})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
