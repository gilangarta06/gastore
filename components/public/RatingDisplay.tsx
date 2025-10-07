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

interface ReviewStats {
  totalReviews?: number;
  averageRating?: number;
  ratingDistribution?: {
    5?: number;
    4?: number;
    3?: number;
    2?: number;
    1?: number;
  };
}

interface RatingDisplayProps {
  reviews: Review[];
  stats?: ReviewStats;
}

export function RatingDisplay({ reviews, stats }: RatingDisplayProps) {
  // Semua review ditampilkan, tidak pakai filter isApproved
  const displayedReviews = reviews;

  // Default fallback stats
  const {
    totalReviews = displayedReviews.length,
    averageRating =
      displayedReviews.length > 0
        ? displayedReviews.reduce((sum, r) => sum + r.rating, 0) / displayedReviews.length
        : 0,
    ratingDistribution,
  } = stats || {};

  // Star Rating Component
  const StarRating = ({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) => {
    const starSize = size === "lg" ? "w-5 h-5" : "w-4 h-4";
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              starSize,
              "transition-colors",
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300 fill-gray-300 dark:text-gray-600"
            )}
          />
        ))}
      </div>
    );
  };

  const getRatingDistribution = () => {
    if (ratingDistribution) {
      return [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: ratingDistribution[star as keyof typeof ratingDistribution] || 0,
      }));
    }

    return [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: displayedReviews.filter((r) => r.rating === star).length,
    }));
  };

  const distribution = getRatingDistribution();

  // Empty state
  if (displayedReviews.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-2">
              <Star className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Belum Ada Ulasan</h3>
              <p className="text-sm text-muted-foreground">
                Jadilah yang pertama memberikan ulasan untuk produk ini!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center justify-center md:w-1/3 border-b md:border-b-0 md:border-r pb-6 md:pb-0 md:pr-6">
              <div className="text-5xl font-bold mb-2 bg-gradient-to-br from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                {averageRating.toFixed(1)}
              </div>
              <StarRating rating={Math.round(averageRating)} size="lg" />
              <p className="text-sm text-muted-foreground mt-2">
                Dari {totalReviews} ulasan
              </p>
            </div>

            <div className="flex-1 space-y-2.5">
              {distribution.map(({ star, count }) => {
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 w-16">
                      <span className="text-sm font-medium">{star}</span>
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    </div>
                    <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-10 text-right font-medium">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <span className="h-1 w-1 bg-primary rounded-full"></span>
            Ulasan Pelanggan
          </h3>
          <Badge variant="secondary">{displayedReviews.length} ulasan</Badge>
        </div>

        <div className="space-y-3">
          {displayedReviews.map((review) => (
            <Card key={review._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-base truncate">{review.customerName}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <StarRating rating={review.rating} />
                      {review.variantName && (
                        <Badge variant="secondary" className="text-xs">
                          {review.variantName}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(review.createdAt).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{review.review}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
