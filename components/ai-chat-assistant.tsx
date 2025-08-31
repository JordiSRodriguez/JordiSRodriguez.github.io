"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { useFloatingComponents } from "@/contexts/floating-components-context";
import { Send, User, Brain, Zap, X } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface Profile {
  full_name?: string;
  bio?: string;
  location?: string;
  roles?: string[];
  github_username?: string;
  linkedin_url?: string;
}

interface Project {
  title: string;
  description: string;
  technologies: string[] | string;
}

interface WorkExperience {
  title: string;
  company: string;
  position: string;
  description?: string;
  current_job: boolean;
}

interface Skill {
  name: string;
  category: string;
  level: number;
}

// Función para obtener contexto dinámico desde Supabase
const getPortfolioContext = async (): Promise<string> => {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const [profileResult, projectsResult, workResult, skillsResult] =
      await Promise.all([
        supabase
          .from("profiles")
          .select(
            "full_name, bio, location, roles, github_username, linkedin_url"
          )
          .single(),
        supabase
          .from("projects")
          .select("title, description, technologies")
          .eq("featured", true)
          .limit(5),
        supabase
          .from("work_experiences")
          .select("title, company, position, description, current_job")
          .order("start_date", { ascending: false })
          .limit(3),
        supabase
          .from("skills")
          .select("name, category, level")
          .gte("level", 4)
          .limit(20),
      ]);

    const profile: Profile = profileResult.data || {};
    const projects: Project[] = projectsResult.data || [];
    const workExperiences: WorkExperience[] = workResult.data || [];
    const skills: Skill[] = skillsResult.data || [];

    // Construir contexto dinámico
    const skillsByCategory = skills.reduce((acc: any, skill: any) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill.name);
      return acc;
    }, {});

    return `Eres el asistente de IA de ${
      profile.full_name || "Jordi"
    }, desarrollador Full Stack.

INFORMACIÓN PERSONAL:
- Nombre: ${profile.full_name || "Jordi"}
- Bio: ${
      profile.bio ||
      "Desarrollador Full Stack especializado en tecnologías modernas"
    }
- Ubicación: ${profile.location || "España"}
- Roles: ${
      Array.isArray(profile.roles)
        ? profile.roles.join(", ")
        : "Full Stack Developer"
    }

PROYECTOS DESTACADOS:
${projects
  .map(
    (p) =>
      `- ${p.title}: ${p.description} (Tecnologías: ${
        Array.isArray(p.technologies)
          ? p.technologies.join(", ")
          : p.technologies
      })`
  )
  .join("\n")}

EXPERIENCIA LABORAL:
${workExperiences
  .map(
    (w) =>
      `- ${w.position} en ${w.company}${w.current_job ? " (Actual)" : ""}: ${
        w.description || w.title
      }`
  )
  .join("\n")}

HABILIDADES TÉCNICAS:
${Object.entries(skillsByCategory)
  .map(([cat, skills]: [string, any]) => `${cat}: ${skills.join(", ")}`)
  .join("\n")}

REGLAS:
- Responde SOLO sobre temas relacionados con el portfolio, tecnologías, proyectos o experiencia profesional
- Si preguntan algo no relacionado, responde: "Lo siento, estoy aqui para ayudarte con informacion sobre el portfolio, proyectos y experiencia profesional. ¿Hay algo especifico sobre mi trabajo que te gustaria saber?"
- Sé conciso: máximo 3-4 líneas por respuesta
- No uses markdown ni caracteres especiales de formato
- Mantén un tono profesional pero cercano`;
  } catch (error) {
    console.error("Error obteniendo contexto:", error);
    return `Soy el asistente de IA de Jordi, desarrollador Full Stack.

Puedo ayudarte con información sobre:
- Proyectos y tecnologías
- Experiencia profesional
- Habilidades técnicas
- Contacto profesional

REGLAS: Solo temas relacionados con el portfolio. Respuestas concisas sin formato especial.`;
  }
};

