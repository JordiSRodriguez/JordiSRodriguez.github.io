"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { FileCard } from "@/components/ui/file-card";
import { GlassCard } from "@/components/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardSpotlight } from "@/components/spotlight-effect";
import {
  Github,
  GitCommit,
  Star,
  GitBranch,
  Activity,
  AlertCircle,
  X,
  Eye,
  Code,
  Terminal,
  Zap,
  TrendingUp,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useFloatingComponents } from "@/contexts/floating-components-context";
import { useGitHubData } from "@/hooks/use-github-data";
import { cn } from "@/lib/utils";

export function FloatingGitHub() {
  const [isLive, setIsLive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [pulse, setPulse] = useState(0);

  const { activities, stats, loading, error, githubUsername } = useGitHubData();

  const isMobile = useIsMobile();
  const { shouldHideComponent, setGithubExpanded } = useFloatingComponents();

  useEffect(() => {
    setGithubExpanded(isHovered);
  }, [isHovered, setGithubExpanded]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsLive((prev) => !prev);
      setPulse((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const shouldHide = shouldHideComponent("githubExpanded");

  const getActivityColor = (type: string): string => {
    switch (type) {
      case "PushEvent":
        return "text-git-clean bg-git-clean/10 border-git-clean/30";
      case "CreateEvent":
        return "text-git-branch bg-git-branch/10 border-git-branch/30";
      case "DeleteEvent":
        return "text-git-conflict bg-git-conflict/10 border-git-conflict/30";
      case "IssuesEvent":
        return "text-git-modified bg-git-modified/10 border-git-modified/30";
      case "PullRequestEvent":
        return "text-purple-400 bg-purple-400/10 border-purple-400/30";
      case "WatchEvent":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
      default:
        return "text-muted-foreground bg-muted/10 border-border/50";
    }
  };

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
        return <Code className="h-3 w-3" />;
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

  if (shouldHide) {
    return (
      <div className="fixed z-50 top-5 right-4 w-16 h-16 opacity-0 pointer-events-none" aria-hidden="true" />
    );
  }

  return (
    <div
      className="fixed z-50 transition-all duration-500 ease-out top-5 right-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardSpotlight>
        <GlassCard intensity="high" hover={false}>
          <Card
            className={cn(
              "transition-all duration-500 ease-out transform-gpu cursor-pointer overflow-hidden",
              "bg-background/80 backdrop-blur-xl border border-git-branch/30",
              isHovered ? "w-[420px] h-auto shadow-2xl shadow-git-branch/20 scale-105" : "w-16 h-16 hover:scale-110",
              "rounded-xl"
            )}
          >
            {!isHovered ? (
              // Compact View - GitHub Icon Terminal Style
              <div className="h-full w-full flex items-center justify-center group relative">
                <div className="relative">
                  {/* Pulsing glow effect */}
                  <div className={cn(
                    "absolute inset-0 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-git-branch/30",
                    pulse === 0 && "opacity-50 animate-pulse"
                  )} />

                  {/* Terminal window frame */}
                  <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 flex items-center justify-center shadow-lg">
                    {/* Window controls */}
                    <div className="absolute top-1 left-1.5 flex gap-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500/80" />
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/80" />
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500/80" />
                    </div>

                    {/* GitHub icon with glow */}
                    <Github
                      className={cn(
                        "h-5 w-5 relative z-10 transition-transform duration-300",
                        isLive && "text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]"
                      )}
                    />

                    {/* Active indicator */}
                    {isLive && (
                      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full animate-ping border border-green-400" />
                    )}
                  </div>

                  {/* Activity rings */}
                  <svg className="absolute inset-0 -rotate-45 scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <circle cx="50%" cy="50%" r="24" fill="none" stroke="currentColor" strokeWidth="1" className="text-git-branch/20" stroke-dasharray="1 150" />
                    <circle cx="50%" cy="50%" r="28" fill="none" stroke="currentColor" strokeWidth="1" className="text-git-clean/10" stroke-dasharray="1 100" />
                  </svg>

                  {/* Stats preview on hover */}
                  <div className="absolute top-full mt-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="bg-background/95 backdrop-blur-sm border border-git-branch/30 rounded-lg px-3 py-2 text-xs whitespace-nowrap shadow-lg">
                      <div className="flex items-center gap-2 font-mono-display">
                        <Zap className="w-3 h-3 text-yellow-400" />
                        <span className="text-git-branch">{formatNumber(stats.totalStars)}</span>
                        <span className="text-muted-foreground">stars</span>
                        <Eye className="w-3 h-3 text-git-clean" />
                        <span className="text-git-clean">{formatNumber(stats.totalRepos)}</span>
                        <span className="text-muted-foreground">repos</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Expanded View - Terminal/File Style
              <div className="overflow-hidden">
                {/* Terminal-style header */}
                <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700 px-3 py-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Terminal className="w-4 h-4 text-git-branch" />
                        <span className="text-[10px] font-mono-display text-gray-300">
                          github
                        </span>
                        <span className="text-[10px] font-mono-display text-gray-500">
                          — bash
                        </span>
                      </div>
                    </div>
                    {isMobile && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsHovered(false)}
                        className="h-6 w-6 p-0 hover:bg-red-500/20 hover:text-red-400 text-gray-400"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4 bg-gray-900/50">
                  {loading ? (
                    <div className="flex items-center justify-center py-8 space-y-3">
                      <div className="relative">
                        <div className="w-8 h-8 rounded border-2 border-git-branch/50 border-t-git-branch animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Terminal className="w-4 h-4 text-git-branch animate-pulse" />
                        </div>
                      </div>
                      <p className="text-xs font-mono-display text-git-branch">
                        Loading activity...
                      </p>
                    </div>
                  ) : error ? (
                    <div className="flex items-center justify-center py-4 text-center space-y-2">
                      <AlertCircle className="h-6 w-6 text-git-conflict mx-auto" />
                      <div className="font-mono-display text-xs">
                        <p className="text-git-conflict">Error: connection failed</p>
                        <p className="text-muted-foreground">Showing demo data</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Stats as code */}
                      <div className="bg-black/40 rounded-lg p-3 font-mono-display text-xs border border-gray-700">
                        <div className="flex items-center gap-2 text-muted-foreground mb-3">
                          <TrendingUp className="w-3 h-3 text-green-400" />
                          <span>// repository metrics</span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">const</span>
                            <span className="text-git-clean">stats</span>
                            <span className="text-git-branch">=</span>
                            <span className="text-purple-400">{`{`}</span>
                          </div>

                          <div className="ml-4 grid grid-cols-3 gap-3">
                            <div>
                              <div className="text-lg font-bold text-git-branch">
                                {formatNumber(stats.totalStars)}
                              </div>
                              <div className="text-[10px] text-muted-foreground">stars</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-git-clean">
                                {formatNumber(stats.totalRepos)}
                              </div>
                              <div className="text-[10px] text-muted-foreground">repos</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-yellow-400">
                                {formatNumber(stats.followers)}
                              </div>
                              <div className="text-[10px] text-muted-foreground">followers</div>
                            </div>
                          </div>

                          <div className="ml-4 text-purple-400">{`{}};`}</div>
                        </div>
                      </div>

                      {/* Activity feed as terminal output */}
                      <div className="bg-black/40 rounded-lg p-3 border border-gray-700">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                          <Terminal className="w-3 h-3 text-git-branch" />
                          <span className="text-[10px] font-mono-display">
                            git log --oneline -5
                          </span>
                        </div>

                        <div className="space-y-1.5 max-h-32 overflow-y-auto custom-scrollbar">
                          {activities.slice(0, 5).map((activity, index) => (
                            <div
                              key={activity.id}
                              className={cn(
                                "flex items-start gap-2 py-1.5 px-2 rounded transition-colors",
                                index === 0 && "bg-git-branch/5 border border-git-branch/20"
                              )}
                            >
                              <div className="flex-shrink-0 mt-0.5">
                                <div className={cn(
                                  "w-5 h-5 rounded flex items-center justify-center",
                                  getActivityColor(activity.type)
                                )}>
                                  {getActivityIcon(activity.type)}
                                </div>
                              </div>

                              <div className="flex-1 min-w-0 font-mono-display text-xs">
                                <div className="text-muted-foreground">
                                  <span className="text-gray-500">{activity.type}:</span>
                                  <span className="ml-2 text-foreground">{activity.message}</span>
                                </div>
                                {activity.repo && (
                                  <div className="ml-4 text-gray-400 truncate">
                                    @ {activity.repo}
                                  </div>
                                )}
                              </div>

                              <div className="flex-shrink-0 text-[10px] text-gray-500">
                                {formatTimeAgo(activity.timestamp)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CTA Button */}
                      {githubUsername && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full group font-mono-display text-xs bg-git-branch hover:bg-git-branch/90 text-white border-0 shadow-lg hover:shadow-git-branch/20 transition-all"
                          onClick={() =>
                            window.open(`https://github.com/${githubUsername}`, "_blank")
                          }
                        >
                          <Github className="mr-2 h-3 w-3 group-hover:rotate-12 transition-transform" />
                          $ cd ~/{githubUsername}
                          <div className="absolute inset-0 bg-gradient-to-r from-git-clean to-git-branch opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </Card>
        </GlassCard>
      </CardSpotlight>
    </div>
  );
}
