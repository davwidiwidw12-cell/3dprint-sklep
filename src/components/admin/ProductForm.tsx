"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/lib/admin-actions";
import { Trash2, Plus, Wand2, Loader2 } from "lucide-react";
import { removeBackground } from "@imgly/background-removal";

// Product validation schema
const ProductSchema = z.object({
  name: z.string().min(2, "Nazwa wymagana"),
  description: z.string().min(10, "Opis wymagany"),
  basePrice: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  minOrderQuantity: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  isActive: z.boolean().default(true),
  hasMount: z.boolean().default(false),
  isLarge: z.boolean().default(false),
});

type ProductFormValues = {
  name: string;
  description: string;
  basePrice: string | number;
  minOrderQuantity: string | number;
  isActive: boolean;
  hasMount: boolean;
  isLarge: boolean;
};

interface ProductFormProps {
  // categories: { id: string; name: string; slug: string }[];
  initialData?: any; // Product with pricing
}

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Pricing tiers state
  const [pricingTiers, setPricingTiers] = useState<{ minQuantity: number; price: number }[]>(
    initialData?.pricing || []
  );

  // Images state
  const [existingImages, setExistingImages] = useState<{ id: string; url: string }[]>(
      initialData?.images || []
  );
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [processingImage, setProcessingImage] = useState<number | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedImages((prev) => [...prev, ...files]);

      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveBackground = async (index: number) => {
      setProcessingImage(index);
      try {
          const imageFile = selectedImages[index];
          // Use public path for wasm/onnx assets if needed, but imgly usually fetches from CDN by default
           // or we can configure it. Default CDN is fine for now.
           const blob = await removeBackground(imageFile);
           
           const processedFile = new File([blob], `removed-bg-${imageFile.name}.png`, { type: "image/png" });
          
          // Update state
          const newImages = [...selectedImages];
          newImages[index] = processedFile;
          setSelectedImages(newImages);
          
          const newPreviews = [...previewUrls];
          URL.revokeObjectURL(newPreviews[index]); // cleanup old
          newPreviews[index] = URL.createObjectURL(processedFile);
          setPreviewUrls(newPreviews);
          
      } catch (err) {
          console.error("Background removal failed:", err);
          alert("Nie udało się usunąć tła. Spróbuj innego zdjęcia.");
      } finally {
          setProcessingImage(null);
      }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => {
      // Revoke old URL to avoid memory leak
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeExistingImage = (imageId: string) => {
      setExistingImages(prev => prev.filter(img => img.id !== imageId));
      setImagesToDelete(prev => [...prev, imageId]);
  };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductSchema) as any,
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      basePrice: initialData?.basePrice ? Number(initialData.basePrice) : 0,
      minOrderQuantity: initialData?.minOrderQuantity ? Number(initialData.minOrderQuantity) : 1,
      isActive: initialData?.isActive ?? true,
      hasMount: initialData?.hasMount ?? false,
      isLarge: initialData?.isLarge ?? false,
    },
  });

  const { setValue, watch } = form;
  const hasMount = watch("hasMount");
  const isLarge = watch("isLarge");

  const onSubmit = async (data: ProductFormValues) => {
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("basePrice", data.basePrice.toString());
      // formData.append("categoryId", data.categoryId);
      formData.append("minOrderQuantity", data.minOrderQuantity.toString());
      formData.append("isActive", data.isActive ? "on" : "off");
      
      // Attributes
      if (data.hasMount) formData.append("hasMount", "on");
      if (data.isLarge) formData.append("isLarge", "on");

      // Pricing Tiers
      formData.append("pricingTiers", JSON.stringify(pricingTiers));

      // Images
      selectedImages.forEach((file) => {
        formData.append("images", file);
      });
      
      if (imagesToDelete.length > 0) {
          formData.append("deletedImageIds", JSON.stringify(imagesToDelete));
      }

      if (initialData) {
        await updateProduct(initialData.id, formData);
      } else {
        await createProduct(formData);
      }
      
      router.push("/admin/products");
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const addPricingTier = () => {
    setPricingTiers([...pricingTiers, { minQuantity: 0, price: 0 }]);
  };

  const removePricingTier = (index: number) => {
    setPricingTiers(pricingTiers.filter((_, i) => i !== index));
  };

  const updatePricingTier = (index: number, field: 'minQuantity' | 'price', value: string) => {
    const newTiers = [...pricingTiers];
    newTiers[index] = { ...newTiers[index], [field]: Number(value) };
    setPricingTiers(newTiers);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl bg-white p-8 rounded-lg shadow-sm border">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nazwa Produktu</label>
          <Input {...form.register("name")} placeholder="Np. Brelok Serce" />
          {form.formState.errors.name && <p className="text-red-500 text-xs">{form.formState.errors.name.message}</p>}
        </div>

        {/* Category removed */}
        
        <div className="space-y-4 border p-4 rounded-md bg-gray-50">
            <h4 className="font-semibold text-sm">Cechy Produktu</h4>
            
            <div className="flex items-center gap-2">
                <input type="checkbox" id="hasMount" {...form.register("hasMount")} className="w-4 h-4" />
                <label htmlFor="hasMount" className="text-sm">Posiada mocowanie/oczko (Brelok)</label>
            </div>

            <div className="flex items-center gap-2">
                <input type="checkbox" id="isLarge" {...form.register("isLarge")} className="w-4 h-4" />
                <label htmlFor="isLarge" className="text-sm">Jest duży / Wolnostojący (Serce)</label>
            </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Zdjęcia Produktu</label>
          <div className="grid grid-cols-4 gap-4 mb-2">
            {/* Existing Images */}
            {existingImages.map((img) => (
                <div key={img.id} className="relative aspect-square border rounded-md overflow-hidden bg-gray-50">
                    <img src={img.url} alt="Existing" className="w-full h-full object-cover" />
                    <button
                        type="button"
                        onClick={() => removeExistingImage(img.id)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition-colors"
                        title="Usuń zdjęcie"
                    >
                        <Trash2 className="w-3 h-3" />
                    </button>
                </div>
            ))}
            
            {/* New Images */}
            {previewUrls.map((url, index) => (
              <div key={index} className="relative aspect-square border rounded-md overflow-hidden">
                <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                <div className="absolute top-1 right-1 flex gap-1">
                    <button
                        type="button"
                        onClick={() => handleRemoveBackground(index)}
                        disabled={processingImage === index}
                        className="bg-white/90 text-gray-700 p-1 rounded-full shadow-md hover:bg-blue-50 transition-colors disabled:opacity-50"
                        title="Usuń tło (AI)"
                    >
                        {processingImage === index ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                    </button>
                    <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition-colors"
                        title="Usuń zdjęcie"
                    >
                        <Trash2 className="w-3 h-3" />
                    </button>
                </div>
              </div>
            ))}
            <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-md aspect-square cursor-pointer hover:bg-gray-50 transition-colors">
              <Plus className="w-8 h-8 text-gray-400" />
              <span className="text-xs text-gray-500 mt-2">Dodaj</span>
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageChange} 
              />
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Opis</label>
          <textarea 
            {...form.register("description")}
            className="flex min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Opis produktu..."
          />
           {form.formState.errors.description && <p className="text-red-500 text-xs">{form.formState.errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Cena Bazowa (zł)</label>
                <Input type="number" step="0.01" {...form.register("basePrice")} />
                 {form.formState.errors.basePrice && <p className="text-red-500 text-xs">{form.formState.errors.basePrice.message}</p>}
            </div>
             <div className="space-y-2">
                <label className="text-sm font-medium">Min. Ilość Zamówienia</label>
                <Input type="number" {...form.register("minOrderQuantity")} />
            </div>
        </div>

        <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-medium">Progi Rabatowe (Opcjonalne)</label>
                <Button type="button" variant="outline" size="sm" onClick={addPricingTier} className="gap-2">
                    <Plus className="w-4 h-4" /> Dodaj Próg
                </Button>
            </div>
            
            {pricingTiers.length === 0 && <p className="text-sm text-gray-500 italic">Brak progów rabatowych.</p>}

            <div className="space-y-3">
                {pricingTiers.map((tier, index) => (
                    <div key={index} className="flex gap-4 items-end">
                        <div className="flex-1 space-y-1">
                             <label className="text-xs text-gray-500">Od ilości (szt.)</label>
                             <Input 
                                type="number" 
                                value={tier.minQuantity} 
                                onChange={(e) => updatePricingTier(index, 'minQuantity', e.target.value)} 
                             />
                        </div>
                        <div className="flex-1 space-y-1">
                             <label className="text-xs text-gray-500">Cena jednostkowa (zł)</label>
                             <Input 
                                type="number" 
                                step="0.01"
                                value={tier.price} 
                                onChange={(e) => updatePricingTier(index, 'price', e.target.value)} 
                             />
                        </div>
                        <Button type="button" variant="destructive" size="icon" onClick={() => removePricingTier(index)}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
        
        <div className="flex items-center gap-2 pt-4">
            <input type="checkbox" id="isActive" {...form.register("isActive")} className="w-4 h-4" />
            <label htmlFor="isActive" className="text-sm font-medium">Produkt Aktywny (widoczny w sklepie)</label>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>Anuluj</Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Zapisywanie..." : (initialData ? "Zapisz Zmiany" : "Utwórz Produkt")}
          </Button>
      </div>
    </form>
  );
}
