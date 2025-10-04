"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Variant {
  name: string;
  price: string;
  stock: string;
  shipping: string;
}

interface ProductDetailProps {
  open: boolean;
  onClose: () => void;
}

export default function ProductDetailModal({ open, onClose }: ProductDetailProps) {
  const [search, setSearch] = useState("");
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  // form pemesanan
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const variants: Variant[] = [
    { name: "Variant Name 1", price: "Rp. 10.000", stock: "Stok habis", shipping: "Pengiriman INSTANT" },
    { name: "Variant Name 2", price: "Rp. 10.000", stock: "Tersedia", shipping: "Pengiriman MANUAL" },
    { name: "Variant Name 3", price: "Rp. 10.000", stock: "Tersisa 9", shipping: "Pengiriman INSTANT" },
  ];

  const filtered = variants.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  const getStockClass = (stock: string) => {
    if (stock.toLowerCase().includes("habis")) return "text-red-500 font-semibold";
    if (stock.toLowerCase().includes("tersedia")) return "text-green-500 font-semibold";
    return "text-yellow-500 font-semibold";
  };

  const getShippingClass = (shipping: string) => {
    if (shipping.toLowerCase().includes("instant"))
      return "bg-green-200 text-green-800 dark:bg-green-900/40 dark:text-green-300";
    return "bg-blue-200 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300";
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
          <DialogTitle className="text-2xl font-bold">🎁 Product Title</DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto pr-2 space-y-6">
          {/* Gambar + Deskripsi */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative aspect-square w-full md:w-1/3 rounded-xl overflow-hidden border">
              <Image
                src="https://via.placeholder.com/400"
                alt="Product"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
            <div className="flex-1 flex items-center">
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Pilih variant produk dulu yuk!  
                Ini adalah deskripsi produk yang menjelaskan fitur dan keuntungan utama.
              </p>
            </div>
          </div>

          {/* Kalau BELUM pilih variant → tampilkan list */}
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
                      <p className="text-sm text-gray-500 dark:text-gray-400">{v.price}</p>
                      <span className={`text-sm ${getStockClass(v.stock)}`}>{v.stock}</span>
                    </div>
                    <span className={`text-xs sm:text-sm px-3 py-1.5 rounded-full font-medium ${getShippingClass(v.shipping)}`}>
                      {v.shipping}
                    </span>
                  </div>
                ))}
                {filtered.length === 0 && (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-6">🚫 Variant tidak ditemukan.</p>
                )}
              </div>
            </>
          )}

          {/* Kalau SUDAH pilih variant → tampilkan form */}
          {selectedVariant && (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-gray-100 dark:bg-gray-800/40">
                <p className="font-bold">Variant dipilih:</p>
                <p>{selectedVariant.name} — {selectedVariant.price}</p>
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
