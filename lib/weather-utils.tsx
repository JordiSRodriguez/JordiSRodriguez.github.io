import { Cloud, Sun, CloudRain, SunSnow as Snow } from "lucide-react";

export const getWeatherIcon = (condition: string) => {
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
