/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ChevronDown, ChevronUp, Clock, Truck, ShieldCheck, HelpCircle, Package, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types';
import { dbGetOrders } from '../lib/firebase';

interface MyOrdersProps {
  setCurrentTab: (tab: string) => void;
}

export default function MyOrders({ setCurrentTab }: MyOrdersProps) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Load orders from Supabase (or fallback to localStorage)
  useEffect(() => {
    if (!user) return;

    const loadOrders = async () => {
      // 1. Try fetching from Supabase
      const dbOrders = await dbGetOrders(user.email);
      if (dbOrders !== null) {
        // Sort orders so newest are first
        dbOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setOrders(dbOrders);
        return;
      }

      // 2. Fallback to localStorage
      const savedOrdersRaw = localStorage.getItem('napike_orders');
      if (savedOrdersRaw) {
        try {
          const parsed: Order[] = JSON.parse(savedOrdersRaw);
          // Filter orders by current user's email
          const userOrders = parsed.filter(o => o.userEmail.toLowerCase() === user.email.toLowerCase());
          
          // Sort orders so newest are first
          userOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setOrders(userOrders);
        } catch (e) {
          console.error('Error parsing local orders state', e);
        }
      } else {
        // Mock some default orders if they don't have any, to show how beautiful it is!
        const mockPastOrders: Order[] = [
          {
            id: 'NPK-2026-89215',
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            userEmail: user.email,
            items: [
              {
                productName: 'Royal Marigold Garland',
                image: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&q=80&w=300',
                quantity: 1,
                color: 'Sunlit Saffron',
                price: 1299
              },
              {
                productName: 'Sage Mint Bouquet',
                image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&q=80&w=300',
                quantity: 2,
                color: 'Eucalyptus Sage',
                price: 999
              }
            ],
            subtotal: 3297,
            discount: 330, // 10% coupon WELCOME
            shipping: 0,
            taxes: 148,
            total: 3115,
            status: 'In Transit',
            deliveryAddress: 'Flat 402, Elite Heights, Sector 15',
            city: 'Mumbai',
            state: 'Maharashtra',
            postalCode: '400001',
            paymentMethod: 'UPI'
          },
          {
            id: 'NPK-2026-38140',
            date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            userEmail: user.email,
            items: [
              {
                productName: 'Shibori Indigo Blossom',
                image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=300',
                quantity: 1,
                color: 'Royal Jaipur Indigo',
                price: 1499
              }
            ],
            subtotal: 1499,
            discount: 0,
            shipping: 150,
            taxes: 75,
            total: 1724,
            status: 'Delivered',
            deliveryAddress: 'Flat 402, Elite Heights, Sector 15',
            city: 'Mumbai',
            state: 'Maharashtra',
            postalCode: '400001',
            paymentMethod: 'Credit Card'
          }
        ];
        localStorage.setItem('napike_orders', JSON.stringify(mockPastOrders));
        setOrders(mockPastOrders);
      }
    };

    loadOrders();
  }, [user]);

  const toggleExpand = (id: string) => {
    setExpandedOrder(prev => (prev === id ? null : id));
  };

  if (!user) {
    return (
      <div className="py-24 text-center text-brand-brown">
        <p>Please log in to view your orders.</p>
        <button
          onClick={() => setCurrentTab('login')}
          className="mt-4 px-6 py-2.5 rounded-full bg-brand-sage text-white text-xs uppercase tracking-wider"
        >
          Sign In
        </button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'In Transit': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'Delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-brand-beige text-brand-brown border-brand-beige';
    }
  };

  return (
    <section id="my-orders-page" className="py-24 bg-brand-cream border-t border-brand-beige text-left">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-brand-gold font-sans">Collector Ledger</span>
          <h1 className="serif-display text-3xl sm:text-4xl font-normal text-brand-charcoal mt-3">
            Your Gifting Odyssey
          </h1>
          <div className="w-12 h-[1px] bg-brand-gold mx-auto mt-4" />
          <p className="text-brand-brown text-sm mt-3 leading-relaxed">
            Monitor active fabric weavers and trace the dispatch logs of your reusable napkin bouquets.
          </p>
        </div>

        {/* Orders List Container */}
        {orders.length === 0 ? (
          <div className="bg-white border border-brand-beige rounded-[40px] p-12 text-center space-y-6 max-w-lg mx-auto shadow-sm">
            <div className="p-4 bg-brand-cream w-fit rounded-full mx-auto text-brand-brown-light">
              <ShoppingBag size={32} />
            </div>
            <h3 className="serif-display text-2xl font-light text-brand-charcoal">No Orders Placed Yet</h3>
            <p className="text-brand-brown text-xs sm:text-sm leading-relaxed">
              We haven't detected any sustainable orders logged under your email profile. Begin browsing our GOTS organic textile bouquet collection to populate your ledger.
            </p>
            <button
              id="orders-browse-catalog-btn"
              onClick={() => setCurrentTab('shop')}
              className="inline-flex items-center space-x-2 bg-brand-sage hover:bg-brand-sage-dark text-white text-xs font-semibold uppercase tracking-wider px-8 py-3.5 rounded-full shadow-sm transition-all cursor-pointer"
            >
              <span>Explore Bouquets catalog</span>
              <ArrowRight size={12} />
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const isOpen = expandedOrder === order.id;
              return (
                <div
                  key={order.id}
                  id={`order-block-${order.id}`}
                  className="bg-white border border-brand-beige rounded-[32px] overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Order Card Header */}
                  <div
                    onClick={() => toggleExpand(order.id)}
                    className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer select-none"
                  >
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-brand-brown-light">Order ID</span>
                        <span className="block font-mono text-xs sm:text-sm font-bold text-brand-charcoal">{order.id}</span>
                      </div>
                      <div className="w-[1px] h-8 bg-brand-beige hidden sm:block" />
                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-brand-brown-light">Date Placed</span>
                        <span className="block text-xs sm:text-sm font-semibold text-brand-charcoal">{order.date}</span>
                      </div>
                      <div className="w-[1px] h-8 bg-brand-beige hidden sm:block" />
                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-brand-brown-light">Total Amount</span>
                        <span className="block text-xs sm:text-sm font-bold text-brand-sage-dark font-mono">₹{order.total}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-brand-beige/50">
                      <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <button
                        id={`toggle-expand-${order.id}`}
                        className="p-2 rounded-xl hover:bg-brand-cream text-brand-charcoal transition-colors cursor-pointer"
                        title="Toggle Details"
                      >
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Expandable Order Details Panel */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden border-t border-brand-beige bg-brand-cream/30"
                      >
                        <div className="p-6 sm:p-8 space-y-8">
                          
                          {/* Stepper Status Tracker bar */}
                          <div className="space-y-4">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-brand-brown-light">Delivery Milestone Track</span>
                            <div className="grid grid-cols-4 relative items-center text-center">
                              
                              {/* Horizontal Connecting lines */}
                              <div className="absolute left-[12%] right-[12%] h-[3px] bg-brand-beige -z-10 top-[13px]" />
                              <div
                                className="absolute left-[12%] h-[3px] bg-brand-sage -z-10 top-[13px] transition-all duration-500 origin-left"
                                style={{
                                  width: order.status === 'Pending' ? '0%' :
                                         order.status === 'Processing' ? '25%' :
                                         order.status === 'In Transit' ? '55%' : '76%'
                                }}
                              />

                              {/* Milestone 1 */}
                              <div className="flex flex-col items-center">
                                <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] shadow-sm ${
                                  ['Pending', 'Processing', 'In Transit', 'Delivered'].includes(order.status)
                                    ? 'bg-brand-sage text-white' : 'bg-brand-beige text-brand-brown-light'
                                }`}>1</span>
                                <span className="text-[9px] uppercase font-bold mt-2 text-brand-charcoal">Ordered</span>
                              </div>

                              {/* Milestone 2 */}
                              <div className="flex flex-col items-center">
                                <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] shadow-sm ${
                                  ['Processing', 'In Transit', 'Delivered'].includes(order.status)
                                    ? 'bg-brand-sage text-white' : 'bg-brand-beige text-brand-brown-light'
                                }`}>2</span>
                                <span className="text-[9px] uppercase font-bold mt-2 text-brand-charcoal">Weaving</span>
                              </div>

                              {/* Milestone 3 */}
                              <div className="flex flex-col items-center">
                                <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] shadow-sm ${
                                  ['In Transit', 'Delivered'].includes(order.status)
                                    ? 'bg-brand-sage text-white' : 'bg-brand-beige text-brand-brown-light'
                                }`}>3</span>
                                <span className="text-[9px] uppercase font-bold mt-2 text-brand-charcoal">In Transit</span>
                              </div>

                              {/* Milestone 4 */}
                              <div className="flex flex-col items-center">
                                <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] shadow-sm ${
                                  order.status === 'Delivered'
                                    ? 'bg-brand-sage text-white' : 'bg-brand-beige text-brand-brown-light'
                                }`}>4</span>
                                <span className="text-[9px] uppercase font-bold mt-2 text-brand-charcoal">Delivered</span>
                              </div>

                            </div>
                          </div>

                          {/* Items Breakdown list */}
                          <div className="space-y-4">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-brand-brown-light">Handcrafted Pieces</span>
                            <div className="border border-brand-beige bg-white rounded-2xl divide-y divide-brand-beige/50">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="p-4 flex items-center space-x-4">
                                  <img
                                    src={item.image}
                                    alt={item.productName}
                                    className="w-14 h-14 object-cover rounded-xl border border-brand-beige shrink-0"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h4 className="serif-display text-sm font-semibold text-brand-charcoal truncate">{item.productName}</h4>
                                    <p className="text-[10px] text-brand-brown-light font-medium tracking-wide mt-0.5">
                                      Color Selected: <strong className="text-brand-brown">{item.color}</strong> • Quantity: <strong className="text-brand-brown">{item.quantity}</strong>
                                    </p>
                                  </div>
                                  <span className="font-mono text-sm font-bold text-brand-sage-dark shrink-0">₹{item.price * item.quantity}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Shipping, Payment and Billing Parameters Columns */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                            
                            {/* Logistics Details */}
                            <div className="bg-white border border-brand-beige rounded-2xl p-4 sm:p-5 space-y-3">
                              <h4 className="serif-display text-base font-semibold text-brand-charcoal flex items-center gap-1.5 border-b border-brand-beige pb-2">
                                <Truck size={15} className="text-brand-sage" />
                                <span>Shipping Parameters</span>
                              </h4>
                              <div className="text-xs text-brand-brown space-y-1.5">
                                <p><span className="font-semibold text-brand-charcoal">Street:</span> {order.deliveryAddress}</p>
                                <p><span className="font-semibold text-brand-charcoal">City/State:</span> {order.city}, {order.state} - {order.postalCode}</p>
                                <p><span className="font-semibold text-brand-charcoal">Method:</span> Standard Green Express Shipping</p>
                              </div>
                            </div>

                            {/* Billing & Receipts */}
                            <div className="bg-white border border-brand-beige rounded-2xl p-4 sm:p-5 space-y-3">
                              <h4 className="serif-display text-base font-semibold text-brand-charcoal flex items-center gap-1.5 border-b border-brand-beige pb-2">
                                <ShieldCheck size={15} className="text-brand-sage" />
                                <span>Receipt Audit</span>
                              </h4>
                              <div className="text-xs text-brand-brown space-y-1.5 font-sans">
                                <div className="flex justify-between">
                                  <span>Subtotal:</span>
                                  <span className="font-mono">₹{order.subtotal}</span>
                                </div>
                                {order.discount > 0 && (
                                  <div className="flex justify-between text-brand-sage-dark font-medium">
                                    <span>Applied Coupon:</span>
                                    <span className="font-mono">-₹{order.discount}</span>
                                  </div>
                                )}
                                <div className="flex justify-between">
                                  <span>Green Packaging:</span>
                                  <span className="font-mono font-semibold text-emerald-700 uppercase text-[9px]">{order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>GST Taxes (5%):</span>
                                  <span className="font-mono">₹{order.taxes}</span>
                                </div>
                                <div className="flex justify-between border-t border-brand-beige pt-2 text-brand-charcoal font-bold font-sans">
                                  <span>Final Total Paid:</span>
                                  <span className="font-mono text-brand-sage-dark">₹{order.total}</span>
                                </div>
                                <p className="text-[10px] text-brand-brown-light pt-2 italic border-t border-brand-beige/40">Paid via secure {order.paymentMethod} gateway</p>
                              </div>
                            </div>

                          </div>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
