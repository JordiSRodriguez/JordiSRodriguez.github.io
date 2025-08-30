"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Cloud,
  Sun,
  CloudRain,
  SunSnow as Snow,
  Wind,
  Loader2,
  X,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useFloatingComponents } from "@/contexts/floating-components-context";

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  description: string;
}

export function FloatingWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [codingWeather, setCodingWeather] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState(false);

  const isMobile = useIsMobile();
  const { shouldHideComponent, setWeatherExpanded } = useFloatingComponents();

  // Sincronizar el estado de expansión con el contexto solo cuando cambie
  useEffect(() => {
    setWeatherExpanded(isHovered);
  }, [isHovered, setWeatherExpanded]);

  // Ocultar el componente en desktop si otro flotante está activo
  const shouldHide = shouldHideComponent("weatherExpanded");

  // OpenWeatherMap API Key from environment variables
  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);

        // Si no hay API key, usar datos mockeados directamente
        if (
          !API_KEY ||
          API_KEY === "tu_api_key_aqui" ||
          API_KEY === "TU_NUEVA_API_KEY_AQUI"
        ) {
          setFallbackWeather();
          return;
        }

        // Get user location
        const position = await getCurrentPosition();
        const { latitude, longitude } = position.coords;

        // Fetch weather data
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );

        if (!weatherResponse.ok) {
          throw new Error("Error fetching weather data");
        }

        const weatherData = await weatherResponse.json();

        const processedWeather: WeatherData = {
          location: weatherData.name,
          temperature: Math.round(weatherData.main.temp),
          condition: weatherData.weather[0].main,
          humidity: weatherData.main.humidity,
          windSpeed: weatherData.wind.speed,
          description: weatherData.weather[0].description,
        };

        setWeather(processedWeather);
        generateCodingWeather(processedWeather);
      } catch (error) {
        console.error("Error fetching weather:", error);
        setFallbackWeather();
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [API_KEY]);

  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported"));
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        timeout: 10000,
        enableHighAccuracy: true,
      });
    });
  };

  const setFallbackWeather = () => {
    const fallbackWeather: WeatherData = {
      location: "Madrid",
      temperature: 24,
      condition: "Clear",
      humidity: 65,
      windSpeed: 3.2,
      description: "cielos despejados",
    };

    setWeather(fallbackWeather);
    generateCodingWeather(fallbackWeather);
    setLoading(false);
  };

  const generateCodingWeather = (weatherData: WeatherData) => {
    const { temperature, condition } = weatherData;

    let codingMood = "";
    let emoji = "";

    if (temperature < 10) {
      codingMood = "Perfecto para código intensivo";
      emoji = "❄️";
    } else if (temperature >= 10 && temperature < 20) {
      codingMood = "Ideal para resolver bugs";
      emoji = "🧊";
    } else if (temperature >= 20 && temperature < 25) {
      codingMood = "Excelente para programar";
      emoji = "☕";
    } else if (temperature >= 25 && temperature < 30) {
      codingMood = "Bueno para desarrollo web";
      emoji = "🌤️";
    } else {
      codingMood = "Better stay with air conditioning";
      emoji = "🔥";
    }

    if (condition === "Rain" || condition === "Drizzle") {
      codingMood = "Perfect weather for coding at home";
      emoji = "🌧️";
    } else if (condition === "Snow") {
      codingMood = "Ideal for Christmas projects";
      emoji = "⛄";
    } else if (condition === "Clear") {
      codingMood = "How about an outdoor project?";
      emoji = "☀️";
    }

    setCodingWeather(`${emoji} ${codingMood}`);
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "Clear":
        return <Sun className="h-6 w-6 text-yellow-500" />;
      case "Clouds":
        return <Cloud className="h-6 w-6 text-gray-500" />;
      case "Rain":
      case "Drizzle":
        return <CloudRain className="h-6 w-6 text-blue-500" />;
      case "Snow":
        return <Snow className="h-6 w-6 text-blue-200" />;
      default:
        return <Cloud className="h-6 w-6 text-gray-500" />;
    }
  };

  // No renderizar si debe estar oculto en desktop
  if (shouldHide) {
    return null;
  }

  return (
    <div
      className="fixed z-50 transition-all duration-500 ease-out top-5 right-4"
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
