/**
 * Application-wide constants
 * Centralizes hardcoded values for easier maintenance
 */

// Navigation constants
export const VALID_SECTIONS = {
  HOME: "home",
  ABOUT: "about",
  EXPERIENCE: "experience",
  EDUCATION: "education",
  PROJECTS: "projects",
  BLOG: "blog",
  CONTACT: "contact",
  ANALYTICS: "analytics",
  DEV: "dev",
} as const;

export const SECTION_NAMES = {
  [VALID_SECTIONS.HOME]: "Inicio",
  [VALID_SECTIONS.ABOUT]: "Acerca de Mí",
  [VALID_SECTIONS.EXPERIENCE]: "Experiencia",
  [VALID_SECTIONS.EDUCATION]: "Educación",
  [VALID_SECTIONS.PROJECTS]: "Proyectos",
  [VALID_SECTIONS.BLOG]: "Blog",
  [VALID_SECTIONS.CONTACT]: "Contacto",
  [VALID_SECTIONS.ANALYTICS]: "Analíticas",
  [VALID_SECTIONS.DEV]: "Herramientas Dev",
} as const;

export const DEV_ONLY_SECTIONS = [VALID_SECTIONS.ANALYTICS, VALID_SECTIONS.DEV] as const;

// UI constants
export const AI_CHAT = {
  MIN_WIDTH: 320,
  MIN_HEIGHT: 400,
  MAX_WIDTH: 600,
  MAX_HEIGHT: 800,
  DEFAULT_WIDTH: 384,
  DEFAULT_HEIGHT: 600,
  MOBILE_WIDTH: 320,
  MOBILE_HEIGHT: 500,
  MAX_MESSAGE_LENGTH: 500,
} as const;

export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1280,
} as const;

// Animation constants
export const ANIMATION = {
  GITHUB_LIVE_INTERVAL: 3000,
  CHAT_TYPING_INDICATOR_DELAY: 100,
  CHAT_MESSAGE_DELAY: 500,
} as const;

// API constants
export const API = {
  GITHUB: {
    DEFAULT_USERNAME: "octocat",
    REPOS_PER_PAGE: 10,
    EVENTS_PER_PAGE: 5,
  },
} as const;

// Theme constants
export const THEME = {
  DEFAULT: "dark",
  STORAGE_KEY: "theme",
} as const;

// Deployment environment detection
export const DEPLOYMENT_ENV = {
  GITHUB_PAGES: "github-pages",
  VERCEL: "vercel",
  DEVELOPMENT: "development",
} as const;

type Section = (typeof VALID_SECTIONS)[keyof typeof VALID_SECTIONS];
type DeploymentEnv = (typeof DEPLOYMENT_ENV)[keyof typeof DEPLOYMENT_ENV];

export type { Section, DeploymentEnv };
