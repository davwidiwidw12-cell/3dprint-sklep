import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { createProduct, updateProduct, deleteProduct } from "@/lib/admin-actions";

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      // category: true,
      pricing: true,
      images: true, // Include images to show preview
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Produkty</h1>
          <p className="text-gray-500 mt-1">Zarządzaj ofertą sklepu.</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> Dodaj Produkt
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="flex items-center p-6 gap-6">
              <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-400 font-mono overflow-hidden">
                 {product.images && product.images.length > 0 ? (
                    <img src={product.images[0].url} alt="" className="w-full h-full object-cover" />
                 ) : (
                    "IMG"
                 )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-lg text-gray-900">{product.name}</h3>
                  {/* <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {product.category.name}
                  </span> */}
                  {!product.isActive && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Ukryty
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Cena bazowa: {Number(product.basePrice).toFixed(2)} zł
                  {product.pricing.length > 0 && ` • Rabaty: ${product.pricing.length} progi`}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/admin/products/${product.id}`}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Pencil className="w-4 h-4" /> Edytuj
                  </Button>
                </Link>
                <form action={deleteProduct.bind(null, product.id)}>
                    <Button variant="destructive" size="sm" className="gap-2">
                        <Trash2 className="w-4 h-4" /> Usuń
                    </Button>
                </form>
              </div>
            </div>
          </Card>
        ))}
        {products.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Brak produktów. Dodaj pierwszy produkt.
          </div>
        )}
      </div>
    </div>
  );
}
