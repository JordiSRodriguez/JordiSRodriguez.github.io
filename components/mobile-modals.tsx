"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Github,
  Star,
  Activity,
  Loader2,
  Cloud,
  Wind,
  AlertCircle,
  MessageCircle,
  Send,
  Bot,
  User,
} from "lucide-react";

interface MobileModalsProps {
  showGithub: boolean;
  onGithubClose: () => void;
  showWeather: boolean;
  onWeatherClose: () => void;
  showAiChat: boolean;
  onAiChatClose: () => void;
}

export function MobileModals({
  showGithub,
  onGithubClose,
  showWeather,
  onWeatherClose,
  showAiChat,
  onAiChatClose,
}: MobileModalsProps) {
  // Estados para GitHub
  const [githubStats, setGithubStats] = useState({
    totalStars: 0,
    totalRepos: 0,
    followers: 0,
    totalCommits: 0,
  });
  const [githubLoading, setGithubLoading] = useState(false);

  // Estados para Weather
  const [weather, setWeather] = useState<{
    temperature: number;
    condition: string;
    description: string;
    humidity: number;
    windSpeed: number;
    location: string;
  } | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  // Estados para AI Chat
  const [messages, setMessages] = useState([
    {
      id: "1",
      content: "¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte hoy?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Datos mock para GitHub (en una implementación real, aquí harías fetch)
  useEffect(() => {
    if (showGithub) {
      setGithubLoading(true);
      // Simular fetch
      setTimeout(() => {
        setGithubStats({
          totalStars: 127,
          totalRepos: 24,
          followers: 89,
          totalCommits: 342,
        });
        setGithubLoading(false);
      }, 500);
    }
  }, [showGithub]);

  // Datos mock para Weather
  useEffect(() => {
    if (showWeather) {
      setWeatherLoading(true);
      // Simular fetch
      setTimeout(() => {
        setWeather({
          temperature: 22,
          condition: "Parcialmente nublado",
          description: "Perfecto para codear",
          humidity: 65,
          windSpeed: 3.2,
          location: "Tu ciudad",
        });
        setWeatherLoading(false);
      }, 500);
    }
  }, [showWeather]);

  // Funciones para el AI Chat
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simular respuesta del AI
    setTimeout(() => {
      const responses = [
        "¡Interesante pregunta! Este portfolio muestra las habilidades en desarrollo web moderno.",
        "Puedo ayudarte a navegar por las diferentes secciones del portfolio.",
        "¿Te gustaría saber más sobre algún proyecto específico?",
        "Las tecnologías principales incluyen React, Next.js, TypeScript y Tailwind CSS.",
      ];
      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: randomResponse,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Modal de GitHub */}
      <Dialog open={showGithub} onOpenChange={onGithubClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Github className="h-5 w-5" />
              GitHub Stats
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {githubLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">
                  Cargando datos...
                </span>
              </div>
            ) : (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-500">
                      {githubStats.totalStars}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ⭐ Stars
                    </div>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-500">
                      {githubStats.totalRepos}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      📁 Repos
                    </div>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-500">
                      {githubStats.followers}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      👥 Seguidores
                    </div>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-500">
                      {githubStats.totalCommits}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      💻 Commits
                    </div>
                  </Card>
                </div>

                <Badge
                  variant="secondary"
                  className="w-full justify-center py-2 bg-gradient-to-r from-primary/10 to-primary/5"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Actividad reciente disponible
                </Badge>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Weather */}
      <Dialog open={showWeather} onOpenChange={onWeatherClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              Clima para Codear
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {weatherLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">
                  Obteniendo clima...
                </span>
              </div>
            ) : weather ? (
              <>
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    {weather.temperature}°C
                  </div>
                  <div className="text-sm text-muted-foreground">
                    📍 {weather.location}
                  </div>
                  <div className="text-lg font-medium">{weather.condition}</div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {weather.description}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 text-center">
                    <Wind className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <div className="text-sm font-medium">
                      {weather.windSpeed} m/s
                    </div>
                    <div className="text-xs text-muted-foreground">Viento</div>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl mb-2">💧</div>
                    <div className="text-sm font-medium">
                      {weather.humidity}%
                    </div>
                    <div className="text-xs text-muted-foreground">Humedad</div>
                  </Card>
                </div>

                <Badge
                  variant="secondary"
                  className="w-full justify-center py-2 bg-gradient-to-r from-blue-500/10 to-blue-500/5"
                >
                  ☀️ Condiciones ideales para programar
                </Badge>
              </>
            ) : (
              <div className="text-center py-4">
                <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-muted-foreground">Error cargando clima</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de AI Chat */}
      <Dialog open={showAiChat} onOpenChange={onAiChatClose}>
        <DialogContent className="sm:max-w-md h-[80vh] flex flex-col p-0">
          <DialogHeader className="p-4 pb-2">
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              Asistente IA
              <Badge variant="outline" className="ml-auto">
                En línea
              </Badge>
            </DialogTitle>
          </DialogHeader>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-96">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.sender === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                  }`}
                >
                  {message.sender === "user" ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                <div
                  className={`max-w-[250px] p-3 rounded-lg text-sm ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground ml-auto"
                      : "bg-muted"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-current rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-current rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="px-3"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
