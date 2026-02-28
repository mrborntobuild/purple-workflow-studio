import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare, ThumbsUp, ChevronRight } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import { getAvatar } from './avatars';

const PENDING_REVIEWS = [
  {
    id: 1,
    project: 'Social Media Content Package',
    creator: 'Marcus Rivera',
    creatorAvatar: 'MR',
    completedDate: 'Feb 16, 2026',
    budget: '$400',
  },
];

const PAST_REVIEWS = [
  {
    id: 1,
    project: 'Logo Redesign with AI Variations',
    creator: 'Priya Patel',
    creatorAvatar: 'PP',
    rating: 5,
    date: 'Jan 15, 2026',
    text: 'Priya was incredible to work with. She created over 20 logo variations using her AI workflows, and the quality was outstanding. The whole process was transparent — I could see the nodes running and the iterations being generated in real time. Would absolutely hire again.',
  },
  {
    id: 2,
    project: 'Product Teaser Video',
    creator: 'Luna Martinez',
    creatorAvatar: 'LM',
    rating: 4,
    date: 'Dec 28, 2025',
    text: 'Luna delivered a great teaser video for our product launch. The AI-generated scenes were impressive, and she was responsive throughout the project. Only small note — the final delivery took a day longer than expected.',
  },
  {
    id: 3,
    project: 'E-commerce Product Shots',
    creator: 'Dev Okonkwo',
    creatorAvatar: 'DO',
    rating: 5,
    date: 'Dec 10, 2025',
    text: 'Dev transformed our basic product photos into studio-quality shots using his AI workflow. Fast turnaround, excellent communication, and the results exceeded expectations. Highly recommended for any product photography needs.',
  },
];

export default function ReviewsPage() {
  const [pendingRating, setPendingRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold">Reviews</h1>
          <p className="mt-1 text-sm text-gray-400">Rate creators you've worked with and view your past reviews</p>
        </div>

        {/* Pending Reviews */}
        {PENDING_REVIEWS.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Awaiting Your Review</h2>
            {PENDING_REVIEWS.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-6 space-y-5"
              >
                <div className="flex items-center gap-4">
                  <img src={getAvatar(review.creator)} alt={review.creator} className="h-12 w-12 rounded-full object-cover" />
                  <div className="flex-1">
                    <div className="font-semibold">{review.project}</div>
                    <div className="text-sm text-gray-400 mt-0.5">
                      with {review.creator} &middot; Completed {review.completedDate} &middot; {review.budget}
                    </div>
                  </div>
                </div>

                {/* Star Rating */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-400">Your Rating</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setPendingRating(star)}
                        className="p-0.5 transition-transform hover:scale-110"
                      >
                        <Star
                          size={28}
                          className={
                            star <= (hoverRating || pendingRating)
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-600'
                          }
                        />
                      </button>
                    ))}
                    {pendingRating > 0 && (
                      <span className="ml-3 text-sm text-gray-400">
                        {pendingRating === 5 ? 'Excellent!' : pendingRating === 4 ? 'Great' : pendingRating === 3 ? 'Good' : pendingRating === 2 ? 'Fair' : 'Poor'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Review Text */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-400">Your Review</label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows={4}
                    placeholder="Share your experience working with this creator. How was the quality? Communication? Would you hire them again?"
                    className="w-full rounded-xl border border-white/10 bg-[#0e0e11] px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all resize-none"
                  />
                </div>

                <button className="rounded-xl bg-purple-600 px-6 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all hover:bg-purple-500 hover:shadow-[0_0_30px_rgba(147,51,234,0.5)]">
                  Submit Review
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Past Reviews */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Your Past Reviews</h2>
          <div className="space-y-4">
            {PAST_REVIEWS.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
              >
                <div className="flex items-start gap-4">
                  <img src={getAvatar(review.creator)} alt={review.creator} className="h-10 w-10 rounded-full object-cover shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-sm">{review.project}</div>
                        <div className="text-xs text-gray-500 mt-0.5">with {review.creator} &middot; {review.date}</div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            className={star <= review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-700'}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-gray-300 leading-relaxed">{review.text}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
