"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

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

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading products...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Products</h2>
          <Button asChild>
            <Link href="/admin/products/add">+ Add Product</Link>
          </Button>
        </div>
        <p className="text-muted-foreground">No products found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Products</h2>
        <Button asChild>
          <Link href="/admin/products/add">+ Add Product</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product._id} className="overflow-hidden">
            <img
              src={product.image || "https://via.placeholder.com/150"}
              alt={product.name}
              className="w-full h-40 object-cover"
            />
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Harga termurah dari variant */}
              {product.variants && product.variants.length > 0 && (
                <p className="text-primary font-bold">
                  Rp{" "}
                  {Math.min(...product.variants.map((v) => v.price)).toLocaleString()}
                </p>
              )}

              {/* List semua variant */}
              <div className="mt-2 space-y-1">
                {product.variants?.map((v) => (
                  <div key={v._id} className="text-sm text-muted-foreground">
                    {v.name} — Rp {v.price.toLocaleString()} ({v.quantity} akun)
                  </div>
                ))}
              </div>

              <Button
                asChild
                variant="outline"
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
    </div>
  );
}
