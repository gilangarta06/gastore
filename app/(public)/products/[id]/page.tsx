//app/(public)/products/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Search, Star } from "lucide-react";
import { RatingDisplay } from "@/components/public/RatingDisplay";

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

interface ReviewData {
  reviews: Array<{
    _id: string;
    customerName: string;
    rating: number;
    review: string;
    variantName?: string;
    createdAt: string;
  }>;
  stats: {
    totalReviews: number;
    averageRating: number;
  };
}

function getValidImageUrl(src?: string) {
  if (!src) return "/images/fallback-product.png";
  try {
    new URL(src);
    return src;
  } catch {
    return "/images/fallback-product.png";
  }
}

export default function ProductDetailPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    const pathParts = window.location.pathname.split("/");
    const productId = pathParts[pathParts.length - 1];

    const fetchData = async () => {
      try {
        // Fetch product
        const productRes = await fetch(`/api/products/${productId}`);
        const productData = await productRes.json();
        setProduct(productData);

        // Fetch reviews
        const reviewRes = await fetch(`/api/reviews?productId=${productId}`);
        const reviewData = await reviewRes.json();
        setReviewData(reviewData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchData();
    }
  }, []);

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

  const getStockVariant = (stock: string) => {
    if (stock.toLowerCase().includes("habis")) return "destructive";
    if (stock.toLowerCase().includes("tersedia")) return "default";
    return "secondary";
  };

  const handleSubmit = async () => {
    if (!selectedVariant || !product) return;

    setSubmitting(true);

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
        if (data.paymentUrl) {
          window.open(data.paymentUrl, "_blank");
        }

        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        alert("❌ Gagal membuat pesanan: " + data.error);
      }
    } catch (err) {
      console.error("Submit order error:", err);
      alert("Terjadi kesalahan saat membuat pesanan");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Memuat produk...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <p className="text-muted-foreground text-lg">Produk tidak ditemukan</p>
          <Button onClick={() => (window.location.href = "/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={handleBack} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Kembali
      </Button>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Gambar & Info Produk */}
        <Card>
          <CardContent className="p-6">
            <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-6 border">
              <img
                src={getValidImageUrl(product.image)}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-3">
              <Badge variant="secondary" className="capitalize">
                {product.category}
              </Badge>
              <h1 className="text-3xl font-bold">{product.name}</h1>

              {/* Rating Summary */}
              {reviewData && reviewData.stats.totalReviews > 0 && (
                <div className="flex items-center gap-2 py-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.round(reviewData.stats.averageRating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300 fill-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">
                    {reviewData.stats.averageRating.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    ({reviewData.stats.totalReviews} ulasan)
                  </span>
                </div>
              )}

              <p className="text-muted-foreground leading-relaxed">
                {product.description || "Deskripsi produk belum tersedia."}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Form Pemesanan */}
        <div className="space-y-6">
          {!selectedVariant ? (
            <Card>
              <CardHeader>
                <CardTitle>Pilih Variant</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari variant..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {filtered.map((v, i) => (
                    <Card
                      key={i}
                      className={`cursor-pointer transition-all ${
                        v.quantity > 0
                          ? "hover:shadow-md hover:border-primary"
                          : "opacity-50 cursor-not-allowed"
                      }`}
                      onClick={() => v.quantity > 0 && setSelectedVariant(v)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="font-semibold">{v.name}</p>
                            <p className="text-lg font-bold text-primary">
                              Rp {v.price.toLocaleString()}
                            </p>
                          </div>
                          <Badge variant={getStockVariant(getStockText(v))}>
                            {getStockText(v)}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {filtered.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      🚫 Variant tidak ditemukan.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Detail Pemesanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Card className="bg-muted">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">
                      Variant Dipilih
                    </p>
                    <p className="font-bold text-lg">{selectedVariant.name}</p>
                    <p className="text-xl font-bold text-primary">
                      Rp {selectedVariant.price.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input
                      id="name"
                      placeholder="Masukkan nama lengkap"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      disabled={submitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      disabled={submitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Nomor HP</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="08xxxxxxxxxx"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      disabled={submitting}
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedVariant(null)}
                    className="flex-1"
                    disabled={submitting}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Ubah Variant
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="flex-1"
                    disabled={
                      !form.name ||
                      !form.email ||
                      !form.phone ||
                      submitting
                    }
                  >
                    {submitting ? "Memproses..." : "Pesan Sekarang"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Tabs: Deskripsi & Reviews */}
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="description">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="description">Deskripsi</TabsTrigger>
              <TabsTrigger value="reviews">
                Ulasan
                {reviewData && reviewData.stats.totalReviews > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {reviewData.stats.totalReviews}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-3">
                  Tentang Produk Ini
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description ||
                    "Deskripsi lengkap produk belum tersedia."}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              {reviewData ? (
                <RatingDisplay
                  reviews={reviewData.reviews}
                  averageRating={reviewData.stats.averageRating}
                  totalReviews={reviewData.stats.totalReviews}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Memuat ulasan...</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}