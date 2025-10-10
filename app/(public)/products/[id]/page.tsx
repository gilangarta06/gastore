// app/(public)/products/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Search, 
  Star, 
  ShoppingCart, 
  Package, 
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Sparkles,
  TrendingUp
} from "lucide-react";
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
        const productRes = await fetch(`/api/products/${productId}`);
        const productData = await productRes.json();
        setProduct(productData);

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

  const handleSubmit = async () => {
    if (!selectedVariant || !product) return;

    if (!form.name.trim() || !form.phone.trim()) {
      alert("⚠️ Nama dan nomor HP wajib diisi!");
      return;
    }

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

  const getTotalStock = () => {
    return variants.reduce((sum, v) => sum + (v.quantity || 0), 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <Package className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <p className="text-muted-foreground font-medium">Memuat produk...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10">
              <AlertCircle className="w-10 h-10 text-destructive" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Produk Tidak Ditemukan</h2>
              <p className="text-muted-foreground">Produk yang Anda cari tidak tersedia</p>
            </div>
            <Button 
              onClick={() => (window.location.href = "/")}
              className="bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Beranda
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const totalStock = getTotalStock();
  const isLowStock = totalStock > 0 && totalStock <= 10;

  return (
    <div className="min-h-screen relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={handleBack} 
          className="mb-6 hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Product Info Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Card */}
            <Card className="glass-card border-border/40 hover:border-primary/20 transition-all duration-300 overflow-hidden">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-5 gap-0">
                  {/* Image */}
                  <div className="md:col-span-2 relative aspect-square md:aspect-auto bg-muted/30">
                    <img
                      src={getValidImageUrl(product.image)}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <Badge className="bg-gradient-to-r from-primary to-blue-500 text-white border-0 capitalize shadow-lg">
                        {product.category}
                      </Badge>
                      {isLowStock && (
                        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          Stok Terbatas
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="md:col-span-3 p-6 space-y-5">
                    <div className="space-y-3">
                      <h1 className="text-2xl md:text-3xl font-bold leading-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                        {product.name}
                      </h1>

                      {/* Rating & Stock */}
                      <div className="flex flex-wrap items-center gap-3">
                        {reviewData && reviewData.stats.totalReviews > 0 ? (
                          <div className="flex items-center gap-2 glass-card px-3 py-1.5 rounded-full border-amber-400/20">
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-3.5 h-3.5 ${
                                    star <= Math.round(reviewData.stats.averageRating)
                                      ? "text-amber-400 fill-amber-400"
                                      : "text-muted-foreground/30 fill-muted-foreground/30"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="font-bold text-sm">
                              {reviewData.stats.averageRating.toFixed(1)}
                            </span>
                            <span className="text-muted-foreground text-xs">
                              ({reviewData.stats.totalReviews})
                            </span>
                          </div>
                        ) : (
                          <Badge variant="secondary" className="border-border/40">
                            Belum ada ulasan
                          </Badge>
                        )}

                        <div className="flex items-center gap-2 glass-card px-3 py-1.5 rounded-full border-primary/20">
                          <Package className="w-3.5 h-3.5 text-primary" />
                          <span className="font-bold text-sm text-primary">
                            {totalStock} Stok
                          </span>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-border/50" />

                    {/* Description */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-5 bg-gradient-to-b from-primary to-blue-500 rounded-full" />
                        <h3 className="text-sm font-bold uppercase tracking-wide">
                          Deskripsi
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed pl-3">
                        {product.description || "Deskripsi produk belum tersedia."}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card className="glass-card border-primary/20 overflow-hidden">
              <div className="bg-gradient-to-r from-primary via-blue-500 to-primary p-5 text-white">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Ulasan Produk
                  {reviewData && reviewData.stats.totalReviews > 0 && (
                    <Badge className="ml-2 bg-white/20 text-white border-0 hover:bg-white/30">
                      {reviewData.stats.totalReviews}
                    </Badge>
                  )}
                </h3>
              </div>
              <CardContent className="p-6">
                {reviewData ? (
                  <RatingDisplay
                    reviews={reviewData.reviews}
                    stats={reviewData.stats}
                  />
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">Memuat ulasan...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Form Section (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {!selectedVariant ? (
                <Card className="glass-card border-primary/20 overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300">
                  <div className="bg-gradient-to-r from-primary to-blue-500 p-5 text-white">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Pilih Variant
                    </h3>
                  </div>
                  <CardContent className="p-4 space-y-4">
                    {/* Search */}
                    <div className="relative group">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        placeholder="Cari variant..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 h-10 rounded-xl border-border/50 focus:ring-2 focus:ring-primary/40"
                      />
                    </div>

                    {/* Variant List */}
                    <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                      {filtered.map((v, i) => {
                        const stockText = getStockText(v);
                        const isOutOfStock = v.quantity === 0;
                        const isLowStock = v.quantity > 0 && v.quantity <= 3;
                        
                        return (
                          <Card
                            key={i}
                            className={`transition-all duration-300 border ${
                              isOutOfStock
                                ? "opacity-50 cursor-not-allowed bg-muted/30"
                                : "cursor-pointer hover:border-primary hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 glass-card"
                            }`}
                            onClick={() => !isOutOfStock && setSelectedVariant(v)}
                          >
                            <CardContent className="p-4 space-y-3">
                              <div className="flex items-start justify-between gap-2">
                                <p className="font-semibold text-sm leading-tight flex-1">
                                  {v.name}
                                </p>
                                {isLowStock && !isOutOfStock && (
                                  <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs border-0">
                                    Hot
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center justify-between">
                                <p className="text-lg font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                                  Rp {v.price.toLocaleString("id-ID")}
                                </p>
                                {!isOutOfStock && (
                                  <ShoppingCart className="w-4 h-4 text-primary" />
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 text-xs">
                                <Package className="w-3.5 h-3.5" />
                                <span className={`font-semibold ${
                                  isOutOfStock ? "text-destructive" : 
                                  isLowStock ? "text-amber-600 dark:text-amber-400" : 
                                  "text-green-600 dark:text-green-400"
                                }`}>
                                  {stockText}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                      {filtered.length === 0 && (
                        <div className="text-center py-12">
                          <AlertCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                          <p className="text-sm text-muted-foreground">Variant tidak ditemukan</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="glass-card border-green-500/30 overflow-hidden hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-300">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-5 text-white">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      Checkout
                    </h3>
                  </div>
                  <CardContent className="p-4 space-y-4">
                    {/* Selected Variant */}
                    <Card className="bg-gradient-to-br from-primary/10 to-blue-500/10 border-primary/20">
                      <CardContent className="p-4 space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">
                          Variant Dipilih
                        </p>
                        <p className="font-bold text-base">{selectedVariant.name}</p>
                        <p className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                          Rp {selectedVariant.price.toLocaleString("id-ID")}
                        </p>
                      </CardContent>
                    </Card>

                    <Separator className="bg-border/50" />

                    {/* Form */}
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-sm font-medium">
                          Nama Lengkap <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="name"
                          placeholder="Masukkan nama lengkap"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          disabled={submitting}
                          className="h-10 rounded-xl border-border/50"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-sm font-medium">
                          Nomor WhatsApp <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="08xxxxxxxxxx"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          disabled={submitting}
                          className="h-10 rounded-xl border-border/50"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-sm font-medium">
                          Email (Opsional)
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="email@example.com"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          disabled={submitting}
                          className="h-10 rounded-xl border-border/50"
                        />
                      </div>
                    </div>

                    <Separator className="bg-border/50" />

                    {/* Action Buttons */}
                    <div className="flex gap-2.5">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedVariant(null)}
                        className="flex-1 h-10 rounded-xl border-border/50 hover:border-primary/50"
                        disabled={submitting}
                      >
                        <ArrowLeft className="mr-1.5 h-4 w-4" />
                        Ubah
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        className="flex-1 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold shadow-lg shadow-green-500/30"
                        disabled={!form.name || !form.phone || submitting}
                      >
                        {submitting ? (
                          "Memproses..."
                        ) : (
                          <>
                            <ShoppingCart className="mr-1.5 h-4 w-4" />
                            Pesan
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--primary) / 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--primary) / 0.5);
        }
      `}</style>
    </div>
  );
}