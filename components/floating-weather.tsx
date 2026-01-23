"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { CardSpotlight } from "@/components/spotlight-effect";
import {
  Cloud,
  CloudRain,
  Sun,
  Moon,
  Wind,
  Droplets,
  Thermometer,
  Loader2,
  X,
  Terminal,
  Zap,
  CloudLightning,
  Snowflake,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useFloatingComponents } from "@/contexts/floating-components-context";
import { useWeatherData } from "@/hooks/use-weather-data";
import { cn } from "@/lib/utils";

export function FloatingWeather() {
  const [isHovered, setIsHovered] = useState(false);
  const { weather, codingWeather, loading } = useWeatherData();

  const isMobile = useIsMobile();
  const { shouldHideComponent, setWeatherExpanded } = useFloatingComponents();

  useEffect(() => {
    setWeatherExpanded(isHovered);
  }, [isHovered, setWeatherExpanded]);

  const shouldHide = shouldHideComponent("weatherExpanded");

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "clear":
        return <Sun className="w-5 h-5" />;
      case "clouds":
        return <Cloud className="w-5 h-5" />;
      case "rain":
        return <CloudRain className="w-5 h-5" />;
      case "drizzle":
        return <CloudRain className="w-5 h-5" />;
      case "thunderstorm":
        return <CloudLightning className="w-5 h-5" />;
      case "snow":
        return <Snowflake className="w-5 h-5" />;
      case "mist":
        return <Cloud className="w-5 h-5 opacity-50" />;
      case "fog":
        return <Cloud className="w-5 h-5 opacity-50" />;
      default:
        return <Cloud className="w-5 h-5" />;
    }
  };

  if (shouldHide) {
    return (
      <div className="fixed z-50 top-5 left-4 w-16 h-16 opacity-0 pointer-events-none" aria-hidden="true" />
    );
  }

  return (
    <div
      className="fixed z-50 transition-all duration-500 ease-out top-5 left-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardSpotlight>
        <GlassCard intensity="high" hover={false}>
          <Card
            className={cn(
              "transition-all duration-500 ease-out transform-gpu cursor-pointer overflow-hidden",
              "bg-gray-950/95 backdrop-blur-xl border border-git-clean/30",
              isHovered ? "w-80 h-auto shadow-2xl shadow-git-clean/20 scale-105" : "w-16 h-16 hover:scale-110",
              "rounded-xl"
            )}
          >
            {!isHovered ? (
              // Compact View - Weather Terminal Style
              <div className="h-full w-full flex items-center justify-center group relative">
                <div className="relative">
                  {/* Ambient glow */}
                  <div className="absolute inset-0 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-git-clean/20 animate-pulse" />

                  {/* Terminal window frame */}
                  <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 flex items-center justify-center shadow-lg">
                    {/* Window controls */}
                    <div className="absolute top-1 left-1.5 flex gap-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500/80" />
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/80" />
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500/80" />
                    </div>

                    {/* Weather icon */}
                    {loading ? (
                      <Loader2 className="h-5 w-5 text-git-clean animate-spin" />
                    ) : weather ? (
                      <div className="text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]">
                        {getWeatherIcon(weather.condition)}
                      </div>
                    ) : (
                      <Cloud className="h-5 w-5 text-gray-500" />
                    )}
                  </div>

                  {/* Weather preview tooltip */}
                  <div className="absolute top-full mt-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="bg-background/95 backdrop-blur-sm border border-git-clean/30 rounded-lg px-3 py-2 text-xs whitespace-nowrap shadow-lg">
                      <div className="flex items-center gap-2 font-mono-display">
                        <Thermometer className="w-3 h-3 text-orange-400" />
                        <span className="text-foreground">{weather?.temperature || "--"}°C</span>
                        {codingWeather && (
                          <span className="text-muted-foreground text-[10px]">
                            ({codingWeather})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Expanded View - Terminal Weather Report
              <div className="overflow-hidden">
                {/* Terminal-style header */}
                <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700 px-3 py-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Terminal className="w-4 h-4 text-git-clean" />
                        <span className="text-[10px] font-mono-display text-gray-300">
                          weather
                        </span>
                        <span className="text-[10px] font-mono-display text-gray-500">
                          — bash
                        </span>
                      </div>
                    </div>
                    {isMobile && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsHovered(false)}
                        className="h-6 w-6 p-0 hover:bg-red-500/20 hover:text-red-400 text-gray-400"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Weather report content */}
                <div className="p-4 space-y-4 bg-gray-900/50">
                  {loading ? (
                    <div className="flex items-center justify-center py-8 space-y-3">
                      <Loader2 className="h-6 w-6 animate-spin text-git-clean" />
                      <p className="text-xs font-mono-display text-git-clean">
                        Fetching weather data...
                      </p>
                    </div>
                  ) : weather ? (
                    <>
                      {/* Current conditions as terminal output */}
                      <div className="bg-black/40 rounded-lg p-3 border border-gray-700 font-mono-display text-xs">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                          <Terminal className="w-3 h-3 text-git-clean" />
                          <span className="text-gray-400">$</span>
                          <span className="text-git-branch">weather</span>
                          <span className="text-muted-foreground">report</span>
                        </div>

                        <div className="space-y-1 text-gray-300">
                          <div>
                            <span className="text-purple-400">location:</span>
                            <span className="ml-2">{weather.location}</span>
                          </div>
                          <div>
                            <span className="text-purple-400">temperature:</span>
                            <span className="ml-2 flex items-center gap-2">
                              <Thermometer className="w-3 h-3 text-orange-400 inline" />
                              {weather.temperature}°C
                            </span>
                          </div>
                          <div>
                            <span className="text-purple-400">condition:</span>
                            <span className="ml-2 capitalize flex items-center gap-2">
                              {getWeatherIcon(weather.condition)}
                              <span>{weather.condition}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Coding conditions */}
                      <div className="bg-black/40 rounded-lg p-3 border border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1 text-muted-foreground text-[10px] font-mono-display">
                            <Zap className="w-3 h-3 text-yellow-400" />
                            <span>coding_conditions</span>
                          </div>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] font-mono-display shimmer",
                              weather?.temperature && weather.temperature > 25
                                ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
                                : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                            )}
                          >
                            {codingWeather}
                          </Badge>
                        </div>

                        {/* Additional details */}
                        <div className="grid grid-cols-2 gap-2 mt-3 text-[10px] font-mono-display text-gray-400">
                          <div className="flex items-center gap-1">
                            <Wind className="w-3 h-3 text-gray-500" />
                            <span>{weather.windSpeed} m/s</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Droplets className="w-3 h-3 text-blue-400" />
                            <span>{weather.humidity}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Weather alert if any */}
                      {(weather.condition.toLowerCase().includes("rain") ||
                        weather.condition.toLowerCase().includes("thunder") ||
                        weather.condition.toLowerCase().includes("storm")) && (
                        <div className="mt-3 p-2 bg-orange-500/10 border border-orange-500/30 rounded flex items-center gap-2">
                          <CloudLightning className="w-4 h-4 text-orange-400" />
                          <span className="text-[10px] font-mono-display text-orange-300">
                            ⚠️ Weather alert
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground text-xs">Unable to load weather</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        </GlassCard>
      </CardSpotlight>
    </div>
  );
}
