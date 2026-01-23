"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useMemo,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { VALID_SECTIONS, DEV_ONLY_SECTIONS, SECTION_NAMES, type Section } from "@/lib/constants";
import logger from "@/lib/logger";
import { prefetchSectionData, getAdjacentSections } from "@/lib/prefetch";

interface NavigationContextType {
  currentSection: string;
  setCurrentSection: (section: string) => void;
  navigateToSection: (section: string) => void;
  prefetchSection: (section: string) => Promise<void>;
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

interface NavigationProviderProps {
  children: ReactNode;
  initialSection?: string;
}

export function NavigationProvider({
  children,
  initialSection = "home",
}: NavigationProviderProps) {
  const [currentSection, setCurrentSection] = useState(initialSection);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // Iniciamos colapsada por defecto
  const queryClient = useQueryClient();

  /**
   * Gets the list of valid sections based on the current environment
   * @returns Array of valid section identifiers
   *
   * In development mode, includes dev-only sections.
   * In production, only includes production sections.
   */
  const getValidSections = (): Section[] => {
    const baseSections: Section[] = Object.values(VALID_SECTIONS).filter(
      (section) => !DEV_ONLY_SECTIONS.includes(section as any)
    );

    // Agregar secciones de desarrollo solo en modo desarrollo
    if (process.env.NODE_ENV === "development") {
      return [...baseSections, ...DEV_ONLY_SECTIONS] as Section[];
    }

    return baseSections;
  };

  /**
   * Prefetches data for a specific section to improve navigation performance
   * @param section - The section identifier to prefetch data for
   *
   * Uses React Query's prefetchQuery to load data in the background.
   * Logs success or error messages.
   */
  const prefetchSection = async (section: string) => {
    try {
      await prefetchSectionData(queryClient, section);
      logger.log(`Prefetched data for section: ${section}`);
    } catch (error) {
      logger.error(`Error prefetching section ${section}:`, error);
    }
  };

  // Prefetch initial sections on mount
  useEffect(() => {
    // Prefetch common sections that users are likely to visit first
    const initialSectionsToPrefetch = ["about", "projects", "skills"];
    initialSectionsToPrefetch.forEach((section) => {
      prefetchSection(section);
    });
  }, []);

  // Sincronizar con el hash de la URL al cargar la página
  useEffect(() => {
    if (typeof window !== "undefined") {
      const rawHash = window.location.hash.replace("#", "");
      const hash = rawHash as Section;
      const validSections = getValidSections();

      if (rawHash && validSections.includes(hash)) {
        setCurrentSection(hash);
      } else if (rawHash === "" && currentSection !== "home") {
        // Si no hay hash, asegurar que estamos en home
        setCurrentSection("home");
      }
    }
  }, []); // Solo ejecutar al montar el componente

  // Escuchar cambios en el hash de la URL
  useEffect(() => {
    const handleHashChange = () => {
      if (typeof window !== "undefined") {
        const rawHash = window.location.hash.replace("#", "");
        const hash = rawHash as Section;
        const validSections = getValidSections();

        if (rawHash && validSections.includes(hash)) {
          setCurrentSection(hash);
        } else if (rawHash === "") {
          setCurrentSection("home");
        }
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Detectar dispositivos móviles y colapsar sidebar automáticamente
  useEffect(() => {
    const checkIsMobile = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setIsSidebarCollapsed(true);
      }
    };

    // Verificar al cargar
    checkIsMobile();

    // Escuchar cambios de tamaño de ventana
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  /**
   * Navigates to a specific section with smart prefetching
   * @param section - The section identifier to navigate to
   *
   * Side effects:
   * - Updates current section state
   * - Prefetches adjacent sections for faster navigation
   * - Updates URL hash for deep linking
   * - Logs navigation event
   */
  const navigateToSection = (section: string) => {
    setCurrentSection(section);

    // Opcional: agregar analytics, logging, etc.
    logger.log(`Navigating to: ${section}`);

    // Prefetch adjacent sections for faster navigation
    const validSections = getValidSections();
    const { previous, next } = getAdjacentSections(section, validSections);

    // Prefetch previous and next sections in background
    if (previous) prefetchSection(previous);
    if (next) prefetchSection(next);

    // Actualizar URL hash
    if (typeof window !== "undefined") {
      // Usar pushState para que el cambio de URL no active el evento hashchange
      // ya que estamos manejando la navegación programáticamente
      const newHash = section === "home" ? "" : `#${section}`;
      if (window.location.hash !== newHash) {
        if (section === "home") {
          // Para la sección home, limpiar el hash
          window.history.pushState(null, "", window.location.pathname);
        } else {
          window.location.hash = section;
        }
      }
    }
  };

  /**
   * Sets the sidebar collapsed state
   * @param collapsed - Whether the sidebar should be collapsed
   */
  const setSidebarCollapsed = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      currentSection,
      setCurrentSection,
      navigateToSection,
      prefetchSection,
      isSidebarCollapsed,
      setSidebarCollapsed,
    }),
    [currentSection, isSidebarCollapsed, prefetchSection]
  );

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}

// Hook para navegación con analytics/logging automático
export function useNavigateToSection() {
  const { navigateToSection } = useNavigation();
  return navigateToSection;
}

// Hook para obtener solo la sección actual
export function useCurrentSection() {
  const { currentSection } = useNavigation();
  return currentSection;
}

// Hook para el estado de la sidebar
export function useSidebarState() {
  const { isSidebarCollapsed, setSidebarCollapsed } = useNavigation();
  return { isSidebarCollapsed, setSidebarCollapsed };
}
