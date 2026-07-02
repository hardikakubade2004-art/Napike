/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, Sparkles, Heart } from 'lucide-react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [inquiryType, setInquiryType] = useState('Standard Gift');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setInquiryType('Standard Gift');
    }, 3000);
  };

  return (
    <section id="contact-us-page" className="py-24 bg-brand-cream border-t border-brand-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-brand-gold">Get In Touch</span>
          <h2 className="serif-display text-3xl sm:text-4xl font-normal text-brand-charcoal mt-3">
            Reach Out To Napike
          </h2>
          <div className="w-12 h-[1px] bg-brand-gold mx-auto mt-4 mb-3" />
          <p className="text-brand-brown text-sm leading-relaxed">
            Have general inquiries, wedding favor consultation, or need help designing a bespoke cotton arrangement? Contact us anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Contact Card Details */}
          <div className="lg:col-span-5 space-y-8 text-left">
            
            <div className="bg-white border border-brand-beige p-8 rounded-[36px] shadow-sm space-y-6">
              <h3 className="serif-display text-2xl font-light text-brand-charcoal">The Jaipur Studio</h3>
              <p className="text-brand-brown text-xs sm:text-sm leading-relaxed">
                Our main packaging workshop and textile sourcing laboratory is nestled in Jaipur's historic craft cluster. Stop by or connect online.
              </p>

              <div className="space-y-4 pt-4 border-t border-brand-beige">
                <div className="flex items-start space-x-3 text-xs sm:text-sm text-brand-brown">
                  <MapPin size={18} className="text-brand-sage shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Napike Design House</strong><br />
                    B-42, Handloom Colony, MI Road,<br />
                    Jaipur, Rajasthan, 302001, India
                  </p>
                </div>

                <div className="flex items-center space-x-3 text-xs sm:text-sm text-brand-brown">
                  <Phone size={18} className="text-brand-sage shrink-0" />
                  <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer" className="hover:text-brand-sage-dark transition-colors">
                    +91 99999 99999 (WhatsApp Support)
                  </a>
                </div>

                <div className="flex items-center space-x-3 text-xs sm:text-sm text-brand-brown">
                  <Mail size={18} className="text-brand-sage shrink-0" />
                  <a href="mailto:hello@napike.com" className="hover:text-brand-sage-dark transition-colors">
                    hello@napike.com
                  </a>
                </div>

                <div className="flex items-start space-x-3 text-xs sm:text-sm text-brand-brown">
                  <Clock size={18} className="text-brand-sage shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Business Hours:</strong><br />
                    Mon - Sat: 10:00 AM - 7:00 PM IST<br />
                    Sunday: Studio closed for rest and nature walks
                  </p>
                </div>
              </div>

              {/* Direct WhatsApp Call to Action Button */}
              <div className="pt-4">
                <a
                  href="https://wa.me/919999999999"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all duration-300"
                >
                  <MessageSquare size={14} className="fill-white text-emerald-600" />
                  <span>Chat directly on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Simulated Google Maps Placement Card */}
            <div className="bg-brand-beige border border-brand-gold/15 rounded-[36px] p-6 h-64 relative overflow-hidden flex flex-col justify-between shadow-sm">
              {/* Abstract decorative grid mimicking map blocks */}
              <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
              <div className="absolute top-1/2 left-1/3 w-6 h-6 bg-brand-sage-dark rounded-full border-4 border-white animate-pulse shadow-md z-10" />
              
              <div className="z-10 bg-white/95 backdrop-blur-sm p-4 rounded-2xl max-w-xs shadow-sm border border-brand-beige">
                <h4 className="font-bold text-xs text-brand-charcoal">Map Placeholder</h4>
                <p className="text-[10px] text-brand-brown leading-relaxed mt-1">Jaipur Studio Flagship, Handloom Colony Area</p>
              </div>

              <div className="z-10 flex justify-between items-center bg-white/95 backdrop-blur-sm p-3 rounded-2xl shadow-sm border border-brand-beige">
                <span className="text-[10px] font-bold text-brand-brown uppercase">Coordinates: 26.9124° N, 75.7873° E</span>
                <span className="text-[9px] text-brand-sage-dark font-bold underline cursor-pointer">Open Maps</span>
              </div>
            </div>

          </div>

          {/* Right Column: Contact/Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-brand-beige p-8 rounded-[36px] shadow-sm text-left">
              <h3 className="serif-display text-2xl font-light text-brand-charcoal mb-6 border-b border-brand-beige pb-4">
                Inquire or Order Bespoke
              </h3>

              <AnimatePresence mode="wait">
                {formSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-12 text-center space-y-4"
                  >
                    <div className="p-3 bg-brand-beige/80 w-fit rounded-full mx-auto text-brand-sage">
                      <Sparkles size={28} className="animate-pulse text-brand-gold" />
                    </div>
                    <h3 className="serif-display text-2xl font-light text-brand-charcoal">Inquiry Dispatched Timelessly</h3>
                    <p className="text-brand-brown text-sm leading-relaxed max-w-md mx-auto">
                      Thank you for trusting Napike. Our design coordination team will review your specs and email/WhatsApp you back in less than 24 hours.
                    </p>
                    <div className="inline-flex items-center space-x-1 text-xs text-brand-gold font-sans font-bold">
                      <Heart size={12} className="fill-brand-gold text-brand-gold" />
                      <span> जयपुर से प्यार के साथ (With love from Jaipur)</span>
                    </div>
                  </motion.div>
                ) : (
                  <form key="form" id="contact-inquiry-form" onSubmit={handleSubmit} className="space-y-6">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-brand-brown-light">Your Name *</label>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Kabir Mehta"
                          className="w-full bg-brand-cream border border-brand-beige rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:border-brand-sage text-brand-charcoal"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-brand-brown-light">Your Email *</label>
                        <input
                          id="contact-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. kabir@gmail.com"
                          className="w-full bg-brand-cream border border-brand-beige rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:border-brand-sage text-brand-charcoal"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-brand-brown-light">Your Phone / WhatsApp Number</label>
                        <input
                          id="contact-phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. +91 98765 43210"
                          className="w-full bg-brand-cream border border-brand-beige rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:border-brand-sage text-brand-charcoal"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-brand-brown-light">Inquiry Subject</label>
                        <select
                          id="contact-subject"
                          value={inquiryType}
                          onChange={(e) => setInquiryType(e.target.value)}
                          className="w-full bg-brand-cream border border-brand-beige rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:border-brand-sage text-brand-charcoal"
                        >
                          <option value="Standard Gift">Standard Gift Purchase</option>
                          <option value="Custom Order">Bespoke Custom Monogram</option>
                          <option value="Wedding Bulk">Wedding / Shadi Guest Hampers</option>
                          <option value="Corporate Order">Corporate Gifting & Logos</option>
                          <option value="Collaborations">Collaborate With Handloom Artisans</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-brown-light">Your Notes & Inquiry Details *</label>
                      <textarea
                        id="contact-message"
                        rows={4}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Please describe what colors you would love, the count of napkins, preferred linen fabrics, monogram requirements, embroidery styles, budget targets, or event dates..."
                        className="w-full bg-brand-cream border border-brand-beige rounded-2xl p-4 text-xs sm:text-sm focus:outline-none focus:border-brand-sage text-brand-charcoal resize-none"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        id="contact-submit-btn"
                        className="flex items-center space-x-2 bg-brand-sage hover:bg-brand-sage-dark text-white text-xs font-semibold uppercase tracking-wider px-8 py-3.5 rounded-full shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                      >
                        <Send size={14} />
                        <span>Send Inquiry Details</span>
                      </button>
                    </div>

                  </form>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
