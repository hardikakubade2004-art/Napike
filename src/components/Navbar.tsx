/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ShoppingBag, Heart, Search, ArrowRight, Sparkles } from 'lucide-react';
import { Product, CartItem } from '../types';
import { PRODUCTS } from '../data/products';
import { useAuth } from '../context/AuthContext';
// @ts-ignore
import logoImg from '../assets/images/napike_logo_1782971974421.jpg';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  cart: CartItem[];
  wishlist: Product[];
  setSelectedProduct: (product: Product | null) => void;
  setIsCartOpen: (open: boolean) => void;
}

export default function Navbar({
  currentTab,
  setCurrentTab,
  cart,
  wishlist,
  setSelectedProduct,
  setIsCartOpen
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  // Track scrolling to toggle glass background style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle live search results
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
    } else {
      const filtered = PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.occasion.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    }
  }, [searchQuery]);

  const { user, logout } = useAuth();

  const navLinks = user
    ? [
        { id: 'home', label: 'Home' },
        { id: 'shop', label: 'Shop' },
        { id: 'wishlist', label: 'Wishlist' },
        { id: 'my-orders', label: 'My Orders' },
        { id: 'profile', label: 'Profile' },
        { id: 'logout', label: 'Logout' },
      ]
    : [
        { id: 'home', label: 'Home' },
        { id: 'shop', label: 'Shop' },
        { id: 'about', label: 'About' },
        { id: 'contact', label: 'Contact' },
        { id: 'login', label: 'Login' },
        { id: 'signup', label: 'Sign Up' },
      ];

  const totalCartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleSearchResultClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentTab('product-detail');
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <>
      <header
        id="main-header"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'glass-panel py-3 shadow-sm border-b'
            : 'bg-transparent py-5 border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                id="mobile-menu-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-brand-charcoal hover:text-brand-sage p-2 transition-colors duration-300"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex-1 md:flex-none text-center md:text-left">
              <button
                id="logo-btn"
                onClick={() => {
                  setCurrentTab('home');
                  setSelectedProduct(null);
                }}
                className="group cursor-pointer select-none inline-flex items-center gap-2 sm:gap-3"
              >
                <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-brand-gold/30 shadow-sm transition-transform duration-500 group-hover:scale-105 group-hover:border-brand-sage/50">
                  <img
                    src={logoImg}
                    alt="Napike Logo"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="relative flex items-center space-x-1 sm:space-x-2">
                  <div className="relative">
                    <span className="serif-display text-2xl sm:text-3xl font-normal tracking-[0.25em] text-brand-charcoal transition-all duration-500 group-hover:text-brand-sage">
                      NAPIKE
                    </span>
                    <span className="absolute -bottom-1 left-0 right-0 h-[1px] bg-brand-gold origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
                  </div>
                  <Sparkles size={14} className="text-brand-gold animate-pulse" />
                </div>
              </button>
              <p className="hidden lg:block text-[9px] tracking-[0.3em] font-medium text-brand-brown-light uppercase mt-0.5 ml-12">
                Handcrafted Reusable Art
              </p>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => {
                    if (link.id === 'logout') {
                      logout();
                      setCurrentTab('home');
                    } else {
                      setCurrentTab(link.id);
                    }
                    setSelectedProduct(null);
                  }}
                  className={`relative px-3 py-2 text-[13px] font-medium tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                    currentTab === link.id
                      ? 'text-brand-sage-dark'
                      : 'text-brand-charcoal/75 hover:text-brand-sage'
                  }`}
                >
                  {link.label}
                  {currentTab === link.id && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-3 right-3 h-[2px] bg-brand-sage rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </nav>

            {/* Quick Actions (Search, Wishlist, Cart) */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search Toggle */}
              <button
                id="search-toggle-btn"
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-brand-charcoal hover:text-brand-sage transition-colors duration-300"
                aria-label="Open search"
              >
                <Search size={20} />
              </button>

              {/* Wishlist Button */}
              <button
                id="wishlist-nav-btn"
                onClick={() => setCurrentTab('wishlist')}
                className="relative p-2 text-brand-charcoal hover:text-brand-sage transition-colors duration-300"
                aria-label="Open wishlist"
              >
                <Heart size={20} className={wishlist.length > 0 ? 'fill-brand-sage text-brand-sage' : ''} />
                {wishlist.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-gold rounded-full" />
                )}
              </button>

              {/* Shopping Cart Button */}
              <button
                id="cart-nav-btn"
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-brand-charcoal hover:text-brand-sage transition-colors duration-300"
                aria-label="Open shopping cart"
              >
                <ShoppingBag size={20} />
                {totalCartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-sage text-[10px] font-bold text-white shadow-sm"
                  >
                    {totalCartCount}
                  </motion.span>
                )}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Slide-out Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-charcoal/30 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              id="mobile-menu"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 bottom-0 w-4/5 max-w-sm bg-brand-cream p-6 shadow-2xl flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-brand-beige">
                  <span className="serif-display text-2xl font-normal tracking-widest text-brand-charcoal">
                    NAPIKE
                  </span>
                  <button
                    id="close-mobile-menu-btn"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-brand-charcoal hover:text-brand-sage transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <nav className="flex flex-col space-y-4 py-8">
                  {navLinks.map((link) => (
                    <button
                      key={link.id}
                      id={`mobile-nav-link-${link.id}`}
                      onClick={() => {
                        if (link.id === 'logout') {
                          logout();
                          setCurrentTab('home');
                        } else {
                          setCurrentTab(link.id);
                        }
                        setSelectedProduct(null);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`text-left text-lg font-medium tracking-wide uppercase py-1 border-b border-transparent hover:border-brand-sage transition-all duration-300 ${
                        currentTab === link.id ? 'text-brand-sage' : 'text-brand-charcoal/80'
                      }`}
                    >
                      {link.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="border-t border-brand-beige pt-6">
                <p className="text-xs text-brand-brown-light leading-relaxed mb-4">
                  Beautiful Zero-Waste bouquets handcrafted by skilled women artisans.
                </p>
                <div className="text-[11px] uppercase tracking-widest text-brand-charcoal/50">
                  © 2026 Napike India
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Elegant Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            id="search-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-charcoal/40 backdrop-blur-md z-50 flex items-start justify-center pt-20 px-4"
          >
            <motion.div
              id="search-container"
              initial={{ y: -20, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: -20, scale: 0.95 }}
              transition={{ cubicBezier: [0.16, 1, 0.3, 1], duration: 0.4 }}
              className="w-full max-w-2xl bg-brand-cream rounded-3xl p-6 shadow-2xl border border-brand-beige"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-brand-beige pb-4">
                <div className="flex items-center space-x-3 flex-1">
                  <Search className="text-brand-sage" size={22} />
                  <input
                    id="search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for bouquets, occasions, or colors..."
                    className="w-full bg-transparent text-lg text-brand-charcoal focus:outline-none placeholder-brand-brown-light/60 font-sans"
                    autoFocus
                  />
                </div>
                <button
                  id="close-search-btn"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="p-1 rounded-full hover:bg-brand-beige text-brand-charcoal/60 hover:text-brand-charcoal transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Instant Search Results */}
              <div className="mt-4 max-h-96 overflow-y-auto">
                {searchQuery.trim() === '' ? (
                  <div className="py-6 text-center text-sm text-brand-brown-light">
                    <p className="font-medium text-brand-charcoal/60 mb-2">Popular Searches</p>
                    <div className="flex flex-wrap justify-center gap-2 mt-3">
                      {['Sage', 'Royal', 'Wedding', 'Marigold', 'Shibori', 'Organic'].map((tag) => (
                        <button
                          key={tag}
                          id={`search-tag-${tag}`}
                          onClick={() => setSearchQuery(tag)}
                          className="px-3 py-1.5 text-xs tracking-wider uppercase bg-brand-beige hover:bg-brand-sage hover:text-white rounded-full transition-all cursor-pointer"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-3 divide-y divide-brand-beige/50">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        id={`search-result-${product.id}`}
                        onClick={() => handleSearchResultClick(product)}
                        className="flex items-center space-x-4 pt-3 first:pt-0 cursor-pointer group hover:bg-brand-beige/20 p-2 rounded-xl transition-all"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-14 h-14 object-cover rounded-xl border border-brand-beige"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif font-medium text-brand-charcoal group-hover:text-brand-sage transition-colors truncate">
                            {product.name}
                          </h4>
                          <p className="text-xs text-brand-brown-light truncate">
                            {product.shortDescription}
                          </p>
                        </div>
                        <div className="flex items-center text-brand-sage-dark font-mono text-sm font-semibold whitespace-nowrap">
                          ₹{product.price}
                          <ArrowRight size={14} className="ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-sm text-brand-brown-light">
                    No results found for "{searchQuery}". Try searching for something else.
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
