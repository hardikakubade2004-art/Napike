/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ArrowRight, Leaf, Sparkles, Heart } from 'lucide-react';

interface HeroProps {
  setCurrentTab: (tab: string) => void;
  onCustomOrderClick: () => void;
}

export default function Hero({ setCurrentTab, onCustomOrderClick }: HeroProps) {
  // Stagger animation variants for smooth loading
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', damping: 25, stiffness: 120 }
    }
  };

  return (
    <section id="hero" className="relative min-h-screen bg-brand-cream pt-24 lg:pt-0 flex items-center overflow-hidden">
      
      {/* Decorative Warm background blur elements */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-brand-beige rounded-full filter blur-[120px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-brand-sage-light rounded-full filter blur-[100px] opacity-40 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Hero Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-6 flex flex-col justify-center space-y-8 text-left"
          >
            {/* Eco-Friendly Mini Badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 self-start bg-brand-beige px-3 py-1.5 rounded-full border border-brand-gold/15">
              <Leaf size={14} className="text-brand-sage" />
              <span className="text-[11px] font-bold tracking-[0.2em] text-brand-sage-dark uppercase">
                Zero-Waste & Reusable Gifting
              </span>
            </motion.div>

            {/* Core Brand Headline */}
            <motion.h1 variants={itemVariants} className="serif-display text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.15] text-brand-charcoal tracking-tight">
              Beautiful Bouquets <br />
              <span className="italic text-brand-sage-dark font-normal">That Last Beyond</span> <br />
              the Celebration.
            </motion.h1>

            {/* Supporting Subheading */}
            <motion.p variants={itemVariants} className="text-base sm:text-lg text-brand-brown leading-relaxed font-sans max-w-xl">
              Handcrafted reusable napkin bouquets that combine absolute elegance, organic materials, and thoughtful gifting. Unfold flowers into premium cloth table napkins for everyday memory making.
            </motion.p>

            {/* Trust Badges */}
            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 border-t border-b border-brand-beige py-5 max-w-lg">
              <div className="text-left">
                <span className="block serif-display text-xl font-normal text-brand-sage">100%</span>
                <span className="text-[10px] tracking-wider uppercase text-brand-brown-light font-medium">Reusable Cotton</span>
              </div>
              <div className="text-left border-l border-brand-beige pl-4">
                <span className="block serif-display text-xl font-normal text-brand-sage">Handmade</span>
                <span className="text-[10px] tracking-wider uppercase text-brand-brown-light font-medium">By Women Artisans</span>
              </div>
              <div className="text-left border-l border-brand-beige pl-4">
                <span className="block serif-display text-xl font-normal text-brand-sage">₹1,499+</span>
                <span className="text-[10px] tracking-wider uppercase text-brand-brown-light font-medium">Luxury Budget Gifting</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <button
                id="hero-shop-btn"
                onClick={() => setCurrentTab('shop')}
                className="group flex items-center justify-center space-x-2 bg-brand-sage hover:bg-brand-sage-dark text-white text-sm font-semibold tracking-wider uppercase px-8 py-4 rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <span>Shop Collection</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                id="hero-custom-btn"
                onClick={onCustomOrderClick}
                className="flex items-center justify-center space-x-2 bg-white hover:bg-brand-beige text-brand-charcoal border border-brand-beige text-sm font-semibold tracking-wider uppercase px-8 py-4 rounded-full hover:shadow-sm transition-all duration-300 cursor-pointer"
              >
                <span>Custom Order</span>
                <Sparkles size={14} className="text-brand-gold ml-1" />
              </button>
            </motion.div>
          </motion.div>

          {/* Hero Collage / Imagery half */}
          <div className="lg:col-span-6 relative h-[450px] sm:h-[550px] lg:h-[600px] flex items-center justify-center">
            
            {/* Golden Circle Accent in Background */}
            <div className="absolute w-[80%] aspect-square rounded-full border border-brand-gold/10 pointer-events-none" />

            {/* Primary Center Image (Bouquet focus) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, cubicBezier: [0.16, 1, 0.3, 1] }}
              className="absolute w-[65%] h-[75%] rounded-[40px] overflow-hidden shadow-2xl border-4 border-white z-20 hover:scale-[1.02] transition-transform duration-500"
            >
              <img
                src="https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800"
                alt="Napike Signature Sage Gold Bouquet"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent flex items-end p-6">
                <div className="text-white text-left">
                  <span className="text-[10px] tracking-widest font-bold bg-brand-gold/80 text-brand-charcoal px-2.5 py-1 rounded-full uppercase">Signature Bouquet</span>
                  <h3 className="serif-display text-xl font-normal mt-2">Sage & Gold</h3>
                </div>
              </div>
            </motion.div>

            {/* Left Offset Float Card (Artisan Handiwork) */}
            <motion.div
              initial={{ opacity: 0, x: -50, y: 50, rotate: -6 }}
              animate={{ opacity: 1, x: 0, y: 0, rotate: -6 }}
              transition={{ delay: 0.4, duration: 1, cubicBezier: [0.16, 1, 0.3, 1] }}
              className="absolute left-0 bottom-8 w-[40%] h-[42%] rounded-3xl overflow-hidden shadow-xl border-4 border-white z-30 hidden sm:block hover:scale-[1.05] hover:z-40 transition-all duration-300"
            >
              <img
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600"
                alt="Women Artisans natural cotton weaving"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* Right Offset Float Card (Ethereal Table styling) */}
            <motion.div
              initial={{ opacity: 0, x: 50, y: -50, rotate: 8 }}
              animate={{ opacity: 1, x: 0, y: 0, rotate: 8 }}
              transition={{ delay: 0.6, duration: 1, cubicBezier: [0.16, 1, 0.3, 1] }}
              className="absolute right-4 top-12 w-[38%] h-[40%] rounded-3xl overflow-hidden shadow-xl border-4 border-white z-10 hidden sm:block hover:scale-[1.05] hover:z-40 transition-all duration-300"
            >
              <img
                src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600"
                alt="Folded premium linen details"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* Floater Badge (Artisan Proof) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, type: 'spring' }}
              className="absolute right-8 bottom-16 z-30 bg-brand-cream/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-brand-gold/20 flex items-center space-x-2.5"
            >
              <div className="flex -space-x-2">
                <img className="w-6 h-6 rounded-full border-2 border-brand-cream object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80" alt="Artisan" referrerPolicy="no-referrer" />
                <img className="w-6 h-6 rounded-full border-2 border-brand-cream object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=60&q=80" alt="Artisan" referrerPolicy="no-referrer" />
              </div>
              <div className="text-left">
                <div className="flex items-center text-brand-gold">
                  <span className="text-xs font-bold font-sans">★ 4.9</span>
                  <span className="text-[10px] text-brand-brown pl-1 font-sans">(400+ reviews)</span>
                </div>
                <p className="text-[9px] uppercase tracking-wider text-brand-brown-light font-bold">Loved sustainable gifting</p>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
