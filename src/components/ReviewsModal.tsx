import React, { useState } from 'react';
import { X, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReviewsModal: React.FC<ReviewsModalProps> = ({ isOpen, onClose }) => {
  const { reviews, addReview, user } = useApp();
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const publishedReviews = reviews.filter((r) => r.status === 'published');
  const avgRating =
    publishedReviews.length > 0
      ? (publishedReviews.reduce((sum, r) => sum + r.rating, 0) / publishedReviews.length).toFixed(1)
      : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    await addReview({
      customerName: user.name,
      rating: newRating,
      comment: newComment.trim(),
      status: 'published'
    });
    setNewComment('');
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md max-h-[90vh] flex flex-col bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden text-slate-900">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>Verified Diner Reviews</span>
            </h3>
            <p className="text-xs text-slate-600">
              {publishedReviews.length > 0
                ? `${avgRating} average across ${publishedReviews.length} real review${publishedReviews.length > 1 ? 's' : ''}`
                : 'Real community ratings • Be the first to review!'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reviews List & Submission */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Write a review form */}
          <form onSubmit={handleSubmit} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
              Write a Review for Coder Cafe
            </h4>

            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-600 mr-1">Your Rating:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewRating(star)}
                  className="p-1 cursor-pointer"
                >
                  <Star
                    className={`w-5 h-5 transition-colors ${
                      star <= newRating
                        ? 'fill-amber-500 text-amber-500'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
              <span className="font-mono text-xs font-bold text-amber-600 ml-2">
                {newRating}.0 / 5
              </span>
            </div>

            <textarea
              rows={2}
              required
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Tell others about food taste, freshness, delivery speed and packing..."
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 resize-none shadow-xs"
            />

            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="w-full py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:opacity-40 text-slate-950 font-black rounded-xl text-xs transition-colors cursor-pointer shadow-sm"
            >
              {isSubmitting ? 'Submitting to Firestore...' : 'Post Verified Review'}
            </button>
          </form>

          {/* Reviews Stream */}
          <div className="space-y-3">
            {publishedReviews.length === 0 ? (
              <div className="text-center py-8 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Star className="w-8 h-8 text-amber-400/60 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">No reviews yet</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Submit the first real review above or complete an order to share your feedback!
                </p>
              </div>
            ) : (
              publishedReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2 text-xs shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs">
                        {rev.customerName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-xs">{rev.customerName}</div>
                        <span className="text-[10px] text-slate-400">{rev.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-amber-700 font-mono font-bold bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>{rev.rating}.0</span>
                    </div>
                  </div>

                  <p className="text-slate-700 leading-relaxed text-xs">
                    {rev.comment}
                  </p>

                  {rev.dishesOrdered && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {rev.dishesOrdered.map((dish, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 font-mono"
                        >
                          {dish}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
