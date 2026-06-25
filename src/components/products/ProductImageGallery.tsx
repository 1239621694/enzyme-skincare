"use client";
import { useState } from "react";
import Image from "next/image";

interface ProductImageGalleryProps {
  images: string[];
  alt: string;
}

export function ProductImageGallery({ images, alt }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const currentImage = selectedImage || images[0];
  if (!images || images.length === 0) {
    return <div className="aspect-square rounded-xl bg-neutral-100 flex items-center justify-center"><span className="text-neutral-400">No image</span></div>;
  }
  return (
    <div>
      <div className="aspect-square rounded-xl overflow-hidden bg-neutral-100 relative mb-3">
        <Image src={currentImage} alt={alt} fill className="object-cover" priority sizes="(max-width: 640px) 100vw, 50vw" />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button key={idx} onClick={() => setSelectedImage(img)}
              className={"w-16 h-16 rounded-md overflow-hidden border-2 flex-shrink-0 transition-colors " + (currentImage === img ? "border-primary-600" : "border-transparent")}>
              <Image src={img} alt={alt + " " + (idx + 1)} width={64} height={64} className="object-cover w-full h-full" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}