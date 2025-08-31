"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CompactThemeGenerator } from "@/components/compact-theme-generator";
import { MobileBottomNavigation } from "@/components/mobile-bottom-navigation";
import { useSidebarState } from "@/contexts/navigation-context";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Home,
  User,
  Briefcase,
  GraduationCap,
  FolderOpen,
  BookOpen,
  Mail,
  Menu,
  Moon,
  Sun,
  Download,
  Share2,
  Zap,
  Eye,
  EyeOff,
  Keyboard,
  BarChart3,
  Music,
  Mic,
  Palette,
  Database,
  Settings,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";

interface SidebarNavigationProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
  onVoiceToggle?: () => void;
  onMusicToggle?: () => void;
  isVoiceActive?: boolean;
  isMusicActive?: boolean;
  onIndicatorsVisibilityChange?: (isVisible: boolean) => void;
}

const baseNavigationItems = [
  { id: "home", label: "Home", icon: Home, color: "bg-blue-500" },
  { id: "about", label: "About Me", icon: User, color: "bg-green-500" },
  {
    id: "experience",
    label: "Experience",
    icon: Briefcase,
    color: "bg-purple-500",
  },
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

const devNavigationItems = [
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    color: "bg-teal-500",
  },
  {
    id: "dev",
    label: "Dev Tools",
    icon: Settings,
    color: "bg-slate-500",
  },
];

const navigationItems =
  process.env.NODE_ENV === "development"
    ? [...baseNavigationItems, ...devNavigationItems]
    : baseNavigationItems;

