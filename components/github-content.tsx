"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Github,
  GitCommit,
  Star,
  GitBranch,
  Activity,
  AlertCircle,
} from "lucide-react";
import { useGitHubData } from "@/hooks/use-github-data";

interface GitHubContentProps {
  isCompact?: boolean;
}

export function GitHubContent({ isCompact = false }: GitHubContentProps) {
  const { activities, stats, loading, error, githubUsername } = useGitHubData();

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Activity className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">
          Cargando actividad...
        </span>
      </div>
    );
  }

  if (error && stats.totalStars === 0) {
    return (
      <div className="flex items-center justify-center py-4 text-center">
        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
        <div>
          <p className="text-sm text-red-600 dark:text-red-400">
            Error de conexión
          </p>
          <p className="text-xs text-muted-foreground">
            Intenta de nuevo más tarde
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center justify-center py-2 text-center">
          <AlertCircle className="h-4 w-4 text-orange-500 mr-2" />
          <p className="text-xs text-muted-foreground">Mostrando datos demo</p>
        </div>
      )}

      {/* Stats rápidas */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="space-y-1">
          <p
            className={`font-bold text-primary ${
              isCompact ? "text-lg" : "text-xl"
            }`}
          >
            {formatNumber(stats.totalStars)}
          </p>
          <p className="text-xs text-muted-foreground">Stars</p>
        </div>
        <div className="space-y-1">
          <p
            className={`font-bold text-primary ${
              isCompact ? "text-lg" : "text-xl"
            }`}
          >
            {formatNumber(stats.totalRepos)}
          </p>
          <p className="text-xs text-muted-foreground">Repos</p>
        </div>
        <div className="space-y-1">
          <p
            className={`font-bold text-primary ${
              isCompact ? "text-lg" : "text-xl"
            }`}
          >
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
        <div
          className={`space-y-2 overflow-y-auto custom-scrollbar ${
            isCompact ? "max-h-40" : "max-h-32"
          }`}
        >
          {activities.slice(0, isCompact ? 5 : 4).map((activity) => (
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
              window.open(`https://github.com/${githubUsername}`, "_blank")
            }
          >
            Ver perfil completo
          </Button>
        </div>
      )}
    </div>
  );
}
