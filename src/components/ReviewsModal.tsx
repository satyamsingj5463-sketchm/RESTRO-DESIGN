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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-[#0D131F] border border-white/[0.12] rounded-3xl shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between bg-[#080C14]">
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>Verified Diner Reviews</span>
            </h3>
            <p className="text-xs text-slate-400">
              4.9 rating average across 1,200+ food lovers
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reviews List & Submission */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Write a review form */}
          <form onSubmit={handleSubmit} className="p-4 rounded-2xl bg-[#080C14] border border-white/[0.08] space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300">
              Leave a Review for Coder Cafe
            </h4>

            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 mr-1">Your Rating:</span>
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
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-700'
                    }`}
                  />
                </button>
              ))}
              <span className="font-mono text-xs font-bold text-amber-400 ml-2">
                {newRating}.0 / 5
              </span>
            </div>

            <textarea
              rows={2}
              required
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Tell others about food freshness, taste, packaging and delivery..."
              className="w-full px-3 py-2 bg-[#0D131F] border border-white/[0.1] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
            />

            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-md shadow-amber-500/20"
            >
              Post Verified Review
            </button>
          </form>

          {/* Reviews Stream */}
          <div className="space-y-3">
            {publishedReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-3.5 rounded-2xl bg-[#080C14] border border-white/[0.06] space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs">
                      {rev.customerName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs">{rev.customerName}</div>
                      <span className="text-[10px] text-slate-400">{rev.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-amber-400 font-mono font-bold bg-[#0D131F] px-2 py-0.5 rounded-lg border border-white/[0.08]">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{rev.rating}.0</span>
                  </div>
                </div>

                <p className="text-slate-300 leading-relaxed text-xs">
                  {rev.comment}
                </p>

                {rev.dishesOrdered && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {rev.dishesOrdered.map((dish, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-[#0D131F] text-slate-400 border border-white/[0.06] font-mono"
                      >
                        {dish}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
