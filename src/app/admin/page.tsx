import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Plus, Package, ShoppingCart, DollarSign } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const productsCount = await prisma.product.count();
  const ordersCount = await prisma.order.count();
  const revenueAggregate = await prisma.order.aggregate({
      _sum: { total: true },
      where: { status: 'PAID' }
  });
  const totalRevenue = Number(revenueAggregate._sum.total || 0);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
           <p className="text-gray-500 mt-1">Witaj w panelu zarządzania sklepem 3dprint.</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> Dodaj Produkt
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Przychody</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{totalRevenue.toFixed(2)} zł</div>
            <p className="text-xs text-gray-500 mt-1">Suma opłaconych zamówień</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Zamówienia</CardTitle>
             <ShoppingCart className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{ordersCount}</div>
            <p className="text-xs text-gray-500 mt-1">Wszystkie zamówienia</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Produkty</CardTitle>
            <Package className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{productsCount}</div>
            <p className="text-xs text-gray-500 mt-1">Aktywnych w ofercie</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
