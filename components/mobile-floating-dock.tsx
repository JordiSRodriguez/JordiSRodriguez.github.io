"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Grid3X3,
  Github,
  Cloud,
  ChevronUp,
  ChevronDown,
  X,
} from "lucide-react";

interface MobileFloatingDockProps {
  onAiChatToggle: () => void;
  onGithubToggle: () => void;
  onWeatherToggle: () => void;
  githubStats?: {
    totalStars: number;
    totalRepos: number;
  };
  weatherData?: {
    temperature: number;
    condition: string;
  };
}

export function MobileFloatingDock({
  onAiChatToggle,
  onGithubToggle,
  onWeatherToggle,
  githubStats,
  weatherData,
}: MobileFloatingDockProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();

  // Solo mostrar en móvil
  if (!isMobile) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-40">
      <Card
        className={`
          bg-background/95 backdrop-blur-md border shadow-lg
          transition-all duration-300 ease-out transform-gpu
          ${isExpanded ? "w-52 h-auto p-3" : "w-14 h-14 p-0 hover:scale-110"}
          rounded-xl overflow-hidden border-primary/20
        `}
      >
        {!isExpanded ? (
          // Vista compacta - solo icono principal con gradiente
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(true)}
            className="w-full h-full p-0 relative group bg-gradient-to-r from-blue-500/10 to-purple-600/10 hover:from-blue-500/20 hover:to-purple-600/20"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Grid3X3 className="w-4 h-4 text-white" />
              </div>
              {/* Indicadores de notificación múltiples */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse border-2 border-background" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-orange-500 rounded-full animate-bounce" />
            </div>
            {/* Tooltip mejorado */}
            <div className="absolute top-full mt-2 right-0 bg-background/95 backdrop-blur-sm border rounded-lg px-3 py-2 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-lg">
              🚀 Herramientas
            </div>
          </Button>
        ) : (
          // Vista expandida - todos los controles con mejor diseño
          <div className="space-y-3">
            {/* Header mejorado */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <Grid3X3 className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Herramientas
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="h-7 w-7 p-0 hover:bg-red-500/10 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* AI Chat con icono mejorado */}
            {/* <Button
              variant="outline"
              size="sm"
              onClick={onAiChatToggle}
              className="w-full justify-start h-10 text-sm hover:bg-blue-500/10 hover:border-blue-500/50 transition-colors group"
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mr-3">
                <MessageCircle className="w-3 h-3 text-white" />
              </div>
              <span className="font-medium">AI Asistente</span>
              <div className="ml-auto w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </Button> */}

            {/* GitHub con stats preview */}
            <Button
              variant="outline"
              size="sm"
              onClick={onGithubToggle}
              className="w-full justify-start h-12 text-sm hover:bg-gray-500/10 hover:border-gray-500/50 transition-colors group"
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-gray-700 to-gray-900 flex items-center justify-center mr-3">
                <Github className="w-3 h-3 text-white" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium">Estadísticas GitHub</div>
                {githubStats && (
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <span>⭐ {githubStats.totalStars}</span>
                    <span>📁 {githubStats.totalRepos}</span>
                  </div>
                )}
              </div>
            </Button>

            {/* Weather con preview de temperatura */}
            <Button
              variant="outline"
              size="sm"
              onClick={onWeatherToggle}
              className="w-full justify-start h-12 text-sm hover:bg-blue-500/10 hover:border-blue-500/50 transition-colors group"
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-sky-400 to-blue-500 flex items-center justify-center mr-3">
                <Cloud className="w-3 h-3 text-white" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium">Clima</div>
                {weatherData && (
                  <div className="text-xs text-muted-foreground">
                    {weatherData.temperature}°C • {weatherData.condition}
                  </div>
                )}
              </div>
            </Button>

            {/* Footer con emoji */}
            <div className="text-center">
              <span className="text-xs text-muted-foreground">
                🎉 Todo en un lugar
              </span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
