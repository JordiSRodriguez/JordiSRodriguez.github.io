"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useNavigateToSection } from "@/contexts/navigation-context";
import logger from "@/lib/logger";

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

export function HeroSection() {
  const navigateToSection = useNavigateToSection();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Default data if no data in Supabase
  const defaultProfile = {
    full_name: "Desarrollador Full Stack",
    bio: "Creo experiencias digitales excepcionales con tecnologías modernas. Apasionado por el código limpio, soluciones innovadoras y dar vida a las ideas.",
    initials: "FS",
    roles: [
      "Desarrollador Full Stack",
      "Especialista Backend",
      "Entusiasta del Código",
      "Solucionador de Problemas",
    ],
    github_username: null,
    linkedin_url: null,
  };

  // Usar roles de la base de datos o datos por defecto
  const texts = profile?.roles || defaultProfile.roles;

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
  }, [displayText, currentIndex, isDeleting, texts.length]); // Cambiado texts por texts.length

  // Función para obtener las iniciales del nombre
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Get data with fallbacks
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      {/* 3D Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-4 sm:left-10 w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full animate-float-slow" />
        <div className="absolute top-40 right-4 sm:right-20 w-12 h-12 sm:w-16 sm:h-16 bg-chart-1/20 rotate-45 animate-float-medium" />
        <div className="absolute bottom-40 left-4 sm:left-20 w-8 h-8 sm:w-12 sm:h-12 bg-chart-2/15 rounded-full animate-float-fast" />
        <div className="absolute bottom-20 right-4 sm:right-10 w-20 h-20 sm:w-24 sm:h-24 bg-chart-3/10 rotate-12 animate-float-slow" />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px] sm:bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile image with 3D effect */}
        <div className="mb-6 sm:mb-8 relative">
          <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-full bg-gradient-to-br from-primary to-chart-1 p-1 animate-pulse-slow">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={displayName}
                width={128}
                height={128}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-muted flex items-center justify-center text-2xl sm:text-4xl font-bold text-primary">
                {displayInitials}
              </div>
            )}
          </div>
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-chart-1/20 rounded-full blur-xl animate-pulse-slow" />
        </div>

        {/* Animated greeting */}
        <div className="mb-3 sm:mb-4">
          <span className="text-base sm:text-lg text-muted-foreground animate-fade-in">
            Hola, soy
          </span>
        </div>

        {/* Main name */}
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-foreground via-primary to-chart-1 bg-clip-text text-transparent animate-fade-in-up">
          {displayName}
        </h1>

        {/* Animated role text - Fixed height container prevents CLS */}
        <div className="mb-6 sm:mb-8 h-16 sm:h-20 flex items-center justify-center">
          <h2 className="text-xl sm:text-2xl md:text-4xl font-semibold text-muted-foreground whitespace-nowrap">
            {displayText}
            <span className="animate-blink">|</span>
          </h2>
        </div>

        {/* Description */}
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed animate-fade-in-up-delay px-4 sm:px-0">
          {displayBio}
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 animate-fade-in-up-delay-2 px-4 sm:px-0">
          <Button
            size="lg"
            className="group relative overflow-hidden w-full sm:w-auto"
            onClick={() => navigateToSection("projects")}
          >
            <span className="relative z-10">Ver Mi Trabajo</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-chart-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="group bg-transparent w-full sm:w-auto"
            onClick={() => navigateToSection("contact")}
          >
            <Mail className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
            Contactar
          </Button>
        </div>

        {/* Social links */}
        <div className="flex justify-center gap-4 sm:gap-6 mb-12 sm:mb-16 animate-fade-in-up-delay-3">
          {(profile?.github_username || defaultProfile.github_username) && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:scale-110 transition-transform"
              onClick={() => {
                const githubUrl = `https://github.com/${
                  profile?.github_username || defaultProfile.github_username
                }`;
                window.open(githubUrl, "_blank");
              }}
              aria-label="Visit GitHub profile"
            >
              <Github className="h-5 w-5" />
            </Button>
          )}
          {(profile?.linkedin_url || defaultProfile.linkedin_url) && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:scale-110 transition-transform"
              onClick={() => {
                const linkedinUrl =
                  profile?.linkedin_url || defaultProfile.linkedin_url;
                if (linkedinUrl) window.open(linkedinUrl, "_blank");
              }}
              aria-label="Visit LinkedIn profile"
            >
              <Linkedin className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="animate-bounce">
          <ArrowDown className="h-6 w-6 mx-auto text-muted-foreground" />
        </div>
      </div>
    </section>
  );
}
