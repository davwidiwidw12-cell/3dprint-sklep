import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Mail, Phone, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Skontaktuj się z nami</h1>
          <p className="mt-4 text-lg text-gray-500">Jesteśmy do Twojej dyspozycji. Napisz lub zadzwoń.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <Card className="border-none shadow-lg">
                <CardContent className="p-8 space-y-6">
                    <h3 className="text-2xl font-bold text-gray-900">Dane Kontaktowe</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center">
                                <Phone className="w-6 h-6 text-[#D4AF37]" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Telefon</p>
                                <a href="tel:+48515083675" className="text-lg font-bold text-gray-900 hover:text-[#D4AF37]">+48 515 083 675</a>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center">
                                <Mail className="w-6 h-6 text-[#D4AF37]" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <a href="mailto:maslana2121@gmail.com" className="text-lg font-bold text-gray-900 hover:text-[#D4AF37]">maslana2121@gmail.com</a>
                            </div>
                        </div>

                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-[#D4AF37]" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Lokalizacja</p>
                                <p className="text-lg font-bold text-gray-900">Bytom, Polska</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="bg-gray-50 p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Michał Kaleta</h3>
                <p className="text-gray-600">
                    Specjalizujemy się w druku 3D najwyższej jakości. Realizujemy zamówienia indywidualne i hurtowe.
                    Masz pomysł? Zrealizujemy go dla Ciebie.
                </p>
            </div>
          </div>

          {/* Form */}
          <Card>
              <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Napisz do nas</h3>
                  <form className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                              <label className="text-sm font-medium">Imię</label>
                              <Input placeholder="Jan" />
                          </div>
                          <div className="space-y-2">
                              <label className="text-sm font-medium">Nazwisko</label>
                              <Input placeholder="Kowalski" />
                          </div>
                      </div>
                      <div className="space-y-2">
                          <label className="text-sm font-medium">Email</label>
                          <Input type="email" placeholder="jan@example.com" />
                      </div>
                      <div className="space-y-2">
                          <label className="text-sm font-medium">Wiadomość</label>
                          <textarea className="flex min-h-[150px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm" placeholder="Treść wiadomości..." />
                      </div>
                      <Button className="w-full h-12 bg-[#D4AF37] hover:bg-[#B5952F] text-white">Wyślij wiadomość</Button>
                  </form>
              </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
