"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Github,
  GitCommit,
  Star,
  GitBranch,
  Activity,
  AlertCircle,
  X,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useFloatingComponents } from "@/contexts/floating-components-context";
import { useGitHubData } from "@/hooks/use-github-data";

export function FloatingGitHub() {
  const [isLive, setIsLive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { activities, stats, loading, error, githubUsername } = useGitHubData();

  const isMobile = useIsMobile();
  const { shouldHideComponent, setGithubExpanded } = useFloatingComponents();

  // Sincronizar el estado de expansión con el contexto solo cuando cambie
  useEffect(() => {
    setGithubExpanded(isHovered);
  }, [isHovered, setGithubExpanded]);

  // Ocultar el componente en desktop si otro flotante está activo
  const shouldHide = shouldHideComponent("githubExpanded");

  // Función para determinar el color basado en el tipo de actividad
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
      case "WatchEvent":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  // Función para determinar el icono basado en el tipo de actividad
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "PushEvent":
        return <GitCommit className="h-3 w-3" />;
      case "CreateEvent":
      case "DeleteEvent":
        return <GitBranch className="h-3 w-3" />;
      case "IssuesEvent":
      case "PullRequestEvent":
        return <Activity className="h-3 w-3" />;
      case "WatchEvent":
        return <Star className="h-3 w-3" />;
      default:
        return <Github className="h-3 w-3" />;
    }
  };

  // Función para formatear el tiempo relativo
  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "hace unos segundos";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `hace ${minutes} min`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `hace ${hours}h`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `hace ${days}d`;
    }
  };

  // Función para formatear números grandes
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  // Efectos de vida (simulación de actividad en tiempo real)
  useEffect(() => {
    const interval = setInterval(() => {
      setIsLive((prev) => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // No renderizar si debe estar oculto en desktop
  if (shouldHide) {
    return null;
  }

  return (
    <div
      className="fixed z-50 transition-all duration-500 ease-out top-20 right-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        className={`
          bg-background/95 backdrop-blur-md border shadow-lg cursor-pointer
          transition-all duration-500 ease-out transform-gpu
          ${
            isHovered
              ? "w-96 h-80 shadow-2xl scale-105 border-primary/20"
              : "w-16 h-16 hover:shadow-xl hover:scale-110"
          }
          rounded-2xl overflow-hidden
          ${
            isHovered ? "max-w-[calc(100vw-2rem)] max-h-[calc(100vh-8rem)]" : ""
          }
        `}
      >
        {!isHovered ? (
          // Vista compacta (icono)
          <div className="h-full w-full flex items-center justify-center group relative">
            <div className="relative">
              <Github
                className={`h-6 w-6 text-muted-foreground transition-all duration-300 ${
                  isLive ? "text-green-500 animate-pulse" : ""
                }`}
              />
              <div
                className={`absolute -top-1 -right-1 w-3 h-3 rounded-full transition-all duration-300 ${
                  isLive
                    ? "bg-green-500 opacity-100 animate-ping"
                    : "bg-primary opacity-0 group-hover:opacity-100"
                }`}
              />
            </div>

            {/* Indicador de toque para móvil */}
            {isMobile && (
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
            )}

            {/* Tooltip */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-background/95 backdrop-blur-sm border rounded-md px-2 py-1 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              {stats.totalStars > 0
                ? `${formatNumber(stats.totalStars)} ⭐`
                : isMobile
                ? "Toca para ver"
                : "GitHub"}
            </div>
          </div>
        ) : (
          // Vista expandida
          <div className="h-full overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Github className="h-5 w-5 text-muted-foreground" />
                  <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    GitHub Activity
                  </span>
                  {isLive && (
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  )}
                </CardTitle>
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsHovered(false)}
                    className="text-xs h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4 animate-in fade-in-50 duration-300">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Activity className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">
                    Cargando actividad...
                  </span>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-4 text-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <div>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Error de conexión
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Mostrando datos demo
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Stats rápidas */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="space-y-1">
                      <p className="text-xl font-bold text-primary">
                        {formatNumber(stats.totalStars)}
                      </p>
                      <p className="text-xs text-muted-foreground">Stars</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xl font-bold text-primary">
                        {formatNumber(stats.totalRepos)}
                      </p>
                      <p className="text-xs text-muted-foreground">Repos</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xl font-bold text-primary">
                        {formatNumber(stats.followers)}
                      </p>
                      <p className="text-xs text-muted-foreground">Followers</p>
                    </div>
                  </div>

                  {/* Actividad reciente */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Actividad Reciente
                    </h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                      {activities.slice(0, 4).map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-start gap-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                          <Badge
                            variant="secondary"
                            className={`flex items-center gap-1 text-xs px-2 py-0.5 ${getActivityColor(
                              activity.type
                            )}`}
                          >
                            {getActivityIcon(activity.type)}
                          </Badge>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">
                              {activity.message}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {activity.repo}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatTimeAgo(activity.timestamp)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {githubUsername && (
                    <div className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() =>
                          window.open(
                            `https://github.com/${githubUsername}`,
                            "_blank"
                          )
                        }
                      >
                        Ver perfil completo
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </div>
        )}
      </Card>
    </div>
  );
}
