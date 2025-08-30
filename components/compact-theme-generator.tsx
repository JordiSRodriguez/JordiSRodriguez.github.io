"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Palette, Shuffle, Save, X } from "lucide-react";

interface CompactThemeGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ThemePalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
}

interface SavedTheme extends ThemePalette {
  name: string;
  id: number;
}

export function CompactThemeGenerator({
  isOpen,
  onClose,
}: CompactThemeGeneratorProps) {
  const [currentPalette, setCurrentPalette] = useState<ThemePalette>({
    primary: "#3b82f6",
    secondary: "#8b5cf6",
    accent: "#06b6d4",
    background: "#0f172a",
    foreground: "#f8fafc",
  });

  const [savedThemes, setSavedThemes] = useState<SavedTheme[]>([]);

  // Load saved themes from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("portfolio-themes");
    if (saved) {
      try {
        setSavedThemes(JSON.parse(saved));
      } catch (error) {
        console.error("Error loading saved themes:", error);
      }
    }
  }, []);

  const generateRandomTheme = () => {
    const colors = [
      "#ef4444",
      "#f97316",
      "#f59e0b",
      "#eab308",
      "#84cc16",
      "#22c55e",
      "#10b981",
      "#14b8a6",
      "#06b6d4",
      "#0ea5e9",
      "#3b82f6",
      "#6366f1",
      "#8b5cf6",
      "#a855f7",
      "#d946ef",
      "#ec4899",
      "#f43f5e",
    ];

    const getRandomColor = () =>
      colors[Math.floor(Math.random() * colors.length)];

    setCurrentPalette({
      primary: getRandomColor(),
      secondary: getRandomColor(),
      accent: getRandomColor(),
      background: Math.random() > 0.5 ? "#0f172a" : "#ffffff",
      foreground: Math.random() > 0.5 ? "#f8fafc" : "#0f172a",
    });
  };

  const applyTheme = () => {
    const root = document.documentElement;
    root.style.setProperty("--primary", currentPalette.primary);
    root.style.setProperty("--secondary", currentPalette.secondary);
    root.style.setProperty("--accent", currentPalette.accent);
    root.style.setProperty("--background", currentPalette.background);
    root.style.setProperty("--foreground", currentPalette.foreground);
  };

  const saveTheme = () => {
    const themeName = `Theme ${savedThemes.length + 1}`;
    const newTheme: SavedTheme = {
      ...currentPalette,
      name: themeName,
      id: Date.now(),
    };
    const updatedThemes = [...savedThemes, newTheme];
    setSavedThemes(updatedThemes);
    localStorage.setItem("portfolio-themes", JSON.stringify(updatedThemes));
  };

  const loadSavedTheme = (savedTheme: SavedTheme) => {
    const { name, id, ...palette } = savedTheme;
    setCurrentPalette(palette);

    // Apply immediately
    const root = document.documentElement;
    root.style.setProperty("--primary", palette.primary);
    root.style.setProperty("--secondary", palette.secondary);
    root.style.setProperty("--accent", palette.accent);
    root.style.setProperty("--background", palette.background);
    root.style.setProperty("--foreground", palette.foreground);
  };

  const openColorPicker = (
    colorKey: keyof ThemePalette,
    currentColor: string
  ) => {
    const input = document.createElement("input");
    input.type = "color";
    input.value = currentColor;
    input.onchange = (e) => {
      setCurrentPalette((prev) => ({
        ...prev,
        [colorKey]: (e.target as HTMLInputElement).value,
      }));
    };
    input.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-background border rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Generador de Temas
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Current Theme Preview */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">Tema Actual</CardTitle>
            <CardDescription className="text-sm">
              Haz clic en cualquier color para editarlo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-3 mb-4">
              {Object.entries(currentPalette).map(([key, color]) => (
                <div key={key} className="text-center">
                  <div
                    className="w-12 h-12 rounded-lg border-2 border-border mx-auto mb-2 cursor-pointer hover:scale-105 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() =>
                      openColorPicker(key as keyof ThemePalette, color)
                    }
                  />
                  <p className="text-xs font-medium capitalize">{key}</p>
                  <p className="text-xs text-muted-foreground">{color}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2 justify-center flex-wrap">
              <Button onClick={generateRandomTheme} variant="outline" size="sm">
                <Shuffle className="w-4 h-4 mr-2" />
                Aleatorio
              </Button>
              <Button onClick={applyTheme} size="sm">
                Aplicar Tema
              </Button>
              <Button onClick={saveTheme} variant="outline" size="sm">
                <Save className="w-4 h-4 mr-2" />
                Guardar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Saved Themes */}
        {savedThemes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Temas Guardados</CardTitle>
              <CardDescription className="text-sm">
                Tu colección de temas personalizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto">
                {savedThemes.map((savedTheme) => (
                  <div key={savedTheme.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{savedTheme.name}</h4>
                      <Button
                        size="sm"
                        onClick={() => loadSavedTheme(savedTheme)}
                        className="h-7 text-xs"
                      >
                        Aplicar
                      </Button>
                    </div>
                    <div className="flex gap-1">
                      {Object.entries(savedTheme)
                        .filter(([key]) => key !== "name" && key !== "id")
                        .map(([key, color]) => (
                          <div
                            key={key}
                            className="w-5 h-5 rounded border flex-shrink-0"
                            style={{ backgroundColor: color as string }}
                          />
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
