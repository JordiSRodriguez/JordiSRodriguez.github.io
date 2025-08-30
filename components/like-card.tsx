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
        <div className="fixed top-4 right-4 z-50 animate-bounce">
          <Card className="bg-gradient-to-r from-green-400 to-blue-500 text-white border-0">
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
      <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white w-full">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Sección izquierda - Estadística */}
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                {formatStatValue(totalLikes)}
              </div>
              <p className="text-lg opacity-90">Personas han dado like</p>
              <p className="text-sm opacity-75 mt-1">¡Únete a la comunidad!</p>
            </div>

            {/* Sección derecha - Acción principal */}
            <div className="text-center">
              <Heart className="h-16 w-16 mx-auto mb-4 animate-pulse" />
              <h3 className="text-2xl font-bold mb-3">¡Gracias por visitar!</h3>
              <p className="opacity-90 mb-6 text-lg">
                Si te gusta mi portfolio, ¡déjame un like!
              </p>
              <Button
                variant="secondary"
                size="lg"
                onClick={handleLike}
                className="hover:scale-105 transition-transform text-lg px-8 py-3"
              >
                ❤️ Dejar un like
              </Button>
            </div>
          </div>

          {/* Barra inferior con información adicional */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm opacity-80">
              <div>
                <span className="font-semibold">💼 Portfolio interactivo</span>
                <p>Explora mi trabajo y proyectos</p>
              </div>
              <div>
                <span className="font-semibold">🚀 Tecnología moderna</span>
                <p>Desarrollado con Next.js y React</p>
              </div>
              <div>
                <span className="font-semibold">⭐ Experiencia única</span>
                <p>Diseño responsivo y UX optimizada</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
