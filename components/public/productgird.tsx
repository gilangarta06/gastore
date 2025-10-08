// components/public/productgird.tsx
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
    <div className="space-y-10">
      {/* Filter Toggle */}
      <div className="flex justify-center">
        <div className="flex flex-wrap gap-2 p-2 bg-muted/30 rounded-xl">
          {categories.map((c) => (
            <Button
              key={c.value}
              size="sm"
              onClick={() => setFilter(c.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === c.value
                  ? "bg-[#0956C8] text-white hover:bg-[#0747A5]"
                  : "bg-transparent text-foreground hover:bg-muted"
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
          <div className="col-span-full text-center py-20 text-muted-foreground text-lg font-medium">
            🚫 Tidak ada produk ditemukan dalam kategori ini.
          </div>
        ) : (
          filteredProducts.map((product) => {
            const stock = getStock(product);
            return (
              <Card
                key={product._id}
                onClick={() => handleCardClick(product._id)}
                className="group cursor-pointer w-full bg-white transition-all duration-300 rounded-3xl overflow-hidden hover:-translate-y-1 border border-gray-100"
              >
                {/* Gambar Produk */}
                <div className="aspect-[4/3]">
                  <img
                    src={getValidImageUrl(product.image)}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) =>
                      ((e.target as HTMLImageElement).src = "/images/fallback-product.png")
                    }
                  />
                </div>

                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Header: Category and Stock */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full capitalize font-medium">
                        {product.category}
                      </span>
                      <span
                        className={`text-xs text-white px-2.5 py-1 rounded-full font-medium ${
                          stock === 0 ? "bg-red-500" : stock <= 3 ? "bg-yellow-500" : "bg-green-500"
                        }`}
                      >
                        {stock === 0 ? "Stok Habis" : `${stock} tersisa`}
                      </span>
                    </div>

                    {/* Product Name */}
                    <h3 className="text-sm font-medium leading-tight line-clamp-2 text-gray-800 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    
                    {/* Rating */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className="w-3.5 h-3.5 fill-current text-yellow-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">5.0</span>
                      </div>
                      <span className="text-xs text-gray-500">100+ terjual</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}