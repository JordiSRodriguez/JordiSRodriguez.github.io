"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Cloud, Wind, Loader2, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useFloatingComponents } from "@/contexts/floating-components-context";
import { useWeatherData } from "@/hooks/use-weather-data";
import { getWeatherIcon } from "@/lib/weather-utils";

export function FloatingWeather() {
  const [isHovered, setIsHovered] = useState(false);
  const { weather, codingWeather, loading } = useWeatherData();

  const isMobile = useIsMobile();
  const { shouldHideComponent, setWeatherExpanded } = useFloatingComponents();

  // Sincronizar el estado de expansión con el contexto solo cuando cambie
  useEffect(() => {
    setWeatherExpanded(isHovered);
  }, [isHovered, setWeatherExpanded]);

  // Ocultar el componente en desktop si otro flotante está activo
  const shouldHide = shouldHideComponent("weatherExpanded");

  // Use visibility instead of null to prevent CLS
  if (shouldHide) {
    return (
      <div
        className="fixed z-50 top-5 left-4 w-16 h-16 opacity-0 pointer-events-none"
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className="fixed z-50 transition-all duration-500 ease-out top-5 left-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        className={`
          bg-background/95 backdrop-blur-md border shadow-lg cursor-pointer
          transition-all duration-500 ease-out transform-gpu
          ${
            isHovered
              ? "w-80 h-72 shadow-2xl scale-105 border-primary/20"
              : "w-16 h-16 hover:shadow-xl hover:scale-110"
          }
          rounded-2xl overflow-hidden
          ${
            isHovered ? "max-w-[calc(100vw-2rem)] max-h-[calc(100vh-8rem)]" : ""
          }
        `}
      >
        {!isHovered ? (
          // Vista compacta (icono)
          <div className="h-full w-full flex items-center justify-center group relative">
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : weather ? (
              <div className="relative">
                {getWeatherIcon(weather.condition)}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
              </div>
            ) : (
              <Cloud className="h-6 w-6 text-gray-500" />
            )}

            {/* Indicador de toque para móvil */}
            {isMobile && !loading && (
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
            )}

            {/* Tooltip */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-background/95 backdrop-blur-sm border rounded-md px-2 py-1 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              {weather
                ? `${weather.temperature}°C`
                : isMobile
                ? "Toca para ver"
                : "Clima"}
            </div>
          </div>
        ) : (
          // Vista expandida
          <div className="h-full overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : weather ? (
                    getWeatherIcon(weather.condition)
                  ) : (
                    <Cloud className="h-5 w-5 text-gray-500" />
                  )}
                  <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    Clima para Codear
                  </span>
                </CardTitle>
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsHovered(false)}
                    className="text-xs h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4 animate-in fade-in-50 duration-300">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">
                    Obteniendo clima...
                  </span>
                </div>
              ) : weather ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                        {weather.temperature}°C
                      </p>
                      <p className="text-sm text-muted-foreground">
                        📍 {weather.location}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm font-medium">{weather.condition}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {weather.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center gap-1">
                      <Wind className="h-4 w-4 text-muted-foreground" />
                      <span>{weather.windSpeed} m/s</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">💧</span>
                      <span>{weather.humidity}%</span>
                    </div>
                  </div>

                  <Badge
                    variant="secondary"
                    className="w-full justify-center text-xs py-2 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20"
                  >
                    {codingWeather}
                  </Badge>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">Error cargando clima</p>
                </div>
              )}
            </CardContent>
          </div>
        )}
      </Card>
    </div>
  );
}
