"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Bell, BellOff, Download } from "lucide-react";
import toast from "react-hot-toast";
import { saveSubscription } from "@/lib/push-actions";

export function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    } else {
        console.log("Push API not supported");
    }

    // Listen for PWA install prompt
    window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
    });
  }, []);

  async function installApp() {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
          setDeferredPrompt(null);
      }
  }

  async function registerServiceWorker() {
    try {
      // Explicitly register custom-sw.js
      if ('serviceWorker' in navigator) {
          // Unregister old ones first to be clean
          const registrations = await navigator.serviceWorker.getRegistrations();
          for(let registration of registrations) {
              await registration.unregister();
          }

          const registration = await navigator.serviceWorker.register('/custom-sw.js');
          console.log("Service Worker (Custom) registered:", registration);
          
          await navigator.serviceWorker.ready;
          const sub = await registration.pushManager.getSubscription();
          setSubscription(sub);
      }
    } catch (error) {
      console.error("SW Registration Error:", error);
    }
  }

  async function subscribe() {
    setIsLoading(true);
    try {
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) {
          alert("Błąd konfiguracji: Brak klucza VAPID");
          setIsLoading(false);
          return;
      }

      console.log("Czekam na Service Worker...");
      
      // Explicitly wait for ready
      let registration = await navigator.serviceWorker.ready;
      
      // If ready resolves but active is null (rare race condition), wait a bit or try to get from getRegistration
      if (!registration.active) {
           console.log("SW ready resolved but .active is null, retrying getRegistration...");
           const reg = await navigator.serviceWorker.getRegistration();
           if (reg && reg.active) {
               registration = reg;
           } else {
               alert("Service Worker zarejestrowany, ale nieaktywny. Odśwież stronę.");
               setIsLoading(false);
               return;
           }
      }
      
      console.log("Service Worker gotowy i aktywny:", registration);

      // Check permission state
      if (Notification.permission === 'denied') {
          alert("Powiadomienia są zablokowane w ustawieniach przeglądarki. Kliknij kłódkę w pasku adresu i odblokuj.");
          setIsLoading(false);
          return;
      }

      // Request permission explicitly first (sometimes subscribe doesn't trigger prompt correctly)
      if (Notification.permission === 'default') {
          const permission = await Notification.requestPermission();
          if (permission !== 'granted') {
              alert("Nie wyrażono zgody na powiadomienia.");
              setIsLoading(false);
              return;
          }
      }

      console.log("Wysyłam prośbę o subskrypcję do przeglądarki...");
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });
      
      console.log("Subskrypcja otrzymana:", sub);
      setSubscription(sub);
      
      console.log("Zapisuję subskrypcję w bazie...");
      await saveSubscription(JSON.parse(JSON.stringify(sub)));
      
      toast.success("Powiadomienia włączone!");
    } catch (error) {
      console.error("Subscription failed:", error);
      alert("Błąd subskrypcji: " + (error instanceof Error ? error.message : JSON.stringify(error)));
    } finally {
        setIsLoading(false);
    }
  }

  async function unsubscribe() {
    if (!subscription) return;
    setIsLoading(true);
    try {
        await subscription.unsubscribe();
        setSubscription(null);
        toast.success("Powiadomienia wyłączone.");
    } catch (error) {
        console.error(error);
        alert("Błąd odsubskrybowania");
    } finally {
        setIsLoading(false);
    }
  }

  if (!isSupported) return null;

  return (
    <div className="flex items-center gap-2">
      {deferredPrompt && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={installApp} 
            className="text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100 animate-pulse"
          >
            <Download className="w-4 h-4 mr-2" />
            Zainstaluj App
          </Button>
      )}

      {subscription ? (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={unsubscribe} 
          disabled={isLoading}
          className="text-green-600 border-green-200 bg-green-50 hover:bg-green-100"
          title="Powiadomienia aktywne"
        >
          <Bell className="w-4 h-4 mr-2" />
          {isLoading ? "Przetwarzanie..." : "Powiadomienia Wł."}
        </Button>
      ) : (
        <Button 
            variant="outline" 
            size="sm" 
            onClick={subscribe}
            disabled={isLoading}
            className="text-gray-500 hover:text-blue-600"
            title="Włącz powiadomienia o zamówieniach"
        >
          <BellOff className="w-4 h-4 mr-2" />
          {isLoading ? "Włączanie..." : "Włącz Powiadomienia"}
        </Button>
      )}
    </div>
  );
}

// Utility to convert VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