export function SidebarNavigation({
  currentSection,
  onSectionChange,
  onVoiceToggle,
  onMusicToggle,
  isVoiceActive,
  isMusicActive,
  onIndicatorsVisibilityChange,
}: SidebarNavigationProps) {
  const { isSidebarCollapsed, setSidebarCollapsed } = useSidebarState();
  const [presentationMode, setPresentationMode] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [shortcuts, setShortcuts] = useState(false);
  const [showThemeGenerator, setShowThemeGenerator] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [indicatorsVisible, setIndicatorsVisible] = useState(true);
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();

  // Evitar problemas de hidratación
  useEffect(() => {
    setMounted(true);
  }, []);

  // Cerrar sidebar al hacer clic en un enlace en móviles
  const handleSectionChange = (section: string) => {
    onSectionChange(section);
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
            e.preventDefault();
            const index = Number.parseInt(e.key) - 1;
            if (navigationItems[index]) {
              handleSectionChange(navigationItems[index].id);
            }
            break;
          case "p":
            e.preventDefault();
            setPresentationMode(!presentationMode);
            break;
          case "f":
            e.preventDefault();
            setFocusMode(!focusMode);
            break;
          case "k":
            e.preventDefault();
            setShortcuts(!shortcuts);
            break;
          case "i":
            e.preventDefault();
            console.log("Opening AI Assistant...");
            break;
          case "v":
            e.preventDefault();
            onVoiceToggle?.();
            break;
          case "m":
            e.preventDefault();
            onMusicToggle?.();
            break;
          case "t":
            e.preventDefault();
            setShowThemeGenerator(!showThemeGenerator);
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    handleSectionChange,
    onVoiceToggle,
    onMusicToggle,
    presentationMode,
    focusMode,
    shortcuts,
    showThemeGenerator,
  ]);

  const exportCV = () => {
    console.log("Exporting CV...");
  };

  const shareSection = () => {
    const url = `${window.location.origin}#${currentSection}`;
    navigator.clipboard.writeText(url);
    console.log("Section URL copied to clipboard");
  };

  if (presentationMode) {
    return (
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPresentationMode(false)}
          className="bg-background/80 backdrop-blur-sm"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Navegación inferior para móviles */}
      <MobileBottomNavigation
        currentSection={currentSection}
        onSectionChange={onSectionChange}
        onIndicatorsVisibilityChange={(isVisible) => {
          setIndicatorsVisible(isVisible);
          onIndicatorsVisibilityChange?.(isVisible);
        }}
      />

      {/* Overlay para móviles cuando el sidebar está abierto */}
      {!isSidebarCollapsed && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {shortcuts && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-background border rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Atajos de Teclado</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShortcuts(false)}
              >
                ×
              </Button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Cmd/Ctrl + 1-8</span>
                <span className="text-muted-foreground">Navegar secciones</span>
              </div>
              <div className="flex justify-between">
                <span>Cmd/Ctrl + P</span>
                <span className="text-muted-foreground">
                  Paleta de comandos
                </span>
              </div>
              <div className="flex justify-between">
                <span>Cmd/Ctrl + I</span>
                <span className="text-muted-foreground">Asistente IA</span>
              </div>
              <div className="flex justify-between">
                <span>Cmd/Ctrl + V</span>
                <span className="text-muted-foreground">
                  Navegación por voz
                </span>
              </div>
              <div className="flex justify-between">
                <span>Cmd/Ctrl + M</span>
                <span className="text-muted-foreground">
                  Reproductor música
                </span>
              </div>
              <div className="flex justify-between">
                <span>Cmd/Ctrl + F</span>
                <span className="text-muted-foreground">Modo enfoque</span>
              </div>
              <div className="flex justify-between">
                <span>Cmd/Ctrl + K</span>
                <span className="text-muted-foreground">Mostrar atajos</span>
              </div>
              {/* <div className="flex justify-between">
                <span>Cmd/Ctrl + T</span>
                <span className="text-muted-foreground">
                  Generador de temas
                </span>
              </div> */}
            </div>
          </div>
        </div>
      )}

      {/* Compact Theme Generator Component */}
      <CompactThemeGenerator
        isOpen={showThemeGenerator}
        onClose={() => setShowThemeGenerator(false)}
      />

      {/* Botón flotante para abrir sidebar cuando está colapsada - Solo en desktop */}
      {isSidebarCollapsed && !isMobile && (
        <Button
          variant="default"
          size="icon"
          onClick={() => setSidebarCollapsed(false)}
          className={`fixed left-2 top-2 sm:left-4 sm:top-4 z-50 rounded-full shadow-lg transition-all duration-300 ${
            focusMode ? "opacity-30 hover:opacity-100" : ""
          }`}
        >
          <Menu className="h-4 w-4" />
        </Button>
      )}

      <aside
        className={`fixed left-0 top-0 h-full bg-background/95 backdrop-blur-sm border-r transition-all duration-300 z-40 flex flex-col ${
          isSidebarCollapsed
            ? "-translate-x-full"
            : isMobile
            ? "w-72 sm:w-64"
            : "w-64"
        } ${focusMode ? "opacity-30 hover:opacity-100" : ""}`}
      >
        <div className="p-3 sm:p-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base sm:text-lg">Jordi Sumba</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Full Stack Developer
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(true)}
              className="ml-auto"
            >
              {isMobile ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <nav className="p-1 sm:p-2 space-y-1 flex-1 overflow-y-auto">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;

            return (
              <Button
                key={item.id}
                variant={isActive ? "secondary" : "ghost"}
                className="w-full justify-start relative group px-2 sm:px-3 text-sm"
                onClick={() => handleSectionChange(item.id)}
              >
                <div
                  className={`w-2 h-2 rounded-full ${item.color} mr-2 sm:mr-3 ${
                    isActive ? "animate-pulse" : ""
                  }`}
                />
                <Icon className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="truncate">{item.label}</span>
                <Badge
                  variant="outline"
                  className="ml-auto text-xs hidden sm:inline-flex"
                >
                  {index + 1}
                </Badge>
              </Button>
            );
          })}
        </nav>

        <div className="flex-shrink-0 p-1 sm:p-2 border-t bg-background/95 space-y-1">
          {/* <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowThemeGenerator(!showThemeGenerator)}
            className="w-full justify-start"
          >
            <Palette
              className={`h-4 w-4 ${
                showThemeGenerator ? "text-purple-500" : ""
              }`}
            />
            <span className="ml-2">Generador Temas</span>
          </Button> */}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-full justify-start text-sm"
          >
            {!mounted ? (
              <Moon className="h-4 w-4" />
            ) : theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span className="ml-2">Tema</span>
          </Button>

          {onVoiceToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onVoiceToggle}
              className="w-full justify-start text-sm"
            >
              <Mic
                className={`h-4 w-4 ${isVoiceActive ? "text-rose-500" : ""}`}
              />
              <span className="ml-2 truncate">Control por Voz</span>
            </Button>
          )}

          {onMusicToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMusicToggle}
              className="w-full justify-start text-sm"
            >
              <Music
                className={`h-4 w-4 ${isMusicActive ? "text-green-500" : ""}`}
              />
              <span className="ml-2 truncate">Música Lo-Fi</span>
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPresentationMode(true)}
            className="w-full justify-start text-sm"
          >
            <EyeOff className="h-4 w-4" />
            <span className="ml-2 truncate">Presentación</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFocusMode(!focusMode)}
            className="w-full justify-start text-sm"
          >
            <Zap className={`h-4 w-4 ${focusMode ? "text-yellow-500" : ""}`} />
            <span className="ml-2">Enfoque</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={exportCV}
            className="w-full justify-start text-sm"
          >
            <Download className="h-4 w-4" />
            <span className="ml-2 truncate">Exportar CV</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={shareSection}
            className="w-full justify-start text-sm"
          >
            <Share2 className="h-4 w-4" />
            <span className="ml-2">Compartir</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShortcuts(true)}
            className="w-full justify-start text-sm"
          >
            <Keyboard className="h-4 w-4" />
            <span className="ml-2">Atajos</span>
          </Button>
        </div>
      </aside>
    </>
  );
}
