/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Heart, Globe, Users, Award, ShieldCheck, Sparkles } from 'lucide-react';

export default function About() {
  const pillars = [
    {
      icon: <Globe className="text-brand-sage-dark" size={26} />,
      title: 'Zero Waste Gifting',
      description: 'We believe celebrations shouldn’t cost the Earth. Instead of sending cut flowers wrapped in microplastics that wither in hours, Napike offers luxurious, functional works of textile art that live on forever on your dining table.'
    },
    {
      icon: <Users className="text-brand-sage-dark" size={26} />,
      title: 'Supporting Women Artisans',
      description: 'Every Napike bouquet is folded, wrapped, and finished by highly skilled women artisans from Jaipur and rural Rajasthan. Your purchases contribute directly to fair-wage employment, financial self-reliance, and micro-entrepreneurship.'
    },
    {
      icon: <Award className="text-brand-sage-dark" size={26} />,
      title: 'Traditional Craftsmanship',
      description: 'We celebrate India’s rich textile heritage by using authentic handloom fabrics, hand-spun Khadi cotton, and botanical dyes extracted from madder root, logwood, indigo, and recycled temple marigolds. It is heritage made modern.'
    },
    {
      icon: <ShieldCheck className="text-brand-sage-dark" size={26} />,
      title: 'Premium Handcrafted Quality',
      description: 'Our napkins aren’t just placeholders; they are heirloom-quality linens. Featuring high-density threads, elegant double-mitered hems, and meticulous folding, they are designed to handle years of dining and washing with grace.'
    }
  ];

  return (
    <section id="about-us" className="py-24 bg-brand-cream border-t border-brand-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Core Vision & Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Images on the left */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4 relative">
            <div className="absolute inset-0 bg-brand-beige/50 filter blur-3xl opacity-30 pointer-events-none -z-10" />
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <div className="rounded-[32px] overflow-hidden shadow-md h-64 sm:h-80 border-2 border-white">
                <img
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600"
                  alt="Traditional Indian dyeing artisan"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="rounded-[32px] overflow-hidden shadow-md h-48 border-2 border-white">
                <img
                  src="https://images.unsplash.com/photo-1484712401471-05c7215a39eb?auto=format&fit=crop&q=80&w=600"
                  alt="Embroidery and artisan craft detailing"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-4 pt-8"
            >
              <div className="rounded-[32px] overflow-hidden shadow-md h-48 border-2 border-white">
                <img
                  src="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=600"
                  alt="High end organic fabrics table setting"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="rounded-[32px] overflow-hidden shadow-md h-64 sm:h-80 border-2 border-white">
                <img
                  src="https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=600"
                  alt="Elegant folded napkin rose"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>

            {/* Float Label */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-cream border border-brand-gold/25 p-4 rounded-2xl shadow-xl z-20 text-center w-40">
              <span className="serif-display text-3xl font-light text-brand-gold">100%</span>
              <p className="text-[10px] tracking-widest text-brand-brown uppercase font-bold mt-1">Handcrafted with Love</p>
            </div>
          </div>

          {/* Text on the right */}
          <div className="lg:col-span-7 text-left space-y-6">
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-brand-gold">The Napike Odyssey</span>
            <h2 className="serif-display text-3xl sm:text-4xl lg:text-5xl font-light leading-tight text-brand-charcoal">
              Gifts Should Create <span className="italic font-normal text-brand-sage-dark">Beautiful Memories</span>, Not Waste.
            </h2>
            <div className="w-12 h-[1px] bg-brand-gold mt-4 mb-3" />
            
            <p className="text-brand-brown text-sm sm:text-base leading-relaxed">
              Napike was born out of a simple, jarring realization during a family wedding. As the celebrations wound down, we watched hundreds of beautiful fresh flower bouquets—which had cost a small fortune—being shoveled into garbage trucks. Within 24 hours of cut-flower harvesting, their life is extinguished, leaving plastic wrappers and rotting organic waste.
            </p>
            <p className="text-brand-brown text-sm sm:text-base leading-relaxed">
              We asked: <em>What if a gorgeous, floral gift could last forever? What if it was useful, handcrafted with heritage stories, and supported the community?</em>
            </p>
            <p className="text-brand-brown text-sm sm:text-base leading-relaxed">
              Thus, Napike was created. We replace cut flowers with premium cloth napkins (rumals) woven from GOTS-certified organic cotton, linen-flax, and hand-spun Khadi. Meticulously hand-folded by local women artisans, our bouquets possess the same breathtaking look as fresh luxury arrangements—but when untied, they transform into exquisite table setting linens that will grace dinner parties for a lifetime.
            </p>

            <div className="flex items-center space-x-3 bg-brand-beige p-4 rounded-2xl border border-brand-gold/10">
              <Heart size={20} className="text-brand-gold fill-brand-gold" />
              <p className="text-xs sm:text-sm font-semibold text-brand-charcoal leading-snug">
                "We don't just sell bouquets. We weave zero-waste circular loops that empower Jaipur's local women weavers."
              </p>
            </div>
          </div>

        </div>

        {/* Brand Pillars / Deep Dive Grid */}
        <div className="mt-28">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-brand-gold">Our Foundation</span>
            <h3 className="serif-display text-3xl font-normal text-brand-charcoal mt-3">
              The Four Pillars of Napike
            </h3>
            <div className="w-12 h-[1px] bg-brand-gold mx-auto mt-4 mb-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-[36px] border border-brand-beige hover:border-brand-gold/20 shadow-sm hover:shadow-md transition-all duration-300 text-left flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 items-start"
              >
                <div className="p-4 bg-brand-beige rounded-2xl shrink-0">
                  {pillar.icon}
                </div>
                <div className="space-y-2">
                  <h4 className="serif-display text-xl font-medium text-brand-charcoal flex items-center">
                    {pillar.title}
                    <Sparkles size={12} className="text-brand-gold ml-2 animate-pulse" />
                  </h4>
                  <p className="text-brand-brown text-xs sm:text-sm leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
