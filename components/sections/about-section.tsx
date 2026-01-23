"use client";

import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileCard } from "@/components/ui/file-card";
import { GlassCard } from "@/components/glass-card";
import { TiltCard } from "@/components/tilt-card";
import { CardSpotlight } from "@/components/spotlight-effect";
import { ScrambleText } from "@/components/typewriter-text";
import { StaggerChildren } from "@/components/stagger-children";
import { useProfile, useSkills, useInterests, useFunFacts } from "@/hooks/use-supabase-data";
import { AboutSectionSkeleton } from "@/components/loading-skeletons";
import {
  MapPin,
  Calendar,
  Code,
  Heart,
  Coffee,
  Music,
  Camera,
  Gamepad2,
  Book,
  Plane,
  Database,
  Container,
  Palette,
  Brain,
  GitBranch,
  Cloud,
  Flame,
  Code2,
  Cpu,
  Terminal,
  Smartphone,
  Globe,
  Layers,
  Settings,
  FileText,
  FolderTree,
} from "lucide-react";

interface Profile {
  full_name: string;
  bio: string;
  location: string;
  avatar_url: string;
  github_username: string;
  linkedin_url: string;
  twitter_url: string;
  website_url: string;
}

interface Skill {
  id: string;
  name: string;
  level: number;
  color: string;
  category: string;
  icon: string;
  display_order: number;
}

interface Interest {
  id: string;
  name: string;
  icon: string;
  color: string;
  category: string;
  display_order: number;
}

interface FunFact {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  value: string;
  display_order: number;
}

// Icon mapping for interests, fun facts, and skills
const iconMap = {
  Code,
  Heart,
  Coffee,
  Music,
  Camera,
  Gamepad2,
  Book,
  Plane,
  MapPin,
  Calendar,
  // Tech icons
  Database,
  Container,
  Palette,
  Brain,
  GitBranch,
  Cloud,
  Flame,
  Code2,
  Cpu,
  Terminal,
  Smartphone,
  Globe,
  Layers,
  Settings,
  // Aliases for common tech terms
  Javascript: Code,
  React: Code2,
  NodeJs: Terminal,
  Python: Code,
  Html5: Globe,
  Css3: Palette,
  Vue: Code2,
  Angular: Code2,
};

export const AboutSection = memo(function AboutSection() {
  // Use React Query hooks for data fetching
  const { data: profile, isLoading: profileLoading, error: profileError } = useProfile();
  const { data: skills, isLoading: skillsLoading, error: skillsError } = useSkills();
  const { data: interests, isLoading: interestsLoading, error: interestsError } = useInterests();
  const { data: funFacts, isLoading: funFactsLoading, error: funFactsError } = useFunFacts();

  const loading = profileLoading || skillsLoading || interestsLoading || funFactsLoading;

  // Function to get experience level based on percentage
  const getSkillLevel = (level: number) => {
    if (level >= 90) return { text: "Experto", color: "text-emerald-600" };
    if (level >= 75) return { text: "Avanzado", color: "text-blue-600" };
    if (level >= 50) return { text: "Intermedio", color: "text-yellow-600" };
    return { text: "Principiante", color: "text-orange-600" };
  };

  if (loading) {
    return <AboutSectionSkeleton />;
  }

  return (
    <div data-testid="about-section" className="space-y-6 sm:space-y-8 px-4 sm:px-0">
      {/* Header with commit-style info */}
      <div className="text-center space-y-3 sm:space-y-4">
        <div className="relative inline-block">
          <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-lg bg-gradient-to-br from-git-branch/20 to-git-clean/10 border-2 border-git-branch/30 p-1">
            <div className="w-full h-full rounded bg-background flex items-center justify-center text-xl sm:text-3xl font-bold font-mono-display text-git-branch">
              {profile?.full_name?.charAt(0) || "J"}
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 px-1.5 py-0.5 bg-muted border border-git-clean rounded text-[10px] font-mono-display text-git-clean">
            main
          </div>
        </div>
        <div>
          <div className="text-[10px] font-mono-display text-muted-foreground mb-1">
            <span className="text-git-branch">commit</span> <span className="opacity-70">a3f8d2c</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground font-mono-display">
            <ScrambleText text={profile?.full_name || "Full Stack Developer"} />
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-muted-foreground mt-2 text-sm sm:text-base">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="font-mono-display text-xs">{profile?.location || "Spain"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-git-clean"></span>
              <span className="font-mono-display text-xs">Available for projects</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bio - README style */}
      <CardSpotlight>
        <GlassCard intensity="medium" hover={true}>
          <TiltCard intensity={10} scale={1.02}>
            <FileCard filename="README.md" language="markdown" icon={FileText}>
              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-border/50">
                  <span className="text-xs font-mono-display text-muted-foreground">
                    # About Me
                  </span>
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-sm sm:text-base text-foreground leading-relaxed whitespace-pre-line">
                    {profile?.bio ||
                      `I'm a passionate full stack developer focused on creating exceptional digital
              experiences. With over 5 years of experience in web development, I specialize in
              modern technologies like React, Next.js, Node.js and Python. I love solving complex
              problems and transforming innovative ideas into functional and attractive digital products.

              When I'm not coding, I enjoy exploring new technologies, contributing to
              open source projects, and sharing knowledge with the developer community.`}
                  </p>
                </div>
              </div>
            </FileCard>
          </TiltCard>
        </GlassCard>
      </CardSpotlight>

      {/* Skills - package.json style */}
      <CardSpotlight>
        <GlassCard intensity="medium" hover={true}>
          <TiltCard intensity={8} scale={1.02}>
            <FileCard filename="skills.json" language="json" icon={Code}>
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {skills?.map((skill) => {
                    const skillLevel = getSkillLevel(skill.level);
                    const IconComponent =
                      iconMap[skill.icon as keyof typeof iconMap] || Code;
                    return (
                      <div
                        key={skill.name}
                        className="flex items-center gap-3 p-3 rounded-md bg-muted/30 border border-border/50 hover:border-git-branch/50 transition-all duration-200 group"
                      >
                        <IconComponent className="h-5 w-5 text-git-branch flex-shrink-0 group-hover:scale-110 transition-transform" />
                        <div className="flex-1 min-w-0 font-mono-display">
                          <span className="text-sm text-foreground">"{skill.name}"</span>
                        </div>
                        <span
                          className={`text-[10px] font-mono-display px-1.5 py-0.5 rounded ${skillLevel.color} bg-background border border-border flex-shrink-0`}
                        >
                          {skill.level}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </FileCard>
          </TiltCard>
        </GlassCard>
      </CardSpotlight>

      {/* Interests - directory style */}
      <CardSpotlight>
        <GlassCard intensity="low" hover={true}>
          <TiltCard intensity={5} scale={1.01}>
            <FileCard filename="interests/" icon={FolderTree}>
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {interests?.map((interest) => {
                    const IconComponent =
                      iconMap[interest.icon as keyof typeof iconMap] || Code;
                    return (
                      <div
                        key={interest.id}
                        className="flex flex-col items-center p-3 sm:p-4 rounded-md bg-muted/30 border border-border/50 hover:border-git-clean/50 transition-all duration-200 hover:scale-105 cursor-pointer group"
                      >
                        <IconComponent
                          className={`h-6 w-6 sm:h-8 sm:w-8 ${interest.color} mb-2 group-hover:scale-110 transition-transform`}
                        />
                        <span className="text-xs sm:text-sm text-center font-mono-display font-medium">
                          {interest.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </FileCard>
          </TiltCard>
        </GlassCard>
      </CardSpotlight>
    </div>
  );
});
