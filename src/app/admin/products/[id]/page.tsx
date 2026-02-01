import { ProductForm } from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: PageProps) {
  // Await params for Next.js 15+ compatibility, though 14 works directly
  const { id } = await Promise.resolve(params);

  const product = await prisma.product.findUnique({
    where: { id },
    include: { 
        pricing: true,
        images: true
    }
  });
  
  // const categories = await prisma.category.findMany();

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edytuj Produkt</h1>
        <p className="text-gray-500">Edycja produktu: {product.name}</p>
      </div>
      <ProductForm initialData={product} />
    </div>
  );
}
