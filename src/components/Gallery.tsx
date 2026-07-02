/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, X, ArrowUpRight, Heart, HeartOff } from 'lucide-react';
import { GALLERY_ITEMS } from '../data/products';
import { GalleryItem } from '../types';

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);
  const [likedPhotos, setLikedPhotos] = useState<Record<string, boolean>>({});

  const categories = [
    { id: 'all', label: 'All Photos' },
    { id: 'wedding', label: 'Weddings' },
    { id: 'birthday', label: 'Birthdays' },
    { id: 'babyshower', label: 'Baby Showers' },
    { id: 'corporate', label: 'Corporate' },
    { id: 'festive', label: 'Festive' },
    { id: 'lifestyle', label: 'Lifestyle Craft' }
  ];

  const filteredItems = selectedCategory === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === selectedCategory);

  const toggleLikePhoto = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedPhotos(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="gallery-portfolio" className="py-24 bg-brand-cream border-t border-brand-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-brand-gold">Lookbook Gallery</span>
          <h2 className="serif-display text-3xl sm:text-4xl font-normal text-brand-charcoal mt-3">
            Inspirations & Celebrations
          </h2>
          <div className="w-12 h-[1px] bg-brand-gold mx-auto mt-4 mb-3" />
          <p className="text-brand-brown text-sm leading-relaxed">
            See how Napike bouquets elevate weddings, modern dinner tables, baby showers, and luxury festive gifting layouts.
          </p>
        </div>

        {/* Filter Categories Header */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`gallery-cat-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-brand-sage text-white shadow-sm'
                  : 'bg-white hover:bg-brand-beige text-brand-charcoal/80 border border-brand-beige'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Masonry-Grid Layout */}
        <motion.div
          layout
          className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
        >
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              id={`gallery-item-${item.id}`}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              onClick={() => setActiveImage(item)}
              className="break-inside-avoid relative rounded-3xl overflow-hidden bg-white border border-brand-beige group cursor-zoom-in shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              
              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/85 via-brand-charcoal/15 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-6">
                
                {/* Upper Right Action */}
                <div className="flex justify-end">
                  <button
                    id={`like-gallery-btn-${item.id}`}
                    onClick={(e) => toggleLikePhoto(item.id, e)}
                    className="p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-sm text-brand-charcoal hover:text-red-500 transition-all cursor-pointer"
                  >
                    <Heart size={14} className={likedPhotos[item.id] ? 'fill-red-500 text-red-500' : ''} />
                  </button>
                </div>

                {/* Lower details block */}
                <div className="text-white text-left space-y-1">
                  <span className="text-[9px] tracking-widest font-bold bg-brand-gold/80 text-brand-charcoal px-2.5 py-0.5 rounded-full uppercase w-fit">
                    {item.category}
                  </span>
                  <div className="flex justify-between items-center pt-1.5">
                    <h3 className="serif-display text-lg font-light truncate flex-1 pr-4">{item.title}</h3>
                    <ArrowUpRight size={16} className="text-brand-beige shrink-0" />
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="py-16 text-center text-brand-brown-light">
            No gallery images found for this category yet.
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            id="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImage(null)}
            className="fixed inset-0 bg-brand-charcoal/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4"
          >
            {/* Close Button */}
            <button
              id="close-lightbox-btn"
              onClick={() => setActiveImage(null)}
              className="absolute top-5 right-5 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Centered Image */}
            <motion.div
              id="lightbox-container"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="max-w-4xl w-full max-h-[80vh] relative flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activeImage.image}
                alt={activeImage.title}
                className="max-w-full max-h-[80vh] rounded-2xl object-contain border border-white/10"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* Bottom details card */}
            <div className="mt-4 text-center text-white space-y-1.5 max-w-xl">
              <span className="text-[10px] tracking-widest font-bold text-brand-gold uppercase">
                {activeImage.category} Collection
              </span>
              <h3 className="serif-display text-xl font-light">{activeImage.title}</h3>
              <p className="text-xs text-brand-beige/70">
                100% handcrafted cloth napkin arrangements. Reusable memory-making tableware.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
