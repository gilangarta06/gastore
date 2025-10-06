"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Account {
  username: string;
  password: string;
  sold?: boolean;
}

interface Variant {
  name: string;
  price: number;
  quantity: number;
  accounts: Account[];
}

interface Product {
  _id: string;
  name: string;
  category: string;
  image?: string;
  description?: string;
  variants: Variant[];
}

interface Category {
  value: string;
  label: string;
}

/* ------------------- HELPER ------------------- */
function getValidImageUrl(src?: string) {
  if (!src) return "/images/fallback-product.png";
  try {
    new URL(src);
    return src;
  } catch {
    return "/images/fallback-product.png";
  }
}

/* ------------------- GRID PRODUK ------------------- */
export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<string>("semua");
  const [categories, setCategories] = useState<Category[]>([{ value: "semua", label: "Semua" }]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products", { cache: "no-store" });
      const data: Product[] = await res.json();
      setProducts(data);

      const uniqueCats = Array.from(new Set(data.map((p) => p.category.toLowerCase())));
      setCategories([
        { value: "semua", label: "Semua" },
        ...uniqueCats.map((c) => ({ value: c, label: c.toUpperCase() })),
      ]);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return filter === "semua"
      ? products
      : products.filter((p) => p.category.toLowerCase() === filter.toLowerCase());
  }, [filter, products]);

  const getStock = (product: Product) =>
    product.variants.reduce((sum, v) => sum + (v.quantity || 0), 0);

  const handleCardClick = (productId: string) => {
    // Buka halaman baru dengan URL produk
    window.location.href = `/products/${productId}`;
  };

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8">
      {/* Filter Toggle */}
      <div className="flex justify-center">
        <div className="flex flex-wrap gap-1 sm:gap-2 p-1 sm:p-2 bg-muted/30 rounded-xl justify-center">
          {categories.map((c) => (
            <Button
              key={c.value}
              variant={filter === c.value ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter(c.value)}
              className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200"
            >
              {c.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid Produk */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-16 text-muted-foreground text-lg font-medium">
            🚫 Tidak ada produk ditemukan dalam kategori ini.
          </div>
        ) : (
          filteredProducts.map((product) => (
            <Card
              key={product._id}
              onClick={() => handleCardClick(product._id)}
              className="cursor-pointer w-full bg-muted/20 shadow-md hover:shadow-lg transition-all duration-300
                rounded-2xl overflow-hidden transform hover:-translate-y-1"
            >
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="relative w-24 h-24 mb-3">
                  <img
                    src={getValidImageUrl(product.image)}
                    alt={product.name}
                    className="w-full h-full rounded-xl object-cover"
                    onError={(e) =>
                      ((e.target as HTMLImageElement).src = "/images/fallback-product.png")
                    }
                  />
                </div>

                <span className="text-xs sm:text-sm px-3 py-1 bg-yellow-500 text-white rounded-full mb-2">
                  Tersisa {getStock(product)}
                </span>

                <span className="text-xs sm:text-sm text-muted-foreground mb-1 capitalize">
                  {product.category}
                </span>

                <h3 className="text-sm sm:text-base font-semibold leading-tight line-clamp-2">
                  {product.name}
                </h3>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}