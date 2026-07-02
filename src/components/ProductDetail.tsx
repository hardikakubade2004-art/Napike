/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Heart, ShoppingBag, Truck, Calendar, Share2, Star, Check, ArrowLeft, Send, Gift, ShieldAlert } from 'lucide-react';
import { Product, ColorOption, CartItem } from '../types';
import { PRODUCTS } from '../data/products';

interface ProductDetailProps {
  product: Product;
  addToCart: (product: Product, quantity: number, color: ColorOption, customNote?: string) => void;
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  setCurrentTab: (tab: string) => void;
  setSelectedProduct: (product: Product | null) => void;
}

export default function ProductDetail({
  product,
  addToCart,
  wishlist,
  toggleWishlist,
  setCurrentTab,
  setSelectedProduct
}: ProductDetailProps) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ColorOption>(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [customEmbroidery, setCustomEmbroidery] = useState('');
  const [isShareDropdownOpen, setIsShareDropdownOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTabSection, setActiveTabSection] = useState<'details' | 'care' | 'shipping'>('details');

  // Related products recommendations (exclude active product)
  const relatedProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);
  }, [product]);

  // Is active product wishlisted?
  const isWishlisted = useMemo(() => {
    return wishlist.some((w) => w.id === product.id);
  }, [wishlist, product]);

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAddToCartClick = () => {
    addToCart(product, quantity, selectedColor, customEmbroidery.trim() || undefined);
  };

  const handleBuyNowClick = () => {
    addToCart(product, quantity, selectedColor, customEmbroidery.trim() || undefined);
    setCurrentTab('checkout');
  };

  // Estimate delivery dates (e.g., 4-7 days from now)
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
    <section id="product-detail-view" className="py-24 bg-brand-cream border-t border-brand-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <button
          id="back-to-shop-btn"
          onClick={() => {
            setSelectedProduct(null);
            setCurrentTab('shop');
          }}
          className="flex items-center space-x-2 text-brand-charcoal hover:text-brand-sage text-xs font-semibold uppercase tracking-wider mb-8 cursor-pointer transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back To Collection</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Image Gallery with Zoom */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-[4/5] bg-brand-beige rounded-[40px] overflow-hidden shadow-md group">
              <img
                src={product.images[activeImageIdx]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              
              {/* Floating zoom indicator tag */}
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm text-[10px] tracking-wider uppercase font-bold text-brand-brown-light pointer-events-none">
                Hover to Zoom
              </div>
            </div>

            {/* Thumbnails grid */}
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  id={`thumb-image-${idx}`}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`aspect-square rounded-2xl overflow-hidden bg-brand-beige border transition-all cursor-pointer ${
                    activeImageIdx === idx ? 'border-brand-sage scale-95 ring-2 ring-brand-sage-light' : 'border-brand-beige hover:border-brand-sage'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumb ${idx}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Complete Details & Shopping Choices */}
          <div className="lg:col-span-6 text-left space-y-6">
            
            {/* Occasion & Star rating */}
            <div className="flex items-center justify-between">
              <span className="bg-brand-beige text-[10px] tracking-widest font-bold text-brand-sage-dark px-3 py-1 rounded-full uppercase border border-brand-gold/15">
                {product.occasion} Occasion Bouquet
              </span>
              <div className="flex items-center space-x-1.5 text-brand-gold">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < Math.floor(product.rating) ? 'fill-brand-gold' : 'text-brand-beige'}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-brand-charcoal font-sans">{product.rating}</span>
                <span className="text-xs text-brand-brown-light font-sans">({product.reviewsCount} reviews)</span>
              </div>
            </div>

            {/* Title & Price */}
            <div className="space-y-2">
              <h1 className="serif-display text-3xl sm:text-4xl font-light leading-tight text-brand-charcoal">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4">
                <span className="font-mono text-2xl font-bold text-brand-sage-dark">
                  ₹{product.price}
                </span>
                <span className="text-xs text-brand-brown-light font-medium uppercase">
                  Includes All taxes & sustainable boxing
                </span>
              </div>
            </div>

            {/* Description Paragraph */}
            <p className="text-brand-brown text-sm sm:text-base leading-relaxed">
              {product.description}
            </p>

            {/* Sustainable Credentials Snippet */}
            <div className="grid grid-cols-2 gap-4 bg-brand-beige/50 p-4 rounded-3xl border border-brand-gold/10">
              <div className="flex items-start space-x-2.5">
                <Gift className="text-brand-sage shrink-0" size={18} />
                <div className="text-left">
                  <h4 className="text-xs font-bold text-brand-charcoal">Unfolds to 6 Napkins</h4>
                  <p className="text-[10px] text-brand-brown leading-relaxed mt-0.5">20 x 20 inch, double-mitered luxury linens.</p>
                </div>
              </div>
              <div className="flex items-start space-x-2.5 border-l border-brand-beige pl-4">
                <Calendar className="text-brand-sage shrink-0" size={18} />
                <div className="text-left">
                  <h4 className="text-xs font-bold text-brand-charcoal">Botanical Natural Dyes</h4>
                  <p className="text-[10px] text-brand-brown leading-relaxed mt-0.5">Crafted with indigo, logwood & turmeric.</p>
                </div>
              </div>
            </div>

            {/* Swatch Selection */}
            <div className="space-y-3">
              <label className="text-[11px] font-bold uppercase tracking-widest text-brand-brown-light block">
                Select Napkin Color Blend: <span className="text-brand-charcoal font-semibold">{selectedColor.name}</span>
              </label>
              <div className="flex space-x-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    id={`detail-swatch-${color.name}`}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                      selectedColor.name === color.name
                        ? 'ring-2 ring-brand-sage ring-offset-2 scale-115'
                        : 'border-brand-beige hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {selectedColor.name === color.name && (
                      <span className="w-1.5 h-1.5 bg-white rounded-full mix-blend-difference" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Embroidery Personalization box */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold uppercase tracking-widest text-brand-brown-light block">
                  Add Personalized Hand-Embroidery (Optional)
                </label>
                <span className="text-[9px] font-bold uppercase tracking-widest text-brand-gold bg-brand-gold-light/50 px-2 py-0.5 rounded-full border border-brand-gold/15">
                  Bespoke Craft
                </span>
              </div>
              <textarea
                id="custom-embroidery-input"
                rows={2}
                value={customEmbroidery}
                onChange={(e) => setCustomEmbroidery(e.target.value)}
                placeholder="e.g. Monogram initials 'A & R', Wedding date '14.02.2026', or short message on napkin edge..."
                className="w-full bg-white border border-brand-beige rounded-2xl p-4 text-xs sm:text-sm focus:outline-none focus:border-brand-sage focus:ring-1 focus:ring-brand-sage-light placeholder-brand-brown-light/60 resize-none text-brand-charcoal"
              />
            </div>

            {/* Quantity and Actions line */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              {/* Qty Selector */}
              <div className="flex items-center justify-between sm:justify-start space-x-3 bg-white border border-brand-beige rounded-2xl px-4 py-3 sm:py-3.5">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-brown-light sm:hidden">Qty:</span>
                <div className="flex items-center space-x-4">
                  <button
                    id="detail-qty-dec"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-2 text-brand-charcoal hover:text-brand-sage font-bold font-sans cursor-pointer text-base"
                  >
                    -
                  </button>
                  <span className="font-mono text-sm font-semibold w-8 text-center select-none">{quantity}</span>
                  <button
                    id="detail-qty-inc"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-2 text-brand-charcoal hover:text-brand-sage font-bold font-sans cursor-pointer text-base"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart button */}
              <button
                id="detail-add-cart-btn"
                onClick={handleAddToCartClick}
                className="flex-1 flex items-center justify-center space-x-2 bg-brand-cream hover:bg-brand-sage text-brand-charcoal hover:text-white border border-brand-beige hover:border-brand-sage py-4 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
              >
                <ShoppingBag size={14} />
                <span>Add to Shopping Cart</span>
              </button>

              {/* Wishlist Heart Button */}
              <button
                id="detail-wishlist-toggle"
                onClick={() => toggleWishlist(product)}
                className={`bg-white hover:bg-brand-beige border border-brand-beige p-3.5 rounded-2xl shadow-sm hover:scale-105 transition-all cursor-pointer flex items-center justify-center ${
                  isWishlisted ? 'text-red-500' : 'text-brand-charcoal hover:text-red-500'
                }`}
                aria-label="Add product to wishlist"
              >
                <Heart size={18} className={isWishlisted ? 'fill-red-500 text-red-500' : ''} />
              </button>
            </div>

            {/* Buy Now Direct Button */}
            <button
              id="detail-buy-now-btn"
              onClick={handleBuyNowClick}
              className="w-full flex items-center justify-center space-x-2 bg-brand-sage hover:bg-brand-sage-dark text-white py-4.5 rounded-2xl text-xs font-semibold uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
            >
              <span>Instant Buy Now</span>
            </button>

            {/* Delivery Estimates Box */}
            <div className="p-4 bg-brand-cream border border-brand-beige rounded-2xl space-y-3">
              <div className="flex items-center space-x-3 text-xs text-brand-brown">
                <Truck size={16} className="text-brand-sage shrink-0" />
                <p>
                  Estimated Delivery: <strong className="text-brand-charcoal font-sans">{estimateDeliveryRange}</strong>
                </p>
              </div>
              <div className="flex items-center space-x-3 text-xs text-brand-brown">
                <Share2 size={16} className="text-brand-sage shrink-0" />
                <div className="relative">
                  <button
                    id="share-btn"
                    onClick={handleShareClick}
                    className="hover:text-brand-sage-dark font-semibold uppercase tracking-wider text-[10px] cursor-pointer"
                  >
                    {copiedLink ? '✓ Link Copied' : 'Share this masterpiece'}
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs details / care instructions / shipping specs */}
            <div className="border-t border-brand-beige pt-6">
              <div className="flex border-b border-brand-beige/50 pb-2 mb-4">
                {['details', 'care', 'shipping'].map((tab) => (
                  <button
                    key={tab}
                    id={`detail-tab-${tab}`}
                    onClick={() => setActiveTabSection(tab as any)}
                    className={`text-xs uppercase tracking-wider font-semibold py-2 px-4 transition-all border-b-2 cursor-pointer ${
                      activeTabSection === tab
                        ? 'border-brand-sage text-brand-sage-dark'
                        : 'border-transparent text-brand-brown-light hover:text-brand-brown'
                    }`}
                  >
                    {tab === 'details' ? 'Specifications' : tab === 'care' ? 'Care & Wash' : 'Shipping'}
                  </button>
                ))}
              </div>

              {activeTabSection === 'details' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3 text-xs text-brand-brown leading-relaxed text-left"
                >
                  <p><strong>Unfolding dimensions:</strong> {product.size}</p>
                  <p><strong>Premium Materials:</strong> {product.materials}</p>
                  <div className="space-y-1.5 pt-1">
                    <p className="font-bold uppercase tracking-wider text-[10px] text-brand-charcoal">Artisanal Features:</p>
                    <ul className="list-disc list-inside space-y-1 pl-1">
                      {product.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}

              {activeTabSection === 'care' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-brand-brown leading-relaxed space-y-2 text-left"
                >
                  <p>Our napkins are built to get softer and more absorbent with every wash. Please follow these guidelines:</p>
                  <ul className="list-disc list-inside space-y-1 pl-1">
                    <li>Machine wash with mild detergent on gentle cycle in cold water.</li>
                    <li>For natural botanical dyes (indigo, turmeric), wash separately for the first 1-2 washes.</li>
                    <li>Do not bleach or use synthetic enzyme fabric softeners.</li>
                    <li>Tumble dry on low or line-dry in the shade.</li>
                    <li>Iron with a warm iron for a neat, premium finish.</li>
                  </ul>
                </motion.div>
              )}

              {activeTabSection === 'shipping' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-brand-brown leading-relaxed space-y-2 text-left"
                >
                  <p>Every Napike bouquet is carefully folded by hand upon order verification to guarantee pristine, crisp napkin folds.</p>
                  <ul className="list-disc list-inside space-y-1 pl-1">
                    <li><strong>Dispatch time:</strong> Shipped in 2-3 business days.</li>
                    <li><strong>Standard delivery:</strong> 3-5 shipping business days post dispatch.</li>
                    <li><strong>Bulk Orders:</strong> For corporate orders or wedding invitations (above 15 pieces), please allow 10-15 days for meticulous hand-embroidery and folding.</li>
                  </ul>
                </motion.div>
              )}
            </div>

          </div>
        </div>

        {/* Detailed Product Reviews Section */}
        <div className="mt-24 border-t border-brand-beige pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
            
            {/* Reviews Summary left */}
            <div className="lg:col-span-4 space-y-4">
              <h3 className="serif-display text-2xl font-light text-brand-charcoal">Product Reviews</h3>
              <div className="flex items-baseline space-x-3">
                <span className="serif-display text-5xl font-light text-brand-sage">{product.rating}</span>
                <div className="space-y-0.5">
                  <div className="flex text-brand-gold">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-brand-gold text-brand-gold" />
                    ))}
                  </div>
                  <p className="text-xs text-brand-brown-light font-medium font-sans">Based on verified orders</p>
                </div>
              </div>

              {/* Progress bars */}
              <div className="space-y-2 pt-2">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const percentage = stars === 5 ? 90 : stars === 4 ? 8 : 2;
                  return (
                    <div key={stars} className="flex items-center text-xs text-brand-brown space-x-3">
                      <span className="w-12 font-sans font-bold">{stars} Star</span>
                      <div className="flex-1 h-1.5 bg-brand-beige rounded-full overflow-hidden">
                        <div className="h-full bg-brand-sage rounded-full" style={{ width: `${percentage}%` }} />
                      </div>
                      <span className="w-8 text-right font-mono text-brand-brown-light">{percentage}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reviews List right */}
            <div className="lg:col-span-8 space-y-6 max-h-[500px] overflow-y-auto pr-4">
              {product.reviews.map((rev) => (
                <div key={rev.id} className="bg-white p-6 rounded-3xl border border-brand-beige space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-brand-charcoal text-sm">{rev.user}</h4>
                      <div className="flex items-center space-x-2 mt-0.5">
                        <span className="text-[10px] text-green-700 bg-green-50 px-2 py-0.5 rounded-full font-bold flex items-center border border-green-100">
                          <Check size={10} className="mr-1" />
                          Verified Purchase
                        </span>
                        <span className="text-[10px] text-brand-brown-light font-mono">{rev.date}</span>
                      </div>
                    </div>
                    <div className="flex text-brand-gold">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} size={12} className="fill-brand-gold text-brand-gold" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-brand-brown leading-relaxed">"{rev.comment}"</p>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Related Products horizontal display shelf */}
        <div className="mt-24 border-t border-brand-beige pt-16">
          <h3 className="serif-display text-2xl font-light text-brand-charcoal mb-10 text-left">
            You May Also Admire
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {relatedProducts.map((relProduct) => (
              <div
                key={relProduct.id}
                id={`related-product-${relProduct.id}`}
                onClick={() => {
                  setSelectedProduct(relProduct);
                  setActiveImageIdx(0);
                  setSelectedColor(relProduct.colors[0]);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group bg-white rounded-[28px] overflow-hidden border border-brand-beige hover:border-brand-gold/15 shadow-sm hover:shadow-md transition-all duration-300 text-left cursor-pointer"
              >
                <div className="aspect-[4/3] overflow-hidden bg-brand-cream">
                  <img
                    src={relProduct.images[0]}
                    alt={relProduct.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-5 space-y-1">
                  <h4 className="serif-display text-base font-normal text-brand-charcoal group-hover:text-brand-sage transition-colors line-clamp-1">
                    {relProduct.name}
                  </h4>
                  <div className="flex justify-between items-center pt-1">
                    <span className="font-mono text-xs font-bold text-brand-sage-dark">₹{relProduct.price}</span>
                    <span className="text-[10px] uppercase font-bold text-brand-brown-light tracking-wide">{relProduct.occasion}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
