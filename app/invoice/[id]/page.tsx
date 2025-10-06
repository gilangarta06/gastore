"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function InvoicePage() {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!review) return;
    setSubmitted(true);
    // kirim ke API ulasan di sini
    console.log({ rating, review });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <svg
              className="h-8 w-8 text-primary"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z" />
            </svg>
            <h1 className="text-xl font-bold">Tech Haven</h1>
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">Invoice</h2>
            <Badge variant="success">LUNAS</Badge>
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
                  <span>Alex Johnson</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span>alex.j@email.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tanggal:</span>
                  <span>20 Juli 2024</span>
                </div>
              </div>
            </div>
            <div className="text-left md:text-right">
              <h3 className="font-semibold text-lg mb-2">ID Pesanan</h3>
              <div className="flex items-center justify-start md:justify-end gap-2">
                <p className="text-sm text-muted-foreground">#20240720-12345</p>
                <Button variant="ghost" size="icon">
                  <svg
                    fill="currentColor"
                    height="16"
                    viewBox="0 0 256 256"
                    width="16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M200,32H104a8,8,0,0,0,0,16h96V208H104a8,8,0,0,0,0,16h96a16,16,0,0,0,16-16V48A16,16,0,0,0,200,32ZM56,72H152a8,8,0,0,0,0-16H56A16,16,0,0,0,40,72V208a16,16,0,0,0,16,16H152a8,8,0,0,0,0-16H56Z"></path>
                  </svg>
                </Button>
              </div>
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
                    <td className="py-3 px-3">Aplikasi Produktivitas</td>
                    <td className="py-3 px-3">Premium</td>
                    <td className="py-3 px-3 text-center">1</td>
                    <td className="py-3 px-3 text-right">Rp 150.000</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-xl font-bold">Rp 150.000</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Ulasan */}
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Bagaimana pengalaman pembelianmu?
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Bagikan ulasan Anda untuk membantu kami menjadi lebih baik.
            </p>

            {/* Rating Bintang */}
            <div className="flex items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className={cn(
                    "w-6 h-6 cursor-pointer transition-colors",
                    star <= (hoverRating || rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-muted-foreground"
                  )}
                />
              ))}
            </div>

            <Textarea
              placeholder="Tulis ulasan singkat..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="min-h-[100px]"
            />

            <div className="flex justify-end mt-4">
              <Button onClick={handleSubmit}>Kirim Ulasan</Button>
            </div>
          </div>

          {submitted && (
            <p className="text-center text-green-500 font-medium">
              Terima kasih atas ulasanmu!
            </p>
          )}
        </CardContent>

        <CardFooter className="flex justify-center border-t pt-4">
          <Button variant="link">Kembali ke Beranda</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