// Función para obtener respuesta a través del proxy
const getAIResponse = async (
  userMessage: string,
  context: string
): Promise<string> => {
  try {
    const response = await fetch("/api/ai-proxy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userMessage,
        context: context,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.response || "Lo siento, no pude procesar tu mensaje.";
  } catch (error) {
    console.error("Error calling AI proxy:", error);
    return "Disculpa, tengo problemas técnicos. Puedes contactar directamente para más información.";
  }
};

export function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "¡Hola! Soy tu asistente de IA. Puedo responder preguntas sobre el portfolio, proyectos, habilidades y experiencia. ¿En qué puedo ayudarte?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatSize, setChatSize] = useState({ width: 384, height: 600 });
  const [isResizing, setIsResizing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { setAiChatOpen } = useFloatingComponents();

  // Límites de redimensionamiento
  const minSize = { width: 320, height: 400 };
  const maxSize = { width: 600, height: 800 };

  // Funciones de redimensionamiento
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = chatSize.width;
    const startHeight = chatSize.height;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(
        minSize.width,
        Math.min(maxSize.width, startWidth + (startX - e.clientX))
      );
      const newHeight = Math.max(
        minSize.height,
        Math.min(maxSize.height, startHeight + (startY - e.clientY))
      );

      setChatSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Sincronizar el estado con el contexto
  useEffect(() => {
    setAiChatOpen(isOpen);
  }, [isOpen, setAiChatOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "i") {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue.trim();
    setInputValue("");
    setIsTyping(true);

    try {
      // Obtener contexto dinámico desde Supabase
      const context = await getPortfolioContext();

      // Obtener respuesta de IA directamente de Hugging Face
      const aiResponseContent = await getAIResponse(currentInput, context);

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponseContent,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Disculpa, hay un problema técnico. Puedes contactar directamente a través del formulario de contacto.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div
        className={`fixed ${
          isMobile ? "bottom-24 right-4" : "bottom-6 right-6"
        }`}
        style={{ zIndex: 10000 }}
      >
        <div className="relative group">
          <Button
            onClick={() => setIsOpen(true)}
            className="rounded-full w-14 h-14 shadow-2xl hover:shadow-3xl transition-all duration-500 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 hover:from-violet-500 hover:via-purple-500 hover:to-indigo-600 border-0 group-hover:scale-110 transform cursor-pointer relative overflow-hidden"
            style={{ zIndex: 10001 }}
          >
            {/* Efecto de brillo animado */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>

            <Brain className="w-6 h-6 text-white relative z-10" />

            {/* Partículas flotantes */}
            <div className="absolute top-1 right-1 w-1 h-1 bg-yellow-300 rounded-full animate-pulse"></div>
            <div className="absolute bottom-2 left-2 w-0.5 h-0.5 bg-blue-300 rounded-full animate-ping"></div>
          </Button>

          {/* Indicador de estado superpuesto */}
          <div
            className="absolute -top-1 -right-1 pointer-events-none"
            style={{ zIndex: 10002 }}
          >
            <div className="relative">
              <div className="w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-lg"></div>
              <div className="absolute inset-0 w-4 h-4 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
              <div className="absolute inset-1 w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Tooltip */}
          <div className="absolute -top-16 right-0 bg-gray-900/95 backdrop-blur-sm text-white text-xs px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none border border-gray-700/50">
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-yellow-400" />
              <span className="font-medium">Asistente IA</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-300">Ctrl+I</span>
            </div>
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900/95"></div>
          </div>

          {/* Efectos de resplandor */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500/30 to-indigo-600/30 opacity-0 group-hover:opacity-100 blur-xl scale-150 transition-all duration-500 pointer-events-none"></div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-400/20 to-purple-500/20 opacity-50 blur-2xl scale-200 animate-pulse pointer-events-none"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed ${isMobile ? "bottom-24 right-4" : "bottom-6 right-6"}`}
      style={{ zIndex: 10000 }}
    >
      <div
        ref={chatRef}
        className="shadow-2xl transition-all duration-500 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden rounded-2xl relative"
        style={{
          width: isMobile ? 320 : chatSize.width,
          height: isMobile ? 500 : chatSize.height,
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Handle de redimensionamiento - solo en desktop */}
        {!isMobile && (
          <div
            className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize z-50 opacity-0 hover:opacity-100 transition-opacity"
            onMouseDown={handleMouseDown}
          >
            <div className="absolute top-1 left-1 w-2 h-2 bg-gray-400 rounded-full"></div>
          </div>
        )}

        {/* Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-purple-500/30 to-pink-500/20"></div>

          {/* Efectos visuales de fondo más sutiles */}
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
          <div className="absolute -bottom-5 -right-5 w-20 h-20 bg-yellow-300/10 rounded-full blur-lg"></div>

          <div className="relative flex items-center justify-between p-5">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 shadow-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                  <Brain className="w-6 h-6 text-white relative z-10" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white shadow-sm">
                  <div className="w-full h-full bg-emerald-300 rounded-full animate-pulse"></div>
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <h3 className="text-lg font-bold text-white drop-shadow-sm">
                  Asistente IA
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-yellow-300" />
                    <span className="text-xs text-white/90 font-medium">
                      Impulsado por IA
                    </span>
                  </div>
                  <span className="text-white/60">•</span>
                  <span className="text-xs text-emerald-300 font-semibold">
                    En línea
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-9 w-9 p-0 hover:bg-white/20 text-white/70 hover:text-white rounded-xl transition-all duration-200 backdrop-blur-sm"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Contenido principal del chat */}
        <div className="flex flex-col" style={{ height: `calc(100% - 80px)` }}>
          {/* Área de mensajes */}
          <div className="flex-1 overflow-y-auto p-6 relative">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white/80 dark:from-gray-800/30 dark:to-gray-900/50"></div>
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200/50 to-transparent"></div>
            </div>

            <div className="relative z-10">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    ¡Hola! Soy tu asistente IA
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs mx-auto leading-relaxed">
                    Puedo ayudarte con información sobre el portfolio,
                    proyectos, habilidades y experiencia profesional.
                  </p>
                </div>
              )}

              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  } ${
                    index > 0 ? "mt-8" : ""
                  } animate-in slide-in-from-bottom-3 duration-500`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {message.sender === "ai" && (
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-800 relative">
                        <Brain className="w-5 h-5 text-white" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white"></div>
                      </div>
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] relative group ${
                      message.sender === "user" ? "order-1" : ""
                    }`}
                  >
                    <div
                      className={`px-5 py-4 text-sm leading-relaxed shadow-lg border backdrop-blur-sm transition-all duration-200 ${
                        message.sender === "user"
                          ? "bg-gradient-to-br from-violet-600 to-purple-700 text-white border-violet-500/20 rounded-2xl rounded-br-lg ml-4"
                          : "bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-100 border-gray-200/50 dark:border-gray-600/50 rounded-2xl rounded-bl-lg mr-4"
                      }`}
                    >
                      <div className="whitespace-pre-wrap break-words">
                        {message.content}
                      </div>
                      <div
                        className={`text-xs mt-3 ${
                          message.sender === "user"
                            ? "text-violet-200 text-right"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>

                  {message.sender === "user" && (
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-800">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-4 justify-start animate-in slide-in-from-bottom-3 duration-300">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-800 relative">
                      <Brain className="w-5 h-5 text-white" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white animate-pulse"></div>
                    </div>
                  </div>
                  <div className="bg-white/90 dark:bg-gray-800/90 border border-gray-200/50 dark:border-gray-600/50 rounded-2xl rounded-bl-lg px-5 py-4 shadow-lg backdrop-blur-sm mr-4">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        IA pensando...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>

          {/* Área de input */}
          <div className="relative border-t border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-50/50 via-purple-50/30 to-indigo-50/50 dark:from-violet-900/10 dark:via-purple-900/10 dark:to-indigo-900/10"></div>

            <div className="relative p-5">
              <div className="flex gap-3 items-end">
                <div className="flex-1 relative">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Escribe tu pregunta aquí..."
                    className="text-sm border-0 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 rounded-2xl py-4 px-5 pr-16 transition-all duration-300 shadow-sm hover:shadow-md resize-none placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    disabled={isTyping}
                    maxLength={500}
                  />

                  {/* Contador de caracteres */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {inputValue.length > 0 && (
                      <span
                        className={`text-xs px-2 py-1 rounded-full transition-colors ${
                          inputValue.length > 400
                            ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                        }`}
                      >
                        {inputValue.length}/500
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  size="sm"
                  className={`h-12 w-12 rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden group ${
                    !inputValue.trim() || isTyping
                      ? "bg-gray-300 dark:bg-gray-600"
                      : "bg-gradient-to-br from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 hover:scale-105"
                  }`}
                >
                  {inputValue.trim() && !isTyping && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                  )}

                  <Send
                    className={`w-5 h-5 relative z-10 transition-transform duration-200 ${
                      inputValue.trim() && !isTyping
                        ? "text-white group-hover:scale-110"
                        : "text-gray-500"
                    }`}
                  />
                </Button>
              </div>

              {/* Información y estado */}
              <div className="mt-4 flex items-center justify-center text-xs">
                <div className="flex items-center gap-6 text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <span className="w-1 h-1 bg-violet-500 rounded-full"></span>
                    Presiona{" "}
                    <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">
                      Enter
                    </kbd>{" "}
                    para enviar
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                    <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">
                      Ctrl+I
                    </kbd>{" "}
                    para ocultar
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
