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

  // Función auxiliar para obtener las secciones válidas
  const getValidSections = () => {
    let validSections = [
      "home",
      "about",
      "experience",
      "education",
      "projects",
      "blog",
      "contact",
    ];

    // Agregar secciones de desarrollo solo en modo desarrollo
    if (process.env.NODE_ENV === "development") {
      validSections = [...validSections, "analytics", "dev"];
    }

    return validSections;
  };

  // Sincronizar con el hash de la URL al cargar la página
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      const validSections = getValidSections();

      if (hash && validSections.includes(hash)) {
        setCurrentSection(hash);
      } else if (hash === "" && currentSection !== "home") {
        // Si no hay hash, asegurar que estamos en home
        setCurrentSection("home");
      }
    }
  }, []); // Solo ejecutar al montar el componente

  // Escuchar cambios en el hash de la URL
  useEffect(() => {
    const handleHashChange = () => {
      if (typeof window !== "undefined") {
        const hash = window.location.hash.replace("#", "");
        const validSections = getValidSections();

        if (hash && validSections.includes(hash)) {
          setCurrentSection(hash);
        } else if (hash === "") {
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

  const navigateToSection = (section: string) => {
    setCurrentSection(section);

    // Opcional: agregar analytics, logging, etc.
    console.log(`Navigating to: ${section}`);

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
