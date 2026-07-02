/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, CreditCard, Landmark, Truck, Check, Sparkles, ArrowLeft, Heart, Award, Copy } from 'lucide-react';
import { CartItem, Product, ColorOption, Order } from '../types';
import { useAuth } from '../context/AuthContext';
import { dbSaveOrder } from '../lib/firebase';

interface CheckoutProps {
  cart: CartItem[];
  clearCart: () => void;
  setCurrentTab: (tab: string) => void;
  couponCode: string;
}

export default function Checkout({
  cart,
  clearCart,
  setCurrentTab,
  couponCode
}: CheckoutProps) {
  // Shipping form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('Delhi');
  const [postalCode, setPostalCode] = useState('');

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setPhone(user.phone || '');
      if (user.fullName) {
        const parts = user.fullName.split(' ');
        setFirstName(parts[0] || '');
        setLastName(parts.slice(1).join(' ') || '');
      }
    }
  }, [user]);
  
  // Payment option
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('cod');
  
  // Card details mock
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Success screen trigger
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  // Calculations
  const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  
  const discount = (() => {
    if (couponCode === 'NAPIKEGREEN' && subtotal > 0) return 200;
    if (couponCode === 'WELCOME' && subtotal > 0) return Math.round(subtotal * 0.1);
    return 0;
  })();

  const shipping = subtotal > 1500 ? 0 : subtotal > 0 ? 150 : 0;
  const taxes = Math.round((subtotal - discount) * 0.05);
  const grandTotal = subtotal - discount + shipping + taxes;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !address || !city || !postalCode) return;

    // Generate a beautiful order number
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const orderId = `NPK-2026-${randomDigits}`;
    setOrderNumber(orderId);

    // Save to localStorage under napike_orders
    const savedOrdersRaw = localStorage.getItem('napike_orders');
    let savedOrders = [];
    if (savedOrdersRaw) {
      try {
        savedOrders = JSON.parse(savedOrdersRaw);
      } catch (err) {
        console.error(err);
      }
    }

    const newOrder: Order = {
      id: orderId,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      userEmail: email,
      items: cart.map(item => ({
        productName: item.product.name,
        image: item.product.images[0] || '',
        quantity: item.quantity,
        color: item.selectedColor.name,
        price: item.product.price
      })),
      subtotal,
      discount,
      shipping,
      taxes,
      total: grandTotal,
      status: 'Pending',
      deliveryAddress: address,
      city,
      state: stateName,
      postalCode,
      paymentMethod: paymentMethod === 'upi' ? 'UPI' : paymentMethod === 'card' ? 'Credit Card' : 'Cash On Delivery'
    };

    savedOrders.push(newOrder);
    localStorage.setItem('napike_orders', JSON.stringify(savedOrders));
    
    // Save to Supabase asynchronously
    dbSaveOrder(newOrder).catch(err => {
      console.warn('Could not save order to Supabase:', err);
    });
    
    setOrderSuccess(true);
  };

  const handleFinishSuccess = () => {
    clearCart();
    setCurrentTab('my-orders');
  };

  // Estimate delivery range
  const estimateDeliveryRange = useMemo(() => {
    const today = new Date();
    const minDelivery = new Date();
    minDelivery.setDate(today.getDate() + 4);
    const maxDelivery = new Date();
    maxDelivery.setDate(today.getDate() + 7);

    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${minDelivery.toLocaleDateString('en-US', options)} - ${maxDelivery.toLocaleDateString('en-US', options)}`;
  }, []);

  return (
    <section id="checkout-flow-page" className="py-24 bg-brand-cream border-t border-brand-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-brand-gold">Secure Gateway</span>
          <h1 className="serif-display text-3xl sm:text-4xl font-normal text-brand-charcoal mt-3">
            Secure Checkout
          </h1>
          <div className="w-12 h-[1px] bg-brand-gold mx-auto mt-4" />
        </div>

        {/* Back navigation */}
        <button
          id="checkout-back-cart-btn"
          onClick={() => setCurrentTab('cart')}
          className="flex items-center space-x-2 text-brand-charcoal hover:text-brand-sage text-xs font-semibold uppercase tracking-wider mb-8 cursor-pointer transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Shopping Cart</span>
        </button>

        {cart.length === 0 && !orderSuccess ? (
          /* Empty state */
          <div className="py-16 text-center">
            <p className="text-brand-brown mb-4">No bouquets ready for checkout.</p>
            <button
              id="checkout-shop-redirect-btn"
              onClick={() => setCurrentTab('shop')}
              className="px-6 py-2.5 rounded-full bg-brand-sage hover:bg-brand-sage-dark text-white text-xs font-semibold uppercase tracking-wider shadow-sm"
            >
              Shop Collection
            </button>
          </div>
        ) : (
          /* Checkout columns split */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left side: Billing Address + Payments Form */}
            <form id="checkout-billing-form" onSubmit={handlePlaceOrder} className="lg:col-span-8 space-y-8 text-left">
              
              {/* Shipping Address details section */}
              <div className="bg-white border border-brand-beige p-6 sm:p-8 rounded-[36px] shadow-sm space-y-6">
                <h3 className="serif-display text-2xl font-light text-brand-charcoal flex items-center gap-2">
                  <Truck size={20} className="text-brand-sage" />
                  <span>1. Shipping Details</span>
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-brand-brown-light">First Name *</label>
                    <input
                      id="shipping-first-name"
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Suresh"
                      className="w-full bg-brand-cream border border-brand-beige rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:border-brand-sage text-brand-charcoal"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-brand-brown-light">Last Name *</label>
                    <input
                      id="shipping-last-name"
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Menon"
                      className="w-full bg-brand-cream border border-brand-beige rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:border-brand-sage text-brand-charcoal"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-brand-brown-light">Email Address *</label>
                    <input
                      id="shipping-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. suresh@gmail.com"
                      className="w-full bg-brand-cream border border-brand-beige rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:border-brand-sage text-brand-charcoal"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-brand-brown-light">WhatsApp Contact *</label>
                    <input
                      id="shipping-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full bg-brand-cream border border-brand-beige rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:border-brand-sage text-brand-charcoal"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-brand-brown-light">Delivery Street Address *</label>
                  <input
                    id="shipping-address"
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Apartment, Suite, Villa name, block or locality"
                    className="w-full bg-brand-cream border border-brand-beige rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:border-brand-sage text-brand-charcoal"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-1 col-span-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-brand-brown-light">City *</label>
                    <input
                      id="shipping-city"
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Mumbai"
                      className="w-full bg-brand-cream border border-brand-beige rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:border-brand-sage text-brand-charcoal"
                    />
                  </div>
                  <div className="space-y-1 col-span-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-brand-brown-light">State / Province</label>
                    <select
                      id="shipping-state"
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      className="w-full bg-brand-cream border border-brand-beige rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:border-brand-sage text-brand-charcoal"
                    >
                      <option value="Delhi">Delhi</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="West Bengal">West Bengal</option>
                    </select>
                  </div>
                  <div className="space-y-1 col-span-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-brand-brown-light">Postal PIN Code *</label>
                    <input
                      id="shipping-postal"
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="e.g. 400001"
                      className="w-full bg-brand-cream border border-brand-beige rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:border-brand-sage text-brand-charcoal"
                    />
                  </div>
                </div>

              </div>

              {/* Simulated Payment details selection section */}
              <div className="bg-white border border-brand-beige p-6 sm:p-8 rounded-[36px] shadow-sm space-y-6">
                <h3 className="serif-display text-2xl font-light text-brand-charcoal flex items-center gap-2">
                  <ShieldCheck size={20} className="text-brand-sage" />
                  <span>2. Payment Methodology</span>
                </h3>

                {/* Method Toggles */}
                <div className="grid grid-cols-3 gap-4">
                  {/* COD */}
                  <button
                    type="button"
                    id="pay-toggle-cod"
                    onClick={() => setPaymentMethod('cod')}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'border-brand-sage bg-brand-sage-light/30 text-brand-sage-dark font-semibold'
                        : 'border-brand-beige hover:border-brand-sage text-brand-charcoal/70'
                    }`}
                  >
                    <Truck size={18} className="mb-1.5" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Cash on Delivery</span>
                  </button>

                  {/* UPI */}
                  <button
                    type="button"
                    id="pay-toggle-upi"
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all cursor-pointer ${
                      paymentMethod === 'upi'
                        ? 'border-brand-sage bg-brand-sage-light/30 text-brand-sage-dark font-semibold'
                        : 'border-brand-beige hover:border-brand-sage text-brand-charcoal/70'
                    }`}
                  >
                    <Landmark size={18} className="mb-1.5" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">UPI / GPay</span>
                  </button>

                  {/* Credit Card */}
                  <button
                    type="button"
                    id="pay-toggle-card"
                    onClick={() => setPaymentMethod('card')}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-brand-sage bg-brand-sage-light/30 text-brand-sage-dark font-semibold'
                        : 'border-brand-beige hover:border-brand-sage text-brand-charcoal/70'
                    }`}
                  >
                    <CreditCard size={18} className="mb-1.5" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Credit Card</span>
                  </button>
                </div>

                {/* Sub Forms */}
                <AnimatePresence mode="wait">
                  {paymentMethod === 'cod' && (
                    <motion.div
                      key="cod-spec"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-brand-cream p-4 rounded-2xl border border-brand-beige space-y-2 text-xs text-brand-brown leading-relaxed"
                    >
                      <p><strong>✓ Standard Cash/UPI on Delivery Selected.</strong></p>
                      <p>No upfront charge is required. You can pay securely with cash or any UPI QR code scanner directly to the delivery partner when they bring your handmade bouquet box.</p>
                    </motion.div>
                  )}

                  {paymentMethod === 'upi' && (
                    <motion.div
                      key="upi-spec"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-brand-cream p-5 rounded-2xl border border-brand-beige space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        {/* Mock QR box */}
                        <div className="w-24 h-24 bg-brand-charcoal rounded-xl border-4 border-white flex items-center justify-center text-white p-2 shrink-0 relative shadow-sm">
                          {/* Simulated QR Code lines */}
                          <div className="absolute inset-1 border border-brand-gold/30 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:8px_8px] opacity-80" />
                          <span className="font-mono text-[8px] font-bold z-10 bg-brand-charcoal px-1.5 py-0.5 rounded text-brand-gold uppercase tracking-widest">NAPIKE UPI</span>
                        </div>
                        <div className="text-left space-y-2">
                          <h4 className="font-bold text-xs text-brand-charcoal">Scan QR or enter UPI VPA ID</h4>
                          <p className="text-[11px] text-brand-brown leading-relaxed">Scan the secure QR or pay to <strong>napike@upi</strong> on any mobile checkout app. Once scanned and completed, tap "Place Order" to verify.</p>
                          <input
                            id="upi-vpa-id"
                            type="text"
                            placeholder="e.g. suresh@okhdfc"
                            className="bg-white border border-brand-beige rounded-xl p-2.5 text-xs focus:outline-none focus:border-brand-sage w-full text-brand-charcoal font-sans"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {paymentMethod === 'card' && (
                    <motion.div
                      key="card-spec"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-brand-cream p-5 rounded-2xl border border-brand-beige space-y-4 text-left"
                    >
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-brand-brown-light">Card Number *</label>
                        <input
                          id="card-num"
                          type="text"
                          required={paymentMethod === 'card'}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                          maxLength={19}
                          placeholder="4111 2222 3333 4444"
                          className="w-full bg-white border border-brand-beige rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:border-brand-sage text-brand-charcoal font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-brand-brown-light">Expiry Date *</label>
                          <input
                            id="card-exp"
                            type="text"
                            required={paymentMethod === 'card'}
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM / YY"
                            maxLength={5}
                            className="w-full bg-white border border-brand-beige rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:border-brand-sage text-brand-charcoal font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-brand-brown-light">CVV Security *</label>
                          <input
                            id="card-cvv"
                            type="password"
                            required={paymentMethod === 'card'}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            maxLength={3}
                            placeholder="•••"
                            className="w-full bg-white border border-brand-beige rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:border-brand-sage text-brand-charcoal font-mono"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>

              {/* Secure placement CTA */}
              <div className="text-right">
                <button
                  type="submit"
                  id="checkout-submit-order-btn"
                  className="bg-brand-sage hover:bg-brand-sage-dark text-white text-xs font-semibold uppercase tracking-widest px-10 py-4.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  Place Order Securely
                </button>
              </div>

            </form>

            {/* Right side: Cart Item receipt sidebar summary */}
            <div className="lg:col-span-4 bg-white border border-brand-beige rounded-[36px] p-6 sm:p-8 space-y-6 text-left shadow-sm">
              <h3 className="serif-display text-2xl font-light text-brand-charcoal border-b border-brand-beige pb-3">
                Items Selected
              </h3>

              {/* Mini row list of products in checkout */}
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2 divide-y divide-brand-beige/40">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 pt-3 first:pt-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-xl border border-brand-beige shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="serif-display text-xs font-medium text-brand-charcoal truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-[9px] text-brand-brown-light font-medium tracking-wide mt-0.5">
                        {item.quantity} x {item.selectedColor.name}
                      </p>
                    </div>
                    <span className="font-mono text-xs font-bold text-brand-sage-dark">
                      ₹{item.product.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Line Recaps */}
              <div className="space-y-3 pt-4 border-t border-brand-beige text-xs text-brand-brown">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono">₹{subtotal}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-brand-sage-dark font-medium">
                    <span>Applied Coupon</span>
                    <span className="font-mono">-₹{discount}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Standard Shipping</span>
                  <span className="font-mono">
                    {shipping === 0 ? <strong className="text-emerald-700 uppercase font-bold text-[9px]">FREE</strong> : `₹${shipping}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>GST Taxes (5%)</span>
                  <span className="font-mono">₹{taxes}</span>
                </div>

                <div className="flex justify-between border-t border-brand-beige pt-4 text-base text-brand-charcoal font-sans">
                  <span className="font-medium">Total Payable</span>
                  <span className="font-mono font-bold text-brand-sage-dark">₹{grandTotal}</span>
                </div>
              </div>

              {/* Trust disclaimer badge bottom */}
              <div className="p-3.5 bg-brand-cream border border-brand-gold/10 rounded-2xl flex items-start space-x-2.5">
                <ShieldCheck className="text-brand-gold shrink-0 mt-0.5" size={16} />
                <p className="text-[9px] text-brand-brown leading-relaxed">
                  <strong>Secure 256-bit encryption.</strong> Napike respects your privacy and uses SSL secure links. No bank logs are saved on local caches.
                </p>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* Highly Animated Immersive Success Overlay Lightbox Modal */}
      <AnimatePresence>
        {orderSuccess && (
          <motion.div
            id="order-success-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-brand-charcoal/50 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              id="order-success-card"
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-brand-cream border border-brand-gold/25 rounded-[40px] max-w-xl w-full p-8 text-center space-y-6 shadow-2xl relative overflow-hidden"
            >
              
              {/* Background celebration glow sparkles */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold-light rounded-full filter blur-[60px] opacity-60 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-sage-light rounded-full filter blur-[60px] opacity-40 pointer-events-none" />

              <div className="p-4 bg-brand-sage text-white w-fit rounded-full mx-auto shadow-md">
                <Check size={36} />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold tracking-[0.25em] text-brand-gold uppercase">Gifting Confirmed</span>
                <h2 className="serif-display text-3xl font-light text-brand-charcoal">Thank You For Your Order!</h2>
                <div className="w-12 h-[1px] bg-brand-gold mx-auto mt-3" />
              </div>

              <p className="text-brand-brown text-sm leading-relaxed max-w-md mx-auto">
                Your order has been logged successfully. Our Jaipur weavers and napkin folding artisans are already busy crafting your sustainable masterpieces.
              </p>

              {/* Order reference tag */}
              <div className="bg-white border border-brand-beige p-4 rounded-2xl flex flex-col items-center justify-center space-y-1 w-fit mx-auto px-8 relative group shadow-sm">
                <span className="text-[9px] uppercase tracking-wider text-brand-brown-light font-bold">Order Reference Number</span>
                <span className="font-mono text-base font-bold text-brand-charcoal tracking-wider flex items-center gap-1.5 select-all">
                  {orderNumber}
                </span>
                <p className="text-[9px] text-brand-sage-dark font-semibold uppercase tracking-wider pt-1">Estimated Delivery: {estimateDeliveryRange}</p>
              </div>

              {/* Summary line */}
              <div className="border-t border-brand-beige pt-6 text-xs text-brand-brown space-y-2 max-w-sm mx-auto">
                <p>We’ve dispatched a receipt copy and invoice to <strong>{email}</strong>.</p>
                <p>A WhatsApp status notification link has also been sent to your contact: <strong>{phone}</strong>.</p>
              </div>

              {/* Return Home Button */}
              <div className="pt-2">
                <button
                  id="checkout-success-continue-btn"
                  onClick={handleFinishSuccess}
                  className="inline-flex items-center space-x-2 bg-brand-sage hover:bg-brand-sage-dark text-white text-xs font-semibold uppercase tracking-wider px-8 py-3.5 rounded-full shadow-md transition-all duration-300 cursor-pointer"
                >
                  <span>Continue Exploring</span>
                  <Sparkles size={12} className="text-brand-gold-light" />
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
