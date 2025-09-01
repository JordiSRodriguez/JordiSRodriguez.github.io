"use client";

import { useState, useEffect } from "react";

export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  description: string;
}

export function useWeatherData() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [codingWeather, setCodingWeather] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

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

  return {
    weather,
    codingWeather,
    loading,
  };
}
