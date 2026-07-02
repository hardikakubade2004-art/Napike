/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, Tag, Sparkles, AlertCircle } from 'lucide-react';
import { CartItem, Product, ColorOption } from '../types';

interface CartProps {
  cart: CartItem[];
  updateQuantity: (itemId: string, qty: number) => void;
  removeFromCart: (itemId: string) => void;
  setCurrentTab: (tab: string) => void;
  couponCode: string;
  setCouponCode: (code: string) => void;
}

export default function Cart({
  cart,
  updateQuantity,
  removeFromCart,
  setCurrentTab,
  couponCode,
  setCouponCode
}: CartProps) {
  const [couponInput, setCouponInput] = useState(couponCode);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(!!couponCode);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = couponInput.trim().toUpperCase();

    if (formatted === 'NAPIKEGREEN' || formatted === 'WELCOME') {
      setCouponCode(formatted);
      setCouponSuccess(true);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code. Try WELCOME or NAPIKEGREEN');
      setCouponSuccess(false);
      setCouponCode('');
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setCouponInput('');
    setCouponSuccess(false);
    setCouponError('');
  };

  // Calculations
  const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  
  const discount = (() => {
    if (couponCode === 'NAPIKEGREEN' && subtotal > 0) return 200;
    if (couponCode === 'WELCOME' && subtotal > 0) return Math.round(subtotal * 0.1);
    return 0;
  })();

  const shipping = subtotal > 1500 ? 0 : subtotal > 0 ? 150 : 0;
  const taxes = Math.round((subtotal - discount) * 0.05); // 5% GST on handloom textiles
  const total = subtotal - discount + shipping + taxes;

  return (
    <section id="shopping-cart-page" className="py-24 bg-brand-cream border-t border-brand-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-brand-gold">Your Selection</span>
          <h1 className="serif-display text-3xl sm:text-4xl font-normal text-brand-charcoal mt-3">
            Shopping Cart
          </h1>
          <div className="w-12 h-[1px] bg-brand-gold mx-auto mt-4" />
        </div>

        {cart.length === 0 ? (
          /* Empty Cart state */
          <div className="max-w-md mx-auto py-16 text-center space-y-6">
            <div className="p-4 bg-brand-beige w-fit rounded-full mx-auto text-brand-brown-light">
              <ShoppingBag size={32} />
            </div>
            <h3 className="serif-display text-2xl font-light text-brand-charcoal">Your Cart is Quietly Empty</h3>
            <p className="text-brand-brown text-sm leading-relaxed">
              Fill it with beautiful organic cotton-linen rose arrangements that honor the Earth and Jaipur artisans.
            </p>
            <button
              id="empty-cart-shop-now"
              onClick={() => setCurrentTab('shop')}
              className="inline-flex items-center space-x-2 bg-brand-sage hover:bg-brand-sage-dark text-white text-xs font-semibold uppercase tracking-wider px-8 py-4 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>Explore The Collection</span>
              <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          /* Cart content list and summary block split screen */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left side: Cart List */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="space-y-4 divide-y divide-brand-beige/50">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    id={`cart-row-${item.id}`}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 first:pt-0 gap-4"
                  >
                    
                    {/* Item Image and title */}
                    <div className="flex items-center space-x-4 flex-1">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-2xl border border-brand-beige shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="text-left min-w-0">
                        <h3 className="serif-display text-base sm:text-lg font-normal text-brand-charcoal truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-[11px] text-brand-brown-light font-medium tracking-wide mt-0.5">
                          Theme: {item.selectedColor.name}
                        </p>
                        {item.customNote && (
                          <p className="text-[10px] text-brand-gold-dark bg-brand-gold-light/40 px-2 py-0.5 rounded-lg border border-brand-gold/15 mt-1.5 inline-block max-w-xs truncate">
                            Embroidery: "{item.customNote}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Quantity controls and Price block */}
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 border-t border-brand-beige/30 sm:border-t-0 pt-3 sm:pt-0">
                      
                      {/* Qty edit buttons */}
                      <div className="flex items-center space-x-2.5 bg-white border border-brand-beige rounded-xl px-2.5 py-1">
                        <button
                          id={`cart-qty-dec-${item.id}`}
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="px-1 text-brand-charcoal hover:text-brand-sage font-bold font-sans cursor-pointer text-sm"
                        >
                          -
                        </button>
                        <span className="font-mono text-xs font-semibold w-6 text-center select-none">{item.quantity}</span>
                        <button
                          id={`cart-qty-inc-${item.id}`}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-1 text-brand-charcoal hover:text-brand-sage font-bold font-sans cursor-pointer text-sm"
                        >
                          +
                        </button>
                      </div>

                      {/* Row price sub-total */}
                      <div className="text-right min-w-20">
                        <span className="font-mono text-sm sm:text-base font-bold text-brand-sage-dark">
                          ₹{item.product.price * item.quantity}
                        </span>
                      </div>

                      {/* Trash Button */}
                      <button
                        id={`cart-remove-${item.id}`}
                        onClick={() => removeFromCart(item.id)}
                        className="text-brand-brown-light hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-all cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>

                  </div>
                ))}
              </div>

              {/* Continue Shopping bottom button */}
              <div className="pt-6 border-t border-brand-beige text-left">
                <button
                  id="cart-continue-shopping"
                  onClick={() => setCurrentTab('shop')}
                  className="inline-flex items-center space-x-2 text-brand-charcoal hover:text-brand-sage text-xs font-semibold uppercase tracking-wider cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>Continue Shopping Collection</span>
                </button>
              </div>

            </div>

            {/* Right side: Summary & checkout details */}
            <div className="lg:col-span-4 bg-white border border-brand-beige rounded-[36px] p-6 sm:p-8 space-y-6 text-left shadow-sm">
              <h3 className="serif-display text-2xl font-light text-brand-charcoal border-b border-brand-beige pb-3">
                Order Summary
              </h3>

              {/* Coupon inputs */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-brown-light block">Promotional Coupon</label>
                
                {couponSuccess ? (
                  <div className="bg-brand-sage-light/40 border border-brand-sage/20 p-3 rounded-xl flex items-center justify-between text-xs text-brand-sage-dark">
                    <div className="flex items-center space-x-2">
                      <Tag size={14} className="text-brand-sage" />
                      <span>Applied: <strong>{couponCode}</strong></span>
                    </div>
                    <button
                      id="remove-coupon-btn"
                      onClick={handleRemoveCoupon}
                      className="text-brand-brown hover:text-red-600 font-bold hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                    <input
                      id="cart-coupon-input"
                      type="text"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        setCouponError('');
                      }}
                      placeholder="e.g. WELCOME"
                      className="flex-1 bg-brand-cream border border-brand-beige rounded-xl px-3.5 py-2.5 text-xs text-brand-charcoal focus:outline-none focus:border-brand-sage uppercase placeholder-brand-brown-light/50"
                    />
                    <button
                      type="submit"
                      id="apply-coupon-btn"
                      className="bg-brand-sage hover:bg-brand-sage-dark text-white px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {couponError && (
                  <p className="text-[10px] text-red-600 flex items-center gap-1">
                    <AlertCircle size={10} />
                    <span>{couponError}</span>
                  </p>
                )}

                {!couponSuccess && (
                  <div className="bg-brand-beige/40 p-2 rounded-xl text-[9px] text-brand-brown leading-relaxed flex items-center space-x-1 border border-brand-gold/5">
                    <Sparkles size={10} className="text-brand-gold shrink-0 animate-pulse" />
                    <span>Try <strong>WELCOME</strong> (10% Off) or <strong>NAPIKEGREEN</strong> (₹200 Off).</span>
                  </div>
                )}
              </div>

              {/* Order pricing summary lines */}
              <div className="space-y-3.5 pt-4 border-t border-brand-beige/60 text-xs text-brand-brown">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold">₹{subtotal}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-brand-sage-dark font-medium">
                    <span>Coupon Discount</span>
                    <span className="font-mono font-semibold">-₹{discount}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Sustainable Packaging</span>
                  <span className="text-emerald-700 font-medium">FREE</span>
                </div>

                <div className="flex justify-between">
                  <span>Standard Shipping</span>
                  <span className="font-mono">
                    {shipping === 0 ? <strong className="text-emerald-700 font-medium uppercase text-[10px]">FREE</strong> : `₹${shipping}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Estimated Tax (5% GST)</span>
                  <span className="font-mono">₹{taxes}</span>
                </div>

                {shipping > 0 && (
                  <p className="text-[9px] text-brand-brown-light italic leading-normal text-right">
                    Add ₹{1500 - subtotal} more of bouquets to unlock free domestic shipping!
                  </p>
                )}

                <div className="flex justify-between border-t border-brand-beige pt-4 text-base text-brand-charcoal font-sans">
                  <span className="font-medium">Total Amount</span>
                  <span className="font-mono font-bold text-brand-sage-dark">₹{total}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <div className="pt-2">
                <button
                  id="cart-checkout-btn"
                  onClick={() => setCurrentTab('checkout')}
                  className="w-full flex items-center justify-center space-x-2 bg-brand-sage hover:bg-brand-sage-dark text-white py-4 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={14} />
                </button>
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
}
