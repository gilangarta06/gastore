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
  MessageSquare
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

  const getStockClass = (stock: string) => {
    if (stock.toLowerCase().includes("habis")) return "text-red-500";
    if (stock.toLowerCase().includes("tersedia")) return "text-green-500";
    return "text-yellow-500";
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <Package className="w-12 h-12 mx-auto text-primary animate-pulse" />
              <p className="text-muted-foreground">Memuat produk...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <AlertCircle className="w-16 h-16 text-muted-foreground" />
            <p className="text-muted-foreground text-lg">Produk tidak ditemukan</p>
            <Button 
              onClick={() => (window.location.href = "/")}
              className="bg-gradient-to-r from-primary to-primary/80"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Beranda
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={handleBack} 
          className="mb-6 hover:bg-primary/10 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Product Info Section - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Card */}
            <Card className="overflow-hidden border shadow-lg rounded-2xl">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-5 gap-6">
                  {/* Image */}
                  <div className="md:col-span-2 relative aspect-square md:aspect-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                    <img
                      src={getValidImageUrl(product.image)}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-black/60 backdrop-blur-sm text-white border-0 capitalize text-xs px-3 py-1">
                        {product.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="md:col-span-3 p-6 space-y-4">
                    <div>
                      <h1 className="text-2xl font-bold mb-3 leading-tight">
                        {product.name}
                      </h1>

                      {/* Rating & Stock Info */}
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        {reviewData && reviewData.stats.totalReviews > 0 ? (
                          <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-950/30 px-3 py-1.5 rounded-full">
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-3.5 h-3.5 ${
                                    star <= Math.round(reviewData.stats.averageRating)
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300 fill-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="font-semibold text-sm">
                              {reviewData.stats.averageRating.toFixed(1)}
                            </span>
                            <span className="text-muted-foreground text-xs">
                              ({reviewData.stats.totalReviews})
                            </span>
                          </div>
                        ) : (
                          <Badge variant="outline" className="px-3 py-1 text-xs">
                            Belum ada ulasan
                          </Badge>
                        )}

                        <div className="flex items-center gap-2 bg-green-50 dark:bg-green-950/30 px-3 py-1.5 rounded-full">
                          <Package className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                          <span className="font-semibold text-sm text-green-600 dark:text-green-400">
                            {getTotalStock()} Stok
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        Deskripsi
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {product.description || "Deskripsi produk belum tersedia."}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card className="border shadow-lg rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-primary/80 p-4 text-white">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Ulasan Produk
                  {reviewData && reviewData.stats.totalReviews > 0 && (
                    <Badge className="ml-2 bg-white/20 text-white border-0 text-xs px-2 py-0.5">
                      {reviewData.stats.totalReviews}
                    </Badge>
                  )}
                </h3>
              </div>
              <CardContent className="p-6">
                {reviewData ? (
                  <RatingDisplay
                    reviews={reviewData.reviews}
                    averageRating={reviewData.stats.averageRating}
                    totalReviews={reviewData.stats.totalReviews}
                  />
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                    <p className="text-sm text-muted-foreground">Memuat ulasan...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Form Section - 1 column (sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {!selectedVariant ? (
                <Card className="border shadow-lg rounded-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-primary to-primary/80 p-4 text-white">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      Pilih Variant
                    </h3>
                  </div>
                  <CardContent className="p-4 space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Cari variant..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 h-10 rounded-lg border"
                      />
                    </div>

                    <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-2">
                      {filtered.map((v, i) => {
                        const stockText = getStockText(v);
                        const isOutOfStock = v.quantity === 0;
                        
                        return (
                          <Card
                            key={i}
                            className={`transition-all duration-300 border ${
                              isOutOfStock
                                ? "opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-900"
                                : "cursor-pointer hover:border-primary hover:shadow-md hover:-translate-y-0.5 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
                            }`}
                            onClick={() => !isOutOfStock && setSelectedVariant(v)}
                          >
                            <CardContent className="p-4">
                              <div className="space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <p className="font-semibold text-sm leading-tight flex-1">
                                    {v.name}
                                  </p>
                                  {!isOutOfStock && (
                                    <ShoppingCart className="w-4 h-4 text-primary flex-shrink-0" />
                                  )}
                                </div>
                                <p className="text-lg font-bold text-primary">
                                  Rp {v.price.toLocaleString("id-ID")}
                                </p>
                                <div className="flex items-center gap-1.5 text-xs">
                                  <Package className="w-3.5 h-3.5" />
                                  <span className={`font-semibold ${getStockClass(stockText)}`}>
                                    {stockText}
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                      {filtered.length === 0 && (
                        <div className="text-center py-12">
                          <AlertCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                          <p className="text-sm text-muted-foreground">Variant tidak ditemukan.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border shadow-lg rounded-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 text-white">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      Checkout
                    </h3>
                  </div>
                  <CardContent className="p-4 space-y-4">
                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-primary/20">
                      <CardContent className="p-4">
                        <p className="text-xs font-medium text-muted-foreground mb-1.5">
                          Variant Dipilih
                        </p>
                        <p className="font-bold text-base mb-1.5">{selectedVariant.name}</p>
                        <p className="text-2xl font-bold text-primary">
                          Rp {selectedVariant.price.toLocaleString("id-ID")}
                        </p>
                      </CardContent>
                    </Card>

                    <Separator />

                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-sm font-medium">
                          Nama Lengkap *
                        </Label>
                        <Input
                          id="name"
                          placeholder="Masukkan nama lengkap"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          disabled={submitting}
                          className="h-10 rounded-lg border"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-sm font-medium">
                          Nomor WhatsApp *
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="08xxxxxxxxxx"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          disabled={submitting}
                          className="h-10 rounded-lg border"
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
                          className="h-10 rounded-lg border"
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="flex gap-2.5">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedVariant(null)}
                        className="flex-1 h-10 rounded-lg border"
                        disabled={submitting}
                      >
                        <ArrowLeft className="mr-1.5 h-4 w-4" />
                        Ubah
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        className="flex-1 h-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold shadow-md"
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
    </div>
  );
}