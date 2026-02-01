import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({
    where: { isActive: true },
    take: 3,
    orderBy: { createdAt: 'desc' },
    include: { images: true }
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent z-10"></div>
        {/* Background image - Place hero-bg.jpg in public folder */}
        <div className="absolute inset-0 opacity-30 bg-[url('/hero-bg.jpg')] bg-cover bg-center"></div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-48">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Precyzja w każdym detalu. <br/>
              <span className="text-[#D4AF37]">Twój świat w 3D.</span>
            </h1>
            <p className="text-lg text-gray-300">
              Oferujemy najwyższej jakości wydruki 3D, wizytówki NFC oraz unikalne prezenty. 
              Nowoczesny design i personalizacja.
            </p>
            <div className="flex gap-4">
              <Link href="/products">
                <Button size="lg" className="bg-[#D4AF37] hover:bg-[#B5952F] text-white border-none">
                  Zobacz ofertę <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="text-black border-white hover:bg-white hover:text-gray-900">
                  Kontakt
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Wyróżnione Produkty</h2>
            <p className="mt-4 text-gray-500">Odkryj nasze bestsellery i nowości.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`} className="group">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="aspect-square bg-gray-100 relative flex items-center justify-center overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                        <img 
                            src={product.images[0].url} 
                            alt={product.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="text-gray-400 font-mono text-xl">PRODUKT 3D</div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#D4AF37] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{product.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">{Number(product.basePrice).toFixed(2)} zł</span>
                      <span className="text-sm text-[#D4AF37] font-medium flex items-center gap-1">
                        Szczegóły <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
