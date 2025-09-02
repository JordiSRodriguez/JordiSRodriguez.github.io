"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import { useNavigateToSection } from "@/contexts/navigation-context";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import {
  Search,
  Terminal,
  Download,
  Share2,
  Moon,
  Sun,
  Presentation,
  Code,
  Mail,
  Github,
  Linkedin,
  Coffee,
} from "lucide-react";

interface Command {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  keywords: string[];
}

interface CommandPaletteProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

export function CommandPalette({
  currentTheme,
  onThemeChange,
}: CommandPaletteProps) {
  const navigateToSection = useNavigateToSection();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: Command[] = [
    {
      id: "home",
      title: "Go to Home",
      description: "Navigate to the home section",
      icon: <Terminal className="w-4 h-4" />,
      action: () => navigateToSection("home"),
      keywords: ["home", "inicio", "main"],
    },
    {
      id: "about",
      title: "Acerca de Mí",
      description: "Conoce más sobre mi experiencia",
      icon: <Search className="w-4 h-4" />,
      action: () => navigateToSection("about"),
      keywords: ["about", "bio", "background", "sobre mi"],
    },
    {
      id: "projects",
      title: "Ver Proyectos",
      description: "Explora mis proyectos del portfolio",
      icon: <Code className="w-4 h-4" />,
      action: () => navigateToSection("projects"),
      keywords: ["projects", "portfolio", "work", "proyectos"],
    },
    {
      id: "experience",
      title: "Experiencia Laboral",
      description: "Ve mi experiencia profesional",
      icon: <Coffee className="w-4 h-4" />,
      action: () => navigateToSection("experience"),
      keywords: ["experience", "work", "job", "career", "experiencia"],
    },
    {
      id: "education",
      title: "Educación",
      description: "Ve mi formación académica",
      icon: <Search className="w-4 h-4" />,
      action: () => navigateToSection("education"),
      keywords: ["education", "school", "university", "educacion"],
    },
    {
      id: "blog",
      title: "Leer Blog",
      description: "Revisa mis últimos artículos",
      icon: <Search className="w-4 h-4" />,
      action: () => navigateToSection("blog"),
      keywords: ["blog", "articles", "posts", "writing"],
    },
    {
      id: "contact",
      title: "Contáctame",
      description: "Ponte en contacto",
      icon: <Mail className="w-4 h-4" />,
      action: () => navigateToSection("contact"),
      keywords: ["contact", "email", "message", "contacto"],
    },
    {
      id: "theme-toggle",
      title: `Cambiar a Modo ${currentTheme === "dark" ? "Claro" : "Oscuro"}`,
      description: "Alterna entre temas claro y oscuro",
      icon:
        currentTheme === "dark" ? (
          <Sun className="w-4 h-4" />
        ) : (
          <Moon className="w-4 h-4" />
        ),
      action: () => onThemeChange(currentTheme === "dark" ? "light" : "dark"),
      keywords: ["theme", "dark", "light", "mode", "tema"],
    },
    {
      id: "download-cv",
      title: "Descargar CV",
      description: "Descarga mi currículum en PDF",
      icon: <Download className="w-4 h-4" />,
      action: () => {
        // Generate and download CV
        const link = document.createElement("a");
        link.href = "/api/generate-cv";
        link.download = "CV_Portfolio.pdf";
        link.click();
      },
      keywords: ["cv", "resume", "download", "pdf", "curriculum"],
    },
    {
      id: "share",
      title: "Compartir Portfolio",
      description: "Comparte este portfolio con otros",
      icon: <Share2 className="w-4 h-4" />,
      action: () => {
        if (navigator.share) {
          navigator.share({
            title: "¡Echa un vistazo a mi portfolio!",
            url: window.location.href,
          });
        } else {
          navigator.clipboard.writeText(window.location.href);
        }
      },
      keywords: ["share", "copy", "link", "compartir"],
    },
    {
      id: "presentation",
      title: "Modo Presentación",
      description: "Iniciar presentación automática del portfolio",
      icon: <Presentation className="w-4 h-4" />,
      action: () => {
        // Start presentation mode
        const sections = [
          "home",
          "about",
          "projects",
          "experience",
          "education",
          "blog",
          "contact",
        ];
        let currentIndex = 0;
        const interval = setInterval(() => {
          navigateToSection(sections[currentIndex]);
          currentIndex = (currentIndex + 1) % sections.length;
          if (currentIndex === 0) clearInterval(interval);
        }, 5000);
      },
      keywords: ["presentation", "auto", "slideshow", "presentacion"],
    },
    {
      id: "github",
      title: "Open GitHub",
      description: "Visit my GitHub profile",
      icon: <Github className="w-4 h-4" />,
      action: () => window.open("https://github.com/yourusername", "_blank"),
      keywords: ["github", "code", "repositories", "git"],
    },
    {
      id: "linkedin",
      title: "Open LinkedIn",
      description: "Visit my LinkedIn profile",
      icon: <Linkedin className="w-4 h-4" />,
      action: () =>
        window.open("https://linkedin.com/in/yourusername", "_blank"),
      keywords: ["linkedin", "professional", "network", "career"],
    },
  ];

  const filteredCommands = commands.filter(
    (command) =>
      command.title.toLowerCase().includes(query.toLowerCase()) ||
      command.description.toLowerCase().includes(query.toLowerCase()) ||
      command.keywords.some((keyword) =>
        keyword.toLowerCase().includes(query.toLowerCase())
      )
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "p") {
        e.preventDefault();
        setIsOpen((prev) => {
          if (prev) {
            // Si se está cerrando, limpiar el estado
            setQuery("");
            setSelectedIndex(0);
          }
          return !prev;
        });
      }

      if (e.key === "Escape") {
        setIsOpen(false);
        setQuery("");
        setSelectedIndex(0);
      }

      if (isOpen) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
        }

        if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev === 0 ? filteredCommands.length - 1 : prev - 1
          );
        }

        if (e.key === "Enter" && filteredCommands[selectedIndex]) {
          e.preventDefault();
          filteredCommands[selectedIndex].action();
          setIsOpen(false);
          setQuery("");
          setSelectedIndex(0);
        }
      }
    },
    [isOpen, filteredCommands, selectedIndex]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="p-0 max-w-2xl">
        <VisuallyHidden>
          <DialogTitle>Command Palette</DialogTitle>
        </VisuallyHidden>
        <div className="border-b border-border">
          <div className="flex items-center px-4 py-3">
            <Search className="w-4 h-4 text-muted-foreground mr-3" />
            <Input
              placeholder="Escribe un comando o busca..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-0 focus-visible:ring-0 text-sm"
              autoFocus
            />
            <Badge variant="outline" className="ml-2 text-xs">
              ⌘P
            </Badge>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No commands found
            </div>
          ) : (
            <div className="p-2">
              {filteredCommands.map((command, index) => (
                <button
                  key={command.id}
                  onClick={() => {
                    command.action();
                    setIsOpen(false);
                    setQuery("");
                    setSelectedIndex(0);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                    index === selectedIndex
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent/50"
                  }`}
                >
                  <div className="flex-shrink-0">{command.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{command.title}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {command.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-border p-3 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Navigate with ↑↓ arrows, select with Enter</span>
            <span>Press Esc to close</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
