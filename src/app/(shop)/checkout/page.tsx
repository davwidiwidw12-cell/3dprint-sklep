"use client";

import { useCartStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { createOrder, markOrderAsPaid } from "@/lib/orders";
import { useSession } from "next-auth/react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup"; // need to create this or use raw inputs
import { Label } from "@/components/ui/Label"; // need to create this

export default function CheckoutPage() {
  const { items, total, shippingCost, clearCart } = useCartStore();
  const { data: session, status } = useSession();
  const router = useRouter();

  // Protect Route
  useEffect(() => {
    if (status === "unauthenticated") {
        router.push("/auth/signin?callbackUrl=/checkout");
    }
  }, [status, router]);
  
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    addressLine1: "",
    city: "",
    postalCode: "",
    country: "PL",
    notes: "",
  });
  
  const [shippingMethod, setShippingMethod] = useState<"COURIER" | "LOCKER">("COURIER");
  const [paymentMethod, setPaymentMethod] = useState<"PAYPAL" | "BLIK">("PAYPAL");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (status === "loading") {
      return <div className="min-h-screen flex items-center justify-center">Ładowanie...</div>;
  }
  
  if (status === "unauthenticated") {
      return null; // Will redirect
  }

  // if (items.length === 0) {
  //    router.push("/cart");
  //    return null;
  // }
  // Removed redirect here to prevent race condition when clearing cart.
  // Instead, handle empty cart in render or let user navigate back manually if they reload.
  // Better yet, only redirect if NOT processing and NOT submitted.
  
  if (items.length === 0 && !isProcessing) {
      // Small delay or check if we just submitted?
      // Actually, createOrder is async.
      // If we are here, and items is empty, and we are NOT processing...
      // It's safe to redirect, BUT if clearCart() happens before push, we are in trouble.
      // Let's just return a message "Koszyk pusty" with link.
      return (
          <div className="min-h-screen flex flex-col items-center justify-center">
              <h1 className="text-2xl font-bold mb-4">Twój koszyk jest pusty</h1>
              <Button onClick={() => router.push('/products')}>Wróć do sklepu</Button>
          </div>
      );
  }

  const subtotal = total();
  const shipping = shippingCost(subtotal);
  const totalAmount = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBlikSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
        const result = await createOrder({
            ...formData,
            shippingMethod,
            paymentMethod,
            items: items.map(i => ({
                productId: i.productId,
                quantity: i.quantity,
                price: i.price,
                name: i.name,
                customDimensions: i.customDimensions,
                customImageUrl: i.customImageUrl
            })),
            shippingCost: shipping,
            total: totalAmount,
            userId: (session?.user as any)?.id
        });

        if (result.success) {
            clearCart();
            router.push(`/checkout/success?orderId=${result.orderId}&method=BLIK`);
        }
    } catch (error) {
        console.error(error);
        alert("Wystąpił błąd podczas składania zamówienia.");
    } finally {
        setIsProcessing(false);
    }
  };

  const handlePayPalApprove = async (data: any, actions: any) => {
      // Deprecated in favor of inline logic in PayPalButtons onApprove
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Kasa / Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Formularz */}
            <div className="space-y-8">
                <Card>
                    <CardHeader><CardTitle>Dane Dostawy</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Imię i Nazwisko</label>
                                <Input name="fullName" value={formData.fullName} onChange={handleInputChange} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Telefon</label>
                                <Input name="phone" value={formData.phone} onChange={handleInputChange} required />
                            </div>
                        </div>
                        <div className="space-y-2">
                             <label className="text-sm font-medium">Email</label>
                             <Input name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Sposób Dostawy</label>
                            <div className="flex gap-4">
                                <button 
                                    type="button"
                                    onClick={() => setShippingMethod("COURIER")}
                                    className={`flex-1 p-4 border rounded-md ${shippingMethod === "COURIER" ? "border-[#D4AF37] bg-yellow-50" : "border-gray-200"}`}
                                >
                                    <div className="font-bold">Kurier</div>
                                    <div className="text-xs text-gray-500">Dostawa do drzwi</div>
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setShippingMethod("LOCKER")}
                                    className={`flex-1 p-4 border rounded-md ${shippingMethod === "LOCKER" ? "border-[#D4AF37] bg-yellow-50" : "border-gray-200"}`}
                                >
                                    <div className="font-bold">Paczkomat</div>
                                    <div className="text-xs text-gray-500">Odbiór w punkcie</div>
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                             <label className="text-sm font-medium">
                                 {shippingMethod === "COURIER" ? "Adres (Ulica i nr)" : "Kod Paczkomatu / Adres Punktu"}
                             </label>
                             <Input name="addressLine1" value={formData.addressLine1} onChange={handleInputChange} required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Kod Pocztowy</label>
                                <Input name="postalCode" value={formData.postalCode} onChange={handleInputChange} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Miasto</label>
                                <Input name="city" value={formData.city} onChange={handleInputChange} required />
                            </div>
                        </div>

                        <div className="space-y-2">
                             <label className="text-sm font-medium">Uwagi do zamówienia (Opcjonalne)</label>
                             <textarea 
                                name="notes" 
                                value={formData.notes} 
                                onChange={handleInputChange}
                                className="flex min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950"
                                placeholder="Np. szczegóły projektu, preferencje..."
                             />
                        </div>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader><CardTitle>Płatność</CardTitle></CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4">
                             <button 
                                type="button"
                                onClick={() => setPaymentMethod("PAYPAL")}
                                className={`p-4 border rounded-md flex items-center justify-between ${paymentMethod === "PAYPAL" ? "border-[#D4AF37] bg-yellow-50" : "border-gray-200"}`}
                            >
                                <span className="font-bold">PayPal / Karta</span>
                            </button>
                            <button 
                                type="button"
                                onClick={() => setPaymentMethod("BLIK")}
                                className={`p-4 border rounded-md flex items-center justify-between ${paymentMethod === "BLIK" ? "border-[#D4AF37] bg-yellow-50" : "border-gray-200"}`}
                            >
                                <span className="font-bold">BLIK</span>
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Podsumowanie */}
            <div>
                <Card className="sticky top-24">
                    <CardHeader><CardTitle>Podsumowanie Zamówienia</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            {items.map(item => (
                                <div key={item.productId} className="flex justify-between text-sm">
                                    <span>{item.name} x {item.quantity}</span>
                                    <span>{(item.price * item.quantity).toFixed(2)} zł</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Wartość koszyka</span>
                                <span>{subtotal.toFixed(2)} zł</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Dostawa</span>
                                <span>{shipping.toFixed(2)} zł</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold pt-2 border-t">
                                <span>Do zapłaty</span>
                                <span>{totalAmount.toFixed(2)} zł</span>
                            </div>
                        </div>

                        <div className="pt-6">
                            <p className="text-xs text-gray-500 mb-4 text-center">
                                W razie jakichkolwiek pytań dotyczących zamówienia, skontaktujemy się z Tobą telefonicznie.
                            </p>
                            {paymentMethod === "BLIK" ? (
                                <Button 
                                    className="w-full h-12 text-lg bg-[#D4AF37] hover:bg-[#B5952F] text-white" 
                                    onClick={handleBlikSubmit}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? "Przetwarzanie..." : "Zamawiam z obowiązkiem zapłaty (BLIK)"}
                                </Button>
                            ) : (
                                <>
                                    <div className="text-center text-sm font-semibold mb-2 text-gray-700">
                                        Klikając poniżej, składasz zamówienie z obowiązkiem zapłaty:
                                    </div>
                                    <PayPalScriptProvider 
                                         options={{ 
                                             clientId: "AdCMpoAZFd7zG_T6S9yQK39AIaLBKUE-Otw_0L6zNa5cOp_65gFYG4IVlAjpsjRkJ-oTuFxHAgVG9BFS",
                                             currency: "PLN",
                                             intent: "capture"
                                         }}
                                     >
                                        <div className="w-full relative z-0">
                                            <PayPalButtons 
                                                className="w-full"
                                                style={{ layout: "vertical", shape: "rect" }}
                                                onError={(err) => {
                                                    console.error("PayPal Error:", err);
                                                    alert("Płatność niezrealizowana. Spróbuj ponownie lub wybierz inną metodę.");
                                                }}
                                                createOrder={async (data, actions) => {
                                                    try {
                                                        const res = await fetch("/api/paypal/orders", {
                                                            method: "POST",
                                                            headers: { "Content-Type": "application/json" },
                                                            body: JSON.stringify({ amount: totalAmount }),
                                                        });
                                                        
                                                        const order = await res.json();
                                                        
                                                        if (order.error || !order.id) {
                                                            console.error("Backend PayPal Error:", order);
                                                            alert("Błąd tworzenia zamówienia: " + (order.error || "Brak ID zamówienia"));
                                                            return "";
                                                        }

                                                        return order.id;
                                                    } catch (err) {
                                                        console.error("Fetch Error:", err);
                                                        alert("Błąd połączenia z serwerem.");
                                                        return "";
                                                    }
                                                }}
                                        onApprove={async (data, actions) => {
                                            try {
                                                // 1. Capture via backend
                                                const res = await fetch(`/api/paypal/orders/${data.orderID}/capture`, {
                                                    method: "POST",
                                                });
                                                const details = await res.json();

                                                // 2. If capture success, create internal order
                                                if (details.status === "COMPLETED") {
                                                    const result = await createOrder({
                                                        ...formData,
                                                        shippingMethod,
                                                        paymentMethod: "PAYPAL",
                                                        items: items.map(i => ({
                                                            productId: i.productId,
                                                            quantity: i.quantity,
                                                            price: i.price,
                                                            name: i.name,
                                                            customDimensions: i.customDimensions,
                                                            customImageUrl: i.customImageUrl
                                                        })),
                                                        shippingCost: shipping,
                                                        total: totalAmount,
                                                        userId: (session?.user as any)?.id
                                                    });
                                                    
                                                    if (result.success) {
                                                        await markOrderAsPaid(result.orderId);
                                                        clearCart();
                                                        router.push(`/checkout/success?orderId=${result.orderId}&method=PAYPAL`);
                                                    }
                                                }
                                            } catch (err) {
                                                console.error(err);
                                                alert("Błąd płatności PayPal");
                                            }
                                        }}
                                    />
                                </div>
                                    </PayPalScriptProvider>
                                </>
                            )}
                            

                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </div>
  );
}
