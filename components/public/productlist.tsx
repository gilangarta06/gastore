"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import ProductDetailModal from "@/components/public/product/product"; // modal detail produk

/* ---------- tipe data ---------- */
interface Category {
  value: string;
  label: string;
}
interface Product {
  id: number;
  title: string;
  category: string;
  stock: number;
  image: string;
}

/* ---------- data statis ---------- */
const categories: Category[] = [
  { value: "semua", label: "Semua" },
  { value: "ai", label: "AI" },
  { value: "musik", label: "MUSIK" },
  { value: "streaming", label: "STREAMING" },
  { value: "editing", label: "EDITING" },
  { value: "pendidikan", label: "PENDIDIKAN" },
  { value: "komunikasi", label: "KOMUNIKASI" },
];

const products: Product[] = [
  {
    id: 1,
    title: "GEMINI AI + GDRIVE2TB + VEO3",
    category: "ai",
    stock: 3,
    image: "/images/images.jpeg",
  },
  { id: 2, title: "CHAT GPT PRO", category: "ai", stock: 1, image: "/images/images.jpeg" },
  { id: 3, title: "Spotify Premium", category: "musik", stock: 10, image: "/images/images.jpeg" },
  { id: 4, title: "Netflix Premium", category: "streaming", stock: 5, image: "/images/images.jpeg" },
];

/* ---------- Komponen utama ---------- */
export default function ProductGrid() {
  const [filter, setFilter] = useState<string>("semua");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // memoisasi agar tidak dihitung tiap render
  const filteredProducts = useMemo(() => {
    return filter === "semua"
      ? products
      : products.filter((p) => p.category === filter);
  }, [filter]);

  const isEmpty = filteredProducts.length === 0;

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8">
      {/* ===== Filter Toggle ===== */}
      <div className="flex justify-center">
        <ToggleGroup
          type="single"
          value={filter}
          onValueChange={(val) => val && setFilter(val)}
          className="flex flex-wrap gap-1 sm:gap-2 p-1 sm:p-2 bg-muted/30 rounded-xl justify-center"
          aria-label="Pilih kategori produk"
        >
          {categories.map((c) => (
            <ToggleGroupItem
              key={c.value}
              value={c.value}
              className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium
                data-[state=on]:bg-primary data-[state=on]:text-primary-foreground
                transition-all duration-200 ease-in-out"
            >
              {c.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* ===== Grid Produk ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6">
        {isEmpty ? (
          <div className="col-span-full text-center py-16 text-muted-foreground text-lg font-medium">
            🚫 Tidak ada produk ditemukan dalam kategori ini.
          </div>
        ) : (
          filteredProducts.map((product, idx) => (
            <Card
              key={product.id}
              onClick={() => setSelectedProduct(product)} // buka modal
              className="cursor-pointer w-full bg-muted/20 shadow-md hover:shadow-lg transition-all duration-300
                rounded-2xl overflow-hidden transform hover:-translate-y-1"
            >
              <CardContent className="p-4 flex flex-col items-center text-center">
                {/* Gambar Produk */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mb-3 aspect-square">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="rounded-xl object-cover"
                    {...(idx === 0 ? { priority: true } : { loading: "lazy" })}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/fallback-product.png";
                    }}
                    aria-label={`Gambar ${product.title}`}
                  />
                </div>

                {/* Stok */}
                <span className="text-xs sm:text-sm px-3 py-1 bg-yellow-500 text-white rounded-full mb-2">
                  Tersisa {product.stock}
                </span>

                {/* Kategori */}
                <span className="text-xs sm:text-sm text-muted-foreground mb-1 capitalize">
                  {product.category}
                </span>

                {/* Judul */}
                <h3 className="text-sm sm:text-base font-semibold leading-tight line-clamp-2">
                  {product.title}
                </h3>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* ===== Modal Detail Produk ===== */}
      {selectedProduct && (
        <ProductDetailModal
          open={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
