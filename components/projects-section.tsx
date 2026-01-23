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
import { HolographicCard } from "@/components/holographic-card";
import { TiltCard } from "@/components/tilt-card";
import { CardSpotlight } from "@/components/spotlight-effect";
import { ProjectPreviewModal } from "@/components/project-preview-modal";
import { Eye, Filter, FolderOpen } from "lucide-react";
import Image from "next/image";
import { ProjectsSectionSkeleton } from "@/components/loading-skeletons";

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

export const ProjectsSection = memo(function ProjectsSection() {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use React Query for data fetching
  const { data: projects = [], isLoading, error } = useProjects();

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  // Derive filtered projects from projects data
  const filteredProjects = projects.filter((project) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "featured") return project.featured;
    return project.status === selectedFilter;
  });

  if (isLoading) {
    return <ProjectsSectionSkeleton />;
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
            <h2 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
              Proyectos Destacados
            </h2>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => {
            const ProjectCard = (
              <Card
                key={project.id}
                data-testid="project-card"
                onClick={() => handleProjectClick(project)}
                className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-card/50 backdrop-blur-sm border-border/50 cursor-pointer hover:border-git-branch/50"
              >
                {/* Project image */}
                <div className="relative aspect-video overflow-hidden bg-muted rounded-t-lg">
                  {project.image_url ? (
                    <Image
                      src={project.image_url}
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

                  {/* Badges overlay */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {project.featured && (
                      <Badge className="bg-primary text-primary-foreground text-xs">
                        Featured
                      </Badge>
                    )}
                    <Badge className={statusColors[project.status] + " text-xs"}>
                      {project.status.replace("-", " ")}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-4">
                  <CardTitle className="group-hover:text-primary transition-colors line-clamp-1">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 text-sm">
                    {project.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Eye className="w-3 h-3 mr-1" />
                    Click to view details
                  </div>
                </CardContent>
              </Card>
            );

            // Apply effects to all projects
            const cardWithEffects = (
              <CardSpotlight key={project.id}>
                <TiltCard intensity={15} scale={1.03} glare={true}>
                  {ProjectCard}
                </TiltCard>
              </CardSpotlight>
            );

            // Use HolographicCard + TiltCard for featured projects
            return project.featured ? (
              <HolographicCard key={project.id} intensity="high">
                <TiltCard intensity={20} scale={1.05} glare={true}>
                  {ProjectCard}
                </TiltCard>
              </HolographicCard>
            ) : (
              cardWithEffects
            );
          })}
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

      {/* Project Preview Modal */}
      <ProjectPreviewModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
});
