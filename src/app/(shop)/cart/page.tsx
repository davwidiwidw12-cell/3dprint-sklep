"use client";

import { useCartStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Trash2, Phone, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, total } = useCartStore();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const totalPrice = total();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In real app, send POST to /api/inquiry
    
    setSubmitted(true);
    clearCart();
    setIsSubmitting(false);
  };

  if (submitted) {
      return (
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckIcon className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Dziękujemy za zapytanie!</h1>
              <p className="text-gray-600 max-w-md mb-8">
                  Twoje zamówienie zostało przekazane do realizacji. Skontaktujemy się z Tobą telefonicznie lub mailowo w celu potwierdzenia szczegółów i płatności.
              </p>
              <Link href="/">
                  <Button size="lg">Wróć na stronę główną</Button>
              </Link>
          </div>
      )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Twój koszyk jest pusty</h1>
        <p className="text-gray-500 mb-8">Wygląda na to, że nie dodałeś jeszcze żadnych produktów.</p>
        <Link href="/products">
          <Button size="lg">Przejdź do sklepu</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">Twój Koszyk</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.productId} className="flex flex-col sm:flex-row items-center p-4 gap-4">
                <div className="h-20 w-20 bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-400 flex-shrink-0">
                  IMG
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500">{Number(item.price).toFixed(2)} zł / szt.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Input 
                        type="number" 
                        min="1" 
                        value={item.quantity} 
                        onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                        className="w-20 text-center"
                    />
                    <div className="font-bold w-24 text-right">
                        {(item.price * item.quantity).toFixed(2)} zł
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeItem(item.productId)}>
                        <Trash2 className="w-5 h-5 text-red-500" />
                    </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Podsumowanie</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Razem</span>
                  <span>{totalPrice.toFixed(2)} zł</span>
                </div>
                <p className="text-xs text-gray-500">
                    Koszt dostawy zostanie obliczony w następnym kroku.
                </p>
                <Link href="/checkout">
                    <Button className="w-full h-12 text-lg mt-4 bg-[#D4AF37] hover:bg-[#B5952F] text-white">
                        Przejdź do kasy
                    </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckIcon(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    )
  }
