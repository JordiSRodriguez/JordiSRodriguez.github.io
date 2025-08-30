"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createBrowserClient } from "@supabase/ssr";
import {
  Code,
  Coffee,
  Users,
  Award,
  Star,
  TrendingUp,
  Zap,
  Target,
  Trophy,
  Rocket,
  Heart,
  GitBranch,
  FileText,
  Eye,
  MessageSquare,
} from "lucide-react";

interface Achievement {
  id: string;
  name: string;
  description: string;
  reward_points: number;
  discovered_count: number;
}

interface StatsData {
  completedProjects: number;
  totalVisits: number;
  workExperiences: number;
  publishedPosts: number;
  totalContacts: number;
  githubRepos?: number;
  totalLikes: number;
  skillsCount: number;
}

export function StatsSection() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [visitCount, setVisitCount] = useState(0);
  const [statsData, setStatsData] = useState<StatsData>({
    completedProjects: 0,
    totalVisits: 0,
    workExperiences: 0,
    publishedPosts: 0,
    totalContacts: 0,
    githubRepos: 0,
    totalLikes: 0,
    skillsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [easterEggMessage, setEasterEggMessage] = useState(
    "¡Easter Egg encontrado! +50 puntos"
  );

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
    setupEasterEggs();
    fetchGitHubStats(); // Nueva función para obtener stats de GitHub

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
            // Like eliminado (si implementas esta funcionalidad)
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

      // Fetch achievements
      const { data: achievementsData, error: achievementsError } =
        await supabase
          .from("easter_eggs")
          .select("*")
          .order("reward_points", { ascending: false });

      if (achievementsError) throw achievementsError;
      setAchievements(achievementsData || []);

      // Fetch all stats in parallel
      const [
        { data: visitsData, error: visitsError },
        { data: projectsData, error: projectsError },
        { data: experiencesData, error: experiencesError },
        { data: workExperiencesData, error: workExperiencesError },
        { data: blogPostsData, error: blogPostsError },
        { data: contactsData, error: contactsError },
        { data: likesData, error: likesError },
        { data: skillsData, error: skillsError },
      ] = await Promise.all([
        supabase.from("visit_stats").select("id"),
        supabase.from("projects").select("id, status"),
        supabase.from("experiences").select("id, type"),
        supabase.from("work_experiences").select("id"),
        supabase.from("blog_posts").select("id, published"),
        supabase.from("contacts").select("id"),
        supabase.from("portfolio_likes").select("id"),
        supabase.from("skills").select("id"),
      ]);

      // Check for any errors
      const errors = [
        visitsError,
        projectsError,
        experiencesError,
        workExperiencesError,
        blogPostsError,
        contactsError,
        likesError,
        skillsError,
      ].filter(Boolean);
      if (errors.length > 0) {
        console.warn("Some stats could not be loaded:", errors);
      }

      // Calculate real stats
      const completedProjects =
        projectsData?.filter((p) => p.status === "completed").length || 0;
      const totalVisits = visitsData?.length || 0;
      const workExperiences = workExperiencesData?.length || 0;
      const publishedPosts =
        blogPostsData?.filter((p) => p.published).length || 0;
      const totalContacts = contactsData?.length || 0;
      const totalLikes = likesData?.length || 0;
      const skillsCount = skillsData?.length || 0;

      // Update state with real data
      setVisitCount(totalVisits);

      // Store stats for use in the stats array
      setStatsData({
        completedProjects,
        totalVisits,
        workExperiences,
        publishedPosts,
        totalContacts,
        totalLikes,
        skillsCount,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      setError(
        "No se pudieron cargar las estadísticas. Intentando nuevamente..."
      );

      // Retry after 3 seconds
      setTimeout(() => {
        fetchStats();
      }, 3000);
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
          page_path: "/",
          user_agent: navigator.userAgent,
          referrer: document.referrer,
        },
      ]);
    } catch (error) {
      console.error("Error tracking visit:", error);
    }
  };

  const setupEasterEggs = () => {
    // Konami Code Easter Egg
    let konamiCode = "";
    const konamiSequence =
      "ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightKeyBKeyA";

    const handleKeyDown = (e: KeyboardEvent) => {
      konamiCode += e.code;
      if (konamiCode.length > konamiSequence.length) {
        konamiCode = konamiCode.slice(-konamiSequence.length);
      }
      if (konamiCode === konamiSequence) {
        triggerEasterEgg("konami_code");
      }
    };

    // Developer Tools Detection
    const detectDevTools = () => {
      const threshold = 160;
      if (
        window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold
      ) {
        triggerEasterEgg("dev_tools");
      }
    };

    // Double Click Easter Egg
    let clickCount = 0;
    const handleDoubleClick = () => {
      clickCount++;
      if (clickCount >= 10) {
        triggerEasterEgg("click_master");
        clickCount = 0;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", detectDevTools);
    document.addEventListener("dblclick", handleDoubleClick);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", detectDevTools);
      document.removeEventListener("dblclick", handleDoubleClick);
    };
  };

  const triggerEasterEgg = async (eggType: string) => {
    setShowEasterEgg(true);
    setUserPoints((prev) => prev + 50);

    try {
      const visitorId = localStorage.getItem("visitor_id");
      if (visitorId) {
        await supabase.from("user_achievements").insert([
          {
            user_id: visitorId,
            easter_egg_id: eggType,
          },
        ]);
      }
    } catch (error) {
      console.error("Error recording achievement:", error);
    }

    setTimeout(() => {
      setShowEasterEgg(false);
      setEasterEggMessage("¡Easter Egg encontrado! +50 puntos"); // Reset to default
    }, 3000);
  };

  const handleLike = async () => {
    try {
      const visitorId =
        localStorage.getItem("visitor_id") || crypto.randomUUID();
      localStorage.setItem("visitor_id", visitorId);

      // Check if user already liked
      const { data: existingLike } = await supabase
        .from("portfolio_likes")
        .select("id")
        .eq("visitor_id", visitorId)
        .single();

      if (existingLike) {
        // User already liked, show message
        setEasterEggMessage("¡Ya has dado like! Gracias por tu apoyo ❤️");
        setShowEasterEgg(true);
        setTimeout(() => setShowEasterEgg(false), 2000);
        return;
      }

      // Add new like - NO actualizar el estado local aquí
      // porque la suscripción en tiempo real lo hará automáticamente
      const { error } = await supabase.from("portfolio_likes").insert([
        {
          visitor_id: visitorId,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      // Show success message
      setEasterEggMessage("¡Gracias por tu like! ❤️ +50 puntos");

      // Trigger easter egg for liking
      triggerEasterEgg("portfolio_like");
    } catch (error) {
      console.error("Error adding like:", error);
    }
  };

  const stats = [
    {
      icon: Code,
      label: "Completed Projects",
      value: formatStatValue(statsData.completedProjects),
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: FileText,
      label: "Published Posts",
      value: formatStatValue(statsData.publishedPosts),
      color: "text-amber-600",
      bgColor: "bg-amber-500/10",
    },
    {
      icon: MessageSquare,
      label: "Messages Received",
      value: formatStatValue(statsData.totalContacts),
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: Award,
      label: "Work Experiences",
      value: formatStatValue(statsData.workExperiences),
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: Star,
      label: "GitHub Repositories",
      value: formatStatValue(statsData.githubRepos || 0),
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      icon: Eye,
      label: "Portfolio Visits",
      value: formatStatValue(statsData.totalVisits),
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      icon: Heart,
      label: "Total Likes",
      value: formatStatValue(statsData.totalLikes),
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
    },
    {
      icon: Zap,
      label: "Technical Skills",
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
        <div className="text-muted-foreground mb-4">{error}</div>
        <Button
          onClick={() => {
            setLoading(true);
            setError(null);
            fetchStats();
          }}
          variant="outline"
        >
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Easter Egg Notification */}
      {showEasterEgg && (
        <div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-50 animate-bounce">
          <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="font-semibold text-sm sm:text-base">
                  {easterEggMessage}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 justify-items-center max-w-6xl mx-auto">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="hover:shadow-lg transition-all duration-300 hover:scale-105 w-full"
            >
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className={`p-1.5 sm:p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon
                      className={`h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 ${stat.color}`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold truncate">
                      {stat.value}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Achievements Section */}
      {/* <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Zap className="h-6 w-6 text-yellow-500" />
              Sistema de Logros
            </h2>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {userPoints} puntos
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="p-4 border rounded-lg hover:shadow-md transition-all duration-200 hover:scale-105 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {achievement.name}
                  </h3>
                  <Badge variant="outline">
                    {achievement.reward_points} pts
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {achievement.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Target className="h-3 w-3" />
                  <span>Descubierto {achievement.discovered_count} veces</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Rocket className="h-4 w-4" />
              How to get more points?
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Explore different portfolio sections</li>
              <li>• Try special key combinations</li>
              <li>• Interact with page elements</li>
              <li>• Open developer tools</li>
              <li>• Be creative and discover hidden secrets!</li>
            </ul>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}
