"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface NavigationContextType {
  currentSection: string;
  setCurrentSection: (section: string) => void;
  navigateToSection: (section: string) => void;
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

  const navigateToSection = (section: string) => {
    setCurrentSection(section);

    // Opcional: agregar analytics, logging, etc.
    console.log(`Navigating to: ${section}`);

    // Opcional: actualizar URL hash
    if (typeof window !== "undefined") {
      window.location.hash = section;
    }
  };

  const setSidebarCollapsed = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  return (
    <NavigationContext.Provider
      value={{
        currentSection,
        setCurrentSection,
        navigateToSection,
        isSidebarCollapsed,
        setSidebarCollapsed,
      }}
    >
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
