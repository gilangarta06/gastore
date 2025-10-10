// app/(public)/invoice/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Star, ArrowLeft, CheckCircle2, AlertCircle, Sparkles, Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface Order {
  _id: string;
  orderId: string;
  customerName: string;
  email?: string;
  phone: string;
  productId: { _id: string; name: string } | string;
  variant: { name: string; price: number } | string;
  qty: number;
  total: number;
  status: string;
  createdAt: string;
  midtransOrderId?: string;
}

export default function InvoicePage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    const pathParts = window.location.pathname.split("/");
    const orderId = pathParts[pathParts.length - 1];

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        
        if (!res.ok) {
          throw new Error("Gagal memuat data pesanan");
        }

        const data = await res.json();
        setOrder(data);

        const productId =
          typeof data.productId === "object" ? data.productId._id : data.productId;

        if (productId) {
          const reviewRes = await fetch(`/api/reviews?productId=${productId}`);
          
          if (reviewRes.ok) {
            const reviewData = await reviewRes.json();
            const alreadyReviewed = reviewData.reviews?.some(
              (r: any) => r.orderId === data.orderId
            );
            setHasReviewed(Boolean(alreadyReviewed));
          }
        }
      } catch (err) {
        console.error("Failed to fetch order:", err);
        setError("Gagal memuat data pesanan. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, []);

  const handleSubmit = async () => {
    if (!rating || !review.trim() || !order) return;

    setError("");
    setSuccessMessage("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.orderId,
          productId:
            typeof order.productId === "object"
              ? order.productId._id
              : order.productId,
          rating,
          review,
        }),
      });

      const data = await res.json();

      if (res.ok && data.message) {
        setSubmitted(true);
        setHasReviewed(true);
        setSuccessMessage(data.message || "Review berhasil dikirim!");
        setRating(0);
        setReview("");
      } else {
        setError(data.error || "Gagal mengirim review. Silakan coba lagi.");
      }
    } catch (err) {
      console.error("Submit review error:", err);
      setError("Terjadi kesalahan saat mengirim review. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
            <Package className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <p className="text-sm text-muted-foreground font-medium">Memuat invoice...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md glass-card border-destructive/20">
          <CardContent className="pt-8 pb-6">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-xl">Invoice Tidak Ditemukan</h3>
                <p className="text-sm text-muted-foreground">
                  {error || "Invoice yang Anda cari tidak ditemukan."}
                </p>
              </div>
              <Button 
                onClick={() => (window.location.href = "/")} 
                className="w-full bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Beranda
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isPaid = order.status === "paid";
  const productName =
    typeof order.productId === "object" ? order.productId.name : "Produk";
  const variantName =
    typeof order.variant === "object" ? order.variant.name : order.variant;

  const getPrice = () => {
    if (typeof order.variant === "object" && order.variant.price) {
      return order.variant.price * order.qty;
    }
    if (order.total) {
      return order.total;
    }
    return 0;
  };

  const totalPrice = getPrice();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-3xl glass-card border-primary/20 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300">
        <CardHeader className="border-b border-border/40">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-500 rounded-xl blur-lg opacity-50" />
                <div className="relative p-3 bg-gradient-to-br from-primary to-blue-500 rounded-xl">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                  GA Store
                </h1>
                <p className="text-xs text-muted-foreground">Digital Store Platform</p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-3">
              <div>
                <p className="text-xs text-muted-foreground text-right mb-1">Status Pembayaran</p>
                <Badge 
                  className={cn(
                    "text-sm px-4 py-1.5 font-semibold",
                    isPaid 
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-lg shadow-green-500/30" 
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {isPaid ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-1.5" />
                      LUNAS
                    </>
                  ) : (
                    "PENDING"
                  )}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Order ID Section */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">ID Pesanan</p>
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/20 rounded-xl">
              <p className="text-xl font-mono font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                #{order.orderId || order.midtransOrderId || order._id}
              </p>
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Customer & Date Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Info */}
            <Card className="glass-card border-border/40">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-5 bg-gradient-to-b from-primary to-blue-500 rounded-full" />
                  <h3 className="font-bold text-sm">Detail Pembeli</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Nama:</span>
                    <span className="font-semibold">{order.customerName}</span>
                  </div>
                  {order.email && (
                    <div className="flex justify-between items-start">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium text-right break-all max-w-[60%]">{order.email}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Telepon:</span>
                    <span className="font-semibold">{order.phone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Date Info */}
            <Card className="glass-card border-border/40">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-5 bg-gradient-to-b from-primary to-blue-500 rounded-full" />
                  <h3 className="font-bold text-sm">Tanggal Pesanan</h3>
                </div>
                <div className="space-y-2">
                  <div className="text-sm">
                    <p className="text-muted-foreground mb-1">Dibuat pada:</p>
                    <p className="font-semibold text-lg">
                      {new Date(order.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      })}
                    </p>
                    <p className="text-muted-foreground text-xs mt-1">
                      {new Date(order.createdAt).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit"
                      })} WIB
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Details */}
          <Card className="glass-card border-primary/20 overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 p-4 border-b border-primary/20">
              <h3 className="font-bold flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" />
                Detail Pesanan
              </h3>
            </div>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/30">
                    <tr className="text-left text-muted-foreground">
                      <th className="py-3 px-4 font-semibold">Produk</th>
                      <th className="py-3 px-4 font-semibold">Varian</th>
                      <th className="py-3 px-4 font-semibold text-center">Qty</th>
                      <th className="py-3 px-4 font-semibold text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-border/40">
                      <td className="py-4 px-4 font-semibold">{productName}</td>
                      <td className="py-4 px-4">{variantName}</td>
                      <td className="py-4 px-4 text-center">
                        <Badge variant="secondary" className="font-bold">
                          {order.qty}x
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <p className="text-lg font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                          Rp {totalPrice.toLocaleString("id-ID")}
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Review Section */}
          {isPaid && (
            <>
              <Separator className="bg-border/50" />
              <Card className="glass-card border-amber-400/20 overflow-hidden">
                {hasReviewed || submitted ? (
                  <CardContent className="text-center py-12 space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/20 mb-2">
                      <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                        Terima kasih atas ulasanmu! 🎉
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        Review Anda sangat membantu kami untuk meningkatkan kualitas layanan
                      </p>
                    </div>
                    {successMessage && (
                      <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                        <p className="text-sm text-green-800 dark:text-green-300 font-medium">
                          {successMessage}
                        </p>
                      </div>
                    )}
                  </CardContent>
                ) : (
                  <>
                    <div className="bg-gradient-to-r from-amber-400/10 to-orange-500/10 p-5 border-b border-amber-400/20">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-500" />
                        Bagaimana pengalaman pembelianmu?
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Bagikan ulasan untuk membantu kami dan pembeli lainnya
                      </p>
                    </div>
                    
                    <CardContent className="p-6 space-y-5">
                      {/* Rating Stars */}
                      <div className="space-y-3">
                        <label className="text-sm font-semibold">
                          Berikan Rating <span className="text-destructive">*</span>
                        </label>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className={cn(
                                  "w-10 h-10 cursor-pointer transition-all hover:scale-110",
                                  star <= (hoverRating || rating)
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-muted-foreground/30"
                                )}
                              />
                            ))}
                          </div>
                          {rating > 0 && (
                            <Badge className="bg-amber-400/10 text-amber-600 dark:text-amber-400 border-0 text-sm font-bold">
                              {rating}/5 ⭐
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Review Text */}
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">
                          Ulasan <span className="text-destructive">*</span>
                        </label>
                        <Textarea
                          placeholder="Ceritakan pengalaman kamu dengan produk dan layanan kami... (Maksimal 500 karakter)"
                          value={review}
                          onChange={(e) => {
                            if (e.target.value.length <= 500) {
                              setReview(e.target.value);
                              setError("");
                            }
                          }}
                          className="min-h-[140px] resize-none rounded-xl border-border/50 focus:ring-2 focus:ring-amber-400/40"
                          disabled={submitting}
                        />
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">{review.length}/500 karakter</span>
                          {review.length >= 500 && (
                            <span className="text-destructive font-medium">Maksimal karakter tercapai</span>
                          )}
                        </div>
                      </div>

                      {/* Error Message */}
                      {error && (
                        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-destructive font-medium">{error}</p>
                        </div>
                      )}

                      {/* Submit Button */}
                      <Button 
                        onClick={handleSubmit} 
                        disabled={!rating || !review.trim() || submitting}
                        className="w-full h-11 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg shadow-amber-500/30 disabled:opacity-50"
                      >
                        {submitting ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
                            Mengirim Ulasan...
                          </>
                        ) : (
                          <>
                            <Star className="mr-2 h-4 w-4" />
                            Kirim Ulasan
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </>
                )}
              </Card>
            </>
          )}
        </CardContent>

        <CardFooter className="flex justify-center border-t border-border/40 pt-6">
          <Button 
            variant="ghost" 
            onClick={() => (window.location.href = "/")}
            className="gap-2 hover:bg-primary/10 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}