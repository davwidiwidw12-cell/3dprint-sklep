import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProfileTabs } from "@/components/profile/ProfileTabs";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
      redirect("/auth/signin?callbackUrl=/profile");
  }

  const rawOrders = await prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      include: { items: true }
  });

  // Serialize dates for client component
  const orders = rawOrders.map(order => ({
      ...order,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      subtotal: Number(order.subtotal),
      shippingCost: Number(order.shippingCost),
      total: Number(order.total),
      items: order.items.map(item => ({
          ...item,
          price: Number(item.price)
      }))
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Witaj, {session.user.name}</h1>
            <p className="text-gray-500 mb-8">Zarządzaj swoim kontem i sprawdzaj zamówienia.</p>

            <ProfileTabs user={session.user} orders={orders} />
        </div>
    </div>
  );
}
