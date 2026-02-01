"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import Link from "next/link";
import { changePassword, changeEmail } from "@/lib/user-actions";
import { Package, Settings, Lock, Mail, User } from "lucide-react";

interface ProfileTabsProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
  orders: any[];
}

export function ProfileTabs({ user, orders }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<"orders" | "settings">("orders");

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 space-y-2">
        <Button 
            variant={activeTab === "orders" ? "default" : "ghost"} 
            className="w-full justify-start gap-2"
            onClick={() => setActiveTab("orders")}
        >
            <Package className="w-4 h-4" /> Zamówienia
        </Button>
        <Button 
            variant={activeTab === "settings" ? "default" : "ghost"} 
            className="w-full justify-start gap-2"
            onClick={() => setActiveTab("settings")}
        >
            <Settings className="w-4 h-4" /> Ustawienia
        </Button>
      </div>

      {/* Content Area */}
      <div className="flex-1">
        {activeTab === "orders" && <OrdersList orders={orders} />}
        {activeTab === "settings" && <SettingsForm user={user} />}
      </div>
    </div>
  );
}

function OrdersList({ orders }: { orders: any[] }) {
    if (orders.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">Nie masz jeszcze żadnych zamówień.</p>
                <Link href="/products" className="mt-4 inline-block">
                    <Button>Rozpocznij zakupy</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Twoje Zamówienia</h2>
            {orders.map((order) => (
                <Card key={order.id}>
                    <CardHeader className="bg-gray-50/50 border-b pb-4">
                        <div className="flex flex-wrap gap-4 justify-between items-center">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Data</p>
                                <p className="text-sm text-gray-900">{format(new Date(order.createdAt), "dd MMM yyyy", { locale: pl })}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Suma</p>
                                <p className="text-sm font-bold text-gray-900">{Number(order.total).toFixed(2)} zł</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Status</p>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    order.status === 'PAID' ? 'bg-green-100 text-green-800' :
                                    order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                    {order.status === 'PENDING' ? 'Oczekuje' : 
                                     order.status === 'PAID' ? 'Opłacone' : 
                                     order.status === 'SHIPPED' ? 'Wysłane' : order.status}
                                </span>
                            </div>
                            <div className="text-right">
                                    <p className="text-sm font-medium text-gray-500">Nr zamówienia</p>
                                    <p className="text-sm font-mono text-gray-900">#{order.id.slice(-8)}</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                            <div className="space-y-4">
                            {order.items.map((item: any) => (
                                <div key={item.id} className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-400">IMG</div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                                            <p className="text-xs text-gray-500">Ilość: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">{Number(item.price).toFixed(2)} zł</p>
                                </div>
                            ))}
                            </div>
                            
                            {order.trackingNumber && (
                                <div className="mt-4 pt-4 border-t">
                                     <p className="text-sm text-blue-600 font-medium">Tracking: {order.trackingNumber}</p>
                                </div>
                            )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

function SettingsForm({ user }: { user: { email?: string | null } }) {
    const [passLoading, setPassLoading] = useState(false);
    const [passMessage, setPassMessage] = useState("");
    
    const [emailLoading, setEmailLoading] = useState(false);
    const [emailMessage, setEmailMessage] = useState("");

    const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPassLoading(true);
        setPassMessage("");
        const formData = new FormData(e.currentTarget);
        const currentPassword = formData.get("currentPassword") as string;
        const newPassword = formData.get("newPassword") as string;

        const res = await changePassword({ currentPassword, newPassword });
        setPassLoading(false);
        if (res.error) {
            setPassMessage(`Błąd: ${res.error}`);
        } else {
            setPassMessage("Hasło zostało zmienione.");
            (e.target as HTMLFormElement).reset();
        }
    };

    const handleEmailChange = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setEmailLoading(true);
        setEmailMessage("");
        const formData = new FormData(e.currentTarget);
        const newEmail = formData.get("newEmail") as string;
        const password = formData.get("password") as string;

        const res = await changeEmail({ newEmail, password });
        setEmailLoading(false);
        if (res.error) {
            setEmailMessage(`Błąd: ${res.error}`);
        } else {
            setEmailMessage("Email został zmieniony.");
            (e.target as HTMLFormElement).reset();
        }
    };

    return (
        <div className="space-y-8">
            <h2 className="text-xl font-semibold text-gray-900">Ustawienia Konta</h2>
            
            <Card>
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Lock className="w-4 h-4"/> Zmiana Hasła</CardTitle></CardHeader>
                <CardContent>
                    <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                        {passMessage && <p className={`text-sm ${passMessage.startsWith("Błąd") ? "text-red-600" : "text-green-600"}`}>{passMessage}</p>}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Obecne hasło</label>
                            <Input name="currentPassword" type="password" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nowe hasło</label>
                            <Input name="newPassword" type="password" minLength={6} required />
                        </div>
                        <Button type="submit" disabled={passLoading}>
                            {passLoading ? "Zapisywanie..." : "Zmień hasło"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Mail className="w-4 h-4"/> Zmiana Emaila</CardTitle></CardHeader>
                <CardContent>
                    <div className="mb-4 text-sm text-gray-500">Obecny email: <span className="font-medium text-gray-900">{user.email}</span></div>
                    <form onSubmit={handleEmailChange} className="space-y-4 max-w-md">
                        {emailMessage && <p className={`text-sm ${emailMessage.startsWith("Błąd") ? "text-red-600" : "text-green-600"}`}>{emailMessage}</p>}
                         <div className="space-y-2">
                            <label className="text-sm font-medium">Nowy adres email</label>
                            <Input name="newEmail" type="email" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Potwierdź hasłem</label>
                            <Input name="password" type="password" required />
                        </div>
                        <Button type="submit" disabled={emailLoading}>
                            {emailLoading ? "Zapisywanie..." : "Zmień email"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
