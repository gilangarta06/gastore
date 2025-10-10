"use client";

import { Star, MessageSquare, Award } from "lucide-react";
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
  const displayedReviews = reviews;

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
              "transition-colors duration-200",
              star <= rating
                ? "text-amber-400 fill-amber-400"
                : "text-muted-foreground/30 fill-muted-foreground/30"
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
      <Card className="glass-card border-border/40">
        <CardContent className="py-16">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-blue-500/10 mb-2">
              <MessageSquare className="w-10 h-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-xl">Belum Ada Ulasan</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Jadilah yang pertama memberikan ulasan untuk produk ini dan bantu pembeli lain!
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
      <Card className="glass-card border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Rating Score */}
            <div className="flex flex-col items-center justify-center md:w-1/3 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-2xl blur-xl" />
                <div className="relative px-8 py-6 rounded-2xl bg-gradient-to-br from-amber-400/10 to-orange-500/10 border border-amber-400/20">
                  <div className="text-6xl font-bold bg-gradient-to-br from-amber-400 to-orange-500 bg-clip-text text-transparent">
                    {averageRating.toFixed(1)}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 text-center">
                <StarRating rating={Math.round(averageRating)} size="lg" />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Award className="w-4 h-4 text-primary" />
                  <span className="font-medium">{totalReviews} ulasan</span>
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="flex-1 space-y-3">
              <p className="text-sm font-semibold text-foreground mb-4">Distribusi Rating</p>
              {distribution.map(({ star, count }) => {
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-3 group">
                    <div className="flex items-center gap-1.5 w-14">
                      <span className="text-sm font-semibold min-w-[8px]">{star}</span>
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    </div>
                    
                    <div className="flex-1 h-3 bg-muted/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500 ease-out group-hover:scale-105 origin-left"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    
                    <span className="text-sm text-muted-foreground w-12 text-right font-medium tabular-nums">
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
          <h3 className="text-lg font-bold flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-primary to-blue-500 rounded-full" />
            Ulasan Pelanggan
          </h3>
          <Badge 
            variant="secondary" 
            className="bg-primary/10 text-primary hover:bg-primary/20 border-0"
          >
            <MessageSquare className="w-3 h-3 mr-1" />
            {displayedReviews.length} ulasan
          </Badge>
        </div>

        <div className="space-y-3">
          {displayedReviews.map((review, index) => (
            <Card 
              key={review._id} 
              className="glass-card border-border/40 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <CardContent className="p-5 md:p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Customer Name with Avatar */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                        {review.customerName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-base truncate group-hover:text-primary transition-colors">
                          {review.customerName}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <StarRating rating={review.rating} />
                          {review.variantName && (
                            <Badge 
                              variant="secondary" 
                              className="text-xs bg-muted/50 border-0"
                            >
                              {review.variantName}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Date */}
                  <time className="text-xs text-muted-foreground whitespace-nowrap bg-muted/30 px-2 py-1 rounded-lg">
                    {new Date(review.createdAt).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </div>
                
                {/* Review Text */}
                <p className="text-sm text-muted-foreground leading-relaxed pl-13">
                  {review.review}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}