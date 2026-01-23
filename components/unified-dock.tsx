"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Github,
  Cloud,
  Star,
  GitBranch,
  Wind,
  Droplets,
  Thermometer,
  Activity,
  Loader2,
  Terminal,
  Zap,
  TrendingUp,
  CloudLightning,
  Snowflake,
  CloudRain,
  Sun,
  Moon,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useFloatingComponents } from "@/contexts/floating-components-context";
import { useGitHubData } from "@/hooks/use-github-data";
import { useWeatherData } from "@/hooks/use-weather-data";
import { cn } from "@/lib/utils";

export function UnifiedDock() {
  const [isHovered, setIsHovered] = useState(false);
  const [activeTab, setActiveTab] = useState<"weather" | "github">("weather");
  const [isMounted, setIsMounted] = useState(false);

  const isMobile = useIsMobile();
  const { shouldHideComponent, setGithubExpanded, setWeatherExpanded } =
    useFloatingComponents();

  const {
    activities,
    stats,
    loading: githubLoading,
    error: githubError,
    githubUsername,
  } = useGitHubData();

  const { weather, codingWeather, loading: weatherLoading } = useWeatherData();

  useEffect(() => {
    if (activeTab === "github") {
      setGithubExpanded(isHovered);
      setWeatherExpanded(false);
    } else {
      setWeatherExpanded(isHovered);
      setGithubExpanded(false);
    }
  }, [isHovered, activeTab, setGithubExpanded, setWeatherExpanded]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const shouldHide = shouldHideComponent("aiChatOpen");

  if (shouldHide && !isMobile) {
    return (
      <div
        className="fixed z-50 top-5 right-4 w-20 h-16 opacity-0 pointer-events-none"
        aria-hidden="true"
      />
    );
  }

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "clear":
        return <Sun className="w-5 h-5" />;
      case "clouds":
        return <Cloud className="w-5 h-5" />;
      case "rain":
        return <CloudRain className="w-5 h-5" />;
      case "drizzle":
        return <CloudRain className="w-5 h-5" />;
      case "thunderstorm":
        return <CloudLightning className="w-5 h-5" />;
      case "snow":
        return <Snowflake className="w-5 h-5" />;
      case "mist":
      case "fog":
        return <Cloud className="w-5 h-5 opacity-50" />;
      default:
        return <Cloud className="w-5 h-5" />;
    }
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  return (
    <div
      className={cn(
        "fixed z-50 transition-all duration-500 ease-out top-5 right-4",
        isMounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        className={cn(
          "transition-all duration-300 ease-out overflow-hidden border-2 shadow-xl",
          "bg-gray-950 border-git-branch/30",
          isHovered ? "w-[400px] h-auto" : "w-20 h-16",
          "rounded-lg"
        )}
      >
        {/* Compact view - icons only */}
        {!isHovered ? (
          <div className="h-full w-full flex items-center justify-center gap-3">
            <button
              onClick={() => setActiveTab("weather")}
              className={cn(
                "p-2 rounded-lg transition-all duration-200",
                activeTab === "weather"
                  ? "bg-git-clean/20 text-git-clean scale-110"
                  : "bg-muted/20 text-muted-foreground hover:scale-105"
              )}
            >
              <Cloud className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveTab("github")}
              className={cn(
                "p-2 rounded-lg transition-all duration-200",
                activeTab === "github"
                  ? "bg-git-branch/20 text-git-branch scale-110"
                  : "bg-muted/20 text-muted-foreground hover:scale-105"
              )}
            >
              <Github className="w-5 h-5" />
            </button>
          </div>
        ) : (
          // Expanded view - content
          <div className="p-4 space-y-4">
            {/* Tab indicator */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-git-branch" />
                <span className="text-sm font-mono-display font-semibold">
                  {activeTab === "weather" ? "weather.ts" : "github.ts"}
                </span>
                <Badge variant="outline" className="text-[10px] font-mono-display">
                  {activeTab}
                </Badge>
              </div>
            </div>

            {/* Weather content */}
            {activeTab === "weather" && (
              <div className="space-y-4">
                {weatherLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="h-6 w-6 animate-spin text-git-clean" />
                  </div>
                ) : weather ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold">
                          {weather.temperature}°C
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {weather.location}
                        </div>
                      </div>
                      <div className="text-git-clean">
                        {getWeatherIcon(weather.condition)}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="flex flex-col items-center p-2 rounded-lg bg-muted/10">
                        <Thermometer className="w-4 h-4 text-orange-400 mb-1" />
                        <span className="text-xs text-muted-foreground">Temp</span>
                        <span className="font-semibold">{weather.temperature}°C</span>
                      </div>
                      <div className="flex flex-col items-center p-2 rounded-lg bg-muted/10">
                        <Wind className="w-4 h-4 text-gray-400 mb-1" />
                        <span className="text-xs text-muted-foreground">Wind</span>
                        <span className="font-semibold">{weather.windSpeed} m/s</span>
                      </div>
                      <div className="flex flex-col items-center p-2 rounded-lg bg-muted/10">
                        <Droplets className="w-4 h-4 text-blue-400 mb-1" />
                        <span className="text-xs text-muted-foreground">Humidity</span>
                        <span className="font-semibold">{weather.humidity}%</span>
                      </div>
                    </div>

                    {codingWeather && (
                      <div className="p-3 rounded-lg bg-muted/20 border border-border">
                        <div className="flex items-center gap-2 mb-1">
                          <Zap className="w-3 h-3 text-yellow-400" />
                          <span className="text-xs font-medium">Coding Conditions</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{codingWeather}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    Unable to load weather
                  </div>
                )}
              </div>
            )}

            {/* GitHub content */}
            {activeTab === "github" && (
              <div className="space-y-4">
                {githubLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="h-6 w-6 animate-spin text-git-branch" />
                  </div>
                ) : githubError ? (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    Error loading GitHub data
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="flex flex-col items-center p-3 rounded-lg bg-muted/10">
                        <Star className="w-5 h-5 text-yellow-400 mb-2" />
                        <span className="text-xl font-bold">{formatNumber(stats.totalStars)}</span>
                        <span className="text-[10px] text-muted-foreground">Stars</span>
                      </div>
                      <div className="flex flex-col items-center p-3 rounded-lg bg-muted/10">
                        <GitBranch className="w-5 h-5 text-git-clean mb-2" />
                        <span className="text-xl font-bold">{formatNumber(stats.totalRepos)}</span>
                        <span className="text-[10px] text-muted-foreground">Repos</span>
                      </div>
                      <div className="flex flex-col items-center p-3 rounded-lg bg-muted/10">
                        <Activity className="w-5 h-5 text-green-400 mb-2" />
                        <span className="text-xl font-bold">{formatNumber(stats.followers)}</span>
                        <span className="text-[10px] text-muted-foreground">Followers</span>
                      </div>
                    </div>

                    <div className="border-t border-border pt-3">
                      <div className="flex items-center gap-2 mb-2 text-sm font-medium">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span>Recent Activity</span>
                      </div>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {activities.slice(0, 4).map((activity) => (
                          <div
                            key={activity.id}
                            className="flex items-start gap-2 p-2 rounded-lg bg-muted/5 hover:bg-muted/10 transition-colors"
                          >
                            <Badge variant="secondary" className="text-[10px] shrink-0">
                              {activity.type.replace("Event", "")}
                            </Badge>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium truncate">
                                {activity.repo}
                              </div>
                              {activity.message && (
                                <div className="text-[10px] text-muted-foreground truncate">
                                  {activity.message}
                                </div>
                              )}
                            </div>
                            <div className="text-[10px] text-muted-foreground shrink-0">
                              {formatTimeAgo(activity.timestamp)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {githubUsername && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs"
                        onClick={() =>
                          window.open(`https://github.com/${githubUsername}`, "_blank")
                        }
                      >
                        <Github className="mr-2 h-3 w-3" />
                        View Profile
                      </Button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
