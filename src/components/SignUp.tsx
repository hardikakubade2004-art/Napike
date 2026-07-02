/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mail, Phone, Lock, Check, X, ShieldAlert, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SignUpProps {
  setCurrentTab: (tab: string) => void;
}

export default function SignUp({ setCurrentTab }: SignUpProps) {
  const { signUp, triggerGoogleSignIn, showToast } = useAuth();

  // Form Fields State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Submission / Loading State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Field Specific Validation Errors State
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: ''
  });

  // Password Requirements State
  const passwordRequirements = {
    length: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  // Run validation checks on form updates
  useEffect(() => {
    if (!hasSubmitted) return; // Only show live validation after first attempt

    const newErrors = {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      agreeTerms: ''
    };

    // Full name check
    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    }

    // Email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email Address is required.';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // Phone check
    const cleanPhone = phone.replace(/\D/g, '');
    if (!phone.trim()) {
      newErrors.phone = 'Mobile Number is required.';
    } else if (cleanPhone.length < 10) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number.';
    }

    // Password requirements checks
    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (
      !passwordRequirements.length ||
      !passwordRequirements.hasUpper ||
      !passwordRequirements.hasLower ||
      !passwordRequirements.hasNumber ||
      !passwordRequirements.hasSpecial
    ) {
      newErrors.password = 'Password does not meet all security guidelines.';
    }

    // Confirm password check
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    // Agree terms check
    if (!agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Privacy Policy and Terms.';
    }

    setErrors(newErrors);
  }, [fullName, email, phone, password, confirmPassword, agreeTerms, hasSubmitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);

    // Initial manual validate
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanPhone = phone.replace(/\D/g, '');

    const isPasswordValid =
      passwordRequirements.length &&
      passwordRequirements.hasUpper &&
      passwordRequirements.hasLower &&
      passwordRequirements.hasNumber &&
      passwordRequirements.hasSpecial;

    if (
      !fullName.trim() ||
      !emailRegex.test(email) ||
      cleanPhone.length < 10 ||
      !isPasswordValid ||
      password !== confirmPassword ||
      !agreeTerms
    ) {
      // Setup error display
      const newErrors = {
        fullName: !fullName.trim() ? 'Full Name is required.' : '',
        email: !email.trim() ? 'Email is required.' : !emailRegex.test(email) ? 'Invalid email format.' : '',
        phone: !phone.trim() ? 'Mobile is required.' : cleanPhone.length < 10 ? 'Must be at least 10 digits.' : '',
        password: !password ? 'Password is required.' : !isPasswordValid ? 'Does not meet guidelines.' : '',
        confirmPassword: !confirmPassword ? 'Required.' : password !== confirmPassword ? 'Passwords do not match.' : '',
        agreeTerms: !agreeTerms ? 'You must agree to the Terms.' : ''
      };
      setErrors(newErrors);
      showToast('Please correct the validation errors before creating your account.', 'error');
      return;
    }

    setIsSubmitting(true);
    const success = await signUp(fullName, email, phone, password);
    setIsSubmitting(false);

    if (success) {
      setCurrentTab('home');
    }
  };

  return (
    <section id="signup-page-container" className="py-24 bg-brand-cream border-t border-brand-beige">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dual Pane Layout Card */}
        <div className="bg-white border border-brand-beige rounded-[48px] overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 min-h-[700px] max-w-5xl mx-auto">
          
          {/* Left Column: Artisan Story */}
          <div className="lg:col-span-5 bg-brand-charcoal text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden text-left">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full filter blur-[60px]" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-sage/10 rounded-full filter blur-[60px]" />
            <div className="absolute inset-0 bg-[radial-gradient(#F5EFEB_0.5px,transparent_0.5px)] [background-size:16px_16px] opacity-5 pointer-events-none" />

            <div className="space-y-6 z-10">
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-brand-gold flex items-center gap-1">
                <Sparkles size={11} />
                <span>Zero-Waste Gifting Circle</span>
              </span>
              <h2 className="serif-display text-3xl sm:text-4xl font-light leading-tight text-brand-cream">
                Weave your story into <br />
                <span className="italic font-normal text-brand-sage">Sustainable Luxury</span>
              </h2>
              <div className="w-12 h-[1px] bg-brand-gold" />
              <p className="text-brand-beige/80 text-xs sm:text-sm leading-relaxed font-sans">
                Join our premium community of GOTS certified organic table art lovers. As a registered member, you directly support underrepresented Rajasthani women weavers and save tons of festive floral waste.
              </p>
            </div>

            <div className="space-y-4 pt-12 lg:pt-0 z-10">
              {/* Premium Perks Box */}
              <div className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                <p className="text-[10px] uppercase tracking-wider font-bold text-brand-gold">Exclusive Membership Benefits</p>
                <ul className="space-y-2 text-xs text-brand-beige/85">
                  <li className="flex items-center gap-2">
                    <Check size={12} className="text-brand-sage" />
                    <span>Free bespoke monogram embroidery</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={12} className="text-brand-sage" />
                    <span>Access to seasonal capsule releases</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={12} className="text-brand-sage" />
                    <span>10% Welcome Gift Code automatically activated</span>
                  </li>
                </ul>
              </div>

              <div className="text-[10px] tracking-widest text-brand-beige/40 uppercase">
                © 2026 Napike India • Jaipur Artistry
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic SignUp Form */}
          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-center text-left">
            <div className="space-y-8">
              
              {/* Header */}
              <div>
                <h3 className="serif-display text-3xl font-light text-brand-charcoal">Create Account</h3>
                <p className="text-xs text-brand-brown mt-1.5 leading-relaxed">
                  Join Napike today. Fill in the parameters to register your sustainable profile.
                </p>
              </div>

              <form id="signup-registration-form" onSubmit={handleSubmit} className="space-y-4">
                
                {/* 1. Full Name Field */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-brand-brown-light">Full Name</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-brown-light">
                      <User size={16} />
                    </span>
                    <input
                      id="signup-name-input"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Hardika Kubade"
                      className={`w-full bg-brand-cream border rounded-2xl py-3 pl-12 pr-4 text-xs sm:text-sm text-brand-charcoal transition-all placeholder-brand-brown-light/50 focus:outline-none focus:ring-0 ${
                        errors.fullName ? 'border-red-500 focus:border-red-500' : 'border-brand-beige focus:border-brand-sage'
                      }`}
                    />
                  </div>
                  {errors.fullName && (
                    <span className="text-[10px] text-red-500 font-medium flex items-center gap-1 mt-1">
                      <ShieldAlert size={10} />
                      <span>{errors.fullName}</span>
                    </span>
                  )}
                </div>

                {/* 2. Email Address Field */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-brand-brown-light">Email Address</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-brown-light">
                      <Mail size={16} />
                    </span>
                    <input
                      id="signup-email-input"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. hardikakubade2004@gmail.com"
                      className={`w-full bg-brand-cream border rounded-2xl py-3 pl-12 pr-4 text-xs sm:text-sm text-brand-charcoal transition-all placeholder-brand-brown-light/50 focus:outline-none focus:ring-0 ${
                        errors.email ? 'border-red-500 focus:border-red-500' : 'border-brand-beige focus:border-brand-sage'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <span className="text-[10px] text-red-500 font-medium flex items-center gap-1 mt-1">
                      <ShieldAlert size={10} />
                      <span>{errors.email}</span>
                    </span>
                  )}
                </div>

                {/* 3. Mobile Number Field */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-brand-brown-light">Mobile Contact Number</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-brown-light">
                      <Phone size={16} />
                    </span>
                    <input
                      id="signup-phone-input"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className={`w-full bg-brand-cream border rounded-2xl py-3 pl-12 pr-4 text-xs sm:text-sm text-brand-charcoal transition-all placeholder-brand-brown-light/50 focus:outline-none focus:ring-0 ${
                        errors.phone ? 'border-red-500 focus:border-red-500' : 'border-brand-beige focus:border-brand-sage'
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <span className="text-[10px] text-red-500 font-medium flex items-center gap-1 mt-1">
                      <ShieldAlert size={10} />
                      <span>{errors.phone}</span>
                    </span>
                  )}
                </div>

                {/* 4. Password Field */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-brand-brown-light">Password</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-brown-light">
                      <Lock size={16} />
                    </span>
                    <input
                      id="signup-password-input"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter a strong password"
                      className={`w-full bg-brand-cream border rounded-2xl py-3 pl-12 pr-4 text-xs sm:text-sm text-brand-charcoal transition-all placeholder-brand-brown-light/50 focus:outline-none focus:ring-0 ${
                        errors.password ? 'border-red-500 focus:border-red-500' : 'border-brand-beige focus:border-brand-sage'
                      }`}
                    />
                  </div>
                  {errors.password && (
                    <span className="text-[10px] text-red-500 font-medium flex items-center gap-1 mt-1">
                      <ShieldAlert size={10} />
                      <span>{errors.password}</span>
                    </span>
                  )}

                  {/* LIVE PASSWORD REQUIREMENTS INDICATOR */}
                  <div className="bg-brand-cream border border-brand-beige rounded-2xl p-3.5 mt-2 space-y-2">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-brand-brown">Password Guidelines</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${passwordRequirements.length ? 'bg-emerald-100 text-emerald-600' : 'bg-brand-beige text-brand-brown-light'}`}>
                          {passwordRequirements.length ? <Check size={8} /> : '•'}
                        </span>
                        <span className={passwordRequirements.length ? 'text-emerald-700 font-semibold' : 'text-brand-brown/70'}>At least 8 characters</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${passwordRequirements.hasUpper ? 'bg-emerald-100 text-emerald-600' : 'bg-brand-beige text-brand-brown-light'}`}>
                          {passwordRequirements.hasUpper ? <Check size={8} /> : '•'}
                        </span>
                        <span className={passwordRequirements.hasUpper ? 'text-emerald-700 font-semibold' : 'text-brand-brown/70'}>One uppercase [A-Z]</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${passwordRequirements.hasLower ? 'bg-emerald-100 text-emerald-600' : 'bg-brand-beige text-brand-brown-light'}`}>
                          {passwordRequirements.hasLower ? <Check size={8} /> : '•'}
                        </span>
                        <span className={passwordRequirements.hasLower ? 'text-emerald-700 font-semibold' : 'text-brand-brown/70'}>One lowercase [a-z]</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${passwordRequirements.hasNumber ? 'bg-emerald-100 text-emerald-600' : 'bg-brand-beige text-brand-brown-light'}`}>
                          {passwordRequirements.hasNumber ? <Check size={8} /> : '•'}
                        </span>
                        <span className={passwordRequirements.hasNumber ? 'text-emerald-700 font-semibold' : 'text-brand-brown/70'}>One number [0-9]</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:col-span-2">
                        <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${passwordRequirements.hasSpecial ? 'bg-emerald-100 text-emerald-600' : 'bg-brand-beige text-brand-brown-light'}`}>
                          {passwordRequirements.hasSpecial ? <Check size={8} /> : '•'}
                        </span>
                        <span className={passwordRequirements.hasSpecial ? 'text-emerald-700 font-semibold' : 'text-brand-brown/70'}>One special character [!, @, #, $, %, ^, etc]</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Confirm Password Field */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-brand-brown-light">Confirm Password</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-brown-light">
                      <Lock size={16} />
                    </span>
                    <input
                      id="signup-confirm-input"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className={`w-full bg-brand-cream border rounded-2xl py-3 pl-12 pr-4 text-xs sm:text-sm text-brand-charcoal transition-all placeholder-brand-brown-light/50 focus:outline-none focus:ring-0 ${
                        errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-brand-beige focus:border-brand-sage'
                      }`}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <span className="text-[10px] text-red-500 font-medium flex items-center gap-1 mt-1">
                      <ShieldAlert size={10} />
                      <span>{errors.confirmPassword}</span>
                    </span>
                  )}
                </div>

                {/* 6. Terms & Privacy Checkbox */}
                <div className="space-y-1 pt-2">
                  <label className="flex items-start space-x-2.5 cursor-pointer select-none">
                    <input
                      id="signup-terms-checkbox"
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="rounded border-brand-beige text-brand-sage focus:ring-brand-sage bg-brand-cream w-4 h-4 mt-0.5 shrink-0"
                    />
                    <span className="text-[11px] text-brand-brown leading-relaxed font-medium">
                      I agree to the <span className="text-brand-sage-dark hover:underline font-semibold">Privacy Policy</span> and <span className="text-brand-sage-dark hover:underline font-semibold">Terms & Conditions</span>. I understand my data is protected.
                    </span>
                  </label>
                  {errors.agreeTerms && (
                    <span className="text-[10px] text-red-500 font-medium flex items-center gap-1 mt-1">
                      <ShieldAlert size={10} />
                      <span>{errors.agreeTerms}</span>
                    </span>
                  )}
                </div>

                {/* Register & Submit CTA buttons */}
                <div className="pt-4 space-y-4">
                  <button
                    type="submit"
                    id="signup-submit-btn"
                    disabled={isSubmitting}
                    className="w-full bg-brand-sage hover:bg-brand-sage-dark disabled:bg-brand-sage/60 text-white font-semibold text-xs uppercase tracking-widest py-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Creating Premium Identity...</span>
                      </>
                    ) : (
                      <>
                        <span>Agree & Create Account</span>
                        <ArrowRight size={12} />
                      </>
                    )}
                  </button>

                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-brand-beige"></div>
                    <span className="flex-shrink mx-4 text-[9px] font-bold uppercase tracking-widest text-brand-brown-light">or register with</span>
                    <div className="flex-grow border-t border-brand-beige"></div>
                  </div>

                  <button
                    type="button"
                    id="signup-google-btn"
                    onClick={triggerGoogleSignIn}
                    className="w-full bg-white hover:bg-brand-cream text-brand-charcoal border border-brand-beige hover:border-brand-brown-light/30 font-semibold text-xs uppercase tracking-wider py-3.5 rounded-2xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2.5"
                  >
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
                    <span>Sign Up with Google</span>
                  </button>
                </div>

              </form>

              {/* Already have an account link footer */}
              <div className="text-center border-t border-brand-beige pt-6">
                <p className="text-xs text-brand-brown font-medium">
                  Already have an account?{' '}
                  <button
                    id="signup-login-link"
                    onClick={() => setCurrentTab('login')}
                    className="text-brand-sage-dark hover:text-brand-sage hover:underline uppercase font-bold tracking-wider ml-1 cursor-pointer"
                  >
                    Log In Instead
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
