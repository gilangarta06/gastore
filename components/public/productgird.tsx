// components/public/productgird.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

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

  return (
    <div className="space-y-12">
      {/* Filter Pills */}
      <div className="flex justify-center">
        <div className="inline-flex flex-wrap gap-2 p-2 glass-card rounded-2xl border-primary/20">
          {categories.map((c) => (
            <Button
              key={c.value}
              size="sm"
              onClick={() => setFilter(c.value)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                filter === c.value
                  ? "bg-gradient-to-r from-primary to-blue-500 text-white shadow-lg shadow-primary/30 scale-105"
                  : "bg-transparent text-foreground hover:bg-muted border border-transparent hover:border-primary/20"
              }`}
            >
              {c.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <motion.div 
        layout
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5"
      >
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
              <ShoppingCart className="w-10 h-10 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-lg font-medium">
              Tidak ada produk dalam kategori ini
            </p>
          </div>
        ) : (
          filteredProducts.map((product, index) => {
            const stock = getStock(product);
            const isLowStock = stock > 0 && stock <= 3;
            const isOutOfStock = stock === 0;

            return (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                layout
              >
                <Card
                  onClick={() => handleCardClick(product._id)}
                  className="group cursor-pointer h-full glass-card border-border/40 hover:border-primary/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 overflow-hidden"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted/50">
                    <img
                      src={getValidImageUrl(product.image)}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) =>
                        ((e.target as HTMLImageElement).src = "/images/fallback-product.png")
                      }
                    />
                    
                    {/* Overlay gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Trending badge for products with low stock */}
                    {isLowStock && (
                      <div className="absolute top-2 left-2 flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-lg">
                        <TrendingUp className="w-3 h-3" />
                        Hot
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4 space-y-3">
                    {/* Category & Stock */}
                    <div className="flex items-center justify-between gap-2">
                      <Badge 
                        variant="secondary" 
                        className="text-xs capitalize bg-primary/10 text-primary border-0 hover:bg-primary/20"
                      >
                        {product.category}
                      </Badge>
                      
                      <Badge
                        className={`text-xs font-medium border-0 ${
                          isOutOfStock
                            ? "bg-destructive/10 text-destructive"
                            : isLowStock
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : "bg-green-500/10 text-green-600 dark:text-green-400"
                        }`}
                      >
                        {isOutOfStock ? "Habis" : `${stock} stok`}
                      </Badge>
                    </div>

                    {/* Product Name */}
                    <h3 className="text-sm font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>

                    {/* Rating & Sales */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-3 h-3 fill-amber-400 text-amber-400"
                            />
                          ))}
                        </div>
                        <span className="text-muted-foreground font-medium">5.0</span>
                      </div>
                      <span className="text-muted-foreground">100+ terjual</span>
                    </div>

                    {/* Quick view hint (appears on hover) */}
                    <div className="pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center justify-center gap-1 text-xs text-primary font-medium">
                        <ShoppingCart className="w-3 h-3" />
                        Lihat Detail
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </motion.div>
    </div>
  );
}