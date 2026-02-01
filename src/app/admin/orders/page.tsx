import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
// import { Badge } from "@/components/ui/Badge"; 
import Link from "next/link";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

// Helper for status badge (inline since no Badge component yet)
function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
        PENDING: "bg-yellow-100 text-yellow-800",
        PAID: "bg-green-100 text-green-800",
        SHIPPED: "bg-blue-100 text-blue-800",
        CANCELLED: "bg-red-100 text-red-800",
    };
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${colors[status] || "bg-gray-100"}`}>
            {status}
        </span>
    );
}

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { items: true }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Zamówienia</h1>
        <p className="text-gray-500 mt-1">Zarządzaj zamówieniami klientów.</p>
      </div>

      <div className="space-y-4">
          {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                  <div className="p-6">
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                          <div>
                              <div className="flex items-center gap-2">
                                  <h3 className="font-bold text-lg">#{order.id.slice(-8)}</h3>
                                  <StatusBadge status={order.status} />
                                  <span className="text-sm text-gray-500">
                                      {format(order.createdAt, "dd MMM yyyy, HH:mm", { locale: pl })}
                                  </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                  {order.fullName} ({order.email})
                              </p>
                          </div>
                          <div className="text-right">
                              <div className="font-bold text-xl">{Number(order.total).toFixed(2)} zł</div>
                              <div className="text-sm text-gray-500">{order.paymentMethod}</div>
                          </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-md mb-4 text-sm">
                          <p><strong>Adres:</strong> {order.addressLine1}, {order.postalCode} {order.city}</p>
                          <p><strong>Metoda:</strong> {order.shippingMethod}</p>
                          {order.trackingNumber && <p><strong>Tracking:</strong> {order.trackingNumber}</p>}
                      </div>

                      <div className="flex items-center gap-2 justify-end">
                          <Link href={`/admin/orders/${order.id}`}>
                              <Button variant="outline" size="sm">Szczegóły</Button>
                          </Link>
                          {order.status === "PENDING" && order.paymentMethod === "BLIK" && (
                              <form action={async () => {
                                  "use server";
                                  // This should be in a separate action file but inline for speed in MVP
                                  /* 
                                    Need to import { markOrderAsPaid } from "@/lib/orders" 
                                    but importing server action in server component is fine if it's just a function call, 
                                    but for form action it needs to be passed.
                                    Better to use a client component for actions or a separate server action file import.
                                  */
                              }}>
                                  {/* Placeholder for action button */}
                              </form>
                          )}
                      </div>
                  </div>
              </Card>
          ))}
          {orders.length === 0 && <p className="text-gray-500 text-center py-12">Brak zamówień.</p>}
      </div>
    </div>
  );
}
