"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Netflix Premium",
    price: 100000,
    image: "https://via.placeholder.com/150",
    variants: [
      { name: "1 Bulan", price: 100000, quantity: 3 },
      { name: "3 Bulan", price: 250000, quantity: 5 },
    ],
  },
  {
    id: 2,
    name: "Spotify Premium",
    price: 60000,
    image: "https://via.placeholder.com/150",
    variants: [{ name: "1 Bulan", price: 60000, quantity: 10 }],
  },
];

export default function ProductsListPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Products</h2>
        <Button asChild>
          <a href="/admin/products/add">+ Add Product</a>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover"
            />
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-primary font-bold">Rp {product.price}</p>
              <div className="mt-2 space-y-1">
                {product.variants.map((v, idx) => (
                  <div key={idx} className="text-sm text-muted-foreground">
                    {v.name} — Rp {v.price} ({v.quantity} akun)
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="mt-4 w-full">
                <Package className="w-4 h-4 mr-2" />
                Manage
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
