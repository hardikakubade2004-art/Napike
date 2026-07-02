/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Leaf, RefreshCw, Sparkles, Award, Heart, HelpCircle, ArrowRight, Trash2 } from 'lucide-react';

export default function WhyChoose() {
  const [activeTab, setActiveTab] = useState<'traditional' | 'napike'>('napike');

  const benefits = [
    {
      icon: <Leaf className="text-brand-sage" size={24} />,
      title: '♻ Zero Waste',
      description: 'Traditional flower bouquets are thrown away after only a few hours. Napike bouquets unfold into gorgeous, useful cloth napkins, creating absolutely zero landfill waste.'
    },
    {
      icon: <RefreshCw className="text-brand-sage" size={24} />,
      title: '🧺 100% Reusable',
      description: 'Every blossom in our bouquets is created using specialized folding. They fully unfold into washable, premium cloth table napkins for dining room styling and dinner parties.'
    },
    {
      icon: <Sparkles className="text-brand-sage" size={24} />,
      title: '💰 Budget Friendly',
      description: 'Get a luxurious, premium-looking floral arrangement that retains its value forever. No more buying expensive, chemically treated imported flowers that wither by tomorrow.'
    },
    {
      icon: <Award className="text-brand-sage" size={24} />,
      title: '👩 Women Empowerment',
      description: 'Each bouquet is handcrafted by talented women artisans in Jaipur and rural India. Your purchase provides sustainable, fair-wage livelihoods and honors local craft heritage.'
    },
    {
      icon: <Heart className="text-brand-sage" size={24} />,
      title: '🌸 Premium Craftsmanship',
      description: 'Our artisans utilize precise, origami-inspired hand-folding. Every edge is meticulously stitched, double-hemmed, and hand-finished with luxury details.'
    },
    {
      icon: <HelpCircle className="text-brand-sage" size={24} />,
      title: '💚 Sustainable Choice',
      description: 'A deeply meaningful and mindful gifting option that aligns with nature. Make your celebrations, weddings, and anniversaries represent a greener tomorrow.'
    }
  ];

  return (
    <section id="why-choose-napike" className="py-20 bg-brand-cream border-t border-brand-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title / Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-brand-gold">Sustainable Footprint</span>
          <h2 className="serif-display text-3xl sm:text-4xl font-normal text-brand-charcoal mt-3">
            Why Choose a Napike Bouquet?
          </h2>
          <div className="w-12 h-[1px] bg-brand-gold mx-auto mt-4 mb-3" />
          <p className="text-brand-brown text-sm leading-relaxed">
            We are redefining the gifting ecosystem. Here is how we combine luxury aesthetic designs with absolute zero-waste values.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white p-8 rounded-3xl border border-brand-beige shadow-sm hover:shadow-md transition-all duration-300 flex flex-col space-y-4"
            >
              <div className="p-3 bg-brand-beige/50 rounded-2xl w-fit">
                {benefit.icon}
              </div>
              <h3 className="serif-display text-xl font-normal text-brand-charcoal">
                {benefit.title}
              </h3>
              <p className="text-brand-brown text-xs sm:text-sm leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Interactive Comparison Module */}
        <div className="mt-20 bg-brand-beige/40 rounded-[40px] p-6 sm:p-10 border border-brand-gold/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left explanation text */}
            <div className="lg:col-span-5 text-left space-y-6">
              <span className="text-[11px] font-bold tracking-[0.2em] text-brand-gold uppercase bg-white px-3 py-1 rounded-full border border-brand-gold/15">The Comparison</span>
              <h3 className="serif-display text-3xl font-light text-brand-charcoal">
                Withering Waste vs. <br />
                <span className="italic text-brand-sage-dark font-normal">Enduring Memories</span>
              </h3>
              <p className="text-brand-brown text-sm leading-relaxed">
                Traditional flower bouquets have an average lifespan of just 48 hours before starting to rot, leading to chemical-laden bio-waste. Napike bouquets are useful, elegant, and permanent.
              </p>
              
              {/* Tab Toggles for Mobile/Visual */}
              <div className="flex bg-white/80 p-1.5 rounded-full border border-brand-beige w-fit">
                <button
                  id="tab-traditional"
                  onClick={() => setActiveTab('traditional')}
                  className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                    activeTab === 'traditional'
                      ? 'bg-red-50 text-red-700 shadow-sm'
                      : 'text-brand-charcoal/65 hover:text-brand-charcoal'
                  }`}
                >
                  Fresh Flowers
                </button>
                <button
                  id="tab-napike"
                  onClick={() => setActiveTab('napike')}
                  className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                    activeTab === 'napike'
                      ? 'bg-brand-sage text-white shadow-sm'
                      : 'text-brand-charcoal/65 hover:text-brand-charcoal'
                  }`}
                >
                  Napike Bouquets
                </button>
              </div>
            </div>

            {/* Right comparison card displays */}
            <div className="lg:col-span-7">
              <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden shadow-xl border border-white">
                {activeTab === 'traditional' ? (
                  <motion.div
                    key="traditional-card"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 bg-gradient-to-r from-red-950/80 to-red-900/60 flex flex-col justify-between p-6 sm:p-8 text-white text-left"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=800"
                      alt="Traditional flowers fading"
                      className="absolute inset-0 w-full h-full object-cover mix-blend-overlay filter grayscale"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex justify-between items-start z-10">
                      <span className="bg-red-600/95 text-[10px] tracking-widest font-bold px-3 py-1 rounded-full uppercase">Fades in 48 Hours</span>
                      <Trash2 className="text-red-200" size={24} />
                    </div>

                    <div className="space-y-4 z-10">
                      <h4 className="serif-display text-2xl font-normal text-red-100">Traditional Imported Flower Bouquet</h4>
                      <ul className="space-y-2 text-xs sm:text-sm text-red-100/80">
                        <li className="flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                          <span>Rotting waste left after less than 2-3 days</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                          <span>Often treated with toxic chemical preservatives to survive shipping</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                          <span>Zero usage or recycling value once wilted</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                          <span>High carbon footprint from air shipping and synthetic plastics</span>
                        </li>
                      </ul>
                      <p className="font-mono text-[10px] text-red-200 uppercase tracking-widest pt-2">Typical Cost: ₹2,000+ (Zero value return)</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="napike-card"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 bg-gradient-to-r from-brand-sage-dark/80 to-brand-sage/60 flex flex-col justify-between p-6 sm:p-8 text-white text-left"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800"
                      alt="Napike sustainable napkins folded"
                      className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex justify-between items-start z-10">
                      <span className="bg-brand-gold text-[10px] tracking-widest font-bold text-brand-charcoal px-3 py-1 rounded-full uppercase">Lasts Forever</span>
                      <Leaf className="text-green-200" size={24} />
                    </div>

                    <div className="space-y-4 z-10">
                      <h4 className="serif-display text-2xl font-normal text-brand-beige">Napike Reusable Cloth Bouquet</h4>
                      <ul className="space-y-2 text-xs sm:text-sm text-brand-beige/90">
                        <li className="flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 bg-brand-gold rounded-full"></span>
                          <span>Unfolds into 6 luxury organic table napkins (20" x 20")</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 bg-brand-gold rounded-full"></span>
                          <span>100% GOTS certified cotton & organic linen, naturally dyed</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 bg-brand-gold rounded-full"></span>
                          <span>Durable double-hemming that stands up to hundreds of washes</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 bg-brand-gold rounded-full"></span>
                          <span>Supports women artisans with fair living wages</span>
                        </li>
                      </ul>
                      <p className="font-mono text-[10px] text-brand-gold-light uppercase tracking-widest pt-2">Typical Cost: ₹1,499+ (Becomes luxury tableware)</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
