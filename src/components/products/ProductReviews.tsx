"use client";

import { useState } from "react";
import { Stars } from "@/components/ui/Stars";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface Review {
  id: string;
  userName: string;
  rating: number;
  title: string | null;
  body: string | null;
  skinType: string | null;
  verifiedPurchase: boolean;
  createdAt: Date;
}

interface ProductReviewsProps {
  reviews: Review[];
  productId: string;
}

export function ProductReviews({ reviews, productId }: ProductReviewsProps) {
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);

  // Aggregate rating breakdown
  const breakdown = [0, 0, 0, 0, 0];
  reviews.forEach((r) => {
    if (r.rating >= 1 && r.rating <= 5) {
      breakdown[5 - r.rating]++;
    }
  });
  const maxCount = Math.max(...breakdown, 1);

  const displayedReviews = reviews.slice(0, visibleCount);
  const hasMore = visibleCount < reviews.length;

  return (
    <div>
      {/* Summary */}
      <div className="flex items-start gap-8 mb-8 p-6 bg-neutral-50 rounded-xl">
        <div className="text-center">
          <p className="text-4xl font-bold text-neutral-800">
            {reviews.length > 0
              ? (
                  reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
                ).toFixed(1)
              : "0.0"}
          </p>
          <Stars
            rating={
              reviews.length > 0
                ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
                : 0
            }
            size="sm"
            className="mt-1"
          />
          <p className="text-xs text-neutral-500 mt-1">
            {reviews.length} review{reviews.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex-1 space-y-1">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = breakdown[5 - star];
            const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2 text-sm">
                <span className="text-neutral-500 w-4 text-right">{star}</span>
                <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent-500 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-neutral-400 w-6 text-xs">{count}</span>
              </div>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="flex-shrink-0"
          onClick={() => setShowWriteReview(true)}
        >
          Write a Review
        </Button>
      </div>

      {/* Review cards */}
      {displayedReviews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-neutral-400">Be the first to review this product</p>
        </div>
      ) : (
        <div className="space-y-6">
          {displayedReviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-neutral-200 pb-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-semibold">
                  {review.userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-800">
                    {review.userName}
                  </p>
                  <div className="flex items-center gap-2">
                    <Stars rating={review.rating} size="sm" />
                    <span className="text-xs text-neutral-400">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                {review.verifiedPurchase && (
                  <span className="ml-auto text-xs text-primary-600 font-medium bg-primary-50 px-2 py-0.5 rounded-full">
                    Verified Purchase
                  </span>
                )}
              </div>
              {review.title && (
                <h4 className="text-sm font-semibold text-neutral-800 mt-1">
                  {review.title}
                </h4>
              )}
              {review.body && (
                <p className="text-sm text-neutral-600 mt-1 leading-relaxed">
                  {review.body}
                </p>
              )}
              {review.skinType && (
                <p className="text-xs text-neutral-400 mt-1">
                  Skin type: {review.skinType}
                </p>
              )}
            </div>
          ))}

          {hasMore && (
            <div className="text-center pt-2">
              <Button
                variant="ghost"
                onClick={() => setVisibleCount(visibleCount + 5)}
              >
                Load More Reviews
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Write Review Modal */}
      <Modal
        open={showWriteReview}
        onClose={() => setShowWriteReview(false)}
        title="Write a Review"
      >
        <WriteReviewForm
          productId={productId}
          onSuccess={() => setShowWriteReview(false)}
        />
      </Modal>
    </div>
  );
}

function WriteReviewForm({
  productId,
  onSuccess,
}: {
  productId: string;
  onSuccess: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSuccess();
      }}
    >
      {/* Star rating selector */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Rating
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="text-2xl transition-colors"
              aria-label={`${star} star`}
            >
              <Stars
                rating={hoverRating || rating}
                size="lg"
              />
            </button>
          ))}
        </div>
      </div>
      <Input label="Your Name" placeholder="Jane Doe" required />
      <Input label="Review Title" placeholder="Great product!" />
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Your Review
        </label>
        <textarea
          rows={4}
          placeholder="Share your experience..."
          className="block w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-800 placeholder-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        />
      </div>
      <Input label="Skin Type (optional)" placeholder="Combination / Oily / Dry" />
      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="ghost"
          onClick={onSuccess}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={rating === 0}>
          Submit Review
        </Button>
      </div>
    </form>
  );
}