/**
 * Prefetch utilities for React Query
 * Maps sections to their query keys for prefetching data
 */

import { QueryClient } from "@tanstack/react-query";

/**
 * Map sections to their query keys
 */
const SECTION_QUERY_KEYS: Record<string, string[][]> = {
  about: [["profile"]],
  skills: [["skills"], ["interests"], ["funFacts"]],
  projects: [["projects"]],
  "work-experience": [["work-experiences"]],
  education: [
    ["education"],
    ["certifications"],
    ["courses"],
    ["learning-goals"],
  ],
  blog: [["blog-posts"]],
  contact: [], // Contact section doesn't prefetch data
  stats: [["visitor-stats"], ["portfolio-likes"]],
  home: [], // Home doesn't need prefetching
  dev: [], // Dev section doesn't need prefetching
};

/**
 * Prefetch data for a specific section
 */
export async function prefetchSectionData(
  queryClient: QueryClient,
  section: string
): Promise<void> {
  const queryKeys = SECTION_QUERY_KEYS[section];

  if (!queryKeys || queryKeys.length === 0) {
    return;
  }

  // Prefetch all queries for this section
  await Promise.all(
    queryKeys.map((queryKey) =>
      queryClient.prefetchQuery({
        queryKey,
        staleTime: 1000 * 60 * 5, // 5 minutes
      })
    )
  );
}

/**
 * Prefetch multiple sections
 */
export async function prefetchMultipleSections(
  queryClient: QueryClient,
  sections: string[]
): Promise<void> {
  await Promise.all(
    sections.map((section) => prefetchSectionData(queryClient, section))
  );
}

/**
 * Get adjacent sections for prefetching
 * Returns the previous and next sections based on section order
 */
export function getAdjacentSections(
  currentSection: string,
  allSections: string[]
): { previous?: string; next?: string } {
  const currentIndex = allSections.indexOf(currentSection);

  if (currentIndex === -1) {
    return {};
  }

  return {
    previous: allSections[currentIndex - 1],
    next: allSections[currentIndex + 1],
  };
}
