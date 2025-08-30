"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Home,
  User,
  Briefcase,
  GraduationCap,
  FolderOpen,
  BookOpen,
  Mail,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";

interface MobileBottomNavigationProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
  onIndicatorsVisibilityChange?: (isVisible: boolean) => void;
}

const navigationItems = [
  { id: "home", label: "Home", icon: Home, color: "bg-blue-500" },
  { id: "about", label: "About", icon: User, color: "bg-green-500" },
  { id: "experience", label: "Work", icon: Briefcase, color: "bg-purple-500" },
  {
    id: "education",
    label: "Education",
    icon: GraduationCap,
    color: "bg-orange-500",
  },
  { id: "projects", label: "Projects", icon: FolderOpen, color: "bg-red-500" },
  { id: "blog", label: "Blog", icon: BookOpen, color: "bg-indigo-500" },
  { id: "contact", label: "Contact", icon: Mail, color: "bg-pink-500" },
];

export function MobileBottomNavigation({
  currentSection,
  onSectionChange,
  onIndicatorsVisibilityChange,
}: MobileBottomNavigationProps) {
  const isMobile = useIsMobile();
  const [showAll, setShowAll] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isIndicatorsVisible, setIsIndicatorsVisible] = useState(true);

  // Evitar problemas de hidratación
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-ocultar indicadores después de 3 segundos, mostrar al cambiar de sección
  useEffect(() => {
    if (!mounted || !isMobile) return;

    setIsIndicatorsVisible(true);
    const timer = setTimeout(() => {
      setIsIndicatorsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentSection, mounted, isMobile]);

  // Mostrar temporalmente al hacer scroll o touch con dirección inteligente
  useEffect(() => {
    if (!mounted || !isMobile) return;

    let timeout: NodeJS.Timeout;
    let lastScrollY = 0;
    let ticking = false;

    const handleInteraction = () => {
      setIsIndicatorsVisible(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsIndicatorsVisible(false);
      }, 2000);
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollDirection = currentScrollY > lastScrollY ? "down" : "up";

          clearTimeout(timeout);

          if (scrollDirection === "down") {
            // Scroll hacia abajo: ocultar inmediatamente
            setIsIndicatorsVisible(false);
          } else if (scrollDirection === "up") {
            // Scroll hacia arriba: mostrar y ocultar después de 1.5s
            setIsIndicatorsVisible(true);
            timeout = setTimeout(() => {
              setIsIndicatorsVisible(false);
            }, 1500);
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    document.addEventListener("touchstart", handleInteraction);
    document.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("touchstart", handleInteraction);
      document.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, [mounted, isMobile]);

  // Notificar cambios de visibilidad al componente padre
  useEffect(() => {
    onIndicatorsVisibilityChange?.(isIndicatorsVisible);
  }, [isIndicatorsVisible, onIndicatorsVisibilityChange]);

  const currentIndex = navigationItems.findIndex(
    (item) => item.id === currentSection
  );

  // Mostrar 4 elementos principales + botón más
  const visibleItems = showAll ? navigationItems : navigationItems.slice(0, 4);
  const hasMore = navigationItems.length > 4;

  const navigateToNext = () => {
    const nextIndex = (currentIndex + 1) % navigationItems.length;
    onSectionChange(navigationItems[nextIndex].id);
  };

  const navigateToPrev = () => {
    const prevIndex =
      currentIndex === 0 ? navigationItems.length - 1 : currentIndex - 1;
    onSectionChange(navigationItems[prevIndex].id);
  };

  // Detectar gestos de swipe
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let isSwiping = false;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isSwiping = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!startX || !startY) return;

      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = Math.abs(startX - currentX);
      const diffY = Math.abs(startY - currentY);

      // Si es un swipe horizontal, prevenir scroll vertical
      if (diffX > diffY && diffX > 10) {
        isSwiping = true;
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!startX || !startY || !isSwiping) return;

      const endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;

      // Solo procesar swipes horizontales significativos
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          // Swipe left - siguiente sección
          navigateToNext();
        } else {
          // Swipe right - sección anterior
          navigateToPrev();
        }
      }

      startX = 0;
      startY = 0;
      isSwiping = false;
    };

    document.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentIndex]);

  // No mostrar en desktop o hasta que esté montado
  if (!mounted || !isMobile) return null;

  return (
    <>
      {/* Indicadores de página en la parte superior */}
      <div
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex gap-1.5 bg-background/90 backdrop-blur-md rounded-full px-4 py-2 border shadow-lg transition-all duration-500 ${
          isIndicatorsVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        {navigationItems.map((item, index) => {
          const isActive = item.id === currentSection;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 hover:scale-110 ${
                isActive
                  ? `${item.color.replace("bg-", "bg-")} scale-125 shadow-md`
                  : "bg-muted hover:bg-muted-foreground/30"
              }`}
              aria-label={`Ir a ${item.label}`}
            />
          );
        })}
      </div>

      {/* Navegación inferior */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t shadow-lg">
        <div className="flex items-center justify-between px-3 py-2">
          {/* Botón anterior */}
          <Button
            variant="ghost"
            size="sm"
            onClick={navigateToPrev}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 h-auto text-xs"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Anterior</span>
          </Button>

          {/* Elementos de navegación - solo los 3 más importantes */}
          <div className="flex flex-1 justify-center gap-2">
            {navigationItems.slice(0, 3).map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;

              return (
                <Button
                  key={item.id}
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => onSectionChange(item.id)}
                  className="flex flex-col items-center gap-0.5 px-2 py-1.5 h-auto min-w-0"
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${item.color} ${
                      isActive ? "animate-pulse" : ""
                    }`}
                  />
                  <Icon className="h-4 w-4" />
                  <span className="text-xs truncate max-w-14">
                    {item.label}
                  </span>
                </Button>
              );
            })}

            {/* Botón "Más" con dropdown */}
            <Button
              variant={showAll ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setShowAll(!showAll)}
              className="flex flex-col items-center gap-0.5 px-2 py-1.5 h-auto"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="text-xs">Más</span>
            </Button>
          </div>

          {/* Botón siguiente */}
          <Button
            variant="ghost"
            size="sm"
            onClick={navigateToNext}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 h-auto text-xs"
          >
            <ChevronRight className="h-4 w-4" />
            <span>Siguiente</span>
          </Button>
        </div>

        {/* Menú expandido */}
        {showAll && (
          <div className="border-t bg-background/90 backdrop-blur-sm">
            <div className="grid grid-cols-4 gap-1 p-3">
              {navigationItems.slice(3).map((item) => {
                const Icon = item.icon;
                const isActive = currentSection === item.id;

                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => {
                      onSectionChange(item.id);
                      setShowAll(false);
                    }}
                    className="flex flex-col items-center gap-1 px-2 py-2 h-auto min-w-0"
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${item.color} ${
                        isActive ? "animate-pulse" : ""
                      }`}
                    />
                    <Icon className="h-4 w-4" />
                    <span className="text-xs truncate max-w-16">
                      {item.label}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
