"use client";

import { useState, useEffect } from 'react';
import { Star, Send, CheckCircle } from 'lucide-react';
import { useParams, useSearchParams } from 'next/navigation';

export default function RateOrderPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params.id as string;
  const preSelectedRating = searchParams.get('rating');

  const [rating, setRating] = useState<number>(parseInt(preSelectedRating || '0'));
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setLoading(true);
    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, rating, feedback }),
      });
      
      const data = await response.json();
      console.log('Rating submitted:', data);
      
      if (data.success) {
        setSubmitted(true);
      } else {
        alert('Failed to submit rating. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating. Please try again.');
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-neutral-800 rounded-lg p-8 text-center border border-neutral-700">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Thank You!</h1>
          <p className="text-neutral-300 mb-6">
            Your feedback helps us serve you better. We appreciate your time!
          </p>
          <a
            href="/"
            className="inline-block bg-amber-600 hover:bg-amber-500 text-white font-semibold px-6 py-3 rounded-lg"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-neutral-800 rounded-lg p-8 border border-neutral-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">🔥 Club Grille</h1>
          <p className="text-neutral-400">How was your experience?</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-white font-semibold mb-4 text-center">
              Rate Your Order
            </label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-12 h-12 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-amber-500 text-amber-500'
                        : 'text-neutral-600'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-amber-500 font-semibold mt-3">
                {rating === 5 && '⭐ Excellent!'}
                {rating === 4 && '⭐ Good!'}
                {rating === 3 && '⭐ Okay'}
                {rating === 2 && '⭐ Could be better'}
                {rating === 1 && '⭐ Needs improvement'}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">
              Additional Feedback (Optional)
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us about your experience..."
              rows={4}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={rating === 0 || loading}
            className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-neutral-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              'Submitting...'
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Feedback
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}