/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, Sparkles, KeyRound, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginProps {
  setCurrentTab: (tab: string) => void;
  setResetEmail?: (email: string) => void; // helper to pass email to ResetPassword
}

export default function Login({ setCurrentTab }: LoginProps) {
  const { login, triggerGoogleSignIn, showToast } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load remembered email on mount
  useEffect(() => {
    const remembered = localStorage.getItem('napike_remembered_email');
    if (remembered) {
      setEmail(remembered);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast('Please enter both email and password.', 'error');
      return;
    }

    setIsSubmitting(true);
    const success = await login(email, password, rememberMe);
    setIsSubmitting(false);

    if (success) {
      setCurrentTab('home');
    }
  };

  return (
    <section id="login-page-container" className="py-24 bg-brand-cream border-t border-brand-beige">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid Wrapper */}
        <div className="bg-white border border-brand-beige rounded-[48px] overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 min-h-[620px] max-w-5xl mx-auto">
          
          {/* Left Column: Visual/Artisan side */}
          <div className="lg:col-span-5 bg-brand-charcoal text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden text-left">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full filter blur-[60px]" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-sage/10 rounded-full filter blur-[60px]" />
            <div className="absolute inset-0 bg-[radial-gradient(#F5EFEB_0.5px,transparent_0.5px)] [background-size:16px_16px] opacity-5 pointer-events-none" />

            <div className="space-y-6 z-10">
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-brand-gold flex items-center gap-1">
                <Sparkles size={11} />
                <span>Napike Member Access</span>
              </span>
              <h2 className="serif-display text-3xl sm:text-4xl font-light leading-tight text-brand-cream">
                Welcome back to your <br />
                <span className="italic font-normal text-brand-gold-light">Artisan Sanctuary</span>
              </h2>
              <div className="w-12 h-[1px] bg-brand-gold" />
              <p className="text-brand-beige/80 text-xs sm:text-sm leading-relaxed font-sans">
                Log in to synchronize your curated design wishlists, manage handcrafted orders, and save custom monogram styles.
              </p>
            </div>

            <div className="space-y-4 pt-12 lg:pt-0 z-10">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex gap-3 items-start">
                <KeyRound size={16} className="text-brand-gold shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-brand-gold">Demo Mode Credentials</p>
                  <p className="text-[11px] text-brand-beige/80">
                    Email: <span className="font-mono text-white select-all">hardikakubade2004@gmail.com</span>
                  </p>
                  <p className="text-[11px] text-brand-beige/80">
                    Password: <span className="font-mono text-white select-all">Password@123</span>
                  </p>
                </div>
              </div>

              <div className="text-[10px] tracking-widest text-brand-beige/40 uppercase">
                © 2026 Napike India • Eco-Luxury
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-center text-left">
            <div className="space-y-8">
              
              {/* Form Header */}
              <div>
                <h3 className="serif-display text-3xl font-light text-brand-charcoal">Log In</h3>
                <p className="text-xs text-brand-brown mt-1.5 leading-relaxed">
                  Enter your email address and password to access your member profile.
                </p>
              </div>

              {/* Form Input fields */}
              <form id="login-credentials-form" onSubmit={handleSubmit} className="space-y-5">
                
                {/* Email address field */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-brand-brown-light">Email Address</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-brown-light">
                      <Mail size={16} />
                    </span>
                    <input
                      id="login-email-input"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. hardika@gmail.com"
                      className="w-full bg-brand-cream border border-brand-beige focus:border-brand-sage focus:outline-none focus:ring-0 rounded-2xl py-3.5 pl-12 pr-4 text-xs sm:text-sm text-brand-charcoal transition-all placeholder-brand-brown-light/50"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-brand-brown-light">Password</label>
                    <button
                      type="button"
                      id="login-forgot-password-link"
                      onClick={() => setCurrentTab('forgot-password')}
                      className="text-[10px] uppercase font-bold tracking-wider text-brand-sage-dark hover:text-brand-sage hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-brown-light">
                      <Lock size={16} />
                    </span>
                    <input
                      id="login-password-input"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full bg-brand-cream border border-brand-beige focus:border-brand-sage focus:outline-none focus:ring-0 rounded-2xl py-3.5 pl-12 pr-12 text-xs sm:text-sm text-brand-charcoal transition-all placeholder-brand-brown-light/50"
                    />
                    <button
                      type="button"
                      id="login-show-password-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-brown-light hover:text-brand-charcoal transition-colors cursor-pointer p-1"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Remember me box */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center space-x-2 cursor-pointer select-none">
                    <input
                      id="login-remember-checkbox"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-brand-beige text-brand-sage focus:ring-brand-sage bg-brand-cream w-4 h-4"
                    />
                    <span className="text-xs text-brand-brown font-medium">Keep me signed in</span>
                  </label>
                </div>

                {/* Primary login CTAs */}
                <div className="pt-2 space-y-4">
                  <button
                    type="submit"
                    id="login-submit-btn"
                    disabled={isSubmitting}
                    className="w-full bg-brand-sage hover:bg-brand-sage-dark disabled:bg-brand-sage/60 text-white font-semibold text-xs uppercase tracking-widest py-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Verifying Access...</span>
                      </>
                    ) : (
                      <>
                        <span>Secure Account Sign In</span>
                        <ArrowRight size={12} />
                      </>
                    )}
                  </button>

                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-brand-beige"></div>
                    <span className="flex-shrink mx-4 text-[9px] font-bold uppercase tracking-widest text-brand-brown-light">or connect with</span>
                    <div className="flex-grow border-t border-brand-beige"></div>
                  </div>

                  {/* Google Authenticator Action */}
                  <button
                    type="button"
                    id="login-google-btn"
                    onClick={triggerGoogleSignIn}
                    className="w-full bg-white hover:bg-brand-cream text-brand-charcoal border border-brand-beige hover:border-brand-brown-light/30 font-semibold text-xs uppercase tracking-wider py-3.5 rounded-2xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2.5"
                  >
                    {/* Google original colored G logo */}
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61c-.28 1.5-.12 3-.97 4.1l3.12 2.42c1.82-1.68 2.98-4.17 2.98-8.37z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.12-2.42c-.87.58-2 .93-3.23.93-3.13 0-5.78-2.11-6.73-4.96L3.68 17.5C5.66 21.4 9.53 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.27 14.64a7.12 7.12 0 0 1 0-4.5l-3.12-2.42a11.96 11.96 0 0 0 0 9.34l3.12-2.42z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.96 1.19 15.24 0 12 0 9.53 0 5.66 2.6 3.68 6.5l3.12 2.42c.95-2.85 3.6-4.96 6.73-4.96z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                </div>

              </form>

              {/* Toggle Page Footer */}
              <div className="text-center border-t border-brand-beige pt-6">
                <p className="text-xs text-brand-brown font-medium">
                  Don't have an account yet?{' '}
                  <button
                    id="login-register-link"
                    onClick={() => setCurrentTab('signup')}
                    className="text-brand-sage-dark hover:text-brand-sage hover:underline uppercase font-bold tracking-wider ml-1 cursor-pointer"
                  >
                    Create Account
                  </button>
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
