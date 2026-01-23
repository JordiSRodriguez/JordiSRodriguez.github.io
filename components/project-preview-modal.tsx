"use client";

import { useEffect, useState } from "react";
import { X, ExternalLink, Github, Calendar, Clock, Users, Star, Eye, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/glass-card";
import { CardSpotlight } from "@/components/spotlight-effect";
import { ScrambleText } from "@/components/typewriter-text";

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

interface ProjectPreviewModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectPreviewModal({ project, isOpen, onClose }: ProjectPreviewModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      setIsVisible(false);
      setTimeout(() => {
        document.body.style.overflow = "";
      }, 300);
    }
  }, [isOpen]);

  if (!project || !isOpen) return null;

  const statusColors = {
    completed: "bg-green-500/10 text-green-500 border-green-500/20",
    "in-progress": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    planned: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-[10000] flex items-center justify-center p-4",
        "transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-background/80 backdrop-blur-sm",
          "transition-all duration-300",
          isVisible ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Modal Content */}
      <div
        className={cn(
          "relative w-full max-w-4xl max-h-[90vh] overflow-y-auto",
          "transition-all duration-300 ease-out",
          isVisible
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <CardSpotlight>
          <GlassCard intensity="high" hover={false}>
            <div className="bg-background border border-border rounded-xl overflow-hidden">
              {/* Header */}
              <div className="relative">
                {/* Project Image */}
                {project.image_url && (
                  <div className="relative h-64 sm:h-80 overflow-hidden">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/20" />
                  </div>
                )}

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-background hover:border-border transition-all hover:scale-110 group"
                >
                  <X className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </button>

                {/* Status badge */}
                <div className="absolute top-4 left-4">
                  <Badge className={cn(statusColors[project.status], "backdrop-blur-sm")}>
                    {project.status.replace("-", " ")}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8 space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ScrambleText text={project.title} />
                    {project.featured && (
                      <Badge className="bg-primary text-primary-foreground">Featured</Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {project.long_description || project.description}
                  </p>
                </div>

                {/* Metadata */}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-mono-display">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(project.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{project.status}</span>
                  </div>
                </div>

                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2 text-sm">
                      <Code className="w-4 h-4 text-git-branch" />
                      Tech Stack
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="font-mono-display text-xs shimmer hover:scale-105 transition-transform"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-muted/20 border border-border/50">
                  <div className="text-center">
                    <Star className="w-5 h-5 mx-auto mb-1 text-git-modified" />
                    <div className="text-lg font-bold">Featured</div>
                    <div className="text-xs text-muted-foreground">Project</div>
                  </div>
                  <div className="text-center">
                    <Users className="w-5 h-5 mx-auto mb-1 text-git-branch" />
                    <div className="text-lg font-bold">{project.technologies?.length || 0}</div>
                    <div className="text-xs text-muted-foreground">Tech Stack</div>
                  </div>
                  <div className="text-center">
                    <Eye className="w-5 h-5 mx-auto mb-1 text-git-clean" />
                    <div className="text-lg font-bold">Active</div>
                    <div className="text-xs text-muted-foreground">Status</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border/50">
                  {project.demo_url && (
                    <Button
                      className="flex-1 group font-mono-display text-sm bg-git-branch hover:bg-git-branch/90 text-white"
                      onClick={() => window.open(project.demo_url!, "_blank")}
                    >
                      <ExternalLink className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                      Live Demo
                    </Button>
                  )}
                  {project.github_url && (
                    <Button
                      variant="outline"
                      className="flex-1 group font-mono-display text-sm"
                      onClick={() => window.open(project.github_url!, "_blank")}
                    >
                      <Github className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                      View Code
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </GlassCard>
        </CardSpotlight>
      </div>
    </div>
  );
}
