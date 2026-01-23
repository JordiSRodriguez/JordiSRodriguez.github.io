/**
 * Prefetch utilities for React Query
 * Maps sections to their query keys for prefetching data
 */

import { QueryClient } from "@tanstack/react-query";

/**
 * Map sections to their React Query keys
 * Each section maps to an array of query keys that should be prefetched
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
 * Prefetch data for a specific section using React Query
 * @param queryClient - The React Query client instance
 * @param section - The section identifier to prefetch
 * @returns Promise that resolves when prefetching is complete
 *
 * Prefetches all queries associated with a section to improve
 * perceived performance when navigating to that section.
 * Uses a 5-minute stale time for prefetched data.
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
 * Prefetch data for multiple sections in parallel
 * @param queryClient - The React Query client instance
 * @param sections - Array of section identifiers to prefetch
 * @returns Promise that resolves when all sections are prefetched
 *
 * Useful for prefetching multiple sections at once, such as
 * during app initialization.
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
 * Get adjacent sections (previous and next) for a given section
 * @param currentSection - The current section identifier
 * @param allSections - Array of all section identifiers in order
 * @returns Object containing previous and next section identifiers
 *
 * Used for intelligent prefetching of neighboring sections.
 * Returns empty object if section is not found in the array.
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
