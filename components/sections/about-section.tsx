"use client";

import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
      {/* Header */}
      <div className="text-center space-y-3 sm:space-y-4">
        <div className="relative inline-block">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 p-1">
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-2xl sm:text-4xl font-bold">
              {profile?.full_name?.charAt(0) || "D"}
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full border-2 sm:border-4 border-background animate-pulse" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {profile?.full_name || "Full Stack Developer"}
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-muted-foreground mt-2 text-sm sm:text-base">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{profile?.location || "Spain"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Disponible para proyectos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bio */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
            Acerca de Mí
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {profile?.bio ||
              `I'm a passionate full stack developer focused on creating exceptional digital 
            experiences. With over 5 years of experience in web development, I specialize in 
            modern technologies like React, Next.js, Node.js and Python. I love solving complex 
            problems and transforming innovative ideas into functional and attractive digital products.
            
            When I'm not coding, I enjoy exploring new technologies, contributing to 
            open source projects, and sharing knowledge with the developer community.`}
          </p>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
            Habilidades Técnicas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {skills?.map((skill) => {
              const skillLevel = getSkillLevel(skill.level);
              const IconComponent =
                iconMap[skill.icon as keyof typeof iconMap] || Code;
              return (
                <div
                  key={skill.name}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                >
                  <IconComponent className="h-6 w-6 text-blue-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-sm">{skill.name}</span>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full bg-muted ${skillLevel.color} flex-shrink-0`}
                  >
                    {skillLevel.text}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Interests */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
            Intereses y Pasiones
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {interests?.map((interest) => {
              const IconComponent =
                iconMap[interest.icon as keyof typeof iconMap] || Code;
              return (
                <div
                  key={interest.id}
                  className="flex flex-col items-center p-3 sm:p-4 rounded-lg border hover:shadow-md transition-all duration-200 hover:scale-105 cursor-pointer group"
                >
                  <IconComponent
                    className={`h-6 w-6 sm:h-8 sm:w-8 ${interest.color} mb-2 group-hover:scale-110 transition-transform`}
                  />
                  <span className="text-xs sm:text-sm text-center font-medium">
                    {interest.name}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Fun Facts */}
      {/* <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Fun Facts</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {funFacts?.map((fact) => {
              const IconComponent =
                iconMap[fact.icon as keyof typeof iconMap] || Code;
              return (
                <div key={fact.id} className="flex items-center gap-3">
                  <IconComponent className={`h-5 w-5 ${fact.color}`} />
                  <span>{fact.description}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
});
