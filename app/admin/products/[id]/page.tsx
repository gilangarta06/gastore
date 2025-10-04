"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Edit, Trash, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mockProducts = [
  {
    id: 1,
    name: "Netflix Premium",
    price: 100000,
    description: "Akses Netflix Premium 1 bulan full HD.",
    image: "https://via.placeholder.com/300",
    variants: [
      {
        id: 1,
        name: "1 Bulan",
        price: 100000,
        quantity: 3,
        accounts: [
          { username: "netflix_1@gmail.com", password: "abc123", sold: true },
          { username: "netflix_2@gmail.com", password: "xyz456", sold: false },
          { username: "netflix_3@gmail.com", password: "qwe789", sold: false },
        ],
      },
      {
        id: 2,
        name: "3 Bulan",
        price: 250000,
        quantity: 2,
        accounts: [
          { username: "netflix3_1@gmail.com", password: "111222", sold: true },
          { username: "netflix3_2@gmail.com", password: "333444", sold: false },
        ],
      },
    ],
  },
];

export default function ProductDetailPage() {
  const params = useParams();
  const productId = Number(params.id);
  const [selectedVariant, setSelectedVariant] = useState<any | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const product = mockProducts.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="p-6">
        <p className="text-center text-muted-foreground">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/products">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h2 className="text-2xl font-bold">{product.name}</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEditOpen(true)}>
            <Edit className="w-4 h-4 mr-2" /> Edit
          </Button>
          <Button variant="destructive">
            <Trash className="w-4 h-4 mr-2" /> Delete
          </Button>
        </div>
      </div>

      {/* Detail Product */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover rounded-lg border"
            />
            <p className="text-muted-foreground">{product.description}</p>
            <p className="text-xl font-bold text-primary">
              Rp {product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
            </p>
          </CardContent>
        </Card>

        {/* Variants */}
        <Card>
          <CardHeader>
            <CardTitle>Variants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {product.variants.map((v) => (
              <div
                key={v.id}
                className="border rounded-lg p-3 flex justify-between items-center cursor-pointer hover:bg-muted/50 transition"
                onClick={() => setSelectedVariant(v)}
              >
                <div>
                  <p className="font-medium flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    {v.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {v.quantity} akun tersedia
                  </p>
                </div>
                <p className="font-semibold text-primary">
                  Rp {v.price.toLocaleString()}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Popup Edit Produk */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Produk</DialogTitle>
            <DialogDescription>
              Ubah informasi produk di bawah dan klik simpan.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nama Produk</Label>
              <Input defaultValue={product.name} />
            </div>
            <div>
              <Label>Harga</Label>
              <Input type="number" defaultValue={product.price} />
            </div>
            <div>
              <Label>Deskripsi</Label>
              <Input defaultValue={product.description} />
            </div>
            <div className="flex justify-end pt-2">
              <Button>Simpan</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Popup Variant Detail */}
      <Dialog
        open={!!selectedVariant}
        onOpenChange={() => setSelectedVariant(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detail Variant</DialogTitle>
            <DialogDescription>
              Informasi akun dan status penjualan untuk varian ini.
            </DialogDescription>
          </DialogHeader>

          {selectedVariant && (
            <div className="space-y-4">
              <div>
                <p className="font-semibold">{selectedVariant.name}</p>
                <p className="text-sm text-muted-foreground">
                  Harga: Rp {selectedVariant.price.toLocaleString()} <br />
                  Jumlah akun: {selectedVariant.quantity}
                </p>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto border-t pt-3">
                {selectedVariant.accounts.map((acc: any, i: number) => (
                  <div
                    key={i}
                    className="flex justify-between items-center border rounded-md p-2"
                  >
                    <div>
                      <p className="text-sm font-medium">{acc.username}</p>
                      <p className="text-xs text-muted-foreground">
                        {acc.password}
                      </p>
                    </div>
                    <Badge variant={acc.sold ? "destructive" : "secondary"}>
                      {acc.sold ? "Terjual" : "Tersedia"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
