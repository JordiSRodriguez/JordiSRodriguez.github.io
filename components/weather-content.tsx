"use client";

import { Badge } from "@/components/ui/badge";
import { Loader2, Wind } from "lucide-react";
import { useWeatherData } from "@/hooks/use-weather-data";
import { getWeatherIcon } from "@/lib/weather-utils";

interface WeatherContentProps {
  isCompact?: boolean;
}

export function WeatherContent({ isCompact = false }: WeatherContentProps) {
  const { weather, codingWeather, loading } = useWeatherData();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Obteniendo clima...</span>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">Error cargando clima</p>
      </div>
    );
  }

  if (isCompact) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {weather.temperature}°C
            </p>
            <p className="text-sm text-muted-foreground">
              📍 {weather.location}
            </p>
          </div>
          <div className="text-right space-y-1">
            <div className="flex items-center gap-2">
              {getWeatherIcon(weather.condition)}
              <span className="text-sm font-medium">{weather.condition}</span>
            </div>
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
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            {weather.temperature}°C
          </p>
          <p className="text-sm text-muted-foreground">📍 {weather.location}</p>
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
    </div>
  );
}
