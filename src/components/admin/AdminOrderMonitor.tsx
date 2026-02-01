"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Volume2, VolumeX } from "lucide-react";

export function AdminOrderMonitor() {
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio("/sounds/notification.mp3");
    
    // Initial fetch to set baseline
    checkLatestOrder(true);

    // Poll every 30 seconds
    const interval = setInterval(() => checkLatestOrder(false), 30000);
    return () => clearInterval(interval);
  }, []);

  const checkLatestOrder = async (isInitial: boolean) => {
    try {
      const res = await fetch("/api/admin/latest-order");
      if (!res.ok) return;
      const data = await res.json();
      
      const order = data.latestOrder;
      if (!order) return;

      setLastOrderId((prevId) => {
        // If it's the first run, just save the ID
        if (isInitial) return order.id;

        // If ID changed and we had a previous ID -> NEW ORDER!
        if (prevId && prevId !== order.id) {
          handleNewOrder(order);
        }
        return order.id;
      });
    } catch (error) {
      console.error("Monitor error:", error);
    }
  };

  const handleNewOrder = (order: any) => {
    toast.success(`Nowe zamówienie! ${order.fullName} (${Number(order.total).toFixed(2)} zł)`, {
      duration: 10000,
      icon: '💰',
      style: {
          border: '2px solid #D4AF37',
          padding: '16px',
          color: '#333',
      },
    });

    if (soundEnabled && audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play failed (interaction needed first)", e));
    }
  };

  return (
    <button 
      onClick={() => setSoundEnabled(!soundEnabled)}
      className="fixed bottom-4 right-4 bg-white p-2 rounded-full shadow-lg border border-gray-200 text-gray-500 hover:text-gray-900 z-50"
      title={soundEnabled ? "Wycisz powiadomienia dźwiękowe" : "Włącz dźwięk powiadomień"}
    >
      {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
    </button>
  );
}
