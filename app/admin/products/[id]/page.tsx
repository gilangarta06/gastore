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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Edit, Trash, Plus, Package2, ShoppingCart, AlertCircle, TrendingUp } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  const [newVariant, setNewVariant] = useState<Variant>({
    name: "",
    price: 0,
    quantity: 0,
    accounts: [],
  });

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

  const handleQuantityChange = (qty: number) => {
    setNewVariant({
      ...newVariant,
      quantity: qty,
      accounts: Array.from({ length: qty }, (_, i) => 
        newVariant.accounts[i] || { username: "", password: "" }
      ),
    });
  };

  const handleAccountChange = (index: number, field: "username" | "password", value: string) => {
    const updatedAccounts = [...newVariant.accounts];
    updatedAccounts[index][field] = value;
    setNewVariant({ ...newVariant, accounts: updatedAccounts });
  };

  const handleAdditionalStockChange = (qty: number) => {
    setAdditionalStock({
      quantity: qty,
      accounts: Array.from({ length: qty }, (_, i) => 
        additionalStock.accounts[i] || { username: "", password: "" }
      ),
    });
  };

  const handleAdditionalAccountChange = (index: number, field: "username" | "password", value: string) => {
    const updatedAccounts = [...additionalStock.accounts];
    updatedAccounts[index][field] = value;
    setAdditionalStock({ ...additionalStock, accounts: updatedAccounts });
  };

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
      const res = await fetch(`/api/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_stock",
          variantName: selectedVariant.name,
          amount: additionalStock.quantity,
          accounts: additionalStock.accounts,
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

  const handleVariantClick = (variant: any) => {
    if (variant.quantity === 0 || variant.quantity < 3) {
      setSelectedVariant(variant);
      setAddStockOpen(true);
    } else {
      setSelectedVariant(variant);
    }
  };

  const getStockBadge = (quantity: number) => {
    if (quantity === 0) {
      return <Badge variant="destructive" className="gap-1"><AlertCircle className="w-3 h-3" />Habis</Badge>;
    }
    if (quantity < 3) {
      return <Badge variant="outline" className="border-orange-500 text-orange-600 gap-1"><TrendingUp className="w-3 h-3" />Menipis</Badge>;
    }
    return <Badge variant="secondary" className="gap-1"><Package2 className="w-3 h-3" />Tersedia</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Memuat produk...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center space-y-3">
            <Package2 className="w-16 h-16 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">Produk tidak ditemukan</p>
            <Button variant="outline" onClick={() => router.push("/admin/products")}>
              Kembali ke Daftar Produk
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      {/* Header dengan Gradient */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background rounded-lg border p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/admin/products">
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Kembali</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Kelola produk dan variant dengan mudah
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEditOpen(true)} className="gap-2">
              <Edit className="w-4 h-4" /> Edit Produk
            </Button>
            <Button variant="destructive" onClick={handleDelete} className="gap-2">
              <Trash className="w-4 h-4" /> Hapus
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Details */}
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader className="bg-muted/50">
            <CardTitle className="flex items-center gap-2">
              <Package2 className="w-5 h-5" />
              Informasi Produk
            </CardTitle>
            <CardDescription>Detail lengkap tentang produk ini</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="relative group">
              <img
                src={product.image || "https://via.placeholder.com/600x400/e2e8f0/64748b?text=No+Image"}
                alt={product.name}
                className="w-full h-80 object-cover rounded-lg border shadow-sm transition-transform group-hover:scale-[1.02]"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-background/80 backdrop-blur-sm">
                  {product.category}
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div>
                <Label className="text-muted-foreground text-xs uppercase tracking-wide">Deskripsi</Label>
                <p className="text-sm mt-1 leading-relaxed">{product.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <Label className="text-muted-foreground text-xs uppercase tracking-wide">Kategori</Label>
                  <p className="font-semibold mt-1">{product.category}</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <Label className="text-muted-foreground text-xs uppercase tracking-wide">Total Variant</Label>
                  <p className="font-semibold mt-1">{product.variants?.length || 0} Variant</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Variants Card */}
        <Card className="h-fit">
          <CardHeader className="bg-gradient-to-br from-primary/10 to-primary/5">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Variants
                </CardTitle>
                <CardDescription className="mt-1">
                  {product.variants?.length || 0} variant tersedia
                </CardDescription>
              </div>
              <Button size="sm" onClick={() => setAddVariantOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" /> Tambah
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-3">
                {product.variants?.map((v: any, idx: number) => (
                  <Card
                    key={idx}
                    className="group hover:shadow-md transition-all duration-200 cursor-pointer border-2 hover:border-primary/50"
                  >
                    <CardContent className="p-4" onClick={() => handleVariantClick(v)}>
                      <div className="space-y-3">
                        {/* Header */}
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-base group-hover:text-primary transition-colors">
                              {v.name}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {v.quantity} akun {v.quantity === 0 ? "" : "tersedia"}
                            </p>
                          </div>
                          {getStockBadge(v.quantity)}
                        </div>

                        <Separator />

                        {/* Price & Stock Info */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground">Harga</p>
                            <p className="text-lg font-bold text-primary">
                              Rp {v.price?.toLocaleString("id-ID")}
                            </p>
                          </div>
                          
                          {v.quantity === 0 ? (
                            <Button size="sm" variant="outline" className="gap-1 text-red-600 border-red-200 hover:bg-red-50">
                              <Plus className="w-3 h-3" /> Tambah Stok
                            </Button>
                          ) : v.quantity < 3 ? (
                            <Button size="sm" variant="outline" className="gap-1 text-orange-600 border-orange-200 hover:bg-orange-50">
                              <Plus className="w-3 h-3" /> Isi Stok
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    </CardContent>
                    
                    {/* Delete Button */}
                    <div className="px-4 pb-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          setVariantToDelete(v.name);
                        }}
                      >
                        <Trash className="w-3 h-3 mr-1" /> Hapus Variant
                      </Button>
                    </div>
                  </Card>
                ))}

                {product.variants?.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Package2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Belum ada variant</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-3"
                      onClick={() => setAddVariantOpen(true)}
                    >
                      Tambah Variant Pertama
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Dialog Edit Produk */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Produk</DialogTitle>
            <DialogDescription>
              Ubah informasi produk di bawah dan klik simpan.
            </DialogDescription>
          </DialogHeader>
          <form action={handleEdit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Produk</Label>
              <Input id="name" name="name" defaultValue={product.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <Input id="category" name="category" defaultValue={product.category || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Input id="description" name="description" defaultValue={product.description} />
            </div>
            <Separator />
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                Batal
              </Button>
              <Button type="submit">Simpan Perubahan</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Tambah Variant */}
      <Dialog open={addVariantOpen} onOpenChange={setAddVariantOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Tambah Variant Baru</DialogTitle>
            <DialogDescription>
              Isi informasi variant dan akun-akunnya di bawah.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[70vh] pr-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="variant-name">Nama Variant</Label>
                  <Input
                    id="variant-name"
                    placeholder="e.g. 1 Month"
                    value={newVariant.name}
                    onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="variant-price">Harga (Rp)</Label>
                  <Input
                    id="variant-price"
                    type="number"
                    placeholder="100000"
                    value={newVariant.price || ""}
                    onChange={(e) => setNewVariant({ ...newVariant, price: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="variant-quantity">Jumlah Akun</Label>
                  <Input
                    id="variant-quantity"
                    type="number"
                    placeholder="5"
                    value={newVariant.quantity || ""}
                    onChange={(e) => handleQuantityChange(Number(e.target.value))}
                  />
                </div>
              </div>

              {newVariant.accounts.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold">
                        Data Akun ({newVariant.accounts.length})
                      </Label>
                      <Badge variant="secondary">{newVariant.accounts.length} akun</Badge>
                    </div>
                    <div className="space-y-2">
                      {newVariant.accounts.map((acc, i) => (
                        <Card key={i} className="p-3 bg-muted/30">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Username {i + 1}</Label>
                              <Input
                                placeholder="username"
                                value={acc.username}
                                onChange={(e) => handleAccountChange(i, "username", e.target.value)}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Password {i + 1}</Label>
                              <Input
                                placeholder="password"
                                value={acc.password}
                                onChange={(e) => handleAccountChange(i, "password", e.target.value)}
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>

          <Separator />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setAddVariantOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleAddVariant} className="gap-2">
              <Plus className="w-4 h-4" /> Simpan Variant
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Tambah Stok */}
      <Dialog open={addStockOpen} onOpenChange={setAddStockOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Tambah Stok - {selectedVariant?.name}</DialogTitle>
            <DialogDescription>
              Tambahkan akun baru untuk variant ini.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[70vh] pr-4">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="stock-quantity">Jumlah Akun yang Ditambahkan</Label>
                <Input
                  id="stock-quantity"
                  type="number"
                  placeholder="5"
                  value={additionalStock.quantity || ""}
                  onChange={(e) => handleAdditionalStockChange(Number(e.target.value))}
                />
              </div>

              {additionalStock.accounts.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold">
                        Akun Baru ({additionalStock.accounts.length})
                      </Label>
                      <Badge variant="secondary">{additionalStock.accounts.length} akun</Badge>
                    </div>
                    <div className="space-y-2">
                      {additionalStock.accounts.map((acc, i) => (
                        <Card key={i} className="p-3 bg-muted/30">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Username {i + 1}</Label>
                              <Input
                                placeholder="username"
                                value={acc.username}
                                onChange={(e) => handleAdditionalAccountChange(i, "username", e.target.value)}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Password {i + 1}</Label>
                              <Input
                                placeholder="password"
                                value={acc.password}
                                onChange={(e) => handleAdditionalAccountChange(i, "password", e.target.value)}
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>

          <Separator />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setAddStockOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleAddStock} className="gap-2">
              <Plus className="w-4 h-4" /> Tambah Stok
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Detail Variant */}
      <Dialog
        open={!!selectedVariant && !addStockOpen}
        onOpenChange={() => setSelectedVariant(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Variant - {selectedVariant?.name}</DialogTitle>
            <DialogDescription>
              Informasi akun dan status penjualan untuk varian ini.
            </DialogDescription>
          </DialogHeader>

          {selectedVariant && (
            <div className="space-y-4">
              <Card className="bg-muted/30">
                <CardContent className="pt-6 grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase">Harga</Label>
                    <p className="text-2xl font-bold text-primary">
                      Rp {selectedVariant.price?.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase">Total Akun</Label>
                    <p className="text-2xl font-bold">{selectedVariant.quantity}</p>
                  </div>
                </CardContent>
              </Card>

              <Separator />

              <ScrollArea className="h-[400px]">
                <div className="space-y-2 pr-4">
                  {selectedVariant.accounts?.map((acc: any, i: number) => (
                    <Card key={i} className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">#{i + 1}</Badge>
                            <p className="font-medium">{acc.username}</p>
                          </div>
                          <p className="text-sm text-muted-foreground font-mono">
                            {acc.password}
                          </p>
                        </div>
                        <Badge variant={acc.sold ? "destructive" : "secondary"} className="gap-1">
                          {acc.sold ? "Terjual" : "Tersedia"}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Alert Dialog Delete Variant */}
      <AlertDialog open={!!variantToDelete} onOpenChange={() => setVariantToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              Hapus Variant?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Variant <span className="font-semibold text-foreground">{variantToDelete}</span> akan dihapus permanen. 
              Semua data akun di variant ini akan hilang dan aksi ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => variantToDelete && handleDeleteVariant(variantToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash className="w-4 h-4 mr-2" />
              Ya, Hapus Variant
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}