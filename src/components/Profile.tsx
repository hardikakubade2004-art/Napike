/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mail, Phone, Calendar, ShieldCheck, KeyRound, Edit3, Camera, Check, Loader2, LogOut, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ProfileProps {
  setCurrentTab: (tab: string) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', // Female 1
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150', // Male 1
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', // Female 2
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', // Male 2
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150', // Female 3
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Hardika' // Vector
];

export default function Profile({ setCurrentTab }: ProfileProps) {
  const { user, logout, updateProfile, changePassword, showToast, supabaseStatus } = useAuth();

  const [activeSubTab, setActiveSubTab] = useState<'view' | 'edit' | 'password'>('view');
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);
  const [showSQL, setShowSQL] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Edit Profile States
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Change Password States
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  if (!user) {
    return (
      <div className="py-24 text-center text-brand-brown">
        <p>Please log in to view your profile.</p>
        <button
          onClick={() => setCurrentTab('login')}
          className="mt-4 px-6 py-2.5 rounded-full bg-brand-sage text-white text-xs uppercase tracking-wider"
        >
          Sign In
        </button>
      </div>
    );
  }

  // Password requirements calculation
  const newPasswordRequirements = {
    length: newPassword.length >= 8,
    hasUpper: /[A-Z]/.test(newPassword),
    hasLower: /[a-z]/.test(newPassword),
    hasNumber: /[0-9]/.test(newPassword),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
  };

  const isNewPasswordValid =
    newPasswordRequirements.length &&
    newPasswordRequirements.hasUpper &&
    newPasswordRequirements.hasLower &&
    newPasswordRequirements.hasNumber &&
    newPasswordRequirements.hasSpecial;

  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      showToast('Name and Phone are required.', 'error');
      return;
    }

    setIsSavingProfile(true);
    const success = await updateProfile(fullName, phone);
    setIsSavingProfile(false);

    if (success) {
      setActiveSubTab('view');
    }
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!oldPassword) {
      showToast('Please enter your current password.', 'error');
      return;
    }

    if (!isNewPasswordValid) {
      showToast('New password does not meet security requirements.', 'error');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      showToast('Confirm password must match new password.', 'error');
      return;
    }

    setIsSavingPassword(true);
    const success = await changePassword(oldPassword, newPassword);
    setIsSavingPassword(false);

    if (success) {
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setActiveSubTab('view');
    }
  };

  const handleAvatarSelect = async (url: string) => {
    setIsAvatarPickerOpen(false);
    await updateProfile(fullName, phone, url);
  };

  return (
    <section id="user-profile-page" className="py-24 bg-brand-cream border-t border-brand-beige text-left">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title Grid */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 pb-6 border-b border-brand-beige">
          <div>
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-brand-gold">Member Profile</span>
            <h1 className="serif-display text-3xl sm:text-4xl font-normal text-brand-charcoal mt-1">
              Your Artisan Salon
            </h1>
          </div>
          
          <button
            id="profile-logout-btn"
            onClick={() => {
              logout();
              setCurrentTab('home');
            }}
            className="flex items-center space-x-2 bg-brand-beige hover:bg-red-50 hover:text-red-600 text-brand-charcoal text-xs font-semibold uppercase tracking-wider px-5 py-3 rounded-2xl cursor-pointer transition-all"
          >
            <LogOut size={14} />
            <span>Secure Log Out</span>
          </button>
        </div>

        {/* Profile Bento Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Profile Photo and Card Summary */}
          <div className="lg:col-span-4 bg-white border border-brand-beige rounded-[36px] p-6 sm:p-8 space-y-6 text-center shadow-sm relative">
            <div className="relative w-28 h-28 mx-auto group">
              <img
                src={user.photoUrl || PRESET_AVATARS[0]}
                alt={user.fullName}
                className="w-full h-full object-cover rounded-full border-4 border-brand-cream shadow-md group-hover:opacity-85 transition-opacity"
                referrerPolicy="no-referrer"
              />
              <button
                id="profile-avatar-trigger"
                onClick={() => setIsAvatarPickerOpen(true)}
                className="absolute bottom-1 right-1 bg-brand-sage text-white p-2 rounded-full hover:scale-110 shadow-md cursor-pointer transition-transform"
                title="Change Avatar photo"
              >
                <Camera size={12} />
              </button>
            </div>

            <div className="space-y-1.5">
              <h2 className="serif-display text-2xl font-light text-brand-charcoal">{user.fullName}</h2>
              <span className="inline-flex items-center gap-1 bg-brand-sage-light/40 text-brand-sage-dark text-[9px] tracking-widest font-bold px-3 py-1 rounded-full uppercase border border-brand-sage-light">
                <ShieldCheck size={10} />
                <span>Verified Collector</span>
              </span>
            </div>

            <div className="border-t border-brand-beige pt-6 space-y-4 text-left text-xs">
              <div className="flex items-center gap-3 text-brand-brown">
                <Mail size={14} className="text-brand-brown-light shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-brand-brown">
                <Phone size={14} className="text-brand-brown-light shrink-0" />
                <span>{user.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-brand-brown">
                <Calendar size={14} className="text-brand-brown-light shrink-0" />
                <span>Member since {user.joinedDate}</span>
              </div>
            </div>

            {/* Quick Stats Summary */}
            <div className="bg-brand-cream border border-brand-beige rounded-2xl p-4 grid grid-cols-2 gap-4 text-center">
              <div className="space-y-0.5">
                <span className="text-[9px] uppercase font-bold tracking-wider text-brand-brown-light">Impact Score</span>
                <span className="block font-mono text-base font-bold text-brand-sage-dark">15 Kg</span>
                <span className="block text-[8px] text-brand-brown/60 leading-none">Flower waste saved</span>
              </div>
              <div className="space-y-0.5 border-l border-brand-beige">
                <span className="text-[9px] uppercase font-bold tracking-wider text-brand-brown-light">Orders logged</span>
                <span className="block font-mono text-base font-bold text-brand-sage-dark">
                  {JSON.parse(localStorage.getItem('napike_orders') || '[]').filter((o: any) => o.userEmail === user.email).length}
                </span>
                <span className="block text-[8px] text-brand-brown/60 leading-none">Sustainable deliveries</span>
              </div>
            </div>

            {/* Supabase Cloud Connection Status Badge */}
            <div className="bg-brand-cream border border-brand-beige rounded-2xl p-4 space-y-3 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase font-bold tracking-wider text-brand-brown-light">Database Sync</span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                  supabaseStatus === 'connected' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                    : 'bg-amber-50 text-amber-700 border border-amber-100'
                }`}>
                  {supabaseStatus === 'connected' ? 'Connected (Supabase)' : 'Offline Sandbox'}
                </span>
              </div>
              
              <div className="text-xs text-brand-brown/80 space-y-2">
                {supabaseStatus === 'connected' ? (
                  <p>
                    Your AI Studio app is actively integrated with your live **Supabase** database! 
                    User profiles and orders are fully synchronized in real-time.
                  </p>
                ) : (
                  <div className="space-y-2">
                    <p>
                      Connected to Supabase project <strong className="font-mono text-[10px]">eruuhixuxmdvsuroihih</strong>, but database tables are not yet set up in your Supabase console. Falling back gracefully to persistent local storage.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowSQL(!showSQL)}
                      className="text-[10px] text-brand-sage-dark hover:text-brand-sage font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {showSQL ? 'Hide Setup Queries' : 'Show SQL to Setup Tables'}
                    </button>
                    
                    {showSQL && (
                      <div className="relative mt-2 p-2 bg-brand-charcoal text-white rounded-lg text-[9px] font-mono leading-relaxed space-y-1">
                        <button
                          type="button"
                          onClick={() => {
                            const sql = `-- Create User Profiles Table\ncreate table napike_users (\n  uid text primary key,\n  full_name text not null,\n  email text unique not null,\n  phone text,\n  joined_date text,\n  photo_url text,\n  password text\n);\n\n-- Create Orders Table\ncreate table napike_orders (\n  id text primary key,\n  date text not null,\n  items jsonb not null,\n  subtotal numeric not null,\n  discount numeric default 0,\n  shipping numeric default 0,\n  taxes numeric default 0,\n  total numeric not null,\n  status text not null,\n  delivery_address text,\n  city text,\n  state text,\n  postal_code text,\n  payment_method text,\n  user_email text not null\n);`;
                            navigator.clipboard.writeText(sql);
                            setIsCopied(true);
                            setTimeout(() => setIsCopied(false), 2000);
                          }}
                          className="absolute right-1.5 top-1.5 bg-white/10 hover:bg-white/20 px-1.5 py-0.5 rounded text-[8px] text-white cursor-pointer"
                        >
                          {isCopied ? 'Copied!' : 'Copy SQL'}
                        </button>
                        <p className="text-brand-gold font-bold mb-1">// Run in Supabase SQL Editor</p>
                        <p>-- Users Table</p>
                        <p>create table napike_users (...);</p>
                        <p>-- Orders Table</p>
                        <p>create table napike_orders (...);</p>
                      </div>
                    )}
                  </div>
                )}
                <div className="pt-1.5 border-t border-brand-beige/50 text-[10px] text-brand-brown-light flex justify-between">
                  <span>Supabase Project: eruuhixuxmdvsuroihih</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Tabbed Form Controls */}
          <div className="lg:col-span-8 bg-white border border-brand-beige rounded-[36px] p-6 sm:p-8 space-y-6 shadow-sm">
            
            {/* Inner Subtabs Navigation */}
            <div className="flex border-b border-brand-beige gap-2">
              <button
                id="subtab-view"
                onClick={() => setActiveSubTab('view')}
                className={`pb-3 text-xs uppercase font-bold tracking-wider border-b-2 transition-all cursor-pointer ${
                  activeSubTab === 'view' ? 'border-brand-sage text-brand-sage-dark' : 'border-transparent text-brand-brown-light hover:text-brand-charcoal'
                }`}
              >
                Profile Overview
              </button>
              <button
                id="subtab-edit"
                onClick={() => {
                  setFullName(user.fullName);
                  setPhone(user.phone);
                  setActiveSubTab('edit');
                }}
                className={`pb-3 text-xs uppercase font-bold tracking-wider border-b-2 transition-all cursor-pointer ${
                  activeSubTab === 'edit' ? 'border-brand-sage text-brand-sage-dark' : 'border-transparent text-brand-brown-light hover:text-brand-charcoal'
                }`}
              >
                Edit Specs
              </button>
              <button
                id="subtab-password"
                onClick={() => setActiveSubTab('password')}
                className={`pb-3 text-xs uppercase font-bold tracking-wider border-b-2 transition-all cursor-pointer ${
                  activeSubTab === 'password' ? 'border-brand-sage text-brand-sage-dark' : 'border-transparent text-brand-brown-light hover:text-brand-charcoal'
                }`}
              >
                Change Security
              </button>
            </div>

            {/* Subtab Contents Container */}
            <div className="pt-4">
              <AnimatePresence mode="wait">
                
                {/* SUBTAB 1: VIEW OVERVIEW */}
                {activeSubTab === 'view' && (
                  <motion.div
                    key="tab-view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <h3 className="serif-display text-xl font-medium text-brand-charcoal">Collector Credentials Summary</h3>
                      <p className="text-xs text-brand-brown leading-relaxed">
                        These credentials verify your identity within Napike's global eco-luxury portal.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                      <div className="p-4 bg-brand-cream border border-brand-beige rounded-2xl space-y-1.5">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-brand-brown-light block">Full Registered Name</span>
                        <span className="text-sm font-semibold text-brand-charcoal">{user.fullName}</span>
                      </div>
                      <div className="p-4 bg-brand-cream border border-brand-beige rounded-2xl space-y-1.5">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-brand-brown-light block">Encrypted Email Address</span>
                        <span className="text-sm font-semibold text-brand-charcoal font-mono">{user.email}</span>
                      </div>
                      <div className="p-4 bg-brand-cream border border-brand-beige rounded-2xl space-y-1.5">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-brand-brown-light block">WhatsApp Contact Contact</span>
                        <span className="text-sm font-semibold text-brand-charcoal">{user.phone}</span>
                      </div>
                      <div className="p-4 bg-brand-cream border border-brand-beige rounded-2xl space-y-1.5">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-brand-brown-light block">Jaipur Association Registry</span>
                        <span className="text-sm font-semibold text-brand-charcoal">Active (GOTS organic)</span>
                      </div>
                    </div>

                    <div className="p-4 bg-brand-sage-light/30 border border-brand-sage/10 rounded-2xl flex items-start gap-3">
                      <KeyRound className="text-brand-sage-dark shrink-0 mt-0.5" size={16} />
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-brand-sage-dark">Need Custom Embroidery?</p>
                        <p className="text-[11px] text-brand-brown leading-relaxed">
                          Your profile qualifies you for free monogram designs on any custom order. Simply contact our Jaipur designers via WhatsApp or write to support@napike.com with your active email session.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* SUBTAB 2: EDIT PROFILE */}
                {activeSubTab === 'edit' && (
                  <motion.div
                    key="tab-edit"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <form id="profile-edit-specs-form" onSubmit={handleEditProfile} className="space-y-6 text-left">
                      <div className="space-y-2">
                        <h3 className="serif-display text-xl font-medium text-brand-charcoal">Edit Profile Information</h3>
                        <p className="text-xs text-brand-brown leading-relaxed">
                          Update your contact and shipping billing parameters. Email cannot be edited.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-brand-brown-light">Full Name</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-brown-light">
                              <User size={16} />
                            </span>
                            <input
                              id="profile-edit-name"
                              type="text"
                              required
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className="w-full bg-brand-cream border border-brand-beige focus:border-brand-sage focus:outline-none focus:ring-0 rounded-2xl py-3 pl-12 pr-4 text-xs sm:text-sm text-brand-charcoal transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-brand-brown-light">Phone Number</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-brown-light">
                              <Phone size={16} />
                            </span>
                            <input
                              id="profile-edit-phone"
                              type="tel"
                              required
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="w-full bg-brand-cream border border-brand-beige focus:border-brand-sage focus:outline-none focus:ring-0 rounded-2xl py-3 pl-12 pr-4 text-xs sm:text-sm text-brand-charcoal transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          id="profile-edit-submit"
                          disabled={isSavingProfile}
                          className="bg-brand-sage hover:bg-brand-sage-dark disabled:bg-brand-sage/60 text-white text-xs font-semibold uppercase tracking-widest px-8 py-3.5 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-2"
                        >
                          {isSavingProfile ? (
                            <>
                              <Loader2 size={12} className="animate-spin" />
                              <span>Saving Parameters...</span>
                            </>
                          ) : (
                            <>
                              <span>Apply Changes</span>
                              <Check size={12} />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* SUBTAB 3: CHANGE PASSWORD */}
                {activeSubTab === 'password' && (
                  <motion.div
                    key="tab-password"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <form id="profile-change-password-form" onSubmit={handleChangePasswordSubmit} className="space-y-5 text-left">
                      <div className="space-y-2">
                        <h3 className="serif-display text-xl font-medium text-brand-charcoal">Update Password credentials</h3>
                        <p className="text-xs text-brand-brown leading-relaxed">
                          Provide your current active password followed by a secure new remapped password.
                        </p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-brand-brown-light">Current Password</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-brown-light">
                            <KeyRound size={16} />
                          </span>
                          <input
                            id="profile-old-password"
                            type="password"
                            required
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            placeholder="Enter current password"
                            className="w-full bg-brand-cream border border-brand-beige focus:border-brand-sage focus:outline-none focus:ring-0 rounded-2xl py-3 pl-12 pr-4 text-xs sm:text-sm text-brand-charcoal transition-all placeholder-brand-brown-light/40"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-1">
                        
                        {/* New password input */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-brand-brown-light">New Password</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-brown-light">
                              <KeyRound size={16} />
                            </span>
                            <input
                              id="profile-new-password"
                              type="password"
                              required
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Create new password"
                              className="w-full bg-brand-cream border border-brand-beige focus:border-brand-sage focus:outline-none focus:ring-0 rounded-2xl py-3 pl-12 pr-4 text-xs sm:text-sm text-brand-charcoal transition-all placeholder-brand-brown-light/40"
                            />
                          </div>
                          
                          {/* Mini dynamic requirements checks */}
                          <div className="bg-brand-cream border border-brand-beige rounded-2xl p-3 mt-2 space-y-1 text-[10px]">
                            <div className="flex items-center gap-1.5">
                              <span className={`w-3 h-3 rounded-full flex items-center justify-center shrink-0 ${newPasswordRequirements.length ? 'bg-emerald-100 text-emerald-600' : 'bg-brand-beige text-brand-brown-light'}`}>
                                {newPasswordRequirements.length ? <Check size={7} /> : '•'}
                              </span>
                              <span className={newPasswordRequirements.length ? 'text-emerald-700 font-semibold' : 'text-brand-brown/70'}>8+ characters</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className={`w-3 h-3 rounded-full flex items-center justify-center shrink-0 ${newPasswordRequirements.hasUpper && newPasswordRequirements.hasLower && newPasswordRequirements.hasNumber && newPasswordRequirements.hasSpecial ? 'bg-emerald-100 text-emerald-600' : 'bg-brand-beige text-brand-brown-light'}`}>
                                {newPasswordRequirements.hasUpper && newPasswordRequirements.hasLower && newPasswordRequirements.hasNumber && newPasswordRequirements.hasSpecial ? <Check size={7} /> : '•'}
                              </span>
                              <span className={newPasswordRequirements.hasUpper && newPasswordRequirements.hasLower && newPasswordRequirements.hasNumber && newPasswordRequirements.hasSpecial ? 'text-emerald-700 font-semibold' : 'text-brand-brown/70'}>Uppercase, number, symbol</span>
                            </div>
                          </div>
                        </div>

                        {/* Confirm New password */}
                        <div className="space-y-1 self-start">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-brand-brown-light">Confirm New Password</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-brown-light">
                              <KeyRound size={16} />
                            </span>
                            <input
                              id="profile-confirm-new-password"
                              type="password"
                              required
                              value={confirmNewPassword}
                              onChange={(e) => setConfirmNewPassword(e.target.value)}
                              placeholder="Re-enter new password"
                              className="w-full bg-brand-cream border border-brand-beige focus:border-brand-sage focus:outline-none focus:ring-0 rounded-2xl py-3 pl-12 pr-4 text-xs sm:text-sm text-brand-charcoal transition-all placeholder-brand-brown-light/40"
                            />
                          </div>
                        </div>

                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          id="profile-password-submit"
                          disabled={isSavingPassword}
                          className="bg-brand-sage hover:bg-brand-sage-dark disabled:bg-brand-sage/60 text-white text-xs font-semibold uppercase tracking-widest px-8 py-3.5 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-2"
                        >
                          {isSavingPassword ? (
                            <>
                              <Loader2 size={12} className="animate-spin" />
                              <span>Remapping Secrets...</span>
                            </>
                          ) : (
                            <>
                              <span>Secure Credentials Reset</span>
                              <ArrowRight size={12} />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

          </div>

        </div>

      </div>

      {/* AVATAR PORTRAIT PICKER DIALOG POPUP */}
      <AnimatePresence>
        {isAvatarPickerOpen && (
          <motion.div
            id="avatar-picker-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-charcoal/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsAvatarPickerOpen(false)}
          >
            <motion.div
              id="avatar-picker-card"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-brand-beige text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="serif-display text-xl font-medium text-brand-charcoal mb-4">Choose Profile Portrait</h3>
              <div className="grid grid-cols-3 gap-4 pb-4">
                {PRESET_AVATARS.map((avatar, idx) => (
                  <button
                    key={idx}
                    id={`avatar-option-${idx}`}
                    onClick={() => handleAvatarSelect(avatar)}
                    className="aspect-square rounded-full overflow-hidden border-2 border-transparent hover:border-brand-sage hover:scale-105 transition-all cursor-pointer shadow-sm relative group"
                  >
                    <img
                      src={avatar}
                      alt={`Avatar option ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {user.photoUrl === avatar && (
                      <div className="absolute inset-0 bg-brand-sage/40 flex items-center justify-center text-white">
                        <Check size={18} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <button
                id="close-avatar-picker"
                onClick={() => setIsAvatarPickerOpen(false)}
                className="w-full bg-brand-cream border border-brand-beige hover:bg-brand-beige text-brand-charcoal text-xs font-semibold uppercase tracking-wider py-2.5 rounded-xl cursor-pointer"
              >
                Close Picker
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
