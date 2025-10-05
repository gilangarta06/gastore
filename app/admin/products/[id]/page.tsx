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
import { ArrowLeft, Edit, Trash, Package, Plus, X, PackagePlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [addVariantOpen, setAddVariantOpen] = useState(false);
  const [addStockOpen, setAddStockOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<any | null>(null);
  const [variantToDelete, setVariantToDelete] = useState<string | null>(null);

  // State untuk form tambah variant
  const [newVariant, setNewVariant] = useState<Variant>({
    name: "",
    price: 0,
    quantity: 0,
    accounts: [],
  });

  // State untuk form tambah stok
  const [additionalStock, setAdditionalStock] = useState({
    quantity: 0,
    accounts: [] as Account[],
  });

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch product");
      const data = await res.json();
      setProduct(data);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat produk");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;
    try {
      const res = await fetch(`/api/products/${productId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Produk berhasil dihapus");
      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus produk");
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
      toast.success("Produk berhasil diperbarui");
    } catch (err) {
      console.error(err);
      toast.error("Gagal memperbarui produk");
    }
  };

  // Handle perubahan quantity variant baru
  const handleQuantityChange = (qty: number) => {
    setNewVariant({
      ...newVariant,
      quantity: qty,
      accounts: Array.from({ length: qty }, (_, i) => 
        newVariant.accounts[i] || { username: "", password: "" }
      ),
    });
  };

  // Handle perubahan akun
  const handleAccountChange = (index: number, field: "username" | "password", value: string) => {
    const updatedAccounts = [...newVariant.accounts];
    updatedAccounts[index][field] = value;
    setNewVariant({ ...newVariant, accounts: updatedAccounts });
  };

  // Handle perubahan quantity tambah stok
  const handleAdditionalStockChange = (qty: number) => {
    setAdditionalStock({
      quantity: qty,
      accounts: Array.from({ length: qty }, (_, i) => 
        additionalStock.accounts[i] || { username: "", password: "" }
      ),
    });
  };

  // Handle perubahan akun tambah stok
  const handleAdditionalAccountChange = (index: number, field: "username" | "password", value: string) => {
    const updatedAccounts = [...additionalStock.accounts];
    updatedAccounts[index][field] = value;
    setAdditionalStock({ ...additionalStock, accounts: updatedAccounts });
  };

  // Submit tambah variant
  const handleAddVariant = async () => {
    if (!newVariant.name.trim()) {
      toast.error("Nama variant wajib diisi");
      return;
    }
    if (newVariant.price <= 0) {
      toast.error("Harga harus lebih dari 0");
      return;
    }
    if (newVariant.quantity <= 0) {
      toast.error("Quantity harus lebih dari 0");
      return;
    }

    const emptyAccounts = newVariant.accounts.filter(
      acc => !acc.username.trim() || !acc.password.trim()
    );
    if (emptyAccounts.length > 0) {
      toast.error("Semua akun harus diisi");
      return;
    }

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_variant",
          variant: newVariant,
        }),
      });

      if (!res.ok) throw new Error("Failed to add variant");
      
      toast.success("Variant berhasil ditambahkan");
      setAddVariantOpen(false);
      setNewVariant({ name: "", price: 0, quantity: 0, accounts: [] });
      fetchProduct();
    } catch (err) {
      console.error(err);
      toast.error("Gagal menambahkan variant");
    }
  };

  // Submit tambah stok
  const handleAddStock = async () => {
    if (!selectedVariant) return;
    
    if (additionalStock.quantity <= 0) {
      toast.error("Quantity harus lebih dari 0");
      return;
    }

    const emptyAccounts = additionalStock.accounts.filter(
      acc => !acc.username.trim() || !acc.password.trim()
    );
    if (emptyAccounts.length > 0) {
      toast.error("Semua akun harus diisi");
      return;
    }

    try {
      // const res = await fetch(`/api/products/${productId}`, {
      //   method: "PATCH",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     action: "add_stock",
      //     variantName: selectedVariant.name,
      //     accounts: additionalStock.accounts,
      //   }),
      // });
        const res = await fetch(`/api/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_stock",
          variantName: selectedVariant.name,
          amount: additionalStock.quantity,       // ✅ ini
          accounts: additionalStock.accounts,     // kalau mau disimpan juga nanti
        }),
      });

      if (!res.ok) throw new Error("Failed to add stock");
      
      toast.success("Stok berhasil ditambahkan");
      setAddStockOpen(false);
      setSelectedVariant(null);
      setAdditionalStock({ quantity: 0, accounts: [] });
      fetchProduct();
    } catch (err) {
      console.error(err);
      toast.error("Gagal menambahkan stok");
    }
  };

  // Delete variant
  const handleDeleteVariant = async (variantName: string) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete_variant",
          variantName,
        }),
      });

      if (!res.ok) throw new Error("Failed to delete variant");
      
      toast.success("Variant berhasil dihapus");
      setVariantToDelete(null);
      fetchProduct();
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus variant");
    }
  };

  // Open detail atau add stock
    const handleVariantClick = (variant: any) => {
      if (variant.quantity === 0 || variant.quantity < 3) {
        // Buka modal tambah stok kalau stok habis atau di bawah 3
        setSelectedVariant(variant);
        setAddStockOpen(true);
      } else {
        // Buka detail
        setSelectedVariant(variant);
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
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Variants</CardTitle>
            <Button size="sm" onClick={() => setAddVariantOpen(true)}>
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </CardHeader>
            <CardContent className="space-y-3">
          {product.variants?.map((v: any, idx: number) => (
            <div
              key={idx}
              className="border rounded-lg p-3 hover:bg-muted/50 transition"
            >
              {/* ✅ Nama & Harga */}
              <div
                className="flex justify-between items-center mb-1 cursor-pointer"
                onClick={() => handleVariantClick(v)}
              >
                <p className="font-semibold text-sm">{v.name}</p>
                <p className="font-semibold text-primary">
                  Rp {v.price?.toLocaleString("id-ID")}
                </p>
              </div>

              {/* ✅ Info Stok */}
              <div
                className="cursor-pointer"
                onClick={() => handleVariantClick(v)}
              >
                <p
                  className={`text-xs ${
                    v.quantity === 0
                      ? "text-red-500 font-medium"
                      : v.quantity < 3
                      ? "text-orange-500 font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {v.quantity === 0
                    ? "Stok habis - Klik untuk tambah"
                    : v.quantity < 3
                    ? `Stok menipis (${v.quantity}) - Klik untuk tambah`
                    : `${v.quantity} akun tersedia`}
                </p>
              </div>

              {/* 🗑 Tombol Hapus */}
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={(e) => {
                  e.stopPropagation();
                  setVariantToDelete(v.name);
                }}
              >
                <Trash className="w-3 h-3 mr-1" /> Hapus Variant
              </Button>
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

      {/* Popup Tambah Variant */}
      <Dialog open={addVariantOpen} onOpenChange={setAddVariantOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Variant Baru</DialogTitle>
            <DialogDescription>
              Isi informasi variant dan akun-akunnya di bawah.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Nama Variant</Label>
                <Input
                  placeholder="e.g. 1 Month"
                  value={newVariant.name}
                  onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Harga</Label>
                <Input
                  type="number"
                  placeholder="100000"
                  value={newVariant.price || ""}
                  onChange={(e) => setNewVariant({ ...newVariant, price: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label>Jumlah Akun</Label>
                <Input
                  type="number"
                  placeholder="5"
                  value={newVariant.quantity || ""}
                  onChange={(e) => handleQuantityChange(Number(e.target.value))}
                />
              </div>
            </div>

            {newVariant.accounts.length > 0 && (
              <div className="space-y-3 border-t pt-4">
                <Label className="text-base font-semibold">
                  Akun ({newVariant.accounts.length})
                </Label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {newVariant.accounts.map((acc, i) => (
                    <div key={i} className="grid grid-cols-2 gap-2 p-3 bg-muted/30 rounded-lg">
                      <Input
                        placeholder={`Username ${i + 1}`}
                        value={acc.username}
                        onChange={(e) => handleAccountChange(i, "username", e.target.value)}
                      />
                      <Input
                        placeholder={`Password ${i + 1}`}
                        value={acc.password}
                        onChange={(e) => handleAccountChange(i, "password", e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setAddVariantOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleAddVariant}>
                Simpan Variant
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Popup Tambah Stok */}
      <Dialog open={addStockOpen} onOpenChange={setAddStockOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Stok - {selectedVariant?.name}</DialogTitle>
            <DialogDescription>
              Tambahkan akun baru untuk variant ini.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Jumlah Akun yang Ditambahkan</Label>
              <Input
                type="number"
                placeholder="5"
                value={additionalStock.quantity || ""}
                onChange={(e) => handleAdditionalStockChange(Number(e.target.value))}
              />
            </div>

            {additionalStock.accounts.length > 0 && (
              <div className="space-y-3 border-t pt-4">
                <Label className="text-base font-semibold">
                  Akun Baru ({additionalStock.accounts.length})
                </Label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {additionalStock.accounts.map((acc, i) => (
                    <div key={i} className="grid grid-cols-2 gap-2 p-3 bg-muted/30 rounded-lg">
                      <Input
                        placeholder={`Username ${i + 1}`}
                        value={acc.username}
                        onChange={(e) => handleAdditionalAccountChange(i, "username", e.target.value)}
                      />
                      <Input
                        placeholder={`Password ${i + 1}`}
                        value={acc.password}
                        onChange={(e) => handleAdditionalAccountChange(i, "password", e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setAddStockOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleAddStock}>
                Tambah Stok
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Popup Variant Detail (untuk yang ada stok) */}
      <Dialog
        open={!!selectedVariant && !addStockOpen}
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
                  Harga: Rp {selectedVariant.price?.toLocaleString("id-ID")} <br />
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

      {/* Alert Dialog Delete Variant */}
      <AlertDialog open={!!variantToDelete} onOpenChange={() => setVariantToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Variant?</AlertDialogTitle>
            <AlertDialogDescription>
              Variant <b>{variantToDelete}</b> akan dihapus permanen. Aksi ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => variantToDelete && handleDeleteVariant(variantToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}