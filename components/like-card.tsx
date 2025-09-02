"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createBrowserClient } from "@supabase/ssr";
import { Heart } from "lucide-react";

export function LikeCard() {
  const [totalLikes, setTotalLikes] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("¡Gracias por tu like! ❤️");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Helper function para formatear números
  const formatStatValue = (value: number): string => {
    if (value === 0) return "0";
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
    return value.toString();
  };

  useEffect(() => {
    fetchLikes();

    // Configurar suscripción en tiempo real para likes
    const likesChannel = supabase
      .channel("portfolio_likes_realtime")
      .on(
        "postgres_changes",
        {
          event: "*", // Escuchar todos los eventos (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "portfolio_likes",
        },
        (payload) => {
          console.log("Cambio en likes detectado:", payload);

          if (payload.eventType === "INSERT") {
            // Nuevo like agregado
            console.log("Like agregado");
            setTotalLikes((prev) => prev + 1);
          } else if (payload.eventType === "DELETE") {
            // Like eliminado
            console.log("Like eliminado");
            setTotalLikes((prev) => Math.max(0, prev - 1));
          }
        }
      )
      .subscribe();

    // Cleanup: cancel subscription when component unmounts
    return () => {
      supabase.removeChannel(likesChannel);
    };
  }, []);

  const fetchLikes = async () => {
    try {
      const { data: likesData, error: likesError } = await supabase
        .from("portfolio_likes")
        .select("id");

      if (likesError) throw likesError;

      setTotalLikes(likesData?.length || 0);
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };

  const handleLike = async () => {
    try {
      const visitorId =
        localStorage.getItem("visitor_id") || crypto.randomUUID();
      localStorage.setItem("visitor_id", visitorId);

      // Check if user already liked
      const { data: existingLike } = await supabase
        .from("portfolio_likes")
        .select("id")
        .eq("visitor_id", visitorId)
        .single();

      if (existingLike) {
        // User already liked, show message
        setMessage("¡Ya has dado like! Gracias por tu apoyo ❤️");
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 2000);
        return;
      }

      // Add new like
      const { error } = await supabase.from("portfolio_likes").insert([
        {
          visitor_id: visitorId,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      // Show success message
      setMessage("¡Gracias por tu like! ❤️");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    } catch (error) {
      console.error("Error adding like:", error);
      setMessage("Error al enviar el like. Inténtalo de nuevo.");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    }
  };

  return (
    <>
      {/* Message Notification */}
      {showMessage && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-5 duration-300">
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                <span className="font-semibold">{message}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Like Card */}
      <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm w-full">
        <CardContent className="p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
            {/* Sección izquierda - Estadística */}
            <div className="text-center">
              <Heart className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
              <div className="text-4xl sm:text-5xl font-bold text-foreground mb-2">
                {formatStatValue(totalLikes)}
              </div>
              <p className="text-base sm:text-lg text-muted-foreground mb-1">
                Personas han dado like
              </p>
              <p className="text-sm text-muted-foreground/80">
                ¡Únete a la comunidad!
              </p>
            </div>

            {/* Sección derecha - Acción principal */}
            <div className="text-center">
              <div className="mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
                  ¡Gracias por visitar!
                </h3>
                <p className="text-muted-foreground mb-6 text-sm sm:text-base">
                  Si te gusta mi portfolio, ¡déjame un like!
                </p>
              </div>
              <Button
                variant="default"
                size="lg"
                onClick={handleLike}
                className="group/button hover:scale-105 transition-all duration-200 text-base px-6 py-3"
              >
                <Heart className="h-5 w-5 mr-2 group-hover/button:animate-pulse" />
                Dejar un like
              </Button>
            </div>
          </div>

          {/* Barra inferior con información adicional */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="group/item hover:bg-muted/50 p-3 rounded-lg transition-colors">
                <div className="text-primary mb-1">💼</div>
                <div className="font-semibold text-sm text-foreground mb-1">
                  Portfolio interactivo
                </div>
                <p className="text-xs text-muted-foreground">
                  Explora mi trabajo y proyectos
                </p>
              </div>
              <div className="group/item hover:bg-muted/50 p-3 rounded-lg transition-colors">
                <div className="text-primary mb-1">🚀</div>
                <div className="font-semibold text-sm text-foreground mb-1">
                  Tecnología moderna
                </div>
                <p className="text-xs text-muted-foreground">
                  Desarrollado con Next.js y React
                </p>
              </div>
              <div className="group/item hover:bg-muted/50 p-3 rounded-lg transition-colors">
                <div className="text-primary mb-1">⭐</div>
                <div className="font-semibold text-sm text-foreground mb-1">
                  Experiencia única
                </div>
                <p className="text-xs text-muted-foreground">
                  Diseño responsivo y UX optimizada
                </p>
              </div>
            </div>
          </div>

          {/* Subtle background gradient effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </CardContent>
      </Card>
    </>
  );
}
