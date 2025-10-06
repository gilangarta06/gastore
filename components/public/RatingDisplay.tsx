"use client";

import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Review {
  _id: string;
  customerName: string;
  rating: number;
  review: string;
  variantName?: string;
  createdAt: string;
}

interface RatingDisplayProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export function RatingDisplay({
  reviews,
  averageRating,
  totalReviews,
}: RatingDisplayProps) {
  // Komponen bintang rating
  const StarRating = ({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) => {
    const starSize = size === "lg" ? "w-5 h-5" : "w-4 h-4";
    
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              starSize,
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300 fill-gray-300"
            )}
          />
        ))}
      </div>
    );
  };

  // Hitung distribusi rating
  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { star, count, percentage };
  });

  if (totalReviews === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Belum ada ulasan untuk produk ini.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Average Rating */}
            <div className="flex flex-col items-center justify-center md:w-1/3 border-b md:border-b-0 md:border-r pb-6 md:pb-0">
              <div className="text-5xl font-bold mb-2">{averageRating.toFixed(1)}</div>
              <StarRating rating={Math.round(averageRating)} size="lg" />
              <p className="text-sm text-muted-foreground mt-2">
                {totalReviews} ulasan
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="flex-1 space-y-2">
              {ratingDistribution.map(({ star, count, percentage }) => (
                <div key={star} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm">{star}</span>
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  </div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8 text-right">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Ulasan Pelanggan</h3>
        {reviews.map((review) => (
          <Card key={review._id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold">{review.customerName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating rating={review.rating} />
                    {review.variantName && (
                      <Badge variant="secondary" className="text-xs">
                        {review.variantName}
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {review.review}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}