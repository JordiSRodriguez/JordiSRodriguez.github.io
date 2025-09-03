"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
} from "lucide-react";

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

  // Helper function para formatear números
  const formatStatValue = (value: number): string => {
    if (value === 0) return "0";
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
    return value.toString();
  };

  useEffect(() => {
    fetchStats();
    trackVisit();
    fetchGitHubStats();

    // Configurar suscripción en tiempo real para likes
    const likesChannel = supabase
      .channel("portfolio_likes_changes")
      .on(
        "postgres_changes",
        {
          event: "*", // Escuchar todos los eventos (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "portfolio_likes",
        },
        (payload) => {
          console.log("Cambio en likes detectado:", payload);

          if (payload.eventType === "INSERT") {
            // Nuevo like agregado
            setStatsData((prev) => ({
              ...prev,
              totalLikes: prev.totalLikes + 1,
            }));
          } else if (payload.eventType === "DELETE") {
            // Like eliminado
            setStatsData((prev) => ({
              ...prev,
              totalLikes: Math.max(0, prev.totalLikes - 1),
            }));
          }
        }
      )
      .subscribe();

    // Cleanup: cancel subscription when component unmounts
    return () => {
      supabase.removeChannel(likesChannel);
    };
  }, []);

  const fetchGitHubStats = async () => {
    try {
      // Get GitHub username from profiles table
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
      console.error("Error fetching GitHub stats:", error);
      // Mantener el valor por defecto si falla
    }
  };

  const fetchStats = async () => {
    try {
      setError(null);

      // Define table queries with safe fallbacks
      const tableQueries = [
        {
          name: "visit_stats",
          query: supabase.from("visit_stats").select("id"),
        },
        {
          name: "projects",
          query: supabase.from("projects").select("id, status"),
        },
        {
          name: "work_experiences",
          query: supabase.from("work_experiences").select("id"),
        },
        { name: "contacts", query: supabase.from("contacts").select("id") },
        {
          name: "portfolio_likes",
          query: supabase.from("portfolio_likes").select("id"),
        },
        { name: "skills", query: supabase.from("skills").select("id") },
        {
          name: "experiences",
          query: supabase.from("experiences").select("id"),
        },
      ];

      // Execute queries with individual error handling
      const results = await Promise.allSettled(
        tableQueries.map(({ query }) => query)
      );

      // Process results with graceful degradation
      const statsResults: {
        visitsData: any[] | null;
        projectsData: any[] | null;
        workExperiencesData: any[] | null;
        contactsData: any[] | null;
        likesData: any[] | null;
        skillsData: any[] | null;
        experiencesData: any[] | null;
      } = {
        visitsData: null,
        projectsData: null,
        workExperiencesData: null,
        contactsData: null,
        likesData: null,
        skillsData: null,
        experiencesData: null,
      };

      const availableTables: string[] = [];
      const failedTables: string[] = [];

      results.forEach((result, index) => {
        const tableName = tableQueries[index].name;

        if (result.status === "fulfilled" && !result.value.error) {
          availableTables.push(tableName);

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
        } else {
          failedTables.push(tableName);
          if (process.env.NODE_ENV === "development") {
            console.warn(
              `Table '${tableName}' not available:`,
              result.status === "fulfilled" ? result.value.error : result.reason
            );
          }
        }
      });

      // Calculate stats from available data
      const completedProjects =
        statsResults.projectsData?.filter((p: any) => p.status === "completed")
          .length || 0;
      const inProgressProjects =
        statsResults.projectsData?.filter(
          (p: any) => p.status === "in-progress"
        ).length || 0;
      const totalVisits = statsResults.visitsData?.length || 0;
      const workExperiences = statsResults.workExperiencesData?.length || 0;
      const totalContacts = statsResults.contactsData?.length || 0;
      const totalLikes = statsResults.likesData?.length || 0;
      const skillsCount = statsResults.skillsData?.length || 0;
      const experiencesCount = statsResults.experiencesData?.length || 0;

      // Update state with real data
      setVisitCount(totalVisits);

      // Store stats for use in the stats array
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

      // Only show warning in development if some tables failed
      if (process.env.NODE_ENV === "development" && failedTables.length > 0) {
        console.info(
          `Portfolio stats loaded successfully. Available tables: ${availableTables.join(
            ", "
          )}. Unavailable: ${failedTables.join(", ")}`
        );
      }
    } catch (error) {
      console.error("Error fetching stats:", error);

      // Set fallback data - production should be silent
      setStatsData({
        completedProjects: 0,
        inProgressProjects: 0,
        totalVisits: 1, // At least one visit (current)
        workExperiences: 0,
        totalContacts: 0,
        totalLikes: 0,
        skillsCount: 0,
        experiencesCount: 0,
      });

      // Only show error in development
      if (process.env.NODE_ENV === "development") {
        setError(
          "Algunas estadísticas no se pudieron cargar. Mostrando datos parciales."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const trackVisit = async () => {
    try {
      const visitorId =
        localStorage.getItem("visitor_id") || crypto.randomUUID();
      localStorage.setItem("visitor_id", visitorId);

      if (process.env.NODE_ENV === "development") {
        console.log("Attempting to track visit for visitor:", visitorId);
      }

      const { data, error } = await supabase.from("visit_stats").insert([
        {
          visitor_id: visitorId,
          page_path: window.location.pathname,
          user_agent: navigator.userAgent,
          referrer: document.referrer || null,
        },
      ]);

      if (error && process.env.NODE_ENV === "development") {
        console.warn("Visit tracking unavailable:", error.message);
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.warn("Visit tracking failed:", error);
      }
      // Silently fail in production - analytics shouldn't break the user experience
    }
  };

  const stats = [
    {
      icon: Code,
      label: "Proyectos Completados",
      value: formatStatValue(statsData.completedProjects),
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      available: true, // Always show, even if 0
    },
    {
      icon: Loader,
      label: "Proyectos en Curso",
      value: formatStatValue(statsData.inProgressProjects),
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      available: true, // Always show, even if 0
    },
    {
      icon: GraduationCap,
      label: "Formación Académica",
      value: formatStatValue(statsData.experiencesCount),
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      available: true, // Always show, even if 0
    },
    {
      icon: Briefcase,
      label: "Experiencias Laborales",
      value: formatStatValue(statsData.workExperiences),
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      available: true, // Always show, even if 0
    },
    {
      icon: MessageSquare,
      label: "Mensajes Recibidos",
      value: formatStatValue(statsData.totalContacts),
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      available: true, // Always show, even if 0
    },
    {
      icon: GitBranch,
      label: "Repositorios GitHub",
      value: formatStatValue(statsData.githubRepos || 0),
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      available: true, // GitHub stats are fetched separately
    },
    {
      icon: Heart,
      label: "Total de Likes",
      value: formatStatValue(statsData.totalLikes),
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
      available: true, // Always show, even if 0
    },
    {
      icon: Star,
      label: "Habilidades Técnicas",
      value: formatStatValue(statsData.skillsCount),
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
      available: true, // Always show, even if 0
    },
  ].filter((stat) => stat.available);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 animate-pulse justify-items-center max-w-6xl mx-auto">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-20 sm:h-24 bg-muted rounded-lg w-full" />
        ))}
      </div>
    );
  }

  // Only show error UI in development mode
  if (error && process.env.NODE_ENV === "development") {
    return (
      <div className="text-center p-8">
        <div className="text-yellow-500 mb-4">{error}</div>
        <div className="text-sm text-muted-foreground mb-4">
          Algunas tablas de la base de datos no están disponibles. Mostrando
          estadísticas con datos parciales.
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Recargar
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Development Notice */}
      {process.env.NODE_ENV === "development" && error && (
        <div className="mb-4 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-center">
          <p className="text-xs text-yellow-600 dark:text-yellow-400">
            ⚠️ Desarrollo: Algunas tablas no disponibles, mostrando datos
            parciales
          </p>
        </div>
      )}

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 justify-items-center max-w-6xl mx-auto">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm w-full"
          >
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className={`p-2 sm:p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon
                    className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`}
                  />
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
