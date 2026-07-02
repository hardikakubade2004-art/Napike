/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Check, MessageSquare, Sparkles, User, UserCheck } from 'lucide-react';
import { REVIEWS } from '../data/products';

export default function Reviews() {
  const [reviewsList, setReviewsList] = useState(REVIEWS);
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  // Form State
  const [newName, setNewName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newOccasion, setNewOccasion] = useState('Wedding');
  const [formSuccess, setFormSuccess] = useState(false);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim() === '' || newComment.trim() === '') return;

    const newReviewItem = {
      id: `custom-rev-${Date.now()}`,
      name: newName,
      role: 'Verified Customer',
      comment: newComment,
      rating: newRating,
      location: newLocation || 'India',
      date: 'Just now',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80' // default elegant avatar placeholder
    };

    setReviewsList([newReviewItem, ...reviewsList]);
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setShowReviewForm(false);
      // Reset form
      setNewName('');
      setNewLocation('');
      setNewRating(5);
      setNewComment('');
      setNewOccasion('Wedding');
    }, 2500);
  };

  return (
    <section id="customer-reviews" className="py-24 bg-brand-cream border-t border-brand-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4 text-left">
          <div className="max-w-2xl">
            <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-brand-gold">Praise & Gratitude</span>
            <h2 className="serif-display text-3xl sm:text-4xl font-normal text-brand-charcoal mt-3">
              Words From Our Patrons
            </h2>
            <div className="w-12 h-[1px] bg-brand-gold mt-4 mb-3" />
            <p className="text-brand-brown text-sm leading-relaxed">
              Read stories of organic beauty and zero-waste utility shared by couples, wedding planners, and gift recipients worldwide.
            </p>
          </div>
          <button
            id="write-review-toggle-btn"
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="flex items-center space-x-2 bg-brand-sage hover:bg-brand-sage-dark text-white text-xs font-semibold uppercase tracking-wider px-6 py-3 rounded-full shadow-sm hover:shadow-md transition-all self-start md:self-auto cursor-pointer"
          >
            <MessageSquare size={14} />
            <span>Write A Review</span>
          </button>
        </div>

        {/* Collapsible Custom Review Composer Form */}
        <AnimatePresence>
          {showReviewForm && (
            <motion.div
              id="review-form-container"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white border border-brand-beige p-6 sm:p-8 rounded-[36px] shadow-sm mb-12 text-left overflow-hidden"
            >
              {formSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 text-center space-y-4"
                >
                  <div className="p-3 bg-brand-beige w-fit rounded-full mx-auto text-brand-sage">
                    <Sparkles size={24} className="animate-spin" />
                  </div>
                  <h3 className="serif-display text-2xl font-light text-brand-charcoal">Review Published Beautifully</h3>
                  <p className="text-brand-brown text-sm">Thank you! Your verified sustainable review has been integrated into our ledger.</p>
                </motion.div>
              ) : (
                <form id="new-review-form" onSubmit={handleReviewSubmit} className="space-y-6">
                  <h3 className="serif-display text-xl font-medium text-brand-charcoal border-b border-brand-beige pb-3">Share Your Gifting Experience</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-brown-light">Your Name *</label>
                      <input
                        id="form-rev-name"
                        type="text"
                        required
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="e.g. Radhika Jhanji"
                        className="w-full bg-brand-cream border border-brand-beige rounded-xl p-3 text-sm focus:outline-none focus:border-brand-sage focus:ring-1 focus:ring-brand-sage-light text-brand-charcoal"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-brown-light">Your Location</label>
                      <input
                        id="form-rev-location"
                        type="text"
                        value={newLocation}
                        onChange={(e) => setNewLocation(e.target.value)}
                        placeholder="e.g. New Delhi"
                        className="w-full bg-brand-cream border border-brand-beige rounded-xl p-3 text-sm focus:outline-none focus:border-brand-sage focus:ring-1 focus:ring-brand-sage-light text-brand-charcoal"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Star selection */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-brown-light block">Your Rating</label>
                      <div className="flex space-x-1.5">
                        {[1, 2, 3, 4, 5].map((stars) => (
                          <button
                            key={stars}
                            type="button"
                            id={`form-star-${stars}`}
                            onClick={() => setNewRating(stars)}
                            className="text-brand-gold hover:scale-110 transition-transform cursor-pointer"
                          >
                            <Star
                              size={20}
                              className={stars <= newRating ? 'fill-brand-gold' : 'text-brand-beige'}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Occasion list select */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-brown-light">Occasion Celebrated</label>
                      <select
                        id="form-rev-occasion"
                        value={newOccasion}
                        onChange={(e) => setNewOccasion(e.target.value)}
                        className="w-full bg-brand-cream border border-brand-beige rounded-xl p-3 text-sm focus:outline-none focus:border-brand-sage text-brand-charcoal"
                      >
                        <option value="Wedding">Wedding</option>
                        <option value="Birthday">Birthday</option>
                        <option value="Baby Shower">Baby Shower</option>
                        <option value="Corporate">Corporate Gifting</option>
                        <option value="Festive">Traditional / Festive</option>
                        <option value="Housewarming">Housewarming</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-brand-brown-light">Your Comment *</label>
                    <textarea
                      id="form-rev-comment"
                      rows={3}
                      required
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Tell other gift lovers why you enjoyed Napike bouquets, the napkin quality, wash care results, or customization services..."
                      className="w-full bg-brand-cream border border-brand-beige rounded-2xl p-4 text-xs sm:text-sm focus:outline-none focus:border-brand-sage text-brand-charcoal resize-none"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      id="cancel-review-btn"
                      onClick={() => setShowReviewForm(false)}
                      className="px-5 py-2.5 rounded-full border border-brand-beige hover:bg-brand-cream text-brand-charcoal text-xs font-semibold uppercase tracking-wider cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      id="submit-review-btn"
                      className="px-6 py-2.5 rounded-full bg-brand-sage hover:bg-brand-sage-dark text-white text-xs font-semibold uppercase tracking-wider shadow-sm hover:shadow-md cursor-pointer"
                    >
                      Publish Review
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reviews Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviewsList.map((review, idx) => (
            <motion.div
              key={review.id}
              id={`review-item-${review.id}`}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-white p-8 rounded-[36px] border border-brand-beige hover:border-brand-gold/10 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between text-left space-y-6"
            >
              {/* Star line */}
              <div className="flex justify-between items-center">
                <div className="flex text-brand-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < review.rating ? 'fill-brand-gold text-brand-gold' : 'text-brand-beige'}
                    />
                  ))}
                </div>
                <span className="text-[9px] uppercase tracking-widest font-mono text-brand-brown-light">{review.date}</span>
              </div>

              {/* Comment text */}
              <p className="text-brand-brown text-xs sm:text-sm italic leading-relaxed flex-1">
                "{review.comment}"
              </p>

              {/* User bottom profile card info */}
              <div className="flex items-center space-x-3.5 pt-4 border-t border-brand-beige/50">
                <div className="w-10 h-10 rounded-full bg-brand-beige overflow-hidden shrink-0 border border-brand-gold/10">
                  {review.avatar ? (
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-sage-dark">
                      <User size={18} />
                    </div>
                  )}
                </div>
                <div className="text-left min-w-0">
                  <h4 className="font-semibold text-brand-charcoal text-sm truncate flex items-center">
                    {review.name}
                    <UserCheck size={12} className="text-brand-sage ml-1.5 shrink-0" title="Verified Buyer" />
                  </h4>
                  <p className="text-[10px] text-brand-brown-light font-medium tracking-wide truncate">
                    {review.role} • {review.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
