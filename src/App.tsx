/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, ArrowRight, Sparkles, Heart, ShoppingBag, X, ChevronRight, HelpCircle } from 'lucide-react';

import { Product, CartItem, ColorOption } from './types';
import { PRODUCTS } from './data/products';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhyChoose from './components/WhyChoose';
import About from './components/About';
import Shop from './components/Shop';
import ProductDetail from './components/ProductDetail';
import Gallery from './components/Gallery';
import Reviews from './components/Reviews';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Footer from './components/Footer';

// Auth Components
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import SignUp from './components/SignUp';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Profile from './components/Profile';
import MyOrders from './components/MyOrders';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // E-commerce states
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [couponCode, setCouponCode] = useState<string>('');
  
  // Visual Drawer states
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [isWhatsAppHovered, setIsWhatsAppHovered] = useState<boolean>(false);

  // Auth & Reset states
  const { user, showToast } = useAuth();
  const [resetEmail, setResetEmail] = useState<string>('');

  // Route Guards for Protected Pages
  useEffect(() => {
    const protectedTabs = ['wishlist', 'cart', 'checkout', 'my-orders', 'profile'];
    if (protectedTabs.includes(currentTab) && !user) {
      showToast('Please sign in to access this section.', 'info');
      setCurrentTab('login');
    }
  }, [currentTab, user]);

  // Load cart & wishlist from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('napike_cart');
    const savedWishlist = localStorage.getItem('napike_wishlist');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error loading cart state', e);
      }
    }
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error('Error loading wishlist state', e);
      }
    }
  }, []);

  // Save cart & wishlist to localStorage on updates
  useEffect(() => {
    localStorage.setItem('napike_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('napike_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Scroll to top on page navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentTab, selectedProduct]);

  // Cart operations
  const addToCart = (product: Product, quantity: number, color: ColorOption, customNote?: string) => {
    // Unique ID for unique combination of product + color swatch
    const itemId = `${product.id}-${color.name.toLowerCase().replace(/\s+/g, '-')}`;
    
    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex((item) => item.id === itemId);
      
      if (existingIdx > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingIdx].quantity += quantity;
        if (customNote) updatedCart[existingIdx].customNote = customNote;
        return updatedCart;
      } else {
        return [
          ...prevCart,
          {
            id: itemId,
            product,
            quantity,
            selectedColor: color,
            customNote
          }
        ];
      }
    });

    // Automatically trigger slide-out drawer as purchase confirmation
    setIsCartDrawerOpen(true);
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode('');
  };

  // Wishlist operations
  const toggleWishlist = (product: Product) => {
    setWishlist((prevWishlist) => {
      const isAlreadyIn = prevWishlist.some((item) => item.id === product.id);
      if (isAlreadyIn) {
        return prevWishlist.filter((item) => item.id !== product.id);
      } else {
        return [...prevWishlist, product];
      }
    });
  };

  // Drawer details calculations
  const totalCartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  return (
    <div id="napike-app" className="min-h-screen flex flex-col justify-between bg-brand-cream relative">
      
      {/* Decorative Warm Top Ambient Glow */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-brand-gold/5 to-transparent pointer-events-none -z-10" />

      {/* Floating Translucent Sticky Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        cart={cart}
        wishlist={wishlist}
        setSelectedProduct={setSelectedProduct}
        setIsCartOpen={setIsCartDrawerOpen}
      />

      {/* Main Content Area Routing with Staggered Fade Transitions */}
      <main className="flex-grow pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedProduct ? `product-${selectedProduct.id}` : currentTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            {/* If a product detail is set, override the currentTab view */}
            {selectedProduct ? (
              <ProductDetail
                product={selectedProduct}
                addToCart={addToCart}
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
                setCurrentTab={setCurrentTab}
                setSelectedProduct={setSelectedProduct}
              />
            ) : (
              <>
                {/* Standard SPA Page Swaps */}
                {currentTab === 'home' && (
                  <div className="space-y-0">
                    <Hero
                      setCurrentTab={setCurrentTab}
                      onCustomOrderClick={() => {
                        setCurrentTab('contact');
                      }}
                    />

                    {/* Home-Featured Bouquets Display */}
                    <section id="home-featured" className="py-20 bg-white border-t border-brand-beige">
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                          <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-brand-gold">Eco-Luxury Masterpieces</span>
                          <h2 className="serif-display text-3xl sm:text-4xl font-normal text-brand-charcoal mt-3">
                            The Featured Collection
                          </h2>
                          <div className="w-12 h-[1px] bg-brand-gold mx-auto mt-4 mb-3" />
                          <p className="text-brand-brown text-sm leading-relaxed">
                            Discover our top sustainable gifting designs, handcrafted entirely from GOTS certified organic linens and natural plant extracts.
                          </p>
                        </div>

                        {/* Staggered Row Products List */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                          {PRODUCTS.slice(0, 3).map((product) => (
                            <div
                              key={product.id}
                              id={`featured-card-${product.id}`}
                              className="group bg-brand-cream rounded-[32px] overflow-hidden border border-brand-beige hover:border-brand-gold/15 transition-all duration-300 flex flex-col justify-between"
                            >
                              <div className="relative aspect-square overflow-hidden bg-brand-beige">
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                  referrerPolicy="no-referrer"
                                />
                                <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-[9px] tracking-widest font-bold text-brand-sage-dark px-2.5 py-1 rounded-full uppercase border border-brand-beige">
                                  {product.occasion}
                                </span>
                              </div>
                              <div className="p-6 text-left space-y-3.5">
                                <div className="flex justify-between items-baseline gap-2">
                                  <h3
                                    onClick={() => setSelectedProduct(product)}
                                    className="serif-display text-lg sm:text-xl font-normal text-brand-charcoal hover:text-brand-sage cursor-pointer transition-colors leading-snug truncate"
                                  >
                                    {product.name}
                                  </h3>
                                  <span className="font-mono text-xs sm:text-sm font-bold text-brand-sage-dark whitespace-nowrap">₹{product.price}</span>
                                </div>
                                <p className="text-brand-brown text-xs sm:text-sm leading-relaxed line-clamp-2">
                                  {product.shortDescription}
                                </p>
                                <button
                                  id={`featured-add-cart-${product.id}`}
                                  onClick={() => addToCart(product, 1, product.colors[0])}
                                  className="w-full bg-white hover:bg-brand-sage border border-brand-beige hover:border-brand-sage hover:text-white py-3.5 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
                                >
                                  Instantly Add to Cart
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* CTA button to shop page */}
                        <div className="text-center mt-12">
                          <button
                            id="home-view-all-btn"
                            onClick={() => setCurrentTab('shop')}
                            className="inline-flex items-center space-x-2 bg-brand-sage hover:bg-brand-sage-dark text-white text-xs font-semibold uppercase tracking-wider px-8 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer"
                          >
                            <span>Browse Complete Catalog</span>
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    </section>

                    <WhyChoose />
                    
                    {/* Brand Story Preview section on Home */}
                    <section id="home-story-preview" className="py-24 bg-white border-t border-brand-beige text-left">
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                          <div className="lg:col-span-6 space-y-6">
                            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-brand-gold">Our Philosophy</span>
                            <h2 className="serif-display text-3xl sm:text-4xl font-normal leading-tight text-brand-charcoal">
                              Gifting Reimagined For <br />
                              <span className="italic text-brand-sage-dark font-normal">A Greener Tomorrow</span>
                            </h2>
                            <div className="w-12 h-[1px] bg-brand-gold mt-4 mb-3" />
                            <p className="text-brand-brown text-sm leading-relaxed">
                              Every year, traditional gifting flowers worth millions are thrown away within 48 hours of celebration. We decided to bridge high-end Indian textile folding art with absolute zero-waste integrity. Unfold flowers into beautiful, everyday table napkins and weave life-long dinner memories.
                            </p>
                            <button
                              id="home-story-read-btn"
                              onClick={() => setCurrentTab('about')}
                              className="inline-flex items-center space-x-2 text-brand-sage-dark hover:text-brand-sage text-xs font-bold uppercase tracking-wider cursor-pointer"
                            >
                              <span>Read the complete Napike Odyssey</span>
                              <ArrowRight size={14} />
                            </button>
                          </div>
                          
                          <div className="lg:col-span-6 relative h-80 rounded-[40px] overflow-hidden shadow-xl border-4 border-brand-beige">
                            <img
                              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800"
                              alt="Botanical weavers hand dying yarns"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Highlights reviews */}
                    <Reviews />

                    {/* CTA Box Banner before footer */}
                    <section id="home-cta-banner" className="py-20 bg-brand-cream border-t border-brand-beige text-center">
                      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-brand-beige/50 border border-brand-gold/15 rounded-[48px] p-8 sm:p-14 space-y-6 shadow-sm relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-24 h-24 bg-brand-gold/5 rounded-full filter blur-[40px]" />
                          <div className="absolute bottom-0 right-0 w-24 h-24 bg-brand-sage/5 rounded-full filter blur-[40px]" />
                          
                          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-brand-gold">Custom Monograms</span>
                          <h2 className="serif-display text-3xl sm:text-4xl font-normal text-brand-charcoal">
                            Design Your Own Reusable Bouquet
                          </h2>
                          <p className="text-brand-brown text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
                            Coordinating a bespoke wedding, festive hamper, or corporate gathering? Select custom napkin counts, custom colors, and monogrammed embroidery. Let's design together.
                          </p>
                          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                            <button
                              id="home-cta-shop-btn"
                              onClick={() => setCurrentTab('shop')}
                              className="bg-brand-sage hover:bg-brand-sage-dark text-white px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider shadow-md transition-all cursor-pointer"
                            >
                              Shop the Collection
                            </button>
                            <button
                              id="home-cta-custom-btn"
                              onClick={() => setCurrentTab('contact')}
                              className="bg-white hover:bg-brand-beige text-brand-charcoal border border-brand-beige px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
                            >
                              WhatsApp Consultation
                            </button>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                )}

                {currentTab === 'shop' && (
                  <Shop
                    cart={cart}
                    addToCart={addToCart}
                    wishlist={wishlist}
                    toggleWishlist={toggleWishlist}
                    setSelectedProduct={setSelectedProduct}
                    setCurrentTab={setCurrentTab}
                  />
                )}

                {currentTab === 'why-napike' && <WhyChoose />}
                {currentTab === 'about' && <About />}
                {currentTab === 'gallery' && <Gallery />}
                {currentTab === 'faq' && <FAQ />}
                {currentTab === 'contact' && <Contact />}

                {/* Shopping Cart page view */}
                {currentTab === 'cart' && (
                  <Cart
                    cart={cart}
                    updateQuantity={updateQuantity}
                    removeFromCart={removeFromCart}
                    setCurrentTab={setCurrentTab}
                    couponCode={couponCode}
                    setCouponCode={setCouponCode}
                  />
                )}

                {/* Checkout Page view */}
                {currentTab === 'checkout' && (
                  <Checkout
                    cart={cart}
                    clearCart={clearCart}
                    setCurrentTab={setCurrentTab}
                    couponCode={couponCode}
                  />
                )}

                {/* Custom Wishlist Page View */}
                {currentTab === 'wishlist' && (
                  <section id="wishlist-page" className="py-24 bg-brand-cream border-t border-brand-beige text-left">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      {/* Section Title */}
                      <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-brand-gold font-sans">Your Vault</span>
                        <h2 className="serif-display text-3xl sm:text-4xl font-normal text-brand-charcoal mt-3">
                          Your Curated Favorites
                        </h2>
                        <div className="w-12 h-[1px] bg-brand-gold mx-auto mt-4" />
                      </div>

                      {wishlist.length === 0 ? (
                        <div className="max-w-md mx-auto py-16 text-center space-y-6">
                          <div className="p-4 bg-brand-beige w-fit rounded-full mx-auto text-brand-brown-light">
                            <Heart size={32} />
                          </div>
                          <h3 className="serif-display text-2xl font-light text-brand-charcoal">Your Wishlist is Empty</h3>
                          <p className="text-brand-brown text-sm leading-relaxed">
                            Bookmark your favorite organic cloth napkin arrangements as you browse through our handcrafted Jaipur catalog.
                          </p>
                          <button
                            id="wishlist-empty-shop"
                            onClick={() => setCurrentTab('shop')}
                            className="bg-brand-sage hover:bg-brand-sage-dark text-white text-xs font-semibold uppercase tracking-wider px-8 py-3.5 rounded-full shadow-sm cursor-pointer"
                          >
                            Browse Collection
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                          {wishlist.map((product) => (
                            <div
                              key={product.id}
                              id={`wishlist-card-${product.id}`}
                              className="group bg-white rounded-[32px] overflow-hidden border border-brand-beige hover:border-brand-gold/15 shadow-sm transition-all flex flex-col justify-between"
                            >
                              <div className="relative aspect-square overflow-hidden bg-brand-cream">
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  referrerPolicy="no-referrer"
                                />
                                <button
                                  id={`wishlist-remove-btn-${product.id}`}
                                  onClick={() => toggleWishlist(product)}
                                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2.5 rounded-full text-red-500 hover:scale-110 transition-transform cursor-pointer"
                                  title="Remove item"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                              <div className="p-6 space-y-4">
                                <div className="space-y-1">
                                  <h3
                                    onClick={() => setSelectedProduct(product)}
                                    className="serif-display text-lg font-normal text-brand-charcoal hover:text-brand-sage cursor-pointer transition-colors leading-snug truncate"
                                  >
                                    {product.name}
                                  </h3>
                                  <span className="font-mono text-xs font-bold text-brand-sage-dark">₹{product.price}</span>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    id={`wishlist-detail-${product.id}`}
                                    onClick={() => {
                                      setSelectedProduct(product);
                                      setCurrentTab('product-detail');
                                    }}
                                    className="flex-1 bg-brand-cream hover:bg-brand-beige text-brand-charcoal py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                                  >
                                    View Specs
                                  </button>
                                  <button
                                    id={`wishlist-add-cart-${product.id}`}
                                    onClick={() => addToCart(product, 1, product.colors[0])}
                                    className="flex-1 bg-brand-sage hover:bg-brand-sage-dark text-white py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                                  >
                                    Add To Cart
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {/* Authentication & Profile Pages */}
                {currentTab === 'login' && <Login setCurrentTab={setCurrentTab} />}
                {currentTab === 'signup' && <SignUp setCurrentTab={setCurrentTab} />}
                {currentTab === 'forgot-password' && (
                  <ForgotPassword setCurrentTab={setCurrentTab} setResetEmail={setResetEmail} />
                )}
                {currentTab === 'reset-password' && (
                  <ResetPassword setCurrentTab={setCurrentTab} resetEmail={resetEmail} />
                )}
                {currentTab === 'profile' && <Profile setCurrentTab={setCurrentTab} />}
                {currentTab === 'my-orders' && <MyOrders setCurrentTab={setCurrentTab} />}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Slide-out Global Cart Drawer Overlays */}
      <AnimatePresence>
        {isCartDrawerOpen && (
          <motion.div
            id="cart-drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartDrawerOpen(false)}
            className="fixed inset-0 bg-brand-charcoal/30 backdrop-blur-sm z-50 flex justify-end"
          >
            <motion.div
              id="cart-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-full max-w-md bg-brand-cream h-full shadow-2xl p-6 flex flex-col justify-between text-left"
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* Header */}
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-brand-beige">
                  <h3 className="serif-display text-xl font-medium text-brand-charcoal flex items-center gap-2">
                    <ShoppingBag size={18} className="text-brand-sage" />
                    <span>Selected Bouquets ({totalCartCount})</span>
                  </h3>
                  <button
                    id="close-cart-drawer"
                    onClick={() => setIsCartDrawerOpen(false)}
                    className="p-1 rounded-full hover:bg-brand-beige text-brand-charcoal/60 hover:text-brand-charcoal transition-colors cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* List items */}
                <div className="py-4 space-y-4 max-h-[55vh] overflow-y-auto divide-y divide-brand-beige/50">
                  {cart.length === 0 ? (
                    <div className="py-12 text-center text-brand-brown-light text-xs">
                      Your shopping drawer is empty.
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 pt-3 first:pt-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-14 h-14 object-cover rounded-xl border border-brand-beige shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="serif-display text-xs font-normal text-brand-charcoal truncate">
                            {item.product.name}
                          </h4>
                          <p className="text-[9px] text-brand-brown-light font-medium tracking-wide mt-0.5">
                            {item.quantity} x {item.selectedColor.name}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-mono text-xs font-bold text-brand-sage-dark block">
                            ₹{item.product.price * item.quantity}
                          </span>
                          <button
                            id={`drawer-remove-${item.id}`}
                            onClick={() => removeFromCart(item.id)}
                            className="text-[9px] uppercase font-bold text-red-500 hover:underline mt-1 cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Drawer Footer Calculations */}
              <div className="border-t border-brand-beige pt-4 space-y-4">
                <div className="flex justify-between items-baseline text-sm">
                  <span className="font-medium text-brand-charcoal">Subtotal</span>
                  <span className="font-mono font-bold text-brand-sage-dark text-base">₹{cartSubtotal}</span>
                </div>
                <p className="text-[9px] text-brand-brown leading-relaxed">
                  Taxes, shipping, and promotional discounts calculated securely at checkout. Free shipping on orders above ₹1,500.
                </p>

                <div className="flex gap-2">
                  <button
                    id="drawer-view-cart"
                    onClick={() => {
                      setIsCartDrawerOpen(false);
                      setCurrentTab('cart');
                    }}
                    className="flex-1 text-center bg-brand-beige hover:bg-brand-beige/80 text-brand-charcoal py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider cursor-pointer"
                  >
                    View Cart
                  </button>
                  <button
                    id="drawer-checkout"
                    onClick={() => {
                      setIsCartDrawerOpen(false);
                      setCurrentTab('checkout');
                    }}
                    disabled={cart.length === 0}
                    className="flex-1 text-center bg-brand-sage hover:bg-brand-sage-dark disabled:bg-brand-beige/50 text-white py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider cursor-pointer disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                  >
                    Checkout
                  </button>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Interactive WhatsApp consultation Bubble */}
      <div className="fixed bottom-6 left-6 z-45 flex items-center">
        <AnimatePresence>
          {isWhatsAppHovered && (
            <motion.div
              id="whatsapp-floater-text"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              className="bg-brand-charcoal text-white text-[10px] uppercase font-bold tracking-widest px-4 py-2 rounded-xl shadow-lg border border-white/5 mr-2 whitespace-nowrap"
            >
              Consult Artisans Live
            </motion.div>
          )}
        </AnimatePresence>
        
        <a
          href="https://wa.me/919999999999"
          target="_blank"
          rel="noreferrer"
          id="whatsapp-floating-btn"
          onMouseEnter={() => setIsWhatsAppHovered(true)}
          onMouseLeave={() => setIsWhatsAppHovered(false)}
          className="p-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-xl hover:scale-110 transition-all flex items-center justify-center relative cursor-pointer"
          aria-label="Contact custom artisan order support on WhatsApp"
        >
          {/* Animated pulsing halo around the WhatsApp icon */}
          <span className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping -z-10" />
          <MessageSquare size={20} className="fill-white text-emerald-600" />
        </a>
      </div>

      {/* Footer component */}
      <Footer
        setCurrentTab={setCurrentTab}
        setSelectedProduct={setSelectedProduct}
      />

    </div>
  );
}
