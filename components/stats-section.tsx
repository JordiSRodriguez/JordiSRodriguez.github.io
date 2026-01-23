"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { FileCard } from "@/components/ui/file-card";
import { ContributionGraph } from "@/components/contribution-graph";
import { createBrowserClient } from "@supabase/ssr";
import {
  Code,
  Users,
  Star,
  TrendingUp,
  Rocket,
  Heart,
  GitBranch,
  FileText,
  Eye,
  MessageSquare,
  GraduationCap,
  Briefcase,
  Loader,
  Terminal,
  GitCommit,
} from "lucide-react";
import logger from "@/lib/logger";
import { cn } from "@/lib/utils";

// Database table types
interface VisitStat {
  id: string;
}

interface Project {
  id: string;
  status?: "completed" | "in-progress" | "planned";
}

interface WorkExperience {
  id: string;
}

interface Contact {
  id: string;
}

interface PortfolioLike {
  id: string;
}

interface Skill {
  id: string;
}

interface Experience {
  id: string;
}

interface StatsData {
  completedProjects: number;
  inProgressProjects: number;
  totalVisits: number;
  workExperiences: number;
  totalContacts: number;
  githubRepos?: number;
  totalLikes: number;
  skillsCount: number;
  experiencesCount: number;
}

export function StatsSection() {
  const [visitCount, setVisitCount] = useState(0);
  const [statsData, setStatsData] = useState<StatsData>({
    completedProjects: 0,
    inProgressProjects: 0,
    totalVisits: 0,
    workExperiences: 0,
    totalContacts: 0,
    githubRepos: 0,
    totalLikes: 0,
    skillsCount: 0,
    experiencesCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const formatStatValue = (value: number): string => {
    if (value === 0) return "0";
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
    return value.toString();
  };

  useEffect(() => {
    fetchStats();
    trackVisit();
    fetchGitHubStats();

    const likesChannel = supabase
      .channel("portfolio_likes_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "portfolio_likes",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setStatsData((prev) => ({
              ...prev,
              totalLikes: prev.totalLikes + 1,
            }));
          } else if (payload.eventType === "DELETE") {
            setStatsData((prev) => ({
              ...prev,
              totalLikes: Math.max(0, prev.totalLikes - 1),
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(likesChannel);
    };
  }, []);

  const fetchGitHubStats = async () => {
    try {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("github_username")
        .single();

      if (profileData?.github_username) {
        const response = await fetch(
          `https://api.github.com/users/${profileData.github_username}/repos?per_page=100`
        );
        if (response.ok) {
          const repos = await response.json();
          setStatsData((prev) => ({
            ...prev,
            githubRepos: repos.length,
          }));
        }
      }
    } catch (error) {
      logger.error("Error fetching GitHub stats:", error);
    }
  };

  const fetchStats = async () => {
    try {
      setError(null);

      const tableQueries = [
        { name: "visit_stats", query: supabase.from("visit_stats").select("id") },
        { name: "projects", query: supabase.from("projects").select("id, status") },
        { name: "work_experiences", query: supabase.from("work_experiences").select("id") },
        { name: "contacts", query: supabase.from("contacts").select("id") },
        { name: "portfolio_likes", query: supabase.from("portfolio_likes").select("id") },
        { name: "skills", query: supabase.from("skills").select("id") },
        { name: "experiences", query: supabase.from("experiences").select("id") },
      ];

      const results = await Promise.allSettled(
        tableQueries.map(({ query }) => query)
      );

      const statsResults: {
        visitsData: VisitStat[] | null;
        projectsData: Project[] | null;
        workExperiencesData: WorkExperience[] | null;
        contactsData: Contact[] | null;
        likesData: PortfolioLike[] | null;
        skillsData: Skill[] | null;
        experiencesData: Experience[] | null;
      } = {
        visitsData: null,
        projectsData: null,
        workExperiencesData: null,
        contactsData: null,
        likesData: null,
        skillsData: null,
        experiencesData: null,
      };

      results.forEach((result, index) => {
        const tableName = tableQueries[index].name;

        if (result.status === "fulfilled" && !result.value.error) {
          switch (tableName) {
            case "visit_stats":
              statsResults.visitsData = result.value.data;
              break;
            case "projects":
              statsResults.projectsData = result.value.data;
              break;
            case "work_experiences":
              statsResults.workExperiencesData = result.value.data;
              break;
            case "contacts":
              statsResults.contactsData = result.value.data;
              break;
            case "portfolio_likes":
              statsResults.likesData = result.value.data;
              break;
            case "skills":
              statsResults.skillsData = result.value.data;
              break;
            case "experiences":
              statsResults.experiencesData = result.value.data;
              break;
          }
        }
      });

      const completedProjects =
        statsResults.projectsData?.filter((p: Project) => p.status === "completed")
          .length || 0;
      const inProgressProjects =
        statsResults.projectsData?.filter(
          (p: Project) => p.status === "in-progress"
        ).length || 0;
      const totalVisits = statsResults.visitsData?.length || 0;
      const workExperiences = statsResults.workExperiencesData?.length || 0;
      const totalContacts = statsResults.contactsData?.length || 0;
      const totalLikes = statsResults.likesData?.length || 0;
      const skillsCount = statsResults.skillsData?.length || 0;
      const experiencesCount = statsResults.experiencesData?.length || 0;

      setVisitCount(totalVisits);
      setStatsData({
        completedProjects,
        inProgressProjects,
        totalVisits,
        workExperiences,
        totalContacts,
        totalLikes,
        skillsCount,
        experiencesCount,
      });
    } catch (error) {
      logger.error("Error fetching stats:", error);
      setStatsData({
        completedProjects: 0,
        inProgressProjects: 0,
        totalVisits: 1,
        workExperiences: 0,
        totalContacts: 0,
        totalLikes: 0,
        skillsCount: 0,
        experiencesCount: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const trackVisit = async () => {
    try {
      const visitorId =
        localStorage.getItem("visitor_id") || crypto.randomUUID();
      localStorage.setItem("visitor_id", visitorId);

      await supabase.from("visit_stats").insert([
        {
          visitor_id: visitorId,
          page_path: window.location.pathname,
          user_agent: navigator.userAgent,
          referrer: document.referrer || null,
        },
      ]);
    } catch (error) {
      // Silently fail
    }
  };

  // Code-themed stat items
  const codeStats = [
    {
      icon: Code,
      label: "completed_projects",
      displayLabel: "Proyectos Completados",
      value: formatStatValue(statsData.completedProjects),
      type: "const" as const,
      color: "text-git-branch",
    },
    {
      icon: Loader,
      label: "in_progress_projects",
      displayLabel: "En Desarrollo",
      value: formatStatValue(statsData.inProgressProjects),
      type: "let" as const,
      color: "text-git-modified",
    },
    {
      icon: Briefcase,
      label: "work_experience",
      displayLabel: "Experiencia",
      value: formatStatValue(statsData.workExperiences),
      type: "const" as const,
      color: "text-git-clean",
    },
    {
      icon: GraduationCap,
      label: "education",
      displayLabel: "Formación",
      value: formatStatValue(statsData.experiencesCount),
      type: "const" as const,
      color: "text-git-branch",
    },
    {
      icon: GitBranch,
      label: "github_repos",
      displayLabel: "Repositorios",
      value: formatStatValue(statsData.githubRepos || 0),
      type: "async" as const,
      color: "text-git-clean",
    },
    {
      icon: Heart,
      label: "portfolio_likes",
      displayLabel: "Likes",
      value: formatStatValue(statsData.totalLikes),
      type: "let" as const,
      color: "text-git-conflict",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="w-full h-32 rounded-lg bg-muted/10 animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 rounded-lg bg-muted/10 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div data-testid="stats-section" className="w-full space-y-6">
      {/* Contribution Graph */}
      <FileCard filename="contributions.tsx" language="typescript" icon={TrendingUp}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-git-branch" />
              <span className="text-xs font-mono-display text-muted-foreground">
                365 days of activity
              </span>
            </div>
            <span className="text-[10px] font-mono-display text-git-clean bg-git-clean/10 px-2 py-1 rounded">
              public
            </span>
          </div>
          <ContributionGraph />
        </div>
      </FileCard>

      {/* Stats as code */}
      <FileCard filename="stats.ts" language="typescript" icon={Terminal}>
        <div className="p-6">
          <div className="space-y-3 font-mono-display text-sm">
            <div className="text-muted-foreground text-xs mb-4">
              // Portfolio metrics dashboard
            </div>

            {codeStats.map((stat, index) => (
              <div
                key={index}
                className="group flex items-center gap-3 p-3 rounded-lg bg-muted/20 border border-border/50 hover:border-git-branch/50 transition-all duration-200 hover:shadow-md"
              >
                {/* Type declaration */}
                <span className="text-muted-foreground text-xs shrink-0 w-12">
                  {stat.type}
                </span>

                {/* Property name */}
                <span className="text-foreground font-medium shrink-0">
                  {stat.label}
                </span>

                {/* Assignment */}
                <span className="text-git-branch text-xs">=</span>

                {/* Icon */}
                <div className={cn("p-1.5 rounded bg-background border", stat.color)}>
                  <stat.icon className="w-3.5 h-3.5" />
                </div>

                {/* Value */}
                <span className={cn("font-bold text-lg", stat.color)}>
                  {stat.value}
                </span>

                {/* Comment */}
                <span className="text-muted-foreground/60 text-xs flex-1 text-right">
                  // {stat.displayLabel}
                </span>
              </div>
            ))}

            {/* Export statement */}
            <div className="mt-4 pt-4 border-t border-border/50">
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <span>export default</span>
                <span className="text-git-clean">metrics</span>
                <span>;</span>
              </div>
            </div>
          </div>
        </div>
      </FileCard>
    </div>
  );
}
