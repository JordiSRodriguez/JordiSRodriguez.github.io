"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from "react";

interface FloatingComponentsState {
  aiChatOpen: boolean;
  githubExpanded: boolean;
  weatherExpanded: boolean;
  toolsDockExpanded: boolean;
}

interface FloatingComponentsContextType {
  state: FloatingComponentsState;
  setAiChatOpen: (open: boolean) => void;
  setGithubExpanded: (expanded: boolean) => void;
  setWeatherExpanded: (expanded: boolean) => void;
  // Función helper para determinar si un componente debería ocultarse
  shouldHideComponent: (component: keyof FloatingComponentsState) => boolean;
}

const FloatingComponentsContext = createContext<
  FloatingComponentsContextType | undefined
>(undefined);

export function FloatingComponentsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, setState] = useState<FloatingComponentsState>({
    aiChatOpen: false,
    githubExpanded: false,
    weatherExpanded: false,
    toolsDockExpanded: false,
  });

  const setAiChatOpen = useCallback((open: boolean) => {
    setState((prev) => {
      if (prev.aiChatOpen === open) return prev; // Evitar actualización innecesaria
      return { ...prev, aiChatOpen: open };
    });
  }, []);

  const setGithubExpanded = useCallback((expanded: boolean) => {
    setState((prev) => {
      if (prev.githubExpanded === expanded) return prev; // Evitar actualización innecesaria
      return { ...prev, githubExpanded: expanded };
    });
  }, []);

  const setWeatherExpanded = useCallback((expanded: boolean) => {
    setState((prev) => {
      if (prev.weatherExpanded === expanded) return prev; // Evitar actualización innecesaria
      return { ...prev, weatherExpanded: expanded };
    });
  }, []);

  // Lógica para determinar qué componentes deben ocultarse - usando useMemo para optimización
  const shouldHideComponent = useMemo(() => {
    return (component: keyof FloatingComponentsState): boolean => {
      // Si el AI Chat está abierto, ocultar todos los demás componentes
      if (state.aiChatOpen && component !== "aiChatOpen") {
        return true;
      }

      // No ocultar componentes del dock entre sí, ya que están en el mismo contenedor
      if (
        (component === "githubExpanded" || component === "weatherExpanded") &&
        (state.githubExpanded || state.weatherExpanded)
      ) {
        return false;
      }

      return false;
    };
  }, [state.aiChatOpen, state.githubExpanded, state.weatherExpanded]);

  const contextValue = useMemo(
    () => ({
      state,
      setAiChatOpen,
      setGithubExpanded,
      setWeatherExpanded,
      shouldHideComponent,
    }),
    [
      state,
      setAiChatOpen,
      setGithubExpanded,
      setWeatherExpanded,
      shouldHideComponent,
    ]
  );

  return (
    <FloatingComponentsContext.Provider value={contextValue}>
      {children}
    </FloatingComponentsContext.Provider>
  );
}

export function useFloatingComponents() {
  const context = useContext(FloatingComponentsContext);
  if (context === undefined) {
    throw new Error(
      "useFloatingComponents must be used within a FloatingComponentsProvider"
    );
  }
  return context;
}
