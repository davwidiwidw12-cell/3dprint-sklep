"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/store";
import { ShoppingCart, Check, Upload, X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import toast from "react-hot-toast";

interface PricingTier {
  minQuantity: number;
  price: number;
}

interface ProductDetailsProps {
  product: {
    id: string;
    name: string;
    basePrice: number;
    slug: string;
    description: string;
    hasMount: boolean;
    isLarge: boolean;
    pricing: PricingTier[];
  };
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  
  // Customization State
  const [dimensions, setDimensions] = useState("");
  const [customFile, setCustomFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const shippingCostCalc = useCartStore((state) => state.shippingCost);

  // Calculate price based on quantity
  const getCurrentPrice = (qty: number) => {
    if (!product.pricing || product.pricing.length === 0) return product.basePrice;
    
    // Sort tiers descending by quantity
    const sortedTiers = [...product.pricing].sort((a, b) => b.minQuantity - a.minQuantity);
    const tier = sortedTiers.find((t) => qty >= t.minQuantity);
    
    return tier ? tier.price : product.basePrice;
  };

  const currentPrice = getCurrentPrice(quantity);
  const totalPrice = currentPrice * quantity;

  const handleAddToCart = async () => {
    if (product.hasMount && quantity > 10) {
      return
    }

    // Validation: Customization is mandatory unless it's a "Mount" (Serce) type product
    if (!product.hasMount) {
        if (!dimensions) {
            toast.error("Proszę podać wymiary");
            return;
        }
        if (!customFile) {
            toast.error("Proszę dodać plik z grafiką");
            return;
        }
    }

    let uploadedUrl = undefined;

    // Handle Upload
    if (customFile) {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", customFile);
            
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData
            });

            if (!res.ok) throw new Error("Upload failed");
            
            const data = await res.json();
            uploadedUrl = data.url;
        } catch (error) {
            console.error(error);
            toast.error("Błąd wysyłania pliku");
            setUploading(false);
            return;
        } finally {
            setUploading(false);
        }
    }

    addItem({
      id: product.id, 
      productId: product.id,
      name: product.name,
      price: currentPrice, 
      quantity: quantity,
      slug: product.slug,
      hasMount: product.hasMount,
      customDimensions: dimensions || undefined,
      customImageUrl: uploadedUrl
    });
    setAdded(true);
    toast.success("Dodano do koszyka");
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
        <div className="text-2xl font-bold text-[#D4AF37] mt-2">
          {Number(currentPrice).toFixed(2)} zł <span className="text-sm text-gray-500 font-normal">/ szt.</span>
        </div>
        {product.pricing.length > 0 && (
           <p className="text-xs text-green-600 mt-1 font-medium">
               Dostępne rabaty ilościowe! Zamów więcej, zapłać mniej.
           </p>
        )}
      </div>

      <div className="prose prose-sm text-gray-600">
        <p>{product.description}</p>
      </div>
      
      {/* Pricing Tiers Table */}
      {product.pricing.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="text-sm font-semibold mb-2">Cennik hurtowy:</h4>
              <ul className="text-sm space-y-1">
                  <li className="flex justify-between text-gray-500">
                      <span>1 - {product.pricing[0].minQuantity - 1} szt.</span>
                      <span>{Number(product.basePrice).toFixed(2)} zł</span>
                  </li>
                  {product.pricing.map((tier) => (
                      <li key={tier.minQuantity} className={`flex justify-between ${quantity >= tier.minQuantity ? 'text-[#D4AF37] font-bold' : 'text-gray-500'}`}>
                          <span>{tier.minQuantity}+ szt.</span>
                          <span>{Number(tier.price).toFixed(2)} zł</span>
                      </li>
                  ))}
              </ul>
          </div>
      )}

      {/* Customization Fields - Show only if NOT hasMount (Serce) or keep optional? 
          User said: "przy sercu nei trzeba" -> implies for others it IS needed. 
          Maybe hide them for "hasMount" or keep optional? 
          "personalizaja czyli wymiary i zdjecia nie opjonalnie tylko trzeba ddoac a przy sercu nei trzeba"
          It suggests for Heart it is NOT needed (maybe not even shown or optional). 
          Let's assume for Heart it is hidden or optional. Let's make it optional/hidden logic.
          If hasMount -> Optional (or hide if irrelevant). If !hasMount -> Required.
      */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
          <h4 className="font-semibold text-gray-800 text-sm">
              Personalizacja {product.hasMount ? "(opcjonalne)" : <span className="text-red-500">* (wymagane)</span>}
          </h4>
          
          {/* Dimensions */}
          <div>
              <label className="text-xs text-gray-500 mb-1 block">
                  Wymiary (np. 10x15 cm) / Uwagi {product.hasMount ? "" : "*"}
              </label>
              <Input 
                  placeholder="Podaj wymiary lub dodatkowe uwagi..."
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  className={`bg-gray-50 ${!product.hasMount && !dimensions ? "border-red-200" : ""}`}
              />
          </div>

          {/* File Upload */}
          <div>
              <label className="text-xs text-gray-500 mb-1 block">
                  Grafika / Projekt {product.hasMount ? "" : "*"}
              </label>
              {!customFile ? (
                  <div className={`border-2 border-dashed rounded-md p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer relative
                      ${!product.hasMount ? "border-red-200 bg-red-50/10" : "border-gray-300"}
                  `}>
                      <input 
                          type="file" 
                          accept="image/*,.pdf,.ai,.svg" 
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => e.target.files && setCustomFile(e.target.files[0])}
                      />
                      <Upload className={`w-6 h-6 mx-auto mb-2 ${!product.hasMount ? "text-red-400" : "text-gray-400"}`} />
                      <p className="text-sm text-gray-600">Kliknij, aby wgrać plik</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG, PDF (max 5MB)</p>
                  </div>
              ) : (
                  <div className="flex items-center justify-between bg-blue-50 p-3 rounded-md border border-blue-100">
                      <div className="flex items-center gap-2 overflow-hidden">
                          <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <span className="text-sm text-blue-800 truncate">{customFile.name}</span>
                      </div>
                      <button 
                          onClick={() => setCustomFile(null)}
                          className="text-gray-500 hover:text-red-500 transition-colors"
                      >
                          <X className="w-4 h-4" />
                      </button>
                  </div>
              )}
          </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4">
            <div className="w-24">
                <label className="text-xs text-gray-500 mb-1 block">Ilość</label>
                <Input 
                    type="number" 
                    min="1"
                    max={product.hasMount ? 10 : undefined}
                    value={quantity} 
                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.hasMount ? 10 : 9999, parseInt(e.target.value) || 1)))} 
                />
            </div>
            <div className="flex-1">
                 <label className="text-xs text-gray-500 mb-1 block">Razem</label>
                 <div className="text-xl font-bold">{totalPrice.toFixed(2)} zł</div>
            </div>
        </div>

        <Button
          size="lg"
          className="w-full gap-2 bg-gray-900 hover:bg-black text-white"
          onClick={handleAddToCart}
          disabled={(product.hasMount && quantity > 10) || uploading}
        >
          {uploading ? "Wysyłanie pliku..." : (added ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />)}
          {uploading ? "" : (added ? "Dodano do koszyka" : "Dodaj do koszyka")}
        </Button>
        <p className="text-xs text-center text-gray-500">
          {product.hasMount
            ? "1–10 sztuk: 5 zł/szt. Powyżej 10 sztuk – kontakt telefoniczny: +48 515 083 675"
            : "W razie pytań prosimy o kontakt: +48 515 083 675"}
        </p>
      </div>
    </div>
  );
}
