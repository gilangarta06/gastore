"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
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

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<any | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${productId}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [productId]);

  const handleDelete = async () => {
    if (!confirm("Are you sure want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${productId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const handleEdit = async (formData: FormData) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        body: JSON.stringify({
          name: formData.get("name"),
          category: formData.get("category"),
          description: formData.get("description"),
        }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Update failed");
      const updated = await res.json();
      setProduct(updated);
      setEditOpen(false);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading...</p>
      </div>
    );
  }

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
          <Button variant="destructive" onClick={handleDelete}>
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
              src={product.image || "https://via.placeholder.com/300"}
              alt={product.name}
              className="w-full h-64 object-cover rounded-lg border"
            />
            <p className="text-muted-foreground">{product.description}</p>
            <p className="text-sm text-muted-foreground">
              Kategori: <span className="font-medium">{product.category}</span>
            </p>
          </CardContent>
        </Card>

        {/* Variants */}
        <Card>
          <CardHeader>
            <CardTitle>Variants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {product.variants?.map((v: any, idx: number) => (
              <div
                key={idx}
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
                  Rp {v.price?.toLocaleString()}
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
          <form action={handleEdit} className="space-y-4">
            <div>
              <Label>Nama Produk</Label>
              <Input name="name" defaultValue={product.name} />
            </div>
            <div>
              <Label>Kategori</Label>
              <Input name="category" defaultValue={product.category || ""} />
            </div>
            <div>
              <Label>Deskripsi</Label>
              <Input name="description" defaultValue={product.description} />
            </div>
            <div className="flex justify-end pt-2">
              <Button type="submit">Simpan</Button>
            </div>
          </form>
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
                  Harga: Rp {selectedVariant.price?.toLocaleString()} <br />
                  Jumlah akun: {selectedVariant.quantity}
                </p>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto border-t pt-3">
                {selectedVariant.accounts?.map((acc: any, i: number) => (
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
