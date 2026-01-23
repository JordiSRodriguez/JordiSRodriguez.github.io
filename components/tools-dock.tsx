"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Github,
  Cloud,
  Star,
  GitBranch,
  Wind,
  Thermometer,
  MapPin,
  Calendar,
  Activity,
  ChevronUp,
  ChevronDown,
  Users,
  UserPlus,
  GitFork,
  Eye,
  Code,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useFloatingComponents } from "@/contexts/floating-components-context";
import { useGitHubData } from "@/hooks/use-github-data";
import { useWeatherData } from "@/hooks/use-weather-data";
import { getWeatherIcon } from "@/lib/weather-utils";
import { cn } from "@/lib/utils";

interface ToolsDockProps {
  className?: string;
}

export function ToolsDock({ className }: ToolsDockProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"weather" | "github">("weather");
  const [isMounted, setIsMounted] = useState(false);
  const dockRef = useRef<HTMLDivElement>(null);

  const isMobile = useIsMobile();
  const { shouldHideComponent, setGithubExpanded, setWeatherExpanded } =
    useFloatingComponents();

  // GitHub data
  const {
    activities,
    stats,
    loading: githubLoading,
    error: githubError,
    githubUsername,
  } = useGitHubData();

  // Weather data
  const { weather, codingWeather, loading: weatherLoading } = useWeatherData();

  // Manejar hover y expansión
  useEffect(() => {
    // Solo actualizar el contexto si realmente necesitamos cambiar el estado
    if (activeTab === "github") {
      setGithubExpanded(isExpanded);
      setWeatherExpanded(false);
    } else {
      setWeatherExpanded(isExpanded);
      setGithubExpanded(false);
    }
  }, [isExpanded, activeTab, setGithubExpanded, setWeatherExpanded]);

  // Auto-collapse cuando se pierde el hover
  useEffect(() => {
    if (!isHovered && !isMobile) {
      const timer = setTimeout(() => {
        setIsExpanded(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isHovered, isMobile]);

  // Remove mount animation to prevent CLS
  // The component should be immediately visible to avoid layout shift
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Solo ocultar si el AI chat está abierto
  const shouldHide = shouldHideComponent("aiChatOpen");

  // Never return null - use visibility to prevent CLS
  if (shouldHide && !isMobile) {
    return (
      <div
        ref={dockRef}
        className="fixed z-50 top-5 right-4 w-20 h-16 opacity-0 pointer-events-none"
        aria-hidden="true"
      />
    );
  }

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (!isMobile) {
      setIsExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const switchTab = (tab: "weather" | "github") => {
    setActiveTab(tab);
    // No forzar expansión, solo cambiar tab
  };

  // Formatear tiempo relativo para GitHub
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  // Obtener color para tipo de actividad de GitHub
  const getActivityColor = (type: string): string => {
    switch (type) {
      case "PushEvent":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "CreateEvent":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "DeleteEvent":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "IssuesEvent":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      case "PullRequestEvent":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  return (
    <div
      ref={dockRef}
      className={cn(
        "fixed z-50 transition-all duration-500 ease-out",
        "top-5 right-4",
        isMounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Card
        className={cn(
          "bg-background/95 backdrop-blur-md border shadow-lg",
          // Disable expansion transition to prevent CLS - only animate hover effects
          isExpanded
            ? "transition-shadow duration-300"
            : "transition-all duration-300 ease-out transform-gpu",
          "rounded-2xl overflow-hidden border-border/50",
          isExpanded
            ? "w-96 h-[500px] shadow-2xl border-primary/20"
            : "w-20 h-16 hover:shadow-xl hover:scale-105 cursor-pointer",
          "max-w-[calc(100vw-2rem)] max-h-[calc(100vh-8rem)]"
        )}
      >
        {/* Header compacto / Dock icons */}
        <div
          className={cn(
            "flex items-center justify-center p-3",
            isExpanded ? "border-b border-border/50 bg-muted/30" : ""
          )}
        >
          {!isExpanded ? (
            // Modo compacto - mostrar iconos superpuestos
            <div className="relative flex items-center justify-center w-full h-full tools-dock-icon-stack">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex -space-x-2">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full border-2 border-background flex items-center justify-center dock-icon",
                      "bg-gradient-to-br from-blue-500 to-blue-600 text-white",
                      "transition-all duration-300 hover:scale-110",
                      activeTab === "weather"
                        ? "z-10 scale-110"
                        : "scale-90 opacity-70"
                    )}
                  >
                    <Cloud className="w-4 h-4" />
                  </div>
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full border-2 border-background flex items-center justify-center dock-icon",
                      "bg-gradient-to-br from-gray-800 to-gray-900 text-white dark:from-gray-700 dark:to-gray-800",
                      "transition-all duration-300 hover:scale-110",
                      activeTab === "github"
                        ? "z-10 scale-110"
                        : "scale-90 opacity-70"
                    )}
                  >
                    <Github className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Modo expandido - mostrar tabs
            <div className="flex space-x-1">
              <Button
                variant={activeTab === "weather" ? "default" : "ghost"}
                size="sm"
                onClick={() => switchTab("weather")}
                className="h-8 px-3"
              >
                <Cloud className="w-4 h-4 mr-2" />
                Clima
              </Button>
              <Button
                variant={activeTab === "github" ? "default" : "ghost"}
                size="sm"
                onClick={() => switchTab("github")}
                className="h-8 px-3"
              >
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
            </div>
          )}
        </div>

        {/* Contenido expandido - Always rendered to prevent CLS */}
        <CardContent
          className={cn(
            "overflow-hidden",
            // Remove transition to prevent CLS during expansion
            isExpanded ? "p-4 h-[calc(100%-4rem)] opacity-100" : "h-0 p-0 opacity-0"
          )}
        >
          <div className={isExpanded ? "block" : "hidden"}>
            {activeTab === "weather" ? (
              // Contenido de Weather
              <div className="space-y-4 h-full overflow-y-auto">
                {weatherLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
                      <span className="text-sm text-muted-foreground">
                        Cargando clima...
                      </span>
                    </div>
                  </div>
                ) : weather ? (
                  <>
                    {/* Información principal del clima */}
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl flex items-center justify-center">
                        <div className="scale-150">
                          {getWeatherIcon(weather.condition)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-2xl font-bold">
                          {weather.temperature}°C
                        </div>
                        <div className="text-muted-foreground capitalize">
                          {weather.description}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {weather.location}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Detalles del clima */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Thermometer className="w-4 h-4 text-orange-500" />
                        <div>
                          <div className="text-sm font-medium">Temperatura</div>
                          <div className="text-sm text-muted-foreground">
                            {weather.temperature}°C
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Wind className="w-4 h-4 text-blue-500" />
                        <div>
                          <div className="text-sm font-medium">Viento</div>
                          <div className="text-sm text-muted-foreground">
                            {weather.windSpeed} m/s
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Activity className="w-4 h-4 text-green-500" />
                        <div>
                          <div className="text-sm font-medium">Humedad</div>
                          <div className="text-sm text-muted-foreground">
                            {weather.humidity}%
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-purple-500" />
                        <div>
                          <div className="text-sm font-medium">Condición</div>
                          <div className="text-sm text-muted-foreground">
                            {weather.condition}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Coding Weather si está disponible */}
                    {codingWeather && (
                      <>
                        <Separator />
                        <div className="p-3 rounded-lg bg-muted/30">
                          <div className="text-sm font-medium mb-2">
                            🖥️ Clima para Programar
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {codingWeather}
                          </div>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    Datos del clima no disponibles
                  </div>
                )}
              </div>
            ) : (
              // Contenido de GitHub
              <div className="flex flex-col h-full overflow-hidden">
                {githubLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
                      <span className="text-sm text-muted-foreground">
                        Cargando datos de GitHub...
                      </span>
                    </div>
                  </div>
                ) : githubError ? (
                  <div className="text-center text-muted-foreground py-8">
                    No se pueden cargar los datos de GitHub
                  </div>
                ) : (
                  <div className="flex flex-col h-full space-y-4">
                    {/* Estadísticas de GitHub */}
                    {stats && (
                      <div className="flex-shrink-0">
                        <div className="grid grid-cols-2 gap-3 github-stats-grid">
                          <div className="flex items-center space-x-2 github-stat-item">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <div>
                              <div className="text-sm font-medium">
                                Estrellas
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {stats.totalStars}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 github-stat-item">
                            <GitBranch className="w-4 h-4 text-blue-500" />
                            <div>
                              <div className="text-sm font-medium">
                                Repositorios
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {stats.totalRepos}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 github-stat-item">
                            <Users className="w-4 h-4 text-green-500" />
                            <div>
                              <div className="text-sm font-medium">
                                Seguidores
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {stats.followers}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 github-stat-item">
                            <UserPlus className="w-4 h-4 text-purple-500" />
                            <div>
                              <div className="text-sm font-medium">
                                Siguiendo
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {stats.following}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 github-stat-item">
                            <GitFork className="w-4 h-4 text-orange-500" />
                            <div>
                              <div className="text-sm font-medium">Forks</div>
                              <div className="text-sm text-muted-foreground">
                                {stats.totalForks}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 github-stat-item">
                            <Code className="w-4 h-4 text-cyan-500" />
                            <div>
                              <div className="text-sm font-medium">Profile</div>
                              <div className="text-xs text-muted-foreground truncate">
                                {githubUsername}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <Separator className="flex-shrink-0" />

                    {/* Actividad reciente */}
                    <div className="space-y-3 flex-1 overflow-y-auto activity-timeline">
                      <div className="text-sm font-medium flex items-center">
                        <Activity className="w-4 h-4 mr-2" />
                        Actividad Reciente
                      </div>
                      {activities && activities.length > 0 ? (
                        activities.slice(0, 6).map((activity, index) => (
                          <div
                            key={index}
                            className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/30 transition-colors"
                          >
                            <Badge
                              variant="secondary"
                              className={cn(
                                "text-xs shrink-0",
                                getActivityColor(activity.type)
                              )}
                            >
                              {activity.type.replace("Event", "")}
                            </Badge>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium truncate">
                                {activity.repo}
                              </div>
                              {activity.message && (
                                <div className="text-xs text-muted-foreground truncate mt-0.5">
                                  {activity.message}
                                </div>
                              )}
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {formatTimeAgo(
                                  activity.timestamp.toISOString()
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-muted-foreground py-4">
                          Sin actividad reciente
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          </CardContent>
      </Card>
    </div>
  );
}
