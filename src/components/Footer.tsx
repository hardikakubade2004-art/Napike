/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Mail, Phone, MapPin, ArrowUp, Send, Leaf } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
  setSelectedProduct: (product: any) => void;
}

export default function Footer({ setCurrentTab, setSelectedProduct }: FooterProps) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim() === '') return;
    
    setSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
    }, 2500);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (tab: string) => {
    setSelectedProduct(null);
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-brand-charcoal text-brand-beige pt-20 pb-8 relative overflow-hidden border-t border-brand-gold/10">
      
      {/* Scroll to Top floating anchor inside footer background block */}
      <div className="absolute top-8 right-8 z-10">
        <button
          id="back-to-top-btn"
          onClick={scrollToTop}
          className="p-3 bg-brand-cream hover:bg-brand-gold hover:text-brand-charcoal text-brand-charcoal rounded-full shadow-lg hover:scale-110 transition-all cursor-pointer"
          title="Back to top of page"
        >
          <ArrowUp size={16} />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-brand-beige/10">
          
          {/* Column 1: Brand Story & Values (col-span-4) */}
          <div className="lg:col-span-4 text-left space-y-6">
            <span className="serif-display text-3xl font-light tracking-[0.25em] text-white">NAPIKE</span>
            <p className="text-xs sm:text-sm text-brand-beige/70 leading-relaxed">
              Redefining luxury gifting through traditional Indian handloom textile folds. We turn premium GOTS-certified organic cotton and linen table napkins into gorgeous, zero-waste rose bouquets that last forever.
            </p>
            <div className="flex items-center space-x-2.5 text-xs text-brand-gold font-sans font-medium">
              <Leaf size={14} className="text-brand-sage fill-brand-sage" />
              <span>Sustainable Craft • Crafted by Skilled Women Artisans</span>
            </div>
          </div>

          {/* Column 2: Navigation Shortcuts (col-span-2) */}
          <div className="lg:col-span-2 text-left space-y-4">
            <h4 className="text-xs font-bold tracking-widest text-white uppercase border-b border-brand-beige/10 pb-2">
              Explore Collection
            </h4>
            <ul className="space-y-2.5 text-xs text-brand-beige/70">
              {['home', 'shop', 'why-napike', 'about', 'gallery'].map((tab) => (
                <li key={tab}>
                  <button
                    id={`footer-link-${tab}`}
                    onClick={() => handleLinkClick(tab)}
                    className="hover:text-brand-gold transition-colors capitalize cursor-pointer"
                  >
                    {tab === 'why-napike' ? 'Why Choose' : tab === 'about' ? 'Our Story' : tab}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Care, Legal & FAQs (col-span-2) */}
          <div className="lg:col-span-2 text-left space-y-4">
            <h4 className="text-xs font-bold tracking-widest text-white uppercase border-b border-brand-beige/10 pb-2">
              Inquiries & Terms
            </h4>
            <ul className="space-y-2.5 text-xs text-brand-beige/70">
              <li>
                <button id="footer-faq-btn" onClick={() => handleLinkClick('faq')} className="hover:text-brand-gold transition-colors cursor-pointer">
                  Frequently Asked
                </button>
              </li>
              <li>
                <button id="footer-contact-btn" onClick={() => handleLinkClick('contact')} className="hover:text-brand-gold transition-colors cursor-pointer">
                  Custom & Bulk Orders
                </button>
              </li>
              <li>
                <a href="#privacy" className="hover:text-brand-gold transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#terms" className="hover:text-brand-gold transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#return" className="hover:text-brand-gold transition-colors">Returns & Refunds</a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter Subscription (col-span-4) */}
          <div className="lg:col-span-4 text-left space-y-4">
            <h4 className="text-xs font-bold tracking-widest text-white uppercase border-b border-brand-beige/10 pb-2">
              Join Our Sustainable Circle
            </h4>
            <p className="text-xs text-brand-beige/75 leading-relaxed">
              Subscribe to receive exclusive access to organic botanical dye collections, tablescape styling ideas, and 10% off your first handcrafted gift.
            </p>

            {subscribed ? (
              <div className="bg-brand-beige/10 p-4 rounded-2xl border border-brand-gold/20 flex items-center space-x-2 text-xs text-brand-gold">
                <Sparkles size={14} className="animate-pulse" />
                <span>Thank you! Welcome to Napike's sustainable circle.</span>
              </div>
            ) : (
              <form id="footer-newsletter-form" onSubmit={handleSubscribe} className="flex bg-white/10 border border-brand-beige/10 p-1 rounded-2xl focus-within:border-brand-sage/40 transition-colors">
                <input
                  id="footer-email-input"
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="bg-transparent text-xs text-white px-3 py-2 w-full focus:outline-none placeholder-brand-beige/45"
                />
                <button
                  type="submit"
                  id="footer-subscribe-btn"
                  className="bg-brand-cream text-brand-charcoal hover:bg-brand-gold transition-colors px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider cursor-pointer shrink-0"
                >
                  Join
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Footer Bottom copyright and social anchors */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-beige/50">
          <div className="text-center sm:text-left leading-relaxed">
            <p>© 2026 Napike Gifting India. Handcrafted in Jaipur. All rights reserved.</p>
            <p className="text-[10px] mt-0.5 text-brand-beige/40">GOTS Certified Organic Handloom Textiles. double-hemming precision.</p>
          </div>
          
          <div className="flex space-x-6">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-brand-gold transition-colors">Instagram</a>
            <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="hover:text-brand-gold transition-colors">Pinterest</a>
            <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer" className="hover:text-brand-gold transition-colors">WhatsApp</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
