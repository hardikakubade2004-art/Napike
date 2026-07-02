/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronDown, ChevronUp, Sparkles, HelpCircle, Mail, Phone, ExternalLink } from 'lucide-react';
import { FAQS } from '../data/products';

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFaqId, setActiveFaqId] = useState<string | null>('faq-1'); // default first opened
  const [activeTab, setActiveTab] = useState<'all' | 'general' | 'care' | 'custom' | 'shipping'>('all');

  const tabs = [
    { id: 'all', label: 'All Questions' },
    { id: 'general', label: 'General Info' },
    { id: 'care', label: 'Care & Wash' },
    { id: 'custom', label: 'Custom Orders' },
    { id: 'shipping', label: 'Shipping' }
  ];

  const filteredFaqs = useMemo(() => {
    return FAQS.filter((faq) => {
      const matchesSearch =
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTab = activeTab === 'all' || faq.category === activeTab;
      
      return matchesSearch && matchesTab;
    });
  }, [searchQuery, activeTab]);

  const toggleFaq = (id: string) => {
    setActiveFaqId(activeFaqId === id ? null : id);
  };

  return (
    <section id="faq-accordions" className="py-24 bg-brand-cream border-t border-brand-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-brand-gold">Inquiries & Assistance</span>
          <h2 className="serif-display text-3xl sm:text-4xl font-normal text-brand-charcoal mt-3">
            Frequently Asked Questions
          </h2>
          <div className="w-12 h-[1px] bg-brand-gold mx-auto mt-4 mb-3" />
          <p className="text-brand-brown text-sm leading-relaxed">
            Need guidance on wash instructions, custom embroidered monograms, or wholesale hampers? Explore our dedicated indices below.
          </p>
        </div>

        {/* Search Bar & Categorization Line */}
        <div className="max-w-3xl mx-auto mb-12 space-y-6">
          {/* Search Input */}
          <div className="flex items-center space-x-3 bg-white border border-brand-beige rounded-2xl px-4 py-3.5 shadow-sm max-w-xl mx-auto">
            <Search className="text-brand-sage" size={18} />
            <input
              id="faq-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search frequently asked questions..."
              className="w-full bg-transparent text-sm focus:outline-none placeholder-brand-brown-light/60 text-brand-charcoal"
            />
            {searchQuery && (
              <button
                id="faq-search-clear"
                onClick={() => setSearchQuery('')}
                className="text-xs font-bold text-brand-brown-light hover:text-brand-charcoal cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                id={`faq-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-brand-sage text-white shadow-sm'
                    : 'bg-white hover:bg-brand-beige text-brand-charcoal/85 border border-brand-beige'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
          
          {/* Accordion List Left/Main */}
          <div className="lg:col-span-8 space-y-4">
            {filteredFaqs.map((faq) => {
              const isOpen = activeFaqId === faq.id;
              
              return (
                <div
                  key={faq.id}
                  id={`faq-block-${faq.id}`}
                  className="bg-white rounded-2xl border border-brand-beige overflow-hidden transition-all duration-300 shadow-sm hover:border-brand-gold/10"
                >
                  <button
                    id={`faq-trigger-${faq.id}`}
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full py-5 px-6 flex items-center justify-between text-left hover:bg-brand-beige/10 transition-colors cursor-pointer"
                  >
                    <span className="serif-display font-medium text-brand-charcoal text-base sm:text-lg pr-4">
                      {faq.question}
                    </span>
                    <span className="text-brand-sage shrink-0">
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-content-${faq.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-brand-beige/50"
                      >
                        <p className="p-6 text-xs sm:text-sm text-brand-brown leading-relaxed text-left">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            {filteredFaqs.length === 0 && (
              <div className="py-12 text-center text-brand-brown-light bg-white rounded-3xl border border-brand-beige">
                No matching answers found for "{searchQuery}". Try asking something else.
              </div>
            )}
          </div>

          {/* Quick Contact Help Desk Right Side */}
          <div className="lg:col-span-4 bg-brand-beige/50 border border-brand-gold/10 rounded-[36px] p-8 text-left space-y-6">
            <div className="p-3.5 bg-white w-fit rounded-2xl text-brand-gold shadow-sm">
              <HelpCircle size={22} className="animate-bounce" />
            </div>
            
            <div className="space-y-2">
              <h3 className="serif-display text-xl font-medium text-brand-charcoal">Have Custom Monograms or Bulk Inquiries?</h3>
              <p className="text-brand-brown text-xs leading-relaxed">
                We custom-craft bouquets for corporate retreats, eco-themed weddings, and milestone gatherings. Let our Jaipur design studio coordinate something specific.
              </p>
            </div>

            <div className="space-y-3.5 pt-2">
              <a
                href="mailto:gifting@napike.com"
                className="flex items-center space-x-3 text-xs text-brand-charcoal hover:text-brand-sage transition-colors"
              >
                <Mail size={16} className="text-brand-sage" />
                <span>gifting@napike.com</span>
              </a>
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-3 text-xs text-brand-charcoal hover:text-brand-sage transition-colors"
              >
                <Phone size={16} className="text-brand-sage" />
                <span>+91 99999 99999 (WhatsApp Support)</span>
              </a>
            </div>

            <div className="border-t border-brand-beige pt-4">
              <p className="text-[10px] uppercase font-bold tracking-widest text-brand-brown-light">Business Hours</p>
              <p className="text-xs text-brand-brown mt-1">Monday - Saturday: 10:00 AM - 7:00 PM IST</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
