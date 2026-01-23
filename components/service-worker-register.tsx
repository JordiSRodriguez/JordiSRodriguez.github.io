"use client";

import { useEffect } from "react";
import { registerSW } from "@/lib/sw-registration";

export function ServiceWorkerRegister() {
  useEffect(() => {
    // Only register in production and if service worker is supported
    if (
      process.env.NODE_ENV === "production" &&
      "serviceWorker" in navigator &&
      typeof window !== "undefined"
    ) {
      registerSW();
    }
  }, []);

  return null;
}
