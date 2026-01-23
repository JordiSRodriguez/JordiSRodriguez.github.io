"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Volume2, VolumeX, Headphones, X } from "lucide-react";
import logger from "@/lib/logger";

// Web Speech API types
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  start(): void;
  stop(): void;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

interface VoiceNavigationProps {
  isActive: boolean;
  onSectionChange: (section: string) => void;
  onToggle: () => void;
}

export function VoiceNavigation({
  isActive,
  onSectionChange,
  onToggle,
}: VoiceNavigationProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const commands = {
    "ir a proyectos": () => onSectionChange("projects"),
    "mostrar experiencia": () => onSectionChange("experience"),
    "abrir contacto": () => onSectionChange("contact"),
    "leer acerca": () => onSectionChange("about"),
    "mostrar blog": () => onSectionChange("blog"),
    "ir a inicio": () => onSectionChange("home"),
    "mostrar educación": () => onSectionChange("education"),
    "abrir analíticas": () => onSectionChange("analytics"),
    "cambiar tema": () => document.documentElement.classList.toggle("dark"),
    "cerrar voz": () => onToggle(),
    // English commands for compatibility
    "go to projects": () => onSectionChange("projects"),
    "show experience": () => onSectionChange("experience"),
    "open contact": () => onSectionChange("contact"),
    "read about": () => onSectionChange("about"),
    "show blog": () => onSectionChange("blog"),
    "go home": () => onSectionChange("home"),
    "show education": () => onSectionChange("education"),
    "open analytics": () => onSectionChange("analytics"),
    "toggle theme": () => document.documentElement.classList.toggle("dark"),
    "close voice": () => onToggle(),
  };

  const speak = (text: string) => {
    if (!voiceEnabled) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      return;
    }

    const SpeechRecognition =
      window.webkitSpeechRecognition || window.SpeechRecognition;
    recognitionRef.current = new SpeechRecognition();

    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript
        .toLowerCase()
        .trim();
      const confidence = event.results[current][0].confidence;

      setTranscript(transcript);
      setConfidence(confidence);

      if (event.results[current].isFinal) {
        // Check for commands
        for (const [command, action] of Object.entries(commands)) {
          if (transcript.includes(command)) {
            action();
            speak(
              `Navigating to ${command
                .replace("go to ", "")
                .replace("show ", "")
                .replace("open ", "")}`
            );
            break;
          }
        }
      }
    };

    recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
      logger.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      speak("Voice navigation stopped");
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      speak(
        "Voice navigation started. Try saying 'go to projects' or 'show experience'"
      );
    }
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (!voiceEnabled) {
      speak("Voice feedback enabled");
    }
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Headphones className="w-5 h-5" />
              Control por Voz
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={isListening ? "default" : "secondary"}>
                {isListening ? "Escuchando" : "Inactivo"}
              </Badge>
              <Button variant="ghost" size="sm" onClick={onToggle}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Button
              onClick={toggleListening}
              variant={isListening ? "destructive" : "default"}
              className="flex-1"
            >
              {isListening ? (
                <MicOff className="w-4 h-4 mr-2" />
              ) : (
                <Mic className="w-4 h-4 mr-2" />
              )}
              {isListening ? "Detener" : "Iniciar"}
            </Button>

            <Button onClick={toggleVoice} variant="outline" size="sm">
              {voiceEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </Button>
          </div>

          {transcript && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Último Comando:</div>
              <div className="p-2 bg-muted rounded text-sm">"{transcript}"</div>
              <div className="text-xs text-muted-foreground">
                Confianza: {Math.round(confidence * 100)}%
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="text-sm font-medium">Comandos Disponibles:</div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>• "Ir a proyectos" - Ir a proyectos</div>
              <div>• "Mostrar experiencia" - Mostrar experiencia</div>
              <div>• "Abrir contacto" - Abrir contacto</div>
              <div>• "Leer acerca" - Leer acerca de mí</div>
              <div>• "Mostrar blog" - Mostrar blog</div>
              <div>• "Ir a inicio" - Ir al inicio</div>
              <div>• "Cerrar voz" - Cerrar control por voz</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
