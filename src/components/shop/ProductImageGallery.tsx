"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
  images: { id: string; url: string }[];
  productName: string;
  hasMount?: boolean;
}

export function ProductImageGallery({ images, productName, hasMount }: ProductImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // If no images, show placeholder
  if (!images || images.length === 0) {
    return (
      <div className="bg-gray-50 rounded-2xl aspect-square relative overflow-hidden flex items-center justify-center">
        <div className="text-gray-300 font-mono text-4xl">PRODUKT 3D</div>
        {hasMount && (
            <span className="absolute top-4 right-4 bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                Brelok
            </span>
        )}
      </div>
    );
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="bg-gray-50 rounded-2xl aspect-square relative overflow-hidden group">
        <Image
          src={images[currentIndex].url}
          alt={`${productName} - Zdjęcie ${currentIndex + 1}`}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain p-8 drop-shadow-md transition-all duration-300"
        />
        
        {hasMount && (
            <span className="absolute top-4 right-4 bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide z-10">
                Brelok
            </span>
        )}

        {/* Arrows (only if more than 1 image) */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
              aria-label="Poprzednie zdjęcie"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
              aria-label="Następne zdjęcie"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all",
                idx === currentIndex ? "border-[#D4AF37]" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <Image
                src={img.url}
                alt={`Thumbnail ${idx + 1}`}
                fill
                unoptimized
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
