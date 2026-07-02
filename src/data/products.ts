/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, FAQItem, GalleryItem } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'sage-gold-royal',
    name: 'The Royal Sage & Gold Bouquet',
    shortDescription: 'Our signature zero-waste bouquet handcrafted from 6 premium pure cotton-linen napkins in sage green and soft gold.',
    description: 'Elevate your gifting with our signature creation. The Royal Sage & Gold Bouquet is a stunning fusion of luxury and environmental consciousness. Handcrafted by our women artisans in Jaipur, this masterwork resembles a classic rose arrangement, yet unfolds into six high-density, double-hemmed 100% organic cotton-linen table napkins. Adorned with organic gold-thread embroidery and wrapped in natural untreated jute with a hand-spun tassel, it is an exquisite centerpiece that lasts forever.',
    price: 1899,
    rating: 4.9,
    reviewsCount: 124,
    images: [
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800', // Beautifully folded cloth
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800', // Artisan packaging
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=800'  // High-quality linen folded
    ],
    colors: [
      { name: 'Sage Green', hex: '#8A9A86' },
      { name: 'Soft Gold', hex: '#D4AF37' },
      { name: 'Cream Ivory', hex: '#FAF5EF' }
    ],
    occasion: 'Wedding',
    materials: '100% Organic Linen-Cotton Blend, GOTS Certified, Hand-dyed with natural madder and indigo',
    size: 'Bouquet height: 14 inches | Unfolds to 6 Napkins (20 x 20 inches each)',
    features: [
      '6 Premium reusable organic napkins',
      'Handcrafted by skilled women artisans in Jaipur',
      'Zero synthetic dyes or microfibers',
      'Comes with a hand-written seed paper card',
      'Packaged in an elegant, biodegradable gift box'
    ],
    isFeatured: true,
    reviews: [
      {
        id: 'rev-1',
        user: 'Aishwarya Roy',
        rating: 5,
        comment: 'I bought this as a housewarming gift for my best friend. She was absolutely speechless when she realized the roses were beautiful, luxury dining napkins! Incredible craftsmanship, the fabric feels so soft and thick.',
        date: 'June 14, 2026',
        occasion: 'Housewarming',
        verified: true
      },
      {
        id: 'rev-2',
        user: 'Kabir Mehta',
        rating: 5,
        comment: 'Absolutely love the concept. Gave it to my mother for Mother’s Day and she has already washed and styled them on our dining table. A sustainable gift that is actually useful and looks extremely royal.',
        date: 'May 10, 2026',
        occasion: 'Anniversary',
        verified: true
      }
    ]
  },
  {
    id: 'ivory-bloom-classic',
    name: 'The Ivory Bloom Classic Bouquet',
    shortDescription: 'An ethereal classic made from 6 ultra-soft waffle-weave cotton napkins in pure cream and natural beige.',
    description: 'An enduring symbol of grace and purity, The Ivory Bloom Classic represents the pinnacle of minimal elegance. Using organic waffle-weave cotton known for its incredible absorbency and luxurious loft, this bouquet features beautifully sculpted origami folds mimicking full-bloom white peonies. The soft cream and oatmeal beige shades are naturally unbleached, retaining the tiny, charming specks of organic cotton husks. Perfect for minimalistic homes and eco-conscious weddings.',
    price: 1599,
    rating: 4.8,
    reviewsCount: 96,
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800', // Linen cream
      'https://images.unsplash.com/photo-1507330081792-564551df4b5b?auto=format&fit=crop&q=80&w=800', // Soft unbleached setting
      'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=800'  // Pale linen texture
    ],
    colors: [
      { name: 'Cream Ivory', hex: '#FAF5EF' },
      { name: 'Oatmeal Beige', hex: '#E6DFD5' },
      { name: 'Warm Taupe', hex: '#C5BAAF' }
    ],
    occasion: 'Wedding',
    materials: '100% GOTS Organic Cotton, Waffle-weave, chemical-free processing',
    size: 'Bouquet height: 13 inches | Unfolds to 6 Napkins (18 x 18 inches each)',
    features: [
      '6 Premium unbleached organic waffle cotton napkins',
      'Minimal, timeless aesthetic',
      'Extremely high water absorbency and quick-drying texture',
      'Tied with a reusable raw jute cord and elegant wooden lock',
      'No plastics, no chemicals'
    ],
    isFeatured: true,
    reviews: [
      {
        id: 'rev-3',
        user: 'Priyanka Sharma',
        rating: 5,
        comment: 'The softest cotton ever! They look like expensive roses but feel like heaven on skin. My wedding guests were fascinated by these as return favors.',
        date: 'May 28, 2026',
        occasion: 'Wedding Favors',
        verified: true
      }
    ]
  },
  {
    id: 'marigold-harmony',
    name: 'The Kesariya Marigold Harmony',
    shortDescription: 'A vibrant festive bouquet crafted from 6 pure cotton khadi napkins dyed with natural marigold and turmeric.',
    description: 'Celebrate Indian heritage with The Kesariya Marigold Harmony. Crafted specifically for traditional celebrations, housewarmings, and festive gifting, this bouquet is made from authentic hand-spun Khadi cotton. Naturally dyed using sacred temple marigold flowers and turmeric, it radiates a rich, warm yellow and ochre color palette. Each napkin is finished with a delicate gold Zari border, making them spectacular for festive tablescapes long after the bouquet is gifted.',
    price: 1799,
    rating: 5.0,
    reviewsCount: 84,
    images: [
      'https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&q=80&w=800', // Marigold dye vibe
      'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&q=80&w=800', // Natural warm styling
      'https://images.unsplash.com/photo-1561375210-91185ffba3bc?auto=format&fit=crop&q=80&w=800'  // Marigold background details
    ],
    colors: [
      { name: 'Kesariya Yellow', hex: '#EAA135' },
      { name: 'Terracotta Ochre', hex: '#D07B3C' },
      { name: 'Warm Cream', hex: '#FAF5EF' }
    ],
    occasion: 'Festive',
    materials: '100% Hand-spun Khadi Cotton, dyed with organic marigold & madder, zari border',
    size: 'Bouquet height: 14 inches | Unfolds to 6 Napkins (19 x 19 inches each)',
    features: [
      '6 Hand-spun Khadi cotton napkins with elegant gold Zari borders',
      'Naturally colored using temple flower circular recycling programs',
      'Perfect for Diwali, Rakhi, Puja, and traditional weddings',
      'Includes beautiful festive clay bead ties'
    ],
    isFeatured: true,
    reviews: [
      {
        id: 'rev-4',
        user: 'Meera Deshmukh',
        rating: 5,
        comment: 'This is the most thoughtful festive gift I’ve ever seen. The color is absolutely radiant, and the Khadi fabric feels incredibly authentic. The Zari borders add such a beautiful royal shine!',
        date: 'October 25, 2025',
        occasion: 'Diwali Gifting',
        verified: true
      }
    ]
  },
  {
    id: 'crimson-rose-shadi',
    name: 'The Crimson Shadi Rose Bouquet',
    shortDescription: 'A passionate, luxurious bouquet folded from 6 heavy linen-damask napkins in rich crimson and warm clay red.',
    description: 'Designed for the grandest celebrations of love, The Crimson Shadi Rose Bouquet is a luxurious statement of devotion. Crafted from heavyweight linen-damask with an intricate self-weaving floral pattern, these napkins resemble velvet roses when folded. The deep crimson and terracotta tones are extracted from natural pomegranate rinds and madder roots. Wrapped in a premium golden-beige tussar silk envelope, this bouquet is the ultimate wedding or anniversary keepsake.',
    price: 2199,
    rating: 4.9,
    reviewsCount: 73,
    images: [
      'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&q=80&w=800', // Rich terracotta/crimson styling
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800', // Organic dye vat
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800'  // Premium napkin folding
    ],
    colors: [
      { name: 'Crimson Red', hex: '#8B2222' },
      { name: 'Terracotta Red', hex: '#C25D4E' },
      { name: 'Soft Beige', hex: '#E3DAC9' }
    ],
    occasion: 'Wedding',
    materials: 'Premium Heavyweight Linen-Damask Blend, Pomegranate & Madder root natural dyes',
    size: 'Bouquet height: 15 inches | Unfolds to 6 Napkins (21 x 21 inches each)',
    features: [
      '6 Heavyweight linen-damask luxury napkins',
      'Stunning damask floral weave that shines subtly in light',
      'Encased in an authentic reusable tussar silk gift envelope',
      'Double mitered-corner stitching for extreme durability'
    ],
    isFeatured: false,
    reviews: [
      {
        id: 'rev-5',
        user: 'Anjali Gupta',
        rating: 5,
        comment: 'Given to my cousin for her wedding. It stood out completely from all the plastic/paper wrapped gifts. The napkins are of absolute premium export quality. Breathtakingly beautiful.',
        date: 'February 12, 2026',
        occasion: 'Wedding',
        verified: true
      }
    ]
  },
  {
    id: 'lilac-mist-whispers',
    name: 'The Lilac Mist & Lavender Bouquet',
    shortDescription: 'A dreamy, delicate arrangement of 6 soft cambric-cotton napkins in lavender and organic pastel blue.',
    description: 'Imbued with the calming essence of high-altitude valleys, The Lilac Mist is a breathtaking pastel bouquet. Ideal for baby showers, gender reveals, birthdays, and gentle celebrations, this bouquet features premium cambric-cotton napkins known for their fine weave, light-as-air feel, and incredible softness. Natural logwood and indigo extracts create the subtle lilac and cloud-blue gradients. Bound with organic lavender sprigs that release a calming scent upon opening.',
    price: 1499,
    rating: 4.7,
    reviewsCount: 52,
    images: [
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=800', // Lilac/lavender fabric tones
      'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&q=80&w=800', // Pastel unbleached settings
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=800'  // Warm ambient cozy linen setup
    ],
    colors: [
      { name: 'Lavender Mist', hex: '#C6BADA' },
      { name: 'Cloud Blue', hex: '#B9CAD6' },
      { name: 'Vanilla Cream', hex: '#F7F3E9' }
    ],
    occasion: 'Baby Shower',
    materials: '100% Cotton Cambric, naturally infused with real lavender oil, logwood botanical dye',
    size: 'Bouquet height: 13 inches | Unfolds to 6 Napkins (18 x 18 inches each)',
    features: [
      '6 Cloud-soft organic cotton cambric napkins',
      'Infused with sustainable lavender essence for an aromatherapeutic unpacking',
      'Comes wrapped in reusable handcrafted seed paper sheets',
      'Perfect for baby showers, new mothers, and gentle birthdays'
    ],
    isFeatured: false,
    reviews: [
      {
        id: 'rev-6',
        user: 'Rohini Sen',
        rating: 4,
        comment: 'Bought this for my sister’s baby shower. The scent of lavender when opening the box was incredibly therapeutic, and the colors are so serene and delicate. Simply lovely!',
        date: 'April 02, 2026',
        occasion: 'Baby Shower',
        verified: true
      }
    ]
  },
  {
    id: 'indigo-heritage',
    name: 'The Heritage Indigo Shibori Bouquet',
    shortDescription: 'A contemporary artisanal bouquet featuring 6 napkins hand-dyed in authentic Indigo Shibori tie-dye.',
    description: 'A striking blend of traditional blue pottery-inspired aesthetics and modern zero-waste utility. The Heritage Indigo Shibori Bouquet features 6 napkins, each hand-folded, bound, and dipped into 100% natural indigo vats by local artisans. Since each item is hand-dyed using classical tie-dye techniques, no two napkins are identical. This makes the bouquet an absolutely unique, collectible piece of usable art. Packaged with raw coconut fiber ties and a handmade ceramic tag.',
    price: 1999,
    rating: 4.9,
    reviewsCount: 65,
    images: [
      'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=800', // Indigo table vibe
      'https://images.unsplash.com/photo-1595111107572-c0e86b4f73b8?auto=format&fit=crop&q=80&w=800', // Blue napkins
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800'  // Dyeing
    ],
    colors: [
      { name: 'Indigo Blue', hex: '#2B4365' },
      { name: 'Sky Cerulean', hex: '#6384B3' },
      { name: 'Natural White', hex: '#FAF9F6' }
    ],
    occasion: 'Corporate',
    materials: '100% Premium Cotton, hand-bound Shibori, dyed with genuine Indigofera Tinctoria',
    size: 'Bouquet height: 14 inches | Unfolds to 6 Napkins (20 x 20 inches each)',
    features: [
      '6 Hand-dyed genuine Shibori indigo napkins',
      'One-of-a-kind organic patterns on every single cloth',
      'Includes a reusable handcrafted terracotta leaf charm',
      'Sturdy, tightly woven premium cotton perfect for everyday dining'
    ],
    isFeatured: false,
    reviews: [
      {
        id: 'rev-7',
        user: 'Vikram Aditya',
        rating: 5,
        comment: 'Ordered 50 of these for our annual corporate executive retreat. The client feedback was astronomical! Everyone loved the story, the artisan-first focus, and the premium craft of the indigo folds.',
        date: 'January 15, 2026',
        occasion: 'Corporate Gift',
        verified: true
      }
    ]
  }
];

