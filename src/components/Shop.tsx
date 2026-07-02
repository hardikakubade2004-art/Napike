/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingBag, Eye, SlidersHorizontal, ChevronRight, X, Sparkles, Check, Info } from 'lucide-react';
import { Product, CartItem, ColorOption } from '../types';
import { PRODUCTS } from '../data/products';

interface ShopProps {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, color: ColorOption) => void;
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  setSelectedProduct: (product: Product) => void;
  setCurrentTab: (tab: string) => void;
}

export default function Shop({
  cart,
  addToCart,
  wishlist,
  toggleWishlist,
  setSelectedProduct,
  setCurrentTab
}: ShopProps) {
  // Filters state
  const [selectedOccasion, setSelectedOccasion] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(2500);
  const [selectedColorName, setSelectedColorName] = useState<string>('All');
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>('featured');

  // Quick View State
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [quickViewSelectedColor, setQuickViewSelectedColor] = useState<ColorOption | null>(null);
  const [quickViewQty, setQuickViewQty] = useState(1);

  // Card-specific selected colors tracker
  const [cardSelectedColors, setCardSelectedColors] = useState<Record<string, ColorOption>>(
    PRODUCTS.reduce((acc, p) => ({ ...acc, [p.id]: p.colors[0] }), {})
  );

  // Unique lists for filter dropdowns
  const occasionsList = ['All', 'Wedding', 'Birthday', 'Baby Shower', 'Corporate', 'Festive'];
  const colorsList = useMemo(() => {
    const allColors = PRODUCTS.flatMap((p) => p.colors.map((c) => c.name));
    return ['All', ...Array.from(new Set(allColors))];
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // Filter by occasion
    if (selectedOccasion !== 'All') {
      result = result.filter((p) => p.occasion === selectedOccasion);
    }

    // Filter by price
    result = result.filter((p) => p.price <= maxPrice);

    // Filter by color name
    if (selectedColorName !== 'All') {
      result = result.filter((p) =>
        p.colors.some((c) => c.name.toLowerCase().includes(selectedColorName.toLowerCase()))
      );
    }

    // Sort
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [selectedOccasion, maxPrice, selectedColorName, sortBy]);

  const handleCardColorSelect = (productId: string, color: ColorOption) => {
    setCardSelectedColors((prev) => ({ ...prev, [productId]: color }));
  };

  const handleOpenQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setQuickViewSelectedColor(product.colors[0]);
    setQuickViewQty(1);
  };

  const handleQuickViewAddToCart = () => {
    if (quickViewProduct && quickViewSelectedColor) {
      addToCart(quickViewProduct, quickViewQty, quickViewSelectedColor);
      setQuickViewProduct(null);
    }
  };

  const isProductInWishlist = (product: Product) => {
    return wishlist.some((item) => item.id === product.id);
  };

  return (
    <section id="shop-catalog" className="py-24 bg-brand-cream border-t border-brand-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-brand-gold">The Collection</span>
          <h1 className="serif-display text-3xl sm:text-4xl font-normal text-brand-charcoal mt-3">
            Handcrafted Napkin Bouquets
          </h1>
          <div className="w-12 h-[1px] bg-brand-gold mx-auto mt-4 mb-3" />
          <p className="text-brand-brown text-sm leading-relaxed">
            Meticulously folded organic linens, bound in natural fibers. An elegant sustainable gift that persists forever.
          </p>
        </div>

        {/* Toolbar (Filters toggle, Sorting, Product count) */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-brand-beige pb-6 mb-8 gap-4">
          <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-start">
            <button
              id="toggle-filters-btn"
              onClick={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)}
              className="flex items-center space-x-2 bg-white hover:bg-brand-beige text-brand-charcoal border border-brand-beige px-4 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-sm cursor-pointer"
            >
              <SlidersHorizontal size={14} />
              <span>Filters</span>
            </button>
            <span className="text-xs text-brand-brown-light font-medium uppercase tracking-wider">
              Showing {filteredProducts.length} of {PRODUCTS.length} creations
            </span>
          </div>

          <div className="flex items-center space-x-2 self-end sm:self-auto">
            <span className="text-xs text-brand-brown font-medium">Sort by:</span>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-brand-beige rounded-full text-xs font-medium px-4 py-2 text-brand-charcoal focus:outline-none focus:border-brand-sage shadow-sm"
            >
              <option value="featured">Featured Masterpieces</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated (★)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Collapsible Filter Sidebar */}
          <AnimatePresence>
            {isFilterSidebarOpen && (
              <motion.div
                id="filter-sidebar"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: '100%' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3 }}
                className="lg:col-span-3 bg-white p-6 rounded-3xl border border-brand-beige shadow-sm space-y-6 overflow-hidden"
              >
                <div className="flex items-center justify-between border-b border-brand-beige pb-4">
                  <h3 className="serif-display text-lg font-medium text-brand-charcoal">Filter Criteria</h3>
                  <button
                    id="clear-filters-btn"
                    onClick={() => {
                      setSelectedOccasion('All');
                      setMaxPrice(2500);
                      setSelectedColorName('All');
                    }}
                    className="text-[10px] uppercase tracking-wider text-brand-sage hover:text-brand-sage-dark font-bold cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                {/* Filter by Occasion */}
                <div className="space-y-2 text-left">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-brand-brown-light">Occasion</h4>
                  <div className="flex flex-col space-y-1">
                    {occasionsList.map((occ) => (
                      <button
                        key={occ}
                        id={`filter-occ-${occ}`}
                        onClick={() => setSelectedOccasion(occ)}
                        className={`text-left text-xs font-medium py-1.5 px-2.5 rounded-lg transition-colors flex justify-between items-center cursor-pointer ${
                          selectedOccasion === occ
                            ? 'bg-brand-beige/80 text-brand-sage-dark font-semibold'
                            : 'text-brand-charcoal/70 hover:bg-brand-cream'
                        }`}
                      >
                        <span>{occ}</span>
                        {selectedOccasion === occ && <Check size={12} />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filter by Color */}
                <div className="space-y-2 text-left">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-brand-brown-light">Color Theme</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {colorsList.map((colorName) => (
                      <button
                        key={colorName}
                        id={`filter-color-${colorName}`}
                        onClick={() => setSelectedColorName(colorName)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                          selectedColorName === colorName
                            ? 'bg-brand-charcoal text-white border-brand-charcoal'
                            : 'bg-brand-cream text-brand-charcoal border-brand-beige hover:border-brand-sage'
                        }`}
                      >
                        {colorName}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filter by Price slider */}
                <div className="space-y-3 text-left">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-brand-brown-light">Max Price</h4>
                    <span className="font-mono text-xs font-semibold text-brand-sage-dark">₹{maxPrice}</span>
                  </div>
                  <input
                    id="price-range-slider"
                    type="range"
                    min="1400"
                    max="2500"
                    step="100"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-brand-sage h-1 bg-brand-beige rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-brand-brown-light uppercase">
                    <span>₹1,400</span>
                    <span>₹2,500</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Catalog Grid */}
          <div className={`${isFilterSidebarOpen ? 'lg:col-span-9' : 'lg:col-span-12'} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8`}>
            {filteredProducts.map((product) => {
              const currentSelectedColor = cardSelectedColors[product.id] || product.colors[0];
              
              return (
                <motion.div
                  key={product.id}
                  id={`product-card-${product.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="group bg-white rounded-[32px] overflow-hidden border border-brand-beige hover:border-brand-gold/20 shadow-sm hover:shadow-lg transition-all duration-500 flex flex-col justify-between"
                >
                  
                  {/* Card Thumbnail / Header Action overlay */}
                  <div className="relative aspect-square bg-brand-cream overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />

                    {/* Left overlay badge: occasion */}
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[9px] tracking-widest font-bold text-brand-sage-dark px-2.5 py-1 rounded-full uppercase border border-brand-beige">
                      {product.occasion}
                    </span>

                    {/* Featured Star Badge */}
                    {product.isFeatured && (
                      <span className="absolute top-4 left-24 bg-brand-gold-light/95 backdrop-blur-md text-[9px] tracking-widest font-bold text-brand-gold-dark px-2.5 py-1 rounded-full uppercase border border-brand-gold/15 flex items-center space-x-1">
                        <Sparkles size={8} className="fill-brand-gold-dark" />
                        <span>Best Seller</span>
                      </span>
                    )}

                    {/* Wishlist Button */}
                    <button
                      id={`card-wishlist-${product.id}`}
                      onClick={() => toggleWishlist(product)}
                      className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2.5 rounded-full shadow-sm hover:scale-110 text-brand-charcoal hover:text-red-500 transition-all cursor-pointer"
                      aria-label="Add to wishlist"
                    >
                      <Heart
                        size={16}
                        className={isProductInWishlist(product) ? 'fill-red-500 text-red-500' : ''}
                      />
                    </button>

                    {/* Quick Hover Actions block */}
                    <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                      <button
                        id={`card-quickview-${product.id}`}
                        onClick={() => handleOpenQuickView(product)}
                        className="bg-white/95 backdrop-blur-sm text-brand-charcoal hover:bg-brand-sage hover:text-white p-3.5 rounded-full shadow-md hover:scale-105 transition-all cursor-pointer"
                        title="Quick View"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        id={`card-detail-go-${product.id}`}
                        onClick={() => {
                          setSelectedProduct(product);
                          setCurrentTab('product-detail');
                        }}
                        className="bg-white/95 backdrop-blur-sm text-brand-charcoal hover:bg-brand-sage hover:text-white p-3.5 rounded-full shadow-md hover:scale-105 transition-all cursor-pointer"
                        title="View Full Details"
                      >
                        <Info size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 text-left space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      {/* Title & Price line */}
                      <div className="flex justify-between items-start gap-2">
                        <h3
                          id={`card-title-${product.id}`}
                          onClick={() => {
                            setSelectedProduct(product);
                            setCurrentTab('product-detail');
                          }}
                          className="serif-display text-lg sm:text-xl font-normal text-brand-charcoal hover:text-brand-sage transition-colors cursor-pointer leading-snug flex-1"
                        >
                          {product.name}
                        </h3>
                        <span className="font-mono text-sm sm:text-base font-bold text-brand-sage-dark whitespace-nowrap">
                          ₹{product.price}
                        </span>
                      </div>

                      {/* Snippet Description */}
                      <p className="text-brand-brown text-xs sm:text-sm line-clamp-2 leading-relaxed">
                        {product.shortDescription}
                      </p>
                    </div>

                    <div className="space-y-4 pt-2">
                      {/* Color Swatches selection */}
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] tracking-wider uppercase font-bold text-brand-brown-light">Colors:</span>
                        <div className="flex space-x-1.5">
                          {product.colors.map((color) => (
                            <button
                              key={color.name}
                              id={`card-${product.id}-swatch-${color.name}`}
                              onClick={() => handleCardColorSelect(product.id, color)}
                              className={`w-4 h-4 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                                currentSelectedColor.name === color.name
                                  ? 'ring-1 ring-brand-sage ring-offset-1 scale-110'
                                  : 'border-brand-beige hover:scale-105'
                              }`}
                              style={{ backgroundColor: color.hex }}
                              title={color.name}
                            >
                              {currentSelectedColor.name === color.name && (
                                <span className="w-1 h-1 bg-white rounded-full mix-blend-difference" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Add directly to Cart */}
                      <button
                        id={`card-add-to-cart-${product.id}`}
                        onClick={() => addToCart(product, 1, currentSelectedColor)}
                        className="w-full flex items-center justify-center space-x-2 bg-brand-cream hover:bg-brand-sage text-brand-charcoal hover:text-white border border-brand-beige hover:border-brand-sage py-3.5 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
                      >
                        <ShoppingBag size={14} />
                        <span>Add To Cart</span>
                      </button>
                    </div>

                  </div>

                </motion.div>
              );
            })}
          </div>

        </div>

      </div>

      {/* Full Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <motion.div
            id="quickview-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-charcoal/40 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setQuickViewProduct(null)}
          >
            <motion.div
              id="quickview-modal"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-brand-cream max-w-3xl w-full rounded-[40px] overflow-hidden shadow-2xl border border-brand-beige relative text-left grid grid-cols-1 md:grid-cols-12"
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* Close Button */}
              <button
                id="close-quickview-btn"
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-5 right-5 z-20 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 text-brand-charcoal transition-all cursor-pointer"
              >
                <X size={18} />
              </button>

              {/* Product Left Imagery */}
              <div className="md:col-span-6 relative h-64 md:h-auto bg-brand-beige">
                <img
                  src={quickViewProduct.images[0]}
                  alt={quickViewProduct.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-4 left-4 bg-brand-gold text-[9px] tracking-widest font-bold text-brand-charcoal px-3 py-1 rounded-full uppercase border border-white">
                  {quickViewProduct.occasion} Bouquet
                </span>
              </div>

              {/* Product Right Details */}
              <div className="md:col-span-6 p-8 flex flex-col justify-between space-y-6 max-h-[85vh] overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h2 className="serif-display text-2xl font-light text-brand-charcoal pr-4">
                      {quickViewProduct.name}
                    </h2>
                  </div>
                  
                  <span className="font-mono text-xl font-bold text-brand-sage-dark block">
                    ₹{quickViewProduct.price}
                  </span>

                  <p className="text-brand-brown text-xs sm:text-sm leading-relaxed">
                    {quickViewProduct.description}
                  </p>

                  {/* Fabric specs info snippet */}
                  <div className="border-t border-b border-brand-beige py-3 space-y-1 text-xs text-brand-brown">
                    <p><strong>Fabric:</strong> {quickViewProduct.materials}</p>
                    <p><strong>Size:</strong> {quickViewProduct.size}</p>
                  </div>

                  {/* Swatches selection */}
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-wider uppercase font-bold text-brand-brown-light">
                      Selected Theme: <span className="text-brand-charcoal font-semibold">{quickViewSelectedColor?.name}</span>
                    </label>
                    <div className="flex space-x-2">
                      {quickViewProduct.colors.map((color) => (
                        <button
                          key={color.name}
                          id={`quickview-swatch-${color.name}`}
                          onClick={() => setQuickViewSelectedColor(color)}
                          className={`w-6 h-6 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                            quickViewSelectedColor?.name === color.name
                              ? 'ring-2 ring-brand-sage ring-offset-2 scale-115'
                              : 'border-brand-beige hover:scale-105'
                          }`}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        >
                          {quickViewSelectedColor?.name === color.name && (
                            <span className="w-1.5 h-1.5 bg-white rounded-full mix-blend-difference" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity adjustment */}
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-wider uppercase font-bold text-brand-brown-light">Quantity:</label>
                    <div className="flex items-center space-x-3 bg-white border border-brand-beige w-fit rounded-xl px-2 py-1">
                      <button
                        id="quickview-qty-dec"
                        onClick={() => setQuickViewQty((q) => Math.max(1, q - 1))}
                        className="px-2 py-1 text-brand-charcoal hover:text-brand-sage font-bold font-sans cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-mono text-sm font-semibold w-8 text-center select-none">{quickViewQty}</span>
                      <button
                        id="quickview-qty-inc"
                        onClick={() => setQuickViewQty((q) => q + 1)}
                        className="px-2 py-1 text-brand-charcoal hover:text-brand-sage font-bold font-sans cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    id="quickview-add-cart-btn"
                    onClick={handleQuickViewAddToCart}
                    className="w-full flex items-center justify-center space-x-2 bg-brand-sage hover:bg-brand-sage-dark text-white py-4 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
                  >
                    <ShoppingBag size={14} />
                    <span>Add To Shopping Cart</span>
                  </button>
                  <button
                    id="quickview-details-btn"
                    onClick={() => {
                      setSelectedProduct(quickViewProduct);
                      setQuickViewProduct(null);
                      setCurrentTab('product-detail');
                    }}
                    className="w-full text-center text-[10px] uppercase tracking-wider font-bold text-brand-brown hover:text-brand-sage-dark transition-colors py-2 cursor-pointer"
                  >
                    View Comprehensive Product Details
                  </button>
                </div>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
