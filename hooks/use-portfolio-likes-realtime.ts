/**
 * Custom hook for Supabase realtime subscription to portfolio_likes table
 * Provides real-time updates when likes are added or removed
 */

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import logger from "@/lib/logger";

export function usePortfolioLikesRealtime() {
  const [totalLikes, setTotalLikes] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    // Fetch initial likes count
    const fetchLikes = async () => {
      try {
        const { data, error } = await supabase
          .from("portfolio_likes")
          .select("id");

        if (error) throw error;
        setTotalLikes(data?.length || 0);
      } catch (error) {
        logger.error("Error fetching likes:", error);
      }
    };

    fetchLikes();

    // Setup realtime subscription for portfolio_likes
    const channel = supabase
      .channel("portfolio_likes_realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "portfolio_likes",
        },
        (payload) => {
          logger.log("Cambio en likes detectado:", payload);

          if (payload.eventType === "INSERT") {
            setTotalLikes((prev) => prev + 1);
          } else if (payload.eventType === "DELETE") {
            setTotalLikes((prev) => Math.max(0, prev - 1));
          }
        }
      )
      .subscribe();

    // Cleanup: remove channel when component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { totalLikes };
}