export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'What exactly are napkin bouquets?',
    answer: 'Napkin bouquets are luxury gifting arrangements that mimic the shape and structure of traditional flower bouquets but are handcrafted entirely from premium, reusable cloth napkins (rumals). Once the recipient admires the presentation, they can easily untie the arrangement and use them as luxurious, high-quality, washable fabric table napkins.',
    category: 'general'
  },
  {
    id: 'faq-2',
    question: 'Are the napkins fully reusable and washable?',
    answer: 'Absolutely. We source only the highest quality organic cotton, linen, and khadi blends. Every napkin is double-hemmed with tight stitching designed to withstand hundreds of machine-wash cycles. They actually become softer and more absorbent with every wash.',
    category: 'care'
  },
  {
    id: 'faq-3',
    question: 'How do I care for and wash these napkins?',
    answer: 'We recommend washing them with like colors in a gentle machine cycle using mild eco-friendly detergents. For naturally-dyed bouquets (like the Indigo or Marigold), wash separately for the first 1-2 washes in cold water. You can tumble dry on low or line dry in shade to preserve colors, and iron on a warm setting for that crisp, premium restaurant feel.',
    category: 'care'
  },
  {
    id: 'faq-4',
    question: 'Can I customize the napkin colors or embroidery?',
    answer: 'Yes! We offer a bespoke custom order builder on our website. You can select specific napkin count, custom colors, choose between waffle cotton or premium linen-damask, and even add monogrammed hand-embroidery (such as initials or dates) for weddings and corporate events. Contact us on WhatsApp or through our Custom Form to begin.',
    category: 'custom'
  },
  {
    id: 'faq-5',
    question: 'How long does delivery take?',
    answer: 'Since each bouquet is meticulously hand-folded by our women artisans upon receiving an order, standard orders ship in 2-3 business days. Domestic delivery takes another 3-5 days depending on your location. Express shipping (next-day dispatch) is available at checkout.',
    category: 'shipping'
  },
  {
    id: 'faq-6',
    question: 'Do you take bulk orders for corporate gifting or weddings?',
    answer: 'Yes, bulk custom orders are our specialty. We have designed thousands of custom napkin bouquets as eco-friendly wedding favors, festive hampers, and luxury corporate gifts. We offer competitive tier pricing and customized branding (such as customized wooden tags, brand-embellished jute wraps, and printed seed cards).',
    category: 'custom'
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Ethereal Wedding Table Setting',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
    category: 'wedding',
    aspectRatio: '16:9'
  },
  {
    id: 'gal-2',
    title: 'Marigold Festive Celebrations',
    image: 'https://images.unsplash.com/photo-1561375210-91185ffba3bc?auto=format&fit=crop&q=80&w=800',
    category: 'festive',
    aspectRatio: '3:4'
  },
  {
    id: 'gal-3',
    title: 'Handcrafting & Organic Dyeing process',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800',
    category: 'lifestyle',
    aspectRatio: '1:1'
  },
  {
    id: 'gal-4',
    title: 'Beige Pastel Baby Shower Backdrop',
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800',
    category: 'babyshower',
    aspectRatio: '4:3'
  },
  {
    id: 'gal-5',
    title: 'Corporate Luxury Gift Boxes',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800',
    category: 'corporate',
    aspectRatio: '1:1'
  },
  {
    id: 'gal-6',
    title: 'Beautiful Rose Fold Details',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800',
    category: 'lifestyle',
    aspectRatio: '3:4'
  },
  {
    id: 'gal-7',
    title: 'Artisan Workshop Thread & Linen',
    image: 'https://images.unsplash.com/photo-1484712401471-05c7215a39eb?auto=format&fit=crop&q=80&w=800',
    category: 'lifestyle',
    aspectRatio: '4:3'
  },
  {
    id: 'gal-8',
    title: 'Earthy Golden Hour Table Styling',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=800',
    category: 'birthday',
    aspectRatio: '16:9'
  }
];

export const REVIEWS = [
  {
    id: 'r-1',
    name: 'Radhika Jhanji',
    role: 'Verified Art Collector',
    comment: 'The sheer artistry of folding these napkins into realistic rose bouquets is incredible. I felt guilty unfolding them, but now they are the pride of my dinner tables. Everyone asks about them!',
    rating: 5,
    location: 'Mumbai',
    date: '2 months ago',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'r-2',
    name: 'Suresh Menon',
    role: 'Event Designer',
    comment: 'Napike was the sustainability hero of our annual gala. We placed these as centerpieces. Guests took them home as favor packages. Reusable, gorgeous, zero-waste perfection.',
    rating: 5,
    location: 'Bangalore',
    date: '1 month ago',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'r-3',
    name: 'Diya Sen',
    role: 'Sustainable Bride',
    comment: 'I customized the Royal Sage bouquet with monogrammed initials for our bridesmaid hampers. The Napike team was incredibly helpful and fast on WhatsApp. Highly recommended!',
    rating: 5,
    location: 'New Delhi',
    date: '3 weeks ago',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80'
  }
];
