/**
 * Service Worker Registration
 * Registers the service worker for offline support and caching
 */

export function registerSW() {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      const swUrl = `/sw.js`;

      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log("SW registered: ", registration);
        })
        .catch((registrationError) => {
          console.error("SW registration failed: ", registrationError);
        });
    });
  }
}

export function unregisterSW() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error("SW unregistration failed:", error);
      });
  }
}
