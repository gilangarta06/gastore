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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

interface Account {
  username: string;
  password: string;
}

interface Variant {
  name: string;
  price: number;
  accounts: Account[];
}

interface Product {
  name: string;
  image: string;
  description?: string;
  variants: Variant[];
}

interface ProductDetailProps {
  open: boolean;
  onClose: () => void;
  product: Product;
}

export default function ProductDetailModal({
  open,
  onClose,
  product,
}: ProductDetailProps) {
  const [search, setSearch] = useState("");
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const filteredVariants = product.variants.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  const getStockText = (variant: Variant) => {
    const qty = variant.accounts.length;
    if (qty === 0) return "Stok habis";
    if (qty <= 5) return `Tersisa ${qty}`;
    return "Tersedia";
  };

  const getStockClass = (stockText: string) => {
    if (stockText.toLowerCase().includes("habis"))
      return "text-red-500 font-medium";
    if (stockText.toLowerCase().includes("tersedia"))
      return "text-green-500 font-medium";
    return "text-yellow-500 font-medium";
  };

  const handleSubmit = () => {
    alert(
      `✅ Pesanan berhasil dibuat!\n\n` +
        `Nama: ${form.name}\nEmail: ${form.email}\nNomor: ${form.phone}\nProduk: ${product.name}\nVarian: ${selectedVariant?.name}`
    );
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {product.name}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh] pr-4">
          {/* Gambar & deskripsi */}
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <Card className="w-full md:w-1/3 overflow-hidden border">
              <CardContent className="p-0">
                <Image
                  src={product.image || "/fallback-product.png"}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              </CardContent>
            </Card>

            <div className="flex-1 flex items-center">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description || "Deskripsi produk tidak tersedia."}
              </p>
            </div>
          </div>

          <Separator className="my-4" />

          {/* List variant */}
          {!selectedVariant ? (
            <>
              <Input
                placeholder="🔍 Cari variant..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mb-4"
              />

              <div className="space-y-3">
                {filteredVariants.length > 0 ? (
                  filteredVariants.map((v, i) => (
                    <Card
                      key={i}
                      className="cursor-pointer hover:bg-muted transition"
                      onClick={() => setSelectedVariant(v)}
                    >
                      <CardContent className="p-4 flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{v.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Rp {v.price.toLocaleString()}
                          </p>
                          <span
                            className={`text-xs ${getStockClass(getStockText(v))}`}
                          >
                            {getStockText(v)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    🚫 Variant tidak ditemukan.
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              <Card className="bg-muted/50 border mb-4">
                <CardContent className="p-4">
                  <p className="font-semibold">Varian dipilih:</p>
                  <p>
                    {selectedVariant.name} — Rp{" "}
                    {selectedVariant.price.toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    placeholder="Nama Lengkap"
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Alamat Email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Nomor HP</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Nomor WhatsApp Aktif"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setSelectedVariant(null)}>
                  ⬅ Kembali
                </Button>
                <Button onClick={handleSubmit}>✅ Pesan Sekarang</Button>
              </div>
            </>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
