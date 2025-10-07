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

function getValidImageUrl(src?: string) {
  if (!src) return "/images/fallback-product.png";
  try {
    new URL(src);
    return src;
  } catch {
    return "/images/fallback-product.png";
  }
}

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
    window.location.href = `/products/${productId}`;
  };

  const getStockColor = (stock: number) => {
    if (stock === 0) return "bg-red-500";
    if (stock <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8">
      {/* Filter Toggle */}
      <div className="flex justify-center">
        <div className="flex flex-wrap gap-1 sm:gap-2 p-1 sm:p-2 bg-muted/30 rounded-xl justify-center">
          {categories.map((c) => (
          <Button
            key={c.value}
            size="sm"
            onClick={() => setFilter(c.value)}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200
              ${
                filter === c.value
                  ? "bg-[#005EE8] text-white hover:bg-[#004ecc]"
                  : "bg-transparent text-foreground hover:bg-muted/40 dark:hover:bg-zinc-800"
              }`}
          >
            {c.label}
          </Button>
          ))}
        </div>
      </div>

      {/* Grid Produk */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-16 text-muted-foreground text-lg font-medium">
            🚫 Tidak ada produk ditemukan dalam kategori ini.
          </div>
        ) : (
          filteredProducts.map((product) => {
            const stock = getStock(product);
            return (
            <Card
              key={product._id}
              onClick={() => handleCardClick(product._id)}
              className="cursor-pointer w-full 
                bg-white dark:bg-zinc-900 
                shadow-md hover:shadow-lg transition-all duration-300 
                rounded-2xl overflow-hidden transform hover:-translate-y-1 
                border border-gray-100 dark:border-zinc-800"
            >
              {/* Gambar Produk */}
              <div className="p-2">
                <div className="relative w-full h-36 sm:h-44 rounded-xl overflow-hidden 
                  bg-gray-100 dark:bg-zinc-800">
                  <img
                    src={getValidImageUrl(product.image)}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-xl"
                    onError={(e) =>
                      ((e.target as HTMLImageElement).src = "/images/fallback-product.png")
                    }
                  />
                </div>
              </div>

              <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
                <span
                  className={`text-xs sm:text-sm text-white px-3 py-1 rounded-full font-medium ${getStockColor(
                    stock
                  )}`}
                >
                  {stock === 0 ? "Stok Habis" : `Tersisa ${stock}`}
                </span>

                <span className="text-xs sm:text-sm text-muted-foreground capitalize">
                  {product.category}
                </span>

                <h3 className="text-sm sm:text-base font-semibold leading-tight line-clamp-2">
                  {product.name}
                </h3>
              </CardContent>
            </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
