"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import {
  Calendar,
  MapPin,
  Building,
  ExternalLink,
  TrendingUp,
  Award,
  Users,
  Target,
  Briefcase,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useIsMobile } from "@/hooks/use-mobile";

interface WorkExperience {
  id: string;
  title: string;
  company: string;
  company_logo?: string;
  location: string;
  start_date: string;
  end_date: string | null;
  description: string;
  achievements: string[];
  technologies: string[];
  team_size?: number;
  salary_growth?: number;
  url?: string;
  testimonial?: string;
  testimonial_author?: string;
}

export function WorkExperienceSection() {
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExperience, setSelectedExperience] = useState<string | null>(
    null
  );
  const [viewMode, setViewMode] = useState<
    "timeline" | "comparison" | "metrics"
  >("timeline");
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchExperiences = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data, error } = await supabase
        .from("work_experiences")
        .select("*")
        .order("start_date", { ascending: false });

      if (error) {
        console.error("Error fetching work experiences:", error);
      } else {
        setExperiences(data || []);
      }
      setLoading(false);
    };

    fetchExperiences();
  }, []);

  const calculateDuration = (startDate: string, endDate: string | null) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years === 0) return `${months} meses`;
    if (remainingMonths === 0) return `${years} año${years > 1 ? "s" : ""}`;
    return `${years} año${years > 1 ? "s" : ""} ${remainingMonths} mes${
      remainingMonths > 1 ? "es" : ""
    }`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const getTotalExperience = () => {
    let totalMonths = 0;
    experiences.forEach((exp) => {
      const start = new Date(exp.start_date);
      const end = exp.end_date ? new Date(exp.end_date) : new Date();
      totalMonths +=
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());
    });
    const years = Math.floor(totalMonths / 12);
    return `${years}+ año${years === 1 ? "" : "s"}`;
  };

  const getAllTechnologies = () => {
    const techSet = new Set<string>();
    experiences.forEach((exp) => {
      exp.technologies?.forEach((tech) => techSet.add(tech));
    });
    return Array.from(techSet);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-48 bg-muted rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 text-white">
          <Briefcase className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
            Professional Experience
          </h1>
          <p className="text-muted-foreground mt-2">
            Mi trayectoria profesional y desarrollo de carrera
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="flex justify-center gap-8 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          <span>{getTotalExperience()} de experiencia</span>
        </div>
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4" />
          <span>{experiences.length} empresas</span>
        </div>
      </div>

      {/* View mode selector */}
      <div className="flex justify-center gap-2">
        <Button
          variant={viewMode === "timeline" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("timeline")}
        >
          Cronología
        </Button>
        <Button
          variant={viewMode === "comparison" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("comparison")}
        >
          Comparación
        </Button>
        {/* <Button
          variant={viewMode === "metrics" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("metrics")}
        >
          Growth Metrics
        </Button> */}
      </div>

      {/* Timeline View */}
      {viewMode === "timeline" && (
        <div className="relative">
          <div
            className={`absolute ${
              isMobile ? "left-6" : "left-8"
            } top-0 bottom-0 w-0.5 bg-border`}
          ></div>

          <div className="space-y-8">
            {experiences.map((experience, index) => (
              <div
                key={experience.id}
                className={`relative flex items-start ${
                  isMobile ? "gap-4" : "gap-6"
                }`}
              >
                <div
                  className={`relative z-10 flex items-center justify-center ${
                    isMobile ? "w-12 h-12" : "w-16 h-16"
                  } aspect-square flex-shrink-0 rounded-full bg-primary text-primary-foreground shadow-lg overflow-hidden`}
                >
                  {experience.company_logo ? (
                    <img
                      src={experience.company_logo}
                      alt={`${experience.company} logo`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building
                      className={`${isMobile ? "w-5 h-5" : "w-6 h-6"}`}
                    />
                  )}
                </div>

                <Card className="flex-1 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                  <CardHeader>
                    <div
                      className={`flex items-start ${
                        isMobile ? "flex-col gap-4" : "justify-between"
                      }`}
                    >
                      <div className="space-y-2 flex-1">
                        <CardTitle className="text-xl">
                          {experience.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Building className="w-4 h-4" />
                          <span className="font-medium">
                            {experience.company}
                          </span>
                          {experience.url && (
                            <a
                              href={experience.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 text-primary hover:underline"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                        <div
                          className={`flex items-center gap-4 text-sm text-muted-foreground ${
                            isMobile ? "flex-wrap" : ""
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {formatDate(experience.start_date)} -{" "}
                              {experience.end_date
                                ? formatDate(experience.end_date)
                                : "Present"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{experience.location}</span>
                          </div>
                          <Badge variant="secondary">
                            {calculateDuration(
                              experience.start_date,
                              experience.end_date
                            )}
                          </Badge>
                        </div>
                      </div>
                      {experience.salary_growth && (
                        <div
                          className={`${
                            isMobile ? "self-start" : "text-right"
                          } flex-shrink-0`}
                        >
                          <div className="text-sm text-muted-foreground">
                            Crecimiento Salarial
                          </div>
                          <div className="text-lg font-semibold text-green-600">
                            +{experience.salary_growth}%
                          </div>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {experience.description}
                    </p>

                    {experience.achievements &&
                      experience.achievements.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Logros Clave
                          </h4>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            {experience.achievements.map((achievement, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    <div
                      className={`flex items-center ${
                        isMobile
                          ? "flex-col items-start gap-3"
                          : "justify-between"
                      }`}
                    >
                      <div className="space-y-2">
                        {experience.technologies &&
                          experience.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {experience.technologies.map((tech, idx) => (
                                <Badge
                                  key={idx}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          )}
                      </div>
                      {experience.team_size && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground flex-shrink-0">
                          <Users className="w-4 h-4" />
                          <span>Team of {experience.team_size}</span>
                        </div>
                      )}
                    </div>

                    {experience.testimonial && (
                      <div className="mt-4 p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                        <blockquote className="text-sm italic text-muted-foreground">
                          "{experience.testimonial}"
                        </blockquote>
                        {experience.testimonial_author && (
                          <cite className="text-xs text-muted-foreground mt-2 block">
                            — {experience.testimonial_author}
                          </cite>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comparison View */}
      {viewMode === "comparison" && (
        <div
          className={`grid gap-6 ${
            isMobile ? "grid-cols-1" : "md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {experiences.map((experience) => (
            <Card
              key={experience.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 aspect-square flex-shrink-0 rounded-full bg-primary text-primary-foreground flex items-center justify-center overflow-hidden">
                    {experience.company_logo ? (
                      <img
                        src={experience.company_logo}
                        alt={`${experience.company} logo`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">
                      {experience.company}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground truncate">
                      {experience.title}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Duration:</span>
                  <span className="font-medium">
                    {calculateDuration(
                      experience.start_date,
                      experience.end_date
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Technologies:</span>
                  <span className="font-medium">
                    {experience.technologies?.length || 0}
                  </span>
                </div>
                {experience.team_size && (
                  <div className="flex justify-between text-sm">
                    <span>Team Size:</span>
                    <span className="font-medium">{experience.team_size}</span>
                  </div>
                )}
                {experience.salary_growth && (
                  <div className="flex justify-between text-sm">
                    <span>Growth:</span>
                    <span className="font-medium text-green-600">
                      +{experience.salary_growth}%
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Growth Metrics View */}
      {/* {viewMode === "metrics" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">Career Growth Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span>Experience Level</span>
                  <span>{getTotalExperience()}</span>
                </div>
                <Progress
                  value={Math.min(experiences.length * 20, 100)}
                  className="h-2"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span>Technology Stack</span>
                  <span>{getAllTechnologies().length} technologies</span>
                </div>
                <Progress
                  value={Math.min(getAllTechnologies().length * 2, 100)}
                  className="h-2"
                />
              </div>

              <div
                className={`grid ${
                  isMobile
                    ? "grid-cols-2 gap-4"
                    : "grid-cols-2 md:grid-cols-4 gap-4"
                } mt-6`}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {experiences.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Companies</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {getAllTechnologies().length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Technologies
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {experiences.reduce(
                      (sum, exp) => sum + (exp.team_size || 0),
                      0
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Team Members Met
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {Math.round(
                      experiences.reduce(
                        (sum, exp) => sum + (exp.salary_growth || 0),
                        0
                      ) / experiences.length
                    ) || 0}
                    %
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Avg Growth
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )} */}
    </div>
  );
}
