import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductDetails } from "@/components/shop/ProductDetails";
import { ProductImageGallery } from "@/components/shop/ProductImageGallery";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await Promise.resolve(params);

  const product = await prisma.product.findUnique({
    where: { id },
    include: { 
        images: true,
        pricing: { orderBy: { minQuantity: 'asc' } } 
    }
  });

  if (!product) {
    notFound();
  }

  // Convert Decimals to numbers for client component
  const productJson = {
      ...product,
      basePrice: Number(product.basePrice),
      pricing: product.pricing.map(p => ({
          minQuantity: p.minQuantity,
          price: Number(p.price)
      }))
  };

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/products" className="inline-block mb-8">
            <Button variant="ghost" size="sm" className="gap-2 text-gray-500 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4" /> Wróć do oferty
            </Button>
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Image Section - Carousel */}
            <ProductImageGallery 
                images={product.images} 
                productName={product.name}
                hasMount={product.hasMount}
            />

            {/* Details Section */}
            <ProductDetails product={productJson} />
        </div>
      </div>
    </div>
  );
}
