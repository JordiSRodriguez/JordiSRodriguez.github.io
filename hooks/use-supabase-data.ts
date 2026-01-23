/**
 * Custom hooks for data fetching with React Query (TanStack Query)
 * Provides caching and automatic refetching for Supabase data
 */

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@supabase/ssr";
import logger from "@/lib/logger";

// Types for database tables
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

interface WorkExperience {
  id: string;
  title: string;
  company: string;
  company_logo?: string;
  location: string;
  start_date: string;
  end_date: string | null;
  description: string;
  technologies: string[];
  current_job: boolean;
  display_order: number;
}

interface Education {
  id: string;
  title: string;
  institution: string;
  location: string;
  description: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  type: string;
  display_order: number;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  published: boolean;
  featured_image: string;
  reading_time: number;
  views: number;
  created_at: string;
  published_at: string;
}

/**
 * Hook for fetching profile data
 */
export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .single();

      if (error) throw error;
      return data as Profile;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook for fetching skills
 */
export function useSkills() {
  return useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as Skill[];
    },
    staleTime: 1000 * 60 * 10,
  });
}

/**
 * Hook for fetching interests
 */
export function useInterests() {
  return useQuery({
    queryKey: ["interests"],
    queryFn: async () => {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data, error } = await supabase
        .from("interests")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as Interest[];
    },
    staleTime: 1000 * 60 * 10,
  });
}

/**
 * Hook for fetching fun facts
 */
export function useFunFacts() {
  return useQuery({
    queryKey: ["funFacts"],
    queryFn: async () => {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data, error } = await supabase
        .from("fun_facts")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as FunFact[];
    },
    staleTime: 1000 * 60 * 10,
  });
}

/**
 * Hook for fetching projects
 */
export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Project[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes for projects
  });
}

/**
 * Hook for fetching work experiences
 */
export function useWorkExperiences() {
  return useQuery({
    queryKey: ["work-experiences"],
    queryFn: async () => {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data, error } = await supabase
        .from("work_experiences")
        .select("*")
        .order("display_order", { ascending: false });

      if (error) throw error;
      return data as WorkExperience[];
    },
    staleTime: 1000 * 60 * 10,
  });
}

/**
 * Hook for fetching education
 */
export function useEducation() {
  return useQuery({
    queryKey: ["education"],
    queryFn: async () => {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data, error } = await supabase
        .from("education")
        .select("*")
        .order("display_order", { ascending: false });

      if (error) throw error;
      return data as Education[];
    },
    staleTime: 1000 * 60 * 10,
  });
}

/**
 * Hook for fetching blog posts
 */
export function useBlogPosts() {
  return useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false });

      if (error) throw error;
      return data as BlogPost[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes for blog
  });
}

/**
 * Hook for fetching visitor stats
 */
export function useVisitorStats() {
  return useQuery({
    queryKey: ["visitor-stats"],
    queryFn: async () => {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data, error } = await supabase
        .from("visit_stats")
        .select("id");

      if (error) {
        // If table doesn't exist, return empty array
        if (error.code === "PGRST204") {
          return [];
        }
        throw error;
      }
      return data;
    },
    staleTime: 1000 * 60, // 1 minute for stats
    refetchInterval: 1000 * 60, // Refetch every minute
  });
}

/**
 * Hook for fetching portfolio likes
 */
export function usePortfolioLikes() {
  return useQuery({
    queryKey: ["portfolio-likes"],
    queryFn: async () => {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data, error } = await supabase
        .from("portfolio_likes")
        .select("id");

      if (error) {
        if (error.code === "PGRST204") {
          return [];
        }
        throw error;
      }
      return data;
    },
    staleTime: 1000 * 30, // 30 seconds for likes
    refetchInterval: 1000 * 30, // Real-time-ish updates
  });
}
