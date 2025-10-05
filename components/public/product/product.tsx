"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

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

/* ------------------- HELPER ------------------- */
function getValidImageUrl(src?: string) {
  if (!src) return "/images/fallback-product.png";
  try {
    new URL(src);
    return src;
  } catch {
    return "/images/fallback-product.png";
  }
}

/* ------------------- MODAL DETAIL ------------------- */
interface ProductDetailModalProps {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
  onOrderSuccess?: () => void;
}

function ProductDetailModal({
  open,
  onClose,
  product,
  onOrderSuccess,
}: ProductDetailModalProps) {
  const [search, setSearch] = useState("");
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const variants = product?.variants || [];

  const filtered = variants.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  const getStockText = (v: Variant) => {
    const qty = v.quantity || 0;
    if (qty === 0) return "Stok habis";
    if (qty <= 5) return `Tersisa ${qty}`;
    return `Tersedia (${qty})`;
  };

  const getStockClass = (stock: string) => {
    if (stock.toLowerCase().includes("habis")) return "text-red-500 font-semibold";
    if (stock.toLowerCase().includes("tersedia")) return "text-green-500 font-semibold";
    return "text-yellow-500 font-semibold";
  };

  const handleSubmit = async () => {
    if (!selectedVariant || !product) return;

    // Validasi form
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Nama dan nomor HP wajib diisi!");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.name,
          phone: form.phone,
          email: form.email,
          productId: product._id,
          variant: selectedVariant.name,
          qty: 1,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Pesanan berhasil dibuat!");
        
        // Buka payment URL di tab baru
        if (data.paymentUrl) {
          window.open(data.paymentUrl, "_blank");
        }

        // Reset form
        setForm({ name: "", email: "", phone: "" });
        setSelectedVariant(null);
        setSearch("");
        
        // Tutup modal
        onClose();
        
        // Refresh stok
        onOrderSuccess?.();
      } else {
        toast.error(data.error || "Gagal membuat pesanan");
      }
    } catch (err) {
      console.error("Submit order error:", err);
      toast.error("Terjadi kesalahan saat membuat pesanan");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset state saat modal ditutup
  useEffect(() => {
    if (!open) {
      setSelectedVariant(null);
      setSearch("");
      setForm({ name: "", email: "", phone: "" });
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl rounded-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{product?.name}</DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto pr-2 space-y-6">
          {/* Gambar + Deskripsi */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative aspect-square w-full md:w-1/3 rounded-xl overflow-hidden border">
              <Image
                src={getValidImageUrl(product?.image)}
                alt={product?.name || "Product"}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
            <div className="flex-1 flex items-center">
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {product?.description || "Deskripsi produk belum tersedia."}
              </p>
            </div>
          </div>

          {/* List Variant */}
          {!selectedVariant && (
            <>
              <Input
                placeholder="Cari variant..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="space-y-4">
                {filtered.map((v, i) => {
                  const stockText = getStockText(v);
                  const isOutOfStock = v.quantity === 0;
                  
                  return (
                    <div
                      key={i}
                      className={`bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg flex items-center justify-between border transition ${
                        isOutOfStock
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:shadow cursor-pointer"
                      }`}
                      onClick={() => !isOutOfStock && setSelectedVariant(v)}
                    >
                      <div>
                        <p className="font-bold">{v.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Rp {v.price.toLocaleString("id-ID")}
                        </p>
                        <span className={`text-sm ${getStockClass(stockText)}`}>
                          {stockText}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {filtered.length === 0 && (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-6">
                    Variant tidak ditemukan.
                  </p>
                )}
              </div>
            </>
          )}

          {/* Form Pemesanan */}
          {selectedVariant && (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/50">
                <p className="font-bold text-sm mb-1">Variant dipilih:</p>
                <p className="text-lg">
                  {selectedVariant.name} — Rp {selectedVariant.price.toLocaleString("id-ID")}
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Nama Lengkap *</label>
                  <Input
                    placeholder="Masukkan nama lengkap"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Nomor WhatsApp *</label>
                  <Input
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Email (Opsional)</label>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="flex justify-between gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedVariant(null)}
                  disabled={isSubmitting}
                >
                  Kembali
                </Button>
                <Button
                  className="bg-primary text-white"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Memproses..." : "Pesan Sekarang"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------- GRID PRODUK ------------------- */
export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<string>("semua");
  const [categories, setCategories] = useState<Category[]>([{ value: "semua", label: "Semua" }]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products", { cache: "no-store" });
      const data: Product[] = await res.json();
      setProducts(data);

      const uniqueCats = Array.from(new Set(data.map((p) => p.category.toLowerCase())));
      setCategories([
        { value: "semua", label: "Semua" },
        ...uniqueCats.map((c) => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) })),
      ]);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      toast.error("Gagal memuat produk");
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

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8">
      {/* Filter Toggle */}
      <div className="flex justify-center">
        <ToggleGroup
          type="single"
          value={filter}
          onValueChange={(val) => val && setFilter(val)}
          className="flex flex-wrap gap-1 sm:gap-2 p-1 sm:p-2 bg-muted/30 rounded-xl justify-center"
        >
          {categories.map((c) => (
            <ToggleGroupItem
              key={c.value}
              value={c.value}
              className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium
                data-[state=on]:bg-primary data-[state=on]:text-primary-foreground
                transition-all duration-200"
            >
              {c.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* Grid Produk */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-16 text-muted-foreground text-lg font-medium">
            Tidak ada produk ditemukan dalam kategori ini.
          </div>
        ) : (
          filteredProducts.map((product) => (
            <Card
              key={product._id}
              onClick={() => setSelectedProduct(product)}
              className="cursor-pointer w-full bg-muted/20 shadow-md hover:shadow-lg transition-all duration-300
                rounded-2xl overflow-hidden transform hover:-translate-y-1"
            >
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="relative w-24 h-24 mb-3">
                  <Image
                    src={getValidImageUrl(product.image)}
                    alt={product.name}
                    fill
                    className="rounded-xl object-cover"
                    onError={(e) =>
                      ((e.target as HTMLImageElement).src = "/images/fallback-product.png")
                    }
                  />
                </div>

                <span className="text-xs sm:text-sm px-3 py-1 bg-yellow-500 text-white rounded-full mb-2">
                  Tersisa {getStock(product)}
                </span>

                <span className="text-xs sm:text-sm text-muted-foreground mb-1 capitalize">
                  {product.category}
                </span>

                <h3 className="text-sm sm:text-base font-semibold leading-tight line-clamp-2">
                  {product.name}
                </h3>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal Detail */}
      {selectedProduct && (
        <ProductDetailModal
          open={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          product={selectedProduct}
          onOrderSuccess={fetchProducts}
        />
      )}
    </div>
  );
}