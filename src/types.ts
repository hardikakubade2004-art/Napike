/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ColorOption {
  name: string;
  hex: string;
}

export interface Review {
  id: string;
  user: string;
  avatar?: string;
  rating: number;
  comment: string;
  date: string;
  occasion: string;
  verified: boolean;
  images?: string[];
}

export interface Product {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  rating: number;
  reviewsCount: number;
  images: string[];
  colors: ColorOption[];
  occasion: 'Wedding' | 'Birthday' | 'Baby Shower' | 'Corporate' | 'Festive' | 'All';
  materials: string;
  size: string;
  features: string[];
  reviews: Review[];
  isFeatured?: boolean;
}

export interface CartItem {
  id: string; // unique for item + color combination
  product: Product;
  quantity: number;
  selectedColor: ColorOption;
  customNote?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  image: string;
  category: 'wedding' | 'birthday' | 'babyshower' | 'corporate' | 'festive' | 'lifestyle';
  aspectRatio: '1:1' | '3:4' | '4:3' | '16:9';
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'care' | 'custom' | 'shipping';
}

export interface User {
  uid: string;
  fullName: string;
  email: string;
  phone: string;
  joinedDate: string;
  photoUrl?: string;
  password?: string; // stored securely for simulation in mock state
}

export interface OrderItem {
  productName: string;
  image: string;
  quantity: number;
  color: string;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  taxes: number;
  total: number;
  status: 'Pending' | 'Processing' | 'In Transit' | 'Delivered';
  deliveryAddress: string;
  city: string;
  state: string;
  postalCode: string;
  paymentMethod: string;
  userEmail: string;
}
