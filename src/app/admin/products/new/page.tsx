import { ProductForm } from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";

export default async function NewProductPage() {
  // const categories = await prisma.category.findMany();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dodaj Nowy Produkt</h1>
        <p className="text-gray-500">Wypełnij formularz, aby dodać produkt do oferty.</p>
      </div>
      <ProductForm />
    </div>
  );
}
