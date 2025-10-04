"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  if (!src) return "/fallback-product.png";
  try {
    new URL(src);
    return src;
  } catch {
    return "/fallback-product.png";
  }
}

/* ------------------- MODAL DETAIL ------------------- */
interface ProductDetailModalProps {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
}

function ProductDetailModal({ open, onClose, product }: ProductDetailModalProps) {
  const [search, setSearch] = useState("");
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const variants = product?.variants || [];

  const filtered = variants.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  const getStockText = (v: Variant) => {
    const qty = v.accounts.length;
    if (qty === 0) return "Stok habis";
    if (qty <= 5) return `Tersisa ${qty}`;
    return `Tersedia (${qty})`;
  };

  const getStockClass = (stock: string) => {
    if (stock.toLowerCase().includes("habis")) return "text-red-500 font-semibold";
    if (stock.toLowerCase().includes("tersedia")) return "text-green-500 font-semibold";
    return "text-yellow-500 font-semibold";
  };

  const handleSubmit = () => {
    console.log("Pesanan:", { variant: selectedVariant, form });
    alert(`Pesanan untuk ${form.name} (${form.email}, ${form.phone}) dengan ${selectedVariant?.name} berhasil!`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl rounded-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">🎁 {product?.name}</DialogTitle>
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
                placeholder="🔍 Cari variant..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="space-y-4">
                {filtered.map((v, i) => (
                  <div
                    key={i}
                    className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg flex items-center justify-between border hover:shadow transition cursor-pointer"
                    onClick={() => setSelectedVariant(v)}
                  >
                    <div>
                      <p className="font-bold">{v.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Rp {v.price.toLocaleString()}
                      </p>
                      <span className={`text-sm ${getStockClass(getStockText(v))}`}>
                        {getStockText(v)}
                      </span>
                    </div>
                  </div>
                ))}
                {filtered.length === 0 && (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-6">🚫 Variant tidak ditemukan.</p>
                )}
              </div>
            </>
          )}

          {/* Form Pemesanan */}
          {selectedVariant && (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-gray-100 dark:bg-gray-800/40">
                <p className="font-bold">Variant dipilih:</p>
                <p>{selectedVariant.name} — Rp {selectedVariant.price.toLocaleString()}</p>
              </div>

              <Input
                placeholder="Nama Lengkap"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <Input
                type="tel"
                placeholder="Nomor HP"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />

              <div className="flex justify-between gap-3">
                <Button variant="outline" onClick={() => setSelectedVariant(null)}>
                  ⬅ Kembali pilih variant
                </Button>
                <Button className="bg-primary text-white" onClick={handleSubmit}>
                  ✅ Pesan Sekarang
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

  useEffect(() => {
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
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return filter === "semua"
      ? products
      : products.filter((p) => p.category.toLowerCase() === filter.toLowerCase());
  }, [filter, products]);

  const isEmpty = filteredProducts.length === 0;

  const getStock = (product: Product) =>
    product.variants.reduce((sum, v) => sum + (v.accounts?.length || 0), 0);

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8">
      {/* Filter Toggle */}
      <div className="flex justify-center">
        <ToggleGroup
          type="single"
          value={filter}
          onValueChange={(val) => val && setFilter(val)}
          className="flex flex-wrap gap-1 sm:gap-2 p-1 sm:p-2 bg-muted/30 rounded-xl justify-center"
          aria-label="Pilih kategori produk"
        >
          {categories.map((c) => (
            <ToggleGroupItem
              key={c.value}
              value={c.value}
              className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium
                data-[state=on]:bg-primary data-[state=on]:text-primary-foreground
                transition-all duration-200 ease-in-out"
            >
              {c.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* Grid Produk */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6">
        {isEmpty ? (
          <div className="col-span-full text-center py-16 text-muted-foreground text-lg font-medium">
            🚫 Tidak ada produk ditemukan dalam kategori ini.
          </div>
        ) : (
          filteredProducts.map((product, idx) => (
            <Card
              key={product._id}
              onClick={() => setSelectedProduct(product)}
              className="cursor-pointer w-full bg-muted/20 shadow-md hover:shadow-lg transition-all duration-300
                rounded-2xl overflow-hidden transform hover:-translate-y-1"
            >
              <CardContent className="p-4 flex flex-col items-center text-center">
                {/* Gambar */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mb-3 aspect-square">
                  <Image
                    src={getValidImageUrl(product.image)}
                    alt={product.name}
                    fill
                    className="rounded-xl object-cover"
                    {...(idx === 0 ? { priority: true } : { loading: "lazy" })}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/fallback-product.png";
                    }}
                    aria-label={`Gambar ${product.name}`}
                  />
                </div>

                {/* Stok */}
                <span className="text-xs sm:text-sm px-3 py-1 bg-yellow-500 text-white rounded-full mb-2">
                  Tersisa {getStock(product)}
                </span>

                {/* Kategori */}
                <span className="text-xs sm:text-sm text-muted-foreground mb-1 capitalize">
                  {product.category}
                </span>

                {/* Judul */}
                <h3 className="text-sm sm:text-base font-semibold leading-tight line-clamp-2">
                  {product.name}
                </h3>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal */}
      {selectedProduct && (
        <ProductDetailModal
          open={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          product={selectedProduct}
        />
      )}
    </div>
  );
}
