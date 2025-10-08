//app/(public)/invoice/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Star, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
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

        // Cek apakah sudah pernah review
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

    // Reset messages
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
        
        // Reset form
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="text-sm text-muted-foreground">Memuat invoice...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Invoice Tidak Ditemukan</h3>
                <p className="text-sm text-muted-foreground">
                  {error || "Invoice yang Anda cari tidak ditemukan."}
                </p>
              </div>
              <Button onClick={() => (window.location.href = "/")} className="w-full">
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/20">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <svg className="h-6 w-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <h1 className="text-xl font-bold">GA Store</h1>
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">Invoice</h2>
            <Badge 
              variant={isPaid ? "default" : "secondary"}
              className={isPaid ? "bg-green-500 hover:bg-green-600" : ""}
            >
              {isPaid ? "✓ LUNAS" : "PENDING"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Detail Pembeli & Order ID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-base flex items-center gap-2">
                <span className="h-1 w-1 bg-primary rounded-full"></span>
                Detail Pembeli
              </h3>
              <div className="space-y-2 text-sm bg-muted/30 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nama:</span>
                  <span className="font-medium">{order.customerName}</span>
                </div>
                {order.email && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium text-right break-all">{order.email}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Telepon:</span>
                  <span className="font-medium">{order.phone}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-muted-foreground">Tanggal:</span>
                  <span className="font-medium">
                    {new Date(order.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3 text-left md:text-right">
              <h3 className="font-semibold text-base flex items-center gap-2 md:justify-end">
                <span className="h-1 w-1 bg-primary rounded-full"></span>
                ID Pesanan
              </h3>
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-lg font-mono font-bold text-primary">
                  #{order.orderId || order.midtransOrderId || order._id}
                </p>
              </div>
            </div>
          </div>

          {/* Detail Pesanan */}
          <div className="space-y-3">
            <h3 className="font-semibold text-base flex items-center gap-2">
              <span className="h-1 w-1 bg-primary rounded-full"></span>
              Detail Pesanan
            </h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr className="text-left text-muted-foreground">
                    <th className="py-3 px-4 font-medium">Produk</th>
                    <th className="py-3 px-4 font-medium">Varian</th>
                    <th className="py-3 px-4 font-medium text-center">Qty</th>
                    <th className="py-3 px-4 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="py-4 px-4 font-medium">{productName}</td>
                    <td className="py-4 px-4">{variantName}</td>
                    <td className="py-4 px-4 text-center font-semibold">{order.qty}</td>
                    <td className="py-4 px-4 text-right font-bold text-primary">
                      Rp {totalPrice.toLocaleString("id-ID")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Review Section */}
          {isPaid && (
            <>
              <Separator className="my-6" />
              <div className="space-y-4">
                {hasReviewed || submitted ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-2">
                      <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Terima kasih atas ulasanmu! 🎉
                      </h3>
                    </div>
                    {successMessage && (
                      <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <p className="text-sm text-green-800 dark:text-green-300">
                          {successMessage}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        Bagaimana pengalaman pembelianmu?
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Bagikan ulasan untuk membantu kami dan pembeli lainnya.
                      </p>
                    </div>

                    {/* Rating Stars */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className={cn(
                              "w-9 h-9 cursor-pointer transition-all hover:scale-110",
                              star <= (hoverRating || rating)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-muted-foreground/30"
                            )}
                          />
                        ))}
                      </div>
                      {rating > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {rating}/5
                        </Badge>
                      )}
                    </div>

                    {/* Review Text */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
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
                        className="min-h-[120px] resize-none"
                        disabled={submitting}
                      />
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>{review.length}/500 karakter</span>
                        {review.length >= 500 && (
                          <span className="text-destructive">Maksimal karakter tercapai</span>
                        )}
                      </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-destructive">{error}</p>
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end pt-2">
                      <Button 
                        onClick={handleSubmit} 
                        disabled={!rating || !review.trim() || submitting}
                        className="min-w-[140px]"
                      >
                        {submitting ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
                            Mengirim...
                          </>
                        ) : (
                          <>
                            <Star className="mr-2 h-4 w-4" />
                            Kirim Ulasan
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>

        <CardFooter className="flex justify-center border-t pt-6">
          <Button 
            variant="ghost" 
            onClick={() => (window.location.href = "/")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}