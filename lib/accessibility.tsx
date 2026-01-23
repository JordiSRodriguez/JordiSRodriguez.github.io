/**
 * Accessibility utilities and helpers
 */

import { type ReactNode } from "react";

/**
 * Props for accessible icon-only buttons
 */
export interface AccessibleIconButtonProps {
  "aria-label": string;
  children: ReactNode;
  title?: string;
}

/**
 * Helper to create visually hidden text for screen readers
 */
export function VisuallyHidden({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        position: "absolute",
        width: "1px",
        height: "1px",
        padding: "0",
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        borderWidth: "0",
      }}
    >
      {children}
    </span>
  );
}

/**
 * Helper to generate unique IDs for form labels and associations
 */
let idCounter = 0;
export function generateId(prefix: string): string {
  return `${prefix}-${++idCounter}`;
}

/**
 * Common ARIA labels for UI elements
 */
export const ariaLabels = {
  navigation: {
    menu: "Toggle navigation menu",
    close: "Close menu",
    open: "Open menu",
    home: "Go to home",
    about: "Go to about section",
    projects: "Go to projects section",
    experience: "Go to work experience section",
    education: "Go to education section",
    blog: "Go to blog section",
    contact: "Go to contact section",
  },
  actions: {
    like: "Like this portfolio",
    share: "Share this page",
    download: "Download file",
    externalLink: "Opens in new tab",
    theme: "Toggle theme",
  },
  status: {
    loading: "Loading content",
    error: "An error occurred",
    success: "Operation successful",
  },
} as const;
