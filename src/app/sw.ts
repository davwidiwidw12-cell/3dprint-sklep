import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

// This declares the value of `injectionPoint` to typescript.
// `injectionPoint` is the string that will be replaced by the actual precache manifest.
// By default, this string is set to `"self.__SW_MANIFEST"`.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: WorkerGlobalScope & {
  registration: ServiceWorkerRegistration;
  clients: any;
  __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  addEventListener: (type: string, listener: (event: any) => void) => void;
};

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();

// Listen for push events
self.addEventListener("push", (event: any) => {
  const data = event.data?.json();
  const title = data?.title || "Nowe powiadomienie";
  const options = {
    body: data?.body || "Masz nową wiadomość!",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    data: data?.url || "/",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Listen for notification click
self.addEventListener("notificationclick", (event: any) => {
  event.notification.close();
  event.waitUntil(
    self.clients.openWindow(event.notification.data)
  );
});
