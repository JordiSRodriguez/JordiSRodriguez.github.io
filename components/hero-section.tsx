"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, Github, Linkedin, Mail, Terminal, Code2, GitCommit, Sparkles } from "lucide-react";
import { ParticleSystem } from "@/components/particle-system";
import { WebGLShader } from "@/components/webgl-shader";
import { SoundWrapper } from "@/lib/sounds";
import { GlitchText } from "@/components/glitch-text";
import { MagneticButton } from "@/components/magnetic-button";
import { createClient } from "@/lib/supabase/client";
import { useNavigateToSection } from "@/contexts/navigation-context";
import logger from "@/lib/logger";
import { cn } from "@/lib/utils";

interface Profile {
  id: string;
  full_name: string;
  bio: string;
  avatar_url?: string;
  github_username?: string;
  linkedin_url?: string;
  twitter_url?: string;
  website_url?: string;
  location?: string;
  roles?: string[];
  initials?: string;
}

// Animated code rain background
function CodeRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Code symbols
    const symbols = ['01', '{ }', '</>', '=>', '&&', '||', 'git', 'npm', '⚡', '✓'];
    const drops: number[] = [];
    const columns = Math.floor(canvas.width / 30);

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = '12px monospace';

      for (let i = 0; i < drops.length; i++) {
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        const x = i * 30;
        const y = drops[i] * 20;

        // Git branch colors
        const colors = ['rgba(99, 102, 241, 0.3)', 'rgba(34, 197, 94, 0.3)', 'rgba(234, 179, 8, 0.3)'];
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];

        ctx.fillText(symbol, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 opacity-30 pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}

// Commit graph visualization
function CommitGraph() {
  const commits = Array.from({ length: 8 }, (_, i) => ({
    id: `a3f8d${2 + i}c`,
    branch: i % 3 === 0 ? 'main' : i % 3 === 1 ? 'feat' : 'fix',
    time: `${(8 - i) * 2}m ago`,
  }));

  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-2">
      {commits.map((commit, i) => (
        <div
          key={commit.id}
          className={cn(
            "flex items-center gap-2 text-[10px] font-mono-display opacity-0",
            "animate-slide-in-right"
          )}
          style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}
        >
          <div
            className={cn(
              "w-2 h-2 rounded-full",
              commit.branch === 'main' ? 'bg-git-branch' : commit.branch === 'feat' ? 'bg-git-clean' : 'bg-git-modified'
            )}
          />
          <span className="text-muted-foreground">{commit.id}</span>
          <span className="text-muted-foreground/60">{commit.time}</span>
        </div>
      ))}
    </div>
  );
}

