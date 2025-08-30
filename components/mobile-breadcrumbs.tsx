"use client";

import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface MobileBreadcrumbsProps {
  currentSection: string;
  isVisible: boolean;
}

const sectionLabels: Record<string, string> = {
  home: "Inicio",
  about: "Acerca de",
  experience: "Experiencia",
  education: "Educación",
  projects: "Proyectos",
  blog: "Blog",
  contact: "Contacto",
  analytics: "Analytics",
};

export function MobileBreadcrumbs({
  currentSection,
  isVisible,
}: MobileBreadcrumbsProps) {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isMobile) return null;

  const currentLabel = sectionLabels[currentSection] || currentSection;

  return (
    <div
      className={`fixed top-16 left-1/2 transform -translate-x-1/2 z-40 bg-background/90 backdrop-blur-md rounded-lg border px-4 py-2 mx-auto max-w-fit shadow-lg transition-all duration-500 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
    >
      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium">{currentLabel}</span>
      </div>
    </div>
  );
}
