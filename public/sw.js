/**
 * Service Worker for Offline Support
 * Caches static assets and API responses for better performance
 */

const CACHE_NAME = "portfolio-v1";
const STATIC_CACHE_NAME = "portfolio-static-v1";
const RUNTIME_CACHE = "portfolio-runtime";

// Assets to cache immediately on install
const PRECACHE_URLS = [
  "/",
  "/manifest.json",
  // Add core UI assets that should always be cached
];

// Network timeout threshold (ms)
const NETWORK_TIMEOUT = 3000;

// Install event - cache static assets
self.addEventListener("install", (event) => {
  self.skipWaiting(); // Activate immediately
  event.waitUntil(
    (async () => {
      const staticCache = await caches.open(STATIC_CACHE_NAME);
      await staticCache.addAll(
        PRECACHE_URLS.map((url) =>
          new Request(url, { cache: "reload-only" })
        )
      );
    })()
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter(
            (name) =>
              name !== STATIC_CACHE_NAME &&
              name !== CACHE_NAME &&
              name !== RUNTIME_CACHE
          )
          .map((name) => caches.delete(name))
      );
    })()
  );
});

// Fetch event - network-first strategy for API, cache-first for static
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip for non-GET requests or Chrome extensions/DevTools
  if (
    request.method !== "GET" ||
    url.protocol.startsWith("chrome-extension") ||
    url.hostname === "localhost" ||
    url.hostname === "127.0.0.1"
  ) {
    return;
  }

  // Skip for Supabase realtime subscriptions (WebSocket)
  if (url.pathname.includes("/realtime") || url.protocol === "ws:") {
    return;
  }

  // API requests - Network first, then cache
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      (async () => {
        try {
          // Try network first with timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), NETWORK_TIMEOUT);

          const response = await fetch(request.clone(), {
            signal: controller.signal,
          });
          clearTimeout(timeoutId);

          // Cache the successful response
          const cache = await caches.open(RUNTIME_CACHE);
          await cache.put(request, response.clone());

          return response;
        } catch {
          // Network error or timeout, try cache
          const cache = await caches.open(RUNTIME_CACHE);
          const cached = await cache.match(request);

          if (cached) {
            return cached;
          }

          // Return offline fallback
          return new Response(
            JSON.stringify({ error: "Offline - No cached data available" }),
            {
              status: 503,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      })()
    );
    return;
  }

  // Static assets - Cache first, then network
  event.respondWith(
    (async () => {
      const cache = await caches.open(STATIC_CACHE_NAME);
      const cached = await cache.match(request);

      if (cached) {
        return cached;
      }

      try {
        const response = await fetch(request);
        if (response.ok) {
          // Cache successful responses
          cache.put(request, response.clone());
        }
        return response;
      } catch {
        // Return offline fallback for HTML pages
        if (request.headers.get("accept")?.includes("text/html")) {
          return caches.match("/"); // Return homepage
        }
        throw error;
      }
    })()
  );
});

// Background sync for offline actions (contact form submissions, etc.)
self.addEventListener("sync", (event) => {
  if (event.tag === "contact-submit") {
    event.waitUntil(
      (async () => {
        try {
          // Retry submitting contact form data
          await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: event.data,
          });
        } catch (error) {
          console.error("Background sync failed:", error);
        }
      })()
    );
  }
});
