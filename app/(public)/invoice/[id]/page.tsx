"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Star, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface Order {
  _id: string;
  orderId: string; // ✅ tambahkan
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

  useEffect(() => {
    const pathParts = window.location.pathname.split("/");
    const orderId = pathParts[pathParts.length - 1];

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();

        setOrder(data);

        // ✅ Pastikan productId ada sebelum ambil review
        const productId =
          typeof data.productId === "object" ? data.productId._id : data.productId;

        if (productId) {
          const reviewRes = await fetch(`/api/reviews?productId=${productId}`);
          const reviewData = await reviewRes.json();

          // ✅ Pakai order.orderId, bukan _id
          const alreadyReviewed = reviewData.reviews?.some(
            (r: any) => r.orderId === data.orderId
          );

          setHasReviewed(Boolean(alreadyReviewed));
        }
      } catch (err) {
        console.error("Failed to fetch order:", err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, []);

  const handleSubmit = async () => {
    if (!rating || !review.trim() || !order) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.orderId, // ✅ gunakan orderId string (ORD-xxxx)
          productId:
            typeof order.productId === "object"
              ? order.productId._id
              : order.productId,
          rating,
          review,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
        setHasReviewed(true);
      } else {
        alert("❌ " + data.error);
      }
    } catch (err) {
      console.error("Submit review error:", err);
      alert("Terjadi kesalahan saat mengirim review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Memuat invoice...</p>
      </div>
    );

  if (!order)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Invoice tidak ditemukan</p>
          <Button onClick={() => (window.location.href = "/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    );

  const isPaid = order.status === "paid";
  const productName =
    typeof order.productId === "object" ? order.productId.name : "Produk";
  const variantName =
    typeof order.variant === "object" ? order.variant.name : order.variant;
  const totalPrice =
    typeof order.variant === "object"
      ? order.variant.price * order.qty
      : order.total;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <svg className="h-8 w-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10 5z" />
            </svg>
            <h1 className="text-xl font-bold">Tech Haven</h1>
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">Invoice</h2>
            <Badge variant={isPaid ? "success" : "secondary"}>
              {isPaid ? "LUNAS" : "PENDING"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Detail Pembeli */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Detail Pembeli</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nama:</span>
                  <span>{order.customerName}</span>
                </div>
                {order.email && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span>{order.email}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tanggal:</span>
                  <span>{new Date(order.createdAt).toLocaleDateString("id-ID")}</span>
                </div>
              </div>
            </div>
            <div className="text-left md:text-right">
              <h3 className="font-semibold text-lg mb-2">ID Pesanan</h3>
              <p className="text-sm text-muted-foreground">
                #{order.orderId || order.midtransOrderId || order._id}
              </p>
            </div>
          </div>

          {/* Detail Pesanan */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Detail Pesanan</h3>
            <div className="border rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr className="text-left text-muted-foreground">
                    <th className="py-2 px-3 font-medium">Produk</th>
                    <th className="py-2 px-3 font-medium">Varian</th>
                    <th className="py-2 px-3 font-medium text-center">Jumlah</th>
                    <th className="py-2 px-3 font-medium text-right">Harga</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="py-3 px-3">{productName}</td>
                    <td className="py-3 px-3">{variantName}</td>
                    <td className="py-3 px-3 text-center">{order.qty}</td>
                    <td className="py-3 px-3 text-right">
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
              <Separator />
              <div>
                {hasReviewed || submitted ? (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                      <svg
                        className="w-8 h-8 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Terima kasih atas ulasanmu!</h3>
                    <p className="text-sm text-muted-foreground">
                      Review kamu sangat membantu kami untuk menjadi lebih baik.
                    </p>
                  </div>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold mb-2">
                      Bagaimana pengalaman pembelianmu?
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Bagikan ulasan Anda untuk membantu kami menjadi lebih baik.
                    </p>

                    <div className="flex items-center gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className={cn(
                            "w-8 h-8 cursor-pointer transition-colors",
                            star <= (hoverRating || rating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-muted-foreground"
                          )}
                        />
                      ))}
                      {rating > 0 && (
                        <span className="ml-2 text-sm text-muted-foreground">{rating}/5</span>
                      )}
                    </div>

                    <Textarea
                      placeholder="Tulis ulasan singkat tentang produk dan pelayanan kami..."
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      className="min-h-[120px]"
                      disabled={submitting}
                    />

                    <div className="flex justify-end mt-4">
                      <Button onClick={handleSubmit} disabled={!rating || !review.trim() || submitting}>
                        {submitting ? "Mengirim..." : "Kirim Ulasan"}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </CardContent>

        <CardFooter className="flex justify-center border-t pt-4">
          <Button variant="link" onClick={() => (window.location.href = "/")}>
            Kembali ke Beranda
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
