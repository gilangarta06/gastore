"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, PlusCircle } from "lucide-react";

interface Variant {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Product {
  _id: string;
  name: string;
  image: string;
  variants: Variant[];
}

export default function ProductsListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <Button asChild className="flex items-center gap-2">
          <Link href="/admin/products/add">
            <PlusCircle className="w-4 h-4" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="w-full h-40" />
              <CardHeader>
                <Skeleton className="h-5 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-9 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
          <Package className="w-12 h-12 mb-4 text-muted-foreground/70" />
          <p className="text-lg font-medium mb-2">No products found</p>
          <p className="text-sm mb-6">Start by adding your first product</p>
          <Button asChild>
            <Link href="/admin/products/add">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>
      )}

      {/* Product Grid */}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card
              key={product._id}
              className="overflow-hidden transition hover:shadow-lg hover:scale-[1.01]"
            >
              <div className="aspect-[4/3] bg-muted overflow-hidden">
                <img
                  src={product.image || "https://via.placeholder.com/150"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold truncate">
                  {product.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Harga termurah */}
                {product.variants?.length > 0 && (
                  <p className="text-primary font-semibold">
                    Rp{" "}
                    {Math.min(
                      ...product.variants.map((v) => v.price)
                    ).toLocaleString()}
                  </p>
                )}

                {/* List variant */}
                <div className="space-y-1 text-sm text-muted-foreground">
                  {product.variants?.map((v) => (
                    <div key={v._id}>
                      {v.name} — Rp {v.price.toLocaleString()} ({v.quantity} akun)
                    </div>
                  ))}
                </div>

                <Button
                  asChild
                  variant="secondary"
                  size="sm"
                  className="mt-4 w-full"
                >
                  <Link href={`/admin/products/${product._id}`}>
                    <Package className="w-4 h-4 mr-2" />
                    Manage
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
