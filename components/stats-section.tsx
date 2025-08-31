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
} from "lucide-react";

interface StatsData {
  completedProjects: number;
  totalVisits: number;
  workExperiences: number;
  totalContacts: number;
  githubRepos?: number;
  totalLikes: number;
  skillsCount: number;
  educationCount: number;
}

export function StatsSection() {
  const [visitCount, setVisitCount] = useState(0);
  const [statsData, setStatsData] = useState<StatsData>({
    completedProjects: 0,
    totalVisits: 0,
    workExperiences: 0,
    totalContacts: 0,
    githubRepos: 0,
    totalLikes: 0,
    skillsCount: 0,
    educationCount: 0,
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

      // Fetch all stats in parallel
      const [
        { data: visitsData, error: visitsError },
        { data: projectsData, error: projectsError },
        { data: workExperiencesData, error: workExperiencesError },
        { data: contactsData, error: contactsError },
        { data: likesData, error: likesError },
        { data: skillsData, error: skillsError },
        { data: educationData, error: educationError },
      ] = await Promise.all([
        supabase.from("visit_stats").select("id"),
        supabase.from("projects").select("id, status"),
        supabase.from("work_experiences").select("id"),
        supabase.from("contacts").select("id"),
        supabase.from("portfolio_likes").select("id"),
        supabase.from("skills").select("id"),
        supabase.from("education").select("id"),
      ]);

      // Check for errors
      const errors = [
        visitsError,
        projectsError,
        workExperiencesError,
        contactsError,
        likesError,
        skillsError,
        educationError,
      ].filter(Boolean);

      if (errors.length > 0) {
        throw new Error(
          `Database errors: ${errors.map((e) => e?.message).join(", ")}`
        );
      }

      // Calculate real stats with fallbacks
      const completedProjects =
        projectsData?.filter((p) => p.status === "completed").length || 0;
      const totalVisits = visitsData?.length || 0;
      const workExperiences = workExperiencesData?.length || 0;
      const totalContacts = contactsData?.length || 0;
      const totalLikes = likesData?.length || 0;
      const skillsCount = skillsData?.length || 0;
      const educationCount = educationData?.length || 0;

      // Update state with real data
      setVisitCount(totalVisits);

      // Store stats for use in the stats array
      setStatsData({
        completedProjects,
        totalVisits,
        workExperiences,
        totalContacts,
        totalLikes,
        skillsCount,
        educationCount,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);

      // Set fallback data instead of showing error
      setStatsData({
        completedProjects: 0,
        totalVisits: 1, // At least one visit (current)
        workExperiences: 0,
        totalContacts: 0,
        totalLikes: 0,
        skillsCount: 0,
        educationCount: 0,
      });

      setError(
        "Algunas estadísticas no se pudieron cargar. Mostrando datos parciales."
      );

      // Don't retry automatically to avoid infinite loops
    } finally {
      setLoading(false);
    }
  };

  const trackVisit = async () => {
    try {
      const visitorId =
        localStorage.getItem("visitor_id") || crypto.randomUUID();
      localStorage.setItem("visitor_id", visitorId);

      console.log("Attempting to track visit for visitor:", visitorId);

      const { data, error } = await supabase.from("visit_stats").insert([
        {
          visitor_id: visitorId,
          page_url: window.location.href,
          user_agent: navigator.userAgent,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error("Error inserting visit:", error);
      }
    } catch (error) {
      console.error("Error tracking visit:", error);
    }
  };

  const stats = [
    {
      icon: Code,
      label: "Proyectos Completados",
      value: formatStatValue(statsData.completedProjects),
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Briefcase,
      label: "Experiencias Laborales",
      value: formatStatValue(statsData.workExperiences),
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: GraduationCap,
      label: "Formación Académica",
      value: formatStatValue(statsData.educationCount),
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      icon: MessageSquare,
      label: "Mensajes Recibidos",
      value: formatStatValue(statsData.totalContacts),
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: GitBranch,
      label: "Repositorios GitHub",
      value: formatStatValue(statsData.githubRepos || 0),
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      icon: Eye,
      label: "Visitas al Portfolio",
      value: formatStatValue(statsData.totalVisits),
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      icon: Heart,
      label: "Total de Likes",
      value: formatStatValue(statsData.totalLikes),
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
    },
    {
      icon: Star,
      label: "Habilidades Técnicas",
      value: formatStatValue(statsData.skillsCount),
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 animate-pulse justify-items-center max-w-6xl mx-auto">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-20 sm:h-24 bg-muted rounded-lg w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 mb-4">{error}</div>
        <div className="text-sm text-muted-foreground mb-4">
          Verifica la consola del navegador para más detalles
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
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
