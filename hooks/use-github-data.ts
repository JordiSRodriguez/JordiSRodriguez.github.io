"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import logger from "@/lib/logger";
import { API } from "@/lib/constants";

// GitHub API Response Types
interface GitHubUser {
  login: string;
  public_repos: number;
  followers: number;
  following: number;
}

interface GitHubRepo {
  id: number;
  name: string;
  stargazers_count: number;
  forks_count: number;
}

interface GitHubEventPayload {
  ref_type?: string;
  action?: string;
  commits?: Array<{
    message?: string;
  }>;
}

interface GitHubEvent {
  id: string;
  type: string;
  repo: {
    name: string;
  };
  created_at: string;
  payload?: GitHubEventPayload;
}

export interface GitHubActivity {
  id: string;
  type: string;
  repo: string;
  message: string;
  timestamp: Date;
  additions?: number;
  deletions?: number;
  url?: string;
}

export interface GitHubStats {
  totalCommits: number;
  totalStars: number;
  totalRepos: number;
  followers: number;
  following: number;
  totalForks: number;
}

export function useGitHubData() {
  const [activities, setActivities] = useState<GitHubActivity[]>([]);
  const [stats, setStats] = useState<GitHubStats>({
    totalCommits: 0,
    totalStars: 0,
    totalRepos: 0,
    followers: 0,
    following: 0,
    totalForks: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [githubUsername, setGithubUsername] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    // Get user configuration from Supabase
    const fetchUserProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("github_username")
          .single();

        if (error) throw error;

        if (data?.github_username) {
          setGithubUsername(data.github_username);
        } else {
          setGithubUsername(API.GITHUB.DEFAULT_USERNAME); // Username por defecto para demo
        }
      } catch (error) {
        logger.error("Error fetching profile:", error);
        setGithubUsername(API.GITHUB.DEFAULT_USERNAME); // Fallback
      }
    };

    fetchUserProfile();
  }, [supabase]);

  useEffect(() => {
    if (!githubUsername) return;

    const fetchGitHubData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch basic user stats
        const userResponse = await fetch(
          `https://api.github.com/users/${githubUsername}`
        );

        if (!userResponse.ok) {
          throw new Error("Error fetching GitHub user data");
        }

        const userData = await userResponse.json();

        // Fetch repositories
        const reposResponse = await fetch(
          `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=${API.GITHUB.REPOS_PER_PAGE}`
        );

        if (!reposResponse.ok) {
          throw new Error("Error fetching GitHub repositories");
        }

        const reposData = await reposResponse.json();

        // Fetch recent events
        const eventsResponse = await fetch(
          `https://api.github.com/users/${githubUsername}/events?per_page=${API.GITHUB.EVENTS_PER_PAGE}`
        );

        if (!eventsResponse.ok) {
          throw new Error("Error fetching GitHub events");
        }

        const eventsData = await eventsResponse.json();

        // Calculate total stars and forks
        const totalStars = reposData.reduce(
          (sum: number, repo: GitHubRepo) => sum + repo.stargazers_count,
          0
        );
        const totalForks = reposData.reduce(
          (sum: number, repo: GitHubRepo) => sum + repo.forks_count,
          0
        );

        setStats({
          totalCommits: 0, // GitHub API doesn't provide this easily
          totalStars,
          totalRepos: userData.public_repos,
          followers: userData.followers,
          following: userData.following,
          totalForks,
        });

        // Process recent activities
        const processedActivities: GitHubActivity[] = eventsData
          .slice(0, API.GITHUB.EVENTS_PER_PAGE)
          .map((event: GitHubEvent) => ({
            id: event.id,
            type: event.type,
            repo: event.repo.name,
            message: getEventMessage(event),
            timestamp: new Date(event.created_at),
            url: `https://github.com/${event.repo.name}`,
          }));

        setActivities(processedActivities);
      } catch (error) {
        logger.error("Error fetching GitHub data:", error);
        setError(error instanceof Error ? error.message : "Error desconocido");
        // Set fallback data for demo
        setFallbackData();
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, [githubUsername]);

  const setFallbackData = () => {
    setStats({
      totalCommits: 247,
      totalStars: 89,
      totalRepos: 23,
      followers: 156,
      following: 89,
      totalForks: 34,
    });

    setActivities([
      {
        id: "1",
        type: "PushEvent",
        repo: "usuario/portfolio-2025",
        message: "Implementado sistema de navegación flotante",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
        additions: 150,
        deletions: 23,
      },
      {
        id: "2",
        type: "CreateEvent",
        repo: "usuario/weather-app",
        message: "Creado nuevo repositorio",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      },
      {
        id: "3",
        type: "IssuesEvent",
        repo: "usuario/open-source-lib",
        message: "Closed issue #42",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      },
      {
        id: "4",
        type: "PullRequestEvent",
        repo: "community/awesome-project",
        message: "Merged PR #15: Add TypeScript support",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
      },
      {
        id: "5",
        type: "WatchEvent",
        repo: "tech/cutting-edge-framework",
        message: "Starred repository",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
      },
    ]);
  };

  const getEventMessage = (event: GitHubEvent): string => {
    switch (event.type) {
      case "PushEvent":
        const commits = event.payload?.commits?.length || 1;
        return `Pushed ${commits} commit${commits > 1 ? "s" : ""}`;
      case "CreateEvent":
        return `Created ${event.payload?.ref_type || "repository"}`;
      case "DeleteEvent":
        return `Deleted ${event.payload?.ref_type}`;
      case "IssuesEvent":
        return `${event.payload?.action} issue`;
      case "PullRequestEvent":
        return `${event.payload?.action} pull request`;
      case "WatchEvent":
        return "Starred repository";
      case "ForkEvent":
        return "Forked repository";
      case "ReleaseEvent":
        return `${event.payload?.action} release`;
      default:
        return "Activity";
    }
  };

  return {
    activities,
    stats,
    loading,
    error,
    githubUsername,
  };
}
