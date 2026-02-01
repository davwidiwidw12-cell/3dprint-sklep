"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { CheckCircle, Phone } from "lucide-react";
import { Suspense } from "react";

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");
    const method = searchParams.get("method");

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center space-y-6">
                <div className="flex justify-center">
                    <CheckCircle className="w-16 h-16 text-green-500" />
                </div>
                
                <h1 className="text-2xl font-bold text-gray-900">Dziękujemy za zamówienie!</h1>
                
                <div className="space-y-2 text-gray-600">
                    <p>Twoje zamówienie zostało przyjęte do realizacji.</p>
                    <p className="font-mono text-sm bg-gray-100 py-1 px-3 rounded inline-block">
                        #{orderId ? orderId.slice(-8) : "..."}
                    </p>
                </div>

                {method === "BLIK" && (
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md text-left space-y-3">
                        <h3 className="font-semibold text-yellow-800 flex items-center gap-2">
                            <Phone className="w-4 h-4" /> Instrukcja płatności BLIK
                        </h3>
                        <p className="text-sm text-yellow-900">
                            Aby sfinalizować zamówienie, wykonaj przelew na telefon BLIK:
                        </p>
                        <div className="bg-gray-100 p-4 rounded-md text-center">
                            <p className="text-gray-500 text-xs">Numer telefonu</p>
                             <p className="text-lg font-bold text-gray-900 tracking-wider mt-1">+48 515 083 675</p>
                            <p className="text-gray-500 text-xs mt-2">Odbiorca: Michał Kaleta</p>
                        </div>
                        <div className="text-xs text-yellow-800">
                            <p>W tytule przelewu wpisz: <strong>Zamówienie {orderId?.slice(-8)}</strong></p>
                            <p className="mt-2">
                                Po zaksięgowaniu wpłaty, administrator musi <strong>ręcznie zaakceptować</strong> płatność, aby status zmienił się na "Opłacone".
                                Dopiero po potwierdzeniu wpłaty zamówienie zostanie <strong>przyjęte do realizacji</strong>.
                            </p>
                        </div>
                    </div>
                )}

                <div className="pt-4">
                    <Link href="/">
                        <Button className="w-full">Wróć do sklepu</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Ładowanie...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