export function HeroSection() {
  const navigateToSection = useNavigateToSection();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Default data if no data in Supabase
  const defaultProfile = {
    full_name: "Jordi Sumba",
    bio: "Full Stack Developer crafting exceptional digital experiences. Passionate about clean code, innovative solutions, and bringing ideas to life.",
    initials: "JS",
    roles: [
      "Full Stack Developer",
      "Backend Specialist",
      "Code Enthusiast",
      "Problem Solver",
    ],
    github_username: null,
    linkedin_url: null,
  };

  const texts = profile?.roles || defaultProfile.roles;

  // Track mouse position for glow effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Get profile data from Supabase
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .limit(1);

        if (error) throw error;
        setProfile(data && data.length > 0 ? data[0] : null);
      } catch (error) {
        logger.error("Error fetching profile:", error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Typing animation
  useEffect(() => {
    if (texts.length === 0) return;
    const currentText = texts[currentIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < currentText.length) {
            setDisplayText(currentText.slice(0, displayText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText(displayText.slice(0, -1));
          } else {
            setIsDeleting(false);
            setCurrentIndex((prev) => (prev + 1) % texts.length);
          }
        }
      },
      isDeleting ? 50 : 100
    );

    return () => clearTimeout(timeout);
  }, [displayText, currentIndex, isDeleting, texts.length]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = profile?.full_name || defaultProfile.full_name;
  const displayBio = profile?.bio || defaultProfile.bio;
  const displayInitials =
    profile?.initials || profile?.full_name
      ? getInitials(profile.full_name)
      : defaultProfile.initials;

  if (loading) {
    return (
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center px-4 sm:px-6">
          <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-full bg-muted mb-6 sm:mb-8" />
          <div className="h-6 sm:h-8 bg-muted rounded w-32 sm:w-48 mx-auto mb-3 sm:mb-4" />
          <div className="h-8 sm:h-12 bg-muted rounded w-48 sm:w-64 mx-auto" />
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Code rain background */}
      <CodeRain />

      {/* Interactive glow effect */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.08), transparent 40%)`,
        }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {/* Floating particle system */}
      <ParticleSystem />

      {/* WebGL shader overlay */}
      <WebGLShader intensity={0.4} />

      {/* Commit graph */}
      <CommitGraph />

      {/* Main content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Terminal-style header */}
        <div className="mb-8 inline-flex">
          <div className="bg-muted/30 backdrop-blur-sm border border-border rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-border/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/80" />
                <div className="w-3 h-3 rounded-full bg-git-modified/80" />
                <div className="w-3 h-3 rounded-full bg-git-clean/80" />
              </div>
              <span className="text-[10px] font-mono-display text-muted-foreground ml-2">
                portfolio/src/app/page.tsx
              </span>
            </div>
            <div className="px-4 py-3 font-mono-display text-xs text-left">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">git commit -m</span>
                <span className="text-git-clean">"init: welcome"</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile avatar with enhanced effects */}
        <div className="mb-8 relative">
          <div
            className="w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-2xl bg-gradient-to-br from-git-branch/20 via-background to-git-clean/10 border-2 border-git-branch/30 p-1 relative group cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="w-full h-full rounded-xl bg-muted/30 flex items-center justify-center text-4xl sm:text-5xl font-bold font-mono-display text-git-branch relative overflow-hidden">
              <span className="relative z-10">{displayInitials}</span>

              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-git-branch/10 to-git-clean/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Scanline effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000" />
            </div>

            {/* Terminal glow effect */}
            {isHovered && (
              <div className="absolute -inset-4 bg-gradient-to-r from-git-branch/20 to-git-clean/20 rounded-2xl blur-xl animate-pulse" />
            )}

            {/* Branch badge */}
            <div className="absolute -bottom-2 -right-2 px-2 py-1 bg-background border border-git-clean rounded-md text-[10px] font-mono-display text-git-clean shadow-lg">
              main
            </div>
          </div>
        </div>

        {/* Terminal-style greeting */}
        <div className="mb-4 font-mono-display">
          <span className="text-muted-foreground">
            <span className="text-git-branch">$</span> ./welcome.sh --user
          </span>
        </div>

        {/* Main name with syntax highlighting and glitch effect */}
        <h1 className="text-5xl sm:text-7xl md:text-9xl font-bold mb-6 font-mono-display relative">
          <div className="relative inline-block">
            <GlitchText className="bg-gradient-to-r from-foreground via-git-branch to-git-clean bg-clip-text text-transparent" intensity="medium">
              {displayName}
            </GlitchText>
            {/* Subtle underline */}
            <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-git-branch/50 to-transparent" />
          </div>
        </h1>

        {/* Animated terminal typing effect */}
        <div className="mb-8 min-h-[80px] flex items-center justify-center">
          <div className="bg-muted/30 backdrop-blur-sm border border-border/50 rounded-lg px-6 py-4 max-w-2xl">
            <div className="flex items-center gap-3">
              <Terminal className="w-5 h-5 text-git-branch flex-shrink-0" />
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2 text-muted-foreground text-xs font-mono-display mb-2">
                  <span>role</span>
                  <span className="text-git-branch">=</span>
                  <span className="text-git-clean">"</span>
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground font-mono-display">
                  {displayText}
                  <span className="typing-cursor text-git-branch" />
                </h2>
              </div>
              {/* Status indicator */}
              <div className="flex items-center gap-2 text-[10px] font-mono-display text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-git-clean animate-pulse" />
                <span>running</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description with code block styling */}
        <div className="mb-12 max-w-3xl mx-auto">
          <div className="bg-muted/20 border border-border/50 rounded-lg p-6 relative">
            {/* Line numbers */}
            <div className="absolute left-4 top-6 bottom-6 w-6 text-right text-xs text-muted-foreground/30 font-mono-display select-none">
              <div>1</div>
              <div>2</div>
              <div>3</div>
            </div>

            <p className="text-base sm:text-lg md:text-xl text-foreground leading-relaxed pl-10 font-mono-display">
              {displayBio}
            </p>

            {/* Syntax highlight dots */}
            <div className="absolute top-4 right-4 flex gap-1">
              <div className="w-1 h-1 rounded-full bg-git-branch/50" />
              <div className="w-1 h-1 rounded-full bg-git-clean/50" />
              <div className="w-1 h-1 rounded-full bg-git-modified/50" />
            </div>
          </div>
        </div>

        {/* CTA buttons with magnetic effect */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 px-4">
          <SoundWrapper sound="hover">
            <MagneticButton
              className="group relative overflow-hidden font-mono-display text-sm bg-git-branch hover:bg-git-branch/90 text-white border-0 shadow-lg shadow-git-branch/20 px-6 py-3"
              onClick={() => navigateToSection("projects")}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              ./projects
              <div className="absolute inset-0 bg-gradient-to-r from-git-clean to-git-branch opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </MagneticButton>
          </SoundWrapper>

          <SoundWrapper sound="hover">
            <MagneticButton
              className="group font-mono-display text-sm border-2 border-border hover:border-git-clean/50 hover:bg-git-clean/5 bg-background px-6 py-3"
              onClick={() => navigateToSection("contact")}
            >
              <Mail className="mr-2 h-4 w-4" />
              ./contact
            </MagneticButton>
          </SoundWrapper>
        </div>

        {/* Social links with terminal-style icons */}
        <div className="flex justify-center gap-6 mb-16">
          {(profile?.github_username || defaultProfile.github_username) && (
            <SoundWrapper sound="hover">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:scale-110 transition-all duration-300 hover:bg-git-branch/10 group"
                onClick={() => {
                  const githubUrl = `https://github.com/${
                    profile?.github_username || "jordisumba"
                  }`;
                  window.open(githubUrl, "_blank");
                }}
                aria-label="Visit GitHub profile"
              >
                <Github className="h-5 w-5 group-hover:text-git-branch transition-colors" />
              </Button>
            </SoundWrapper>
          )}
          {(profile?.linkedin_url || defaultProfile.linkedin_url) && (
            <SoundWrapper sound="hover">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:scale-110 transition-all duration-300 hover:bg-git-clean/10 group"
                onClick={() => {
                  const linkedinUrl =
                    profile?.linkedin_url || defaultProfile.linkedin_url;
                  if (linkedinUrl) window.open(linkedinUrl, "_blank");
                }}
                aria-label="Visit LinkedIn profile"
              >
                <Linkedin className="h-5 w-5 group-hover:text-git-clean transition-colors" />
              </Button>
            </SoundWrapper>
          )}
        </div>

        {/* Scroll indicator with git branch metaphor */}
        <div className="animate-bounce">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <div className="text-[10px] font-mono-display">
              <span className="text-git-branch">git</span> checkout -b next-section
            </div>
            <ArrowDown className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
