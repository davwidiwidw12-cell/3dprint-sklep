import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { updateOrderStatus, approveBlikPayment } from "@/lib/admin-actions";
import { deleteOrder } from "@/lib/orders"; 
import { ArrowLeft, Truck, Check, Trash2 } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { DeleteOrderButton } from "@/components/admin/DeleteOrderButton";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const order = await prisma.order.findUnique({
        where: { id },
        include: { items: true }
    });

    if (!order) notFound();

    return (
        <div className="space-y-6">
            <Link href="/admin/orders">
                <Button variant="ghost" className="gap-2">
                    <ArrowLeft className="w-4 h-4" /> Wróć do listy
                </Button>
            </Link>

            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Zamówienie #{order.id.slice(-8)}</h1>
                <div className="flex gap-2">
                    {order.status === "PENDING" && order.paymentMethod === "BLIK" && (
                         <form action={approveBlikPayment.bind(null, order.id)}>
                            <Button className="bg-green-600 hover:bg-green-700 text-white gap-2">
                                <Check className="w-4 h-4" /> Zatwierdź BLIK
                            </Button>
                        </form>
                    )}
                    <DeleteOrderButton orderId={order.id} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle>Dane Klienta</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                        <p><span className="font-semibold">Imię i nazwisko:</span> {order.fullName}</p>
                        <p><span className="font-semibold">Email:</span> {order.email}</p>
                        <p><span className="font-semibold">Telefon:</span> {order.phone}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Adres Dostawy</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                        <p>{order.addressLine1}</p>
                        <p>{order.postalCode} {order.city}</p>
                        <p>{order.country}</p>
                        <p className="mt-2 text-sm text-gray-500">Metoda: {order.shippingMethod}</p>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader><CardTitle>Pozycje Zamówienia</CardTitle></CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {order.items.map(item => (
                                <div key={item.id} className="border-b pb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium">{item.name} x {item.quantity}</span>
                                        <span>{Number(item.price).toFixed(2)} zł</span>
                                    </div>
                                    
                                    {/* Custom details */}
                                    {(item.customDimensions || item.customImageUrl) && (
                                        <div className="bg-gray-50 p-3 rounded-md text-sm space-y-2">
                                            {item.customDimensions && (
                                                <p><span className="font-semibold text-gray-600">Wymiary:</span> {item.customDimensions}</p>
                                            )}
                                            {item.customImageUrl && (
                                                <div>
                                                    <p className="font-semibold text-gray-600 mb-1">Projekt/Grafika:</p>
                                                    <a href={item.customImageUrl} target="_blank" rel="noopener noreferrer" className="block w-fit">
                                                        <img src={item.customImageUrl} alt="Projekt" className="h-32 object-contain border rounded bg-white hover:opacity-90 transition-opacity" />
                                                    </a>
                                                    <a href={item.customImageUrl} download className="text-blue-600 hover:underline text-xs mt-1 block">
                                                        Pobierz plik
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div className="flex justify-between font-bold pt-2">
                                <span>Suma</span>
                                <span>{Number(order.total).toFixed(2)} zł</span>
                            </div>
                            
                            {order.notes && (
                                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                                    <h4 className="font-semibold text-yellow-800 mb-1">Uwagi od klienta:</h4>
                                    <p className="text-sm text-yellow-900 whitespace-pre-wrap">{order.notes}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
                
                 <Card className="md:col-span-2">
                    <CardHeader><CardTitle>Zarządzanie Statusem</CardTitle></CardHeader>
                    <CardContent>
                            <StatusButtons orderId={order.id} currentStatus={order.status} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatusButtons({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
    const statuses = [
        { value: "PENDING", label: "Oczekuje" },
        { value: "PAID", label: "Opłacone" },
        { value: "PROCESSING", label: "Wykonywane" },
        { value: "COMPLETED", label: "Zrobione" },
        { value: "READY_TO_SHIP", label: "Gotowe do wysyłki" },
        { value: "SHIPPED", label: "Wysłane" },
        { value: "CANCELLED", label: "Anulowane" },
    ];

    return (
         <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
                {statuses.map((status) => (
                     <form key={status.value} action={async () => {
                        "use server";
                        await updateOrderStatus(orderId, status.value, undefined);
                     }}>
                        <Button 
                            type="submit" 
                            variant={currentStatus === status.value ? "default" : "outline"}
                            className={`
                                ${currentStatus === status.value ? "ring-2 ring-offset-2 ring-black" : ""}
                                ${status.value === "CANCELLED" ? "hover:bg-red-50 hover:text-red-600 hover:border-red-200" : ""}
                                ${status.value === "PAID" ? "hover:bg-green-50 hover:text-green-600 hover:border-green-200" : ""}
                            `}
                        >
                            {status.label}
                        </Button>
                    </form>
                ))}
            </div>

            {/* Tracking input only shows if SHIPPED is active or we want to add it separately. 
                Let's make it a separate small form below buttons */}
            <form action={async (formData) => {
                 "use server";
                 const tracking = formData.get("tracking") as string;
                 // Keep current status, just update tracking
                 await updateOrderStatus(orderId, currentStatus, tracking);
             }} className="flex gap-2 items-end pt-4 border-t">
                 <div className="w-full">
                     <label className="text-xs text-gray-500 mb-1 block">Numer przesyłki</label>
                     <input 
                         name="tracking"
                         className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm" 
                         placeholder="Wpisz numer..."
                     />
                 </div>
                 <Button type="submit" variant="outline">Zapisz Nr</Button>
            </form>
         </div>
    );
}
