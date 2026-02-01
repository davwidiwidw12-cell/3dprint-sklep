import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    include: { images: true }
  });

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Nasze Produkty</h1>
          <p className="mt-4 text-xl text-gray-500">Wybierz coś dla siebie z naszej oferty druku 3D.</p>
        </div>

        {products.length === 0 ? (
           <div className="text-center py-20">
               <p className="text-gray-500 text-lg">Brak dostępnych produktów w tej chwili.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`} className="group h-full">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                  <div className="aspect-square bg-gray-100 relative flex items-center justify-center overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                        <img 
                            src={product.images[0].url} 
                            alt={product.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="text-gray-400 font-mono text-xl">IMG</div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#D4AF37] transition-colors mb-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">{product.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-lg font-bold text-gray-900">{Number(product.basePrice).toFixed(2)} zł</span>
                      <Button size="sm" variant="ghost" className="text-[#D4AF37] hover:text-[#B5952F] hover:bg-yellow-50 p-0 h-auto font-medium flex items-center gap-1">
                        Szczegóły <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
