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
import { createClient } from "@/lib/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { useFloatingComponents } from "@/contexts/floating-components-context";

interface GitHubActivity {
  id: string;
  type: string;
  repo: string;
  message: string;
  timestamp: Date;
  additions?: number;
  deletions?: number;
  url?: string;
}

interface GitHubStats {
  totalCommits: number;
  totalStars: number;
  totalRepos: number;
  followers: number;
  following: number;
  totalForks: number;
}

export function FloatingGitHub() {
  const [activities, setActivities] = useState<GitHubActivity[]>([]);
  const [stats, setStats] = useState<GitHubStats>({
    totalCommits: 0,
    totalStars: 0,
    totalRepos: 0,
    followers: 0,
    following: 0,
    totalForks: 0,
  });
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [githubUsername, setGithubUsername] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const isMobile = useIsMobile();
  const { shouldHideComponent, setGithubExpanded } = useFloatingComponents();

  // Sincronizar el estado de expansión con el contexto solo cuando cambie
  useEffect(() => {
    setGithubExpanded(isHovered);
  }, [isHovered, setGithubExpanded]);

  // Ocultar el componente en desktop si otro flotante está activo
  const shouldHide = shouldHideComponent("githubExpanded");

  const supabase = createClient();

  useEffect(() => {
    // Get user configuration from Supabase
    const fetchUserProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("github_username")
          .single();

        if (error) throw error;

        if (data?.github_username) {
          setGithubUsername(data.github_username);
        } else {
          setGithubUsername("octocat"); // Username por defecto para demo
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setGithubUsername("octocat"); // Fallback
      }
    };

    fetchUserProfile();
  }, [supabase]);

  useEffect(() => {
    if (!githubUsername) return;

    const fetchGitHubData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch basic user stats
        const userResponse = await fetch(
          `https://api.github.com/users/${githubUsername}`
        );

        if (!userResponse.ok) {
          throw new Error("Error fetching GitHub user data");
        }

        const userData = await userResponse.json();

        // Fetch repositories
        const reposResponse = await fetch(
          `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=10`
        );

        if (!reposResponse.ok) {
          throw new Error("Error fetching GitHub repositories");
        }

        const reposData = await reposResponse.json();

        // Fetch recent events
        const eventsResponse = await fetch(
          `https://api.github.com/users/${githubUsername}/events?per_page=5`
        );

        if (!eventsResponse.ok) {
          throw new Error("Error fetching GitHub events");
        }

        const eventsData = await eventsResponse.json();

        // Calculate total stars and forks
        const totalStars = reposData.reduce(
          (sum: number, repo: any) => sum + repo.stargazers_count,
          0
        );
        const totalForks = reposData.reduce(
          (sum: number, repo: any) => sum + repo.forks_count,
          0
        );

        setStats({
          totalCommits: 0, // GitHub API doesn't provide this easily
          totalStars,
          totalRepos: userData.public_repos,
          followers: userData.followers,
          following: userData.following,
          totalForks,
        });

        // Process recent activities
        const processedActivities: GitHubActivity[] = eventsData
          .slice(0, 5)
          .map((event: any) => ({
            id: event.id,
            type: event.type,
            repo: event.repo.name,
            message: getEventMessage(event),
            timestamp: new Date(event.created_at),
            url: `https://github.com/${event.repo.name}`,
          }));

        setActivities(processedActivities);
      } catch (error) {
        console.error("Error fetching GitHub data:", error);
        setError(error instanceof Error ? error.message : "Error desconocido");
        // Set fallback data for demo
        setFallbackData();
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, [githubUsername]);

  const setFallbackData = () => {
    setStats({
      totalCommits: 247,
      totalStars: 89,
      totalRepos: 23,
      followers: 156,
      following: 89,
      totalForks: 34,
    });

    setActivities([
      {
        id: "1",
        type: "PushEvent",
        repo: "usuario/portfolio-2025",
        message: "Implementado sistema de navegación flotante",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
        additions: 150,
        deletions: 23,
      },
      {
        id: "2",
        type: "CreateEvent",
        repo: "usuario/weather-app",
        message: "Creado nuevo repositorio",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      },
      {
        id: "3",
        type: "IssuesEvent",
        repo: "usuario/react-components",
        message: "Cerrado issue: Mejorar responsive design",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      },
    ]);
  };

  const getEventMessage = (event: any): string => {
    switch (event.type) {
      case "PushEvent":
        const commits = event.payload.commits?.length || 1;
        return `${commits} nuevo${commits > 1 ? "s" : ""} commit${
          commits > 1 ? "s" : ""
        }`;
      case "CreateEvent":
        return `Creado ${event.payload.ref_type}: ${
          event.payload.ref || "repositorio"
        }`;
      case "IssuesEvent":
        return `${event.payload.action} issue: ${event.payload.issue?.title}`;
      case "PullRequestEvent":
        return `${event.payload.action} pull request`;
      case "ForkEvent":
        return "Repositorio forkeado";
      case "WatchEvent":
        return "Repositorio marcado con estrella";
      default:
        return `Actividad: ${event.type}`;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "PushEvent":
        return <GitCommit className="h-4 w-4 text-green-500" />;
      case "CreateEvent":
        return <GitBranch className="h-4 w-4 text-blue-500" />;
      case "IssuesEvent":
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case "PullRequestEvent":
        return <GitBranch className="h-4 w-4 text-purple-500" />;
      case "ForkEvent":
        return <GitBranch className="h-4 w-4 text-yellow-500" />;
      case "WatchEvent":
        return <Star className="h-4 w-4 text-yellow-500" />;
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 1) return "Ahora";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const toggleLiveMode = () => {
    setIsLive(!isLive);
  };

  // No renderizar si debe estar oculto en desktop
  if (shouldHide) {
    return null;
  }

  return (
    <div
      className="fixed z-50 transition-all duration-500 ease-out top-1/2 right-4 -translate-y-1/2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        className={`
          bg-background/95 backdrop-blur-md border shadow-lg cursor-pointer
          transition-all duration-500 ease-out transform-gpu
          ${
            isHovered
              ? "w-96 h-80 shadow-2xl scale-105 border-primary/20 origin-right"
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
          <div className="h-full w-full flex items-center justify-center relative group">
            <Github className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
            {isLive && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            )}
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />

            {/* Indicador de toque para móvil */}
            {isMobile && (
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
            )}

            {/* Tooltip */}
            <div
              className={`absolute ${
                isMobile
                  ? "top-8"
                  : "top-1/2 -left-20 transform -translate-y-1/2"
              } left-1/2 transform -translate-x-1/2 bg-background/95 backdrop-blur-sm border rounded-md px-2 py-1 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
            >
              {isLive
                ? "GitHub Live"
                : isMobile
                ? "Toca para ver"
                : "GitHub Stats"}
            </div>
          </div>
        ) : (
          // Vista expandida
          <div className="h-full overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Github className="h-5 w-5" />
                  <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    GitHub Live
                  </span>
                  {isLive && (
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  )}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleLiveMode}
                    className="text-xs hover:bg-primary/10 transition-colors duration-200"
                  >
                    {isLive ? "Pausar" : "Live"}
                  </Button>
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
              </div>
            </CardHeader>
            <CardContent className="space-y-4 animate-in fade-in-50 duration-300">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Cargando datos...
                  </span>
                </div>
              ) : error ? (
                <div className="text-center py-4">
                  <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-sm text-red-500">Error: {error}</p>
                </div>
              ) : (
                <>
                  {/* Stats compactas */}
                  <div className="grid grid-cols-3 gap-2 text-center bg-muted/30 rounded-lg p-3">
                    <div>
                      <p className="text-lg font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                        {stats.totalRepos}
                      </p>
                      <p className="text-xs text-muted-foreground">Repos</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                        {stats.totalStars}
                      </p>
                      <p className="text-xs text-muted-foreground">Stars</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
                        {stats.followers}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Seguidores
                      </p>
                    </div>
                  </div>

                  {/* Actividades recientes */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Actividad Reciente
                    </h4>
                    <div className="space-y-2 max-h-36 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20">
                      {activities.slice(0, 3).map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-start gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors duration-200"
                        >
                          {getActivityIcon(activity.type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">
                              📁 {activity.repo.split("/")[1]}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {activity.message}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded">
                            {formatTimeAgo(activity.timestamp)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {githubUsername && (
                    <div className="text-center">
                      <Badge
                        variant="secondary"
                        className="text-xs bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20"
                      >
                        👤 @{githubUsername}
                      </Badge>
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
