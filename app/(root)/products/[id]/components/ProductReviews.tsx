'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  profiles: {
    full_name: string;
    avatar_url?: string;
  };
}

interface ProductReviewsProps {
  reviews: Review[];
  averageRating: number;
}

export function ProductReviews({
  reviews,
  averageRating,
}: ProductReviewsProps) {
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Mock user state - in a real app, this would come from authentication
  const user = { id: '1' };

  const handleRatingChange = (rating: number) => {
    setNewRating(rating);
  };

  const handleSubmitReview = async () => {
    if (!user) {
      toast.error('Sign in required to leave a review');
      return;
    }

    if (newRating === 0) {
      toast.error('Please select a star rating before submitting');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please write a comment before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real implementation, this would connect to a database
      // For now, we'll just simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('Thank you for your feedback!');

      // Reset form
      setNewRating(0);
      setComment('');

      // In a real implementation, we would refresh the reviews
    } catch {
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Review summary */}
      <div className="bg-card rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-medium mb-2">Customer Reviews</h3>
            <div className="flex items-center">
              <div className="flex items-center text-amber-500 mr-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(averageRating)
                        ? 'fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span>
                {averageRating > 0
                  ? `${averageRating.toFixed(1)} out of 5 (${reviews.length} ${
                      reviews.length === 1 ? 'review' : 'reviews'
                    })`
                  : 'No reviews yet'}
              </span>
            </div>
          </div>

          {user && (
            <Button
              onClick={() =>
                document
                  .getElementById('write-review')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Write a Review
            </Button>
          )}
        </div>
      </div>

      {/* Reviews list */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-card rounded-lg p-6">
              <div className="flex items-start">
                <Avatar className="h-10 w-10 mr-4">
                  <AvatarImage
                    src={review.profiles.avatar_url}
                    alt={review.profiles.full_name}
                  />
                  <AvatarFallback>
                    {review.profiles.full_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <div>
                      <h4 className="font-medium">
                        {review.profiles.full_name}
                      </h4>
                      <div className="flex items-center text-amber-500">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? 'fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <span className="text-sm text-muted-foreground mt-1 sm:mt-0">
                      {formatDistanceToNow(new Date(review.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>

                  <p className="text-sm mt-2">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-lg p-8 text-center">
          <p className="text-muted-foreground mb-4">
            This product doesn&apos;t have any reviews yet. Be the first to
            share your thoughts!
          </p>
        </div>
      )}

      {/* Write a review form */}
      {user && (
        <div id="write-review" className="bg-card rounded-lg p-6 mt-8">
          <h3 className="text-xl font-medium mb-4">Write a Review</h3>

          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">Rating</p>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => handleRatingChange(rating)}
                  onMouseEnter={() => setHoverRating(rating)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none p-1"
                >
                  <Star
                    className={`h-8 w-8 ${
                      rating <= (hoverRating || newRating)
                        ? 'text-amber-500 fill-amber-500'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm">
                {newRating > 0 && `You rated ${newRating} out of 5`}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="comment"
              className="text-sm text-muted-foreground mb-2 block"
            >
              Your Review
            </label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Share your experience with this product..."
            />
          </div>

          <Button
            onClick={handleSubmitReview}
            disabled={isSubmitting || newRating === 0 || !comment.trim()}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </div>
      )}

      {!user && (
        <div className="bg-card rounded-lg p-6 text-center">
          <p className="text-muted-foreground mb-4">
            Please sign in to leave a review.
          </p>
          <Button asChild>
            <a href="/auth/signin">Sign In</a>
          </Button>
        </div>
      )}
    </div>
  );
}
