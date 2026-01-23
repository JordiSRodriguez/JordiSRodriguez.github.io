"use client";

import { useState, memo } from "react";
import { useProjects } from "@/hooks/use-supabase-data";
import { Button } from "@/components/ui/button";
import logger from "@/lib/logger";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Eye, Filter, FolderOpen } from "lucide-react";
import Image from "next/image";

interface Project {
  id: string;
  title: string;
  description: string;
  long_description: string | null;
  image_url: string | null;
  demo_url: string | null;
  github_url: string | null;
  technologies: string[];
  featured: boolean;
  status: "completed" | "in-progress" | "planned";
  created_at: string;
}

const statusColors = {
  completed: "bg-green-500/10 text-green-500 border-green-500/20",
  "in-progress": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  planned: "bg-blue-500/10 text-blue-500 border-blue-500/20",
};

const techColors = [
  "bg-chart-1/10 text-chart-1 border-chart-1/20",
  "bg-chart-2/10 text-chart-2 border-chart-2/20",
  "bg-chart-3/10 text-chart-3 border-chart-3/20",
  "bg-chart-4/10 text-chart-4 border-chart-4/20",
  "bg-chart-5/10 text-chart-5 border-chart-5/20",
];

export const ProjectsSection = memo(function ProjectsSection() {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [expandedTechs, setExpandedTechs] = useState<Set<string>>(new Set());

  // Use React Query for data fetching
  const { data: projects = [], isLoading, error } = useProjects();

  // Derive filtered projects from projects data
  const filteredProjects = projects.filter((project) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "featured") return project.featured;
    return project.status === selectedFilter;
  });

  const getTechColor = (index: number) => {
    return techColors[index % techColors.length];
  };

  const toggleTechExpansion = (projectId: string) => {
    setExpandedTechs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="h-8 bg-muted animate-pulse rounded mb-4 max-w-md mx-auto" />
            <div className="h-4 bg-muted animate-pulse rounded max-w-2xl mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-video bg-muted animate-pulse" />
                <CardHeader>
                  <div className="h-6 bg-muted animate-pulse rounded mb-2" />
                  <div className="h-4 bg-muted animate-pulse rounded" />
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section data-testid="projects-section" className="py-20 px-6 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-rose-500 text-white">
            <FolderOpen className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
              Proyectos Destacados
            </h1>
            <p className="text-muted-foreground mt-2">
              Una colección de proyectos que demuestran mis habilidades en
              desarrollo full-stack, diseño UI/UX, y tecnologías web modernas.
            </p>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            { key: "all", label: "Todos los Proyectos", icon: Filter },
            { key: "featured", label: "Destacados", icon: Eye },
            { key: "completed", label: "Completados", icon: null },
            { key: "in-progress", label: "En Progreso", icon: null },
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant={selectedFilter === key ? "default" : "outline"}
              onClick={() => setSelectedFilter(key)}
              className="group"
            >
              {Icon && (
                <Icon className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              )}
              {label}
            </Button>
          ))}
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {filteredProjects.map((project, index) => (
            <Card
              key={project.id}
              data-testid="project-card"
              className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-card/50 backdrop-blur-sm border-border/50 w-full h-fit"
            >
              {/* Project image */}
              <div className="relative aspect-video overflow-hidden bg-muted">
                {project.image_url ? (
                  <Image
                    src={project.image_url || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    loading="lazy"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-chart-1/20 flex items-center justify-center">
                    <div className="text-4xl font-bold text-muted-foreground opacity-50">
                      {project.title.charAt(0)}
                    </div>
                  </div>
                )}
                {project.featured && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary text-primary-foreground">
                      Featured
                    </Badge>
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <Badge className={statusColors[project.status]}>
                    {project.status.replace("-", " ")}
                  </Badge>
                </div>
              </div>

              <CardHeader className="pb-4">
                <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
                  {project.title}
                </CardTitle>
                <CardDescription className="line-clamp-3 text-sm">
                  {project.description}
                </CardDescription>
              </CardHeader>

              <CardContent data-testid="project-details" className="space-y-4">
                {/* Technologies */}
                <div className="flex flex-wrap gap-2">
                  {(expandedTechs.has(project.id)
                    ? project.technologies
                    : project.technologies.slice(0, 4)
                  ).map((tech, techIndex) => (
                    <Badge
                      key={tech}
                      variant="outline"
                      className={`${getTechColor(techIndex)} text-xs`}
                    >
                      {tech}
                    </Badge>
                  ))}
                  {project.technologies.length > 4 && (
                    <Badge
                      variant="outline"
                      className="text-muted-foreground cursor-pointer hover:bg-muted/50 transition-colors text-xs"
                      onClick={() => toggleTechExpansion(project.id)}
                    >
                      {expandedTechs.has(project.id)
                        ? "Ver menos"
                        : `+${project.technologies.length - 4}`}
                    </Badge>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 pt-2">
                  {project.demo_url && (
                    <Button size="sm" className="flex-1 group/btn" asChild>
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-2 h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                        Demo
                      </a>
                    </Button>
                  )}
                  {project.github_url && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 group/btn bg-transparent"
                      asChild
                    >
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="mr-2 h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                        Code
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty state */}
        {filteredProjects.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Filter className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              No se encontraron proyectos
            </h3>
            <p className="text-muted-foreground">
              Ajusta tus filtros o vuelve más tarde para ver nuevos proyectos.
            </p>
          </div>
        )}

        {/* View all projects button */}
        {filteredProjects.length > 0 && selectedFilter !== "all" && (
          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setSelectedFilter("all")}
            >
              Ver Todos los Proyectos
            </Button>
          </div>
        )}
      </div>
    </section>
  );
});
