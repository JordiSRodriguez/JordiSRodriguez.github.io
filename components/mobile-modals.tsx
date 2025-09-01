"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github, Cloud, MessageCircle, Send, Bot, User } from "lucide-react";
import { WeatherContent } from "@/components/weather-content";
import { GitHubContent } from "@/components/github-content";

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
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Modal GitHub */}
      <Dialog open={showGithub} onOpenChange={onGithubClose}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Github className="h-5 w-5" />
              GitHub Activity
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <GitHubContent isCompact={true} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Weather */}
      <Dialog open={showWeather} onOpenChange={onWeatherClose}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              Clima para Codear
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <WeatherContent isCompact={true} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal AI Chat */}
      <Dialog open={showAiChat} onOpenChange={onAiChatClose}>
        <DialogContent className="max-w-md h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Asistente IA
            </DialogTitle>
          </DialogHeader>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto space-y-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.sender === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {message.sender === "user" ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                <div
                  className={`max-w-[75%] p-3 rounded-lg ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-muted text-muted-foreground p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat input */}
          <div className="flex gap-2 pt-4 border-t">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
