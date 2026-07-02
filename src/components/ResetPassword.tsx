/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Check, Loader2, Sparkles, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ResetPasswordProps {
  setCurrentTab: (tab: string) => void;
  resetEmail: string;
}

export default function ResetPassword({ setCurrentTab, resetEmail }: ResetPasswordProps) {
  const { resetPassword, showToast } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Fallback if resetEmail is empty (e.g. they opened it directly)
  const targetEmail = resetEmail || 'hardikakubade2004@gmail.com';

  // Password Requirements State
  const passwordRequirements = {
    length: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const isPasswordValid =
    passwordRequirements.length &&
    passwordRequirements.hasUpper &&
    passwordRequirements.hasLower &&
    passwordRequirements.hasNumber &&
    passwordRequirements.hasSpecial;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordValid) {
      showToast('Please fulfill all security guidelines before continuing.', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match. Please re-enter.', 'error');
      return;
    }

    setIsSubmitting(true);
    const success = await resetPassword(targetEmail, password);
    setIsSubmitting(false);

    if (success) {
      setIsSuccess(true);
      // Wait 3 seconds, then redirect to login page
      setTimeout(() => {
        setCurrentTab('login');
      }, 3000);
    }
  };

  return (
    <section id="reset-password-page" className="py-24 bg-brand-cream border-t border-brand-beige text-left">
      <div className="max-w-md mx-auto px-4">
        
        {/* Back navigation button */}
        <button
          id="reset-back-btn"
          onClick={() => setCurrentTab('login')}
          className="inline-flex items-center space-x-2 text-brand-charcoal hover:text-brand-sage text-xs font-semibold uppercase tracking-wider mb-8 cursor-pointer transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Cancel & Back</span>
        </button>

        {/* Beautiful Floating Card */}
        <div className="bg-white border border-brand-beige rounded-[40px] p-8 sm:p-10 shadow-sm relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/5 rounded-full filter blur-[40px]" />
          
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key="reset-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="space-y-2 text-center sm:text-left">
                  <span className="text-[10px] font-bold tracking-[0.25em] text-brand-gold uppercase flex items-center justify-center sm:justify-start gap-1">
                    <Sparkles size={11} />
                    <span>Credentials Forge</span>
                  </span>
                  <h2 className="serif-display text-3xl font-light text-brand-charcoal leading-tight">Create New Password</h2>
                  <p className="text-xs text-brand-brown leading-relaxed">
                    Resetting credentials for email session:<br />
                    <strong className="text-brand-charcoal font-semibold font-mono text-[11px] block mt-1 bg-brand-beige/50 p-2 rounded-xl border border-brand-beige text-center">{targetEmail}</strong>
                  </p>
                </div>

                <form id="reset-password-credentials-form" onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* Password Input */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-brand-brown-light">New Password</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-brown-light">
                        <Lock size={16} />
                      </span>
                      <input
                        id="reset-new-password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a strong password"
                        className="w-full bg-brand-cream border border-brand-beige focus:border-brand-sage focus:outline-none focus:ring-0 rounded-2xl py-3.5 pl-12 pr-4 text-xs sm:text-sm text-brand-charcoal transition-all placeholder-brand-brown-light/50 font-sans"
                      />
                    </div>
                    
                    {/* Live requirements checklist */}
                    <div className="bg-brand-cream border border-brand-beige rounded-2xl p-3.5 mt-2 space-y-1.5 text-[10px]">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-brand-brown mb-1">Complexity Check</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${passwordRequirements.length ? 'bg-emerald-100 text-emerald-600' : 'bg-brand-beige text-brand-brown-light'}`}>
                            {passwordRequirements.length ? <Check size={8} /> : '•'}
                          </span>
                          <span className={passwordRequirements.length ? 'text-emerald-700 font-semibold' : 'text-brand-brown/70'}>8+ characters</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${passwordRequirements.hasUpper ? 'bg-emerald-100 text-emerald-600' : 'bg-brand-beige text-brand-brown-light'}`}>
                            {passwordRequirements.hasUpper ? <Check size={8} /> : '•'}
                          </span>
                          <span className={passwordRequirements.hasUpper ? 'text-emerald-700 font-semibold' : 'text-brand-brown/70'}>Uppercase [A-Z]</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${passwordRequirements.hasLower ? 'bg-emerald-100 text-emerald-600' : 'bg-brand-beige text-brand-brown-light'}`}>
                            {passwordRequirements.hasLower ? <Check size={8} /> : '•'}
                          </span>
                          <span className={passwordRequirements.hasLower ? 'text-emerald-700 font-semibold' : 'text-brand-brown/70'}>Lowercase [a-z]</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${passwordRequirements.hasNumber ? 'bg-emerald-100 text-emerald-600' : 'bg-brand-beige text-brand-brown-light'}`}>
                            {passwordRequirements.hasNumber ? <Check size={8} /> : '•'}
                          </span>
                          <span className={passwordRequirements.hasNumber ? 'text-emerald-700 font-semibold' : 'text-brand-brown/70'}>Number [0-9]</span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:col-span-2 mt-0.5">
                          <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${passwordRequirements.hasSpecial ? 'bg-emerald-100 text-emerald-600' : 'bg-brand-beige text-brand-brown-light'}`}>
                            {passwordRequirements.hasSpecial ? <Check size={8} /> : '•'}
                          </span>
                          <span className={passwordRequirements.hasSpecial ? 'text-emerald-700 font-semibold' : 'text-brand-brown/70'}>Special Character [!@#$%]</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Confirm Password Input */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-brand-brown-light">Confirm New Password</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-brown-light">
                        <Lock size={16} />
                      </span>
                      <input
                        id="reset-confirm-password"
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full bg-brand-cream border border-brand-beige focus:border-brand-sage focus:outline-none focus:ring-0 rounded-2xl py-3.5 pl-12 pr-4 text-xs sm:text-sm text-brand-charcoal transition-all placeholder-brand-brown-light/50 font-sans"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    id="reset-submit-btn"
                    disabled={isSubmitting}
                    className="w-full bg-brand-sage hover:bg-brand-sage-dark disabled:bg-brand-sage/60 text-white font-semibold text-xs uppercase tracking-widest py-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Updating credentials...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify & Change Password</span>
                        <ArrowRight size={12} />
                      </>
                    )}
                  </button>

                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success-screen"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 text-center"
              >
                <div className="p-4 bg-emerald-50 text-emerald-600 w-fit rounded-full mx-auto shadow-sm animate-bounce">
                  <CheckCircle size={32} />
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] font-bold tracking-[0.3em] text-brand-gold uppercase">Credentials Remapped</span>
                  <h3 className="serif-display text-2xl font-light text-brand-charcoal">Password Reset Successfully</h3>
                  <div className="w-12 h-[1px] bg-brand-gold mx-auto mt-2" />
                </div>

                <p className="text-xs text-brand-brown leading-relaxed max-w-sm mx-auto">
                  Your security parameters have been updated. We are automatically rerouting your connection back to the Secure Sign-In interface. Please wait...
                </p>

                <div className="relative flex justify-center py-4">
                  <div className="w-6 h-6 border-2 border-brand-sage border-t-transparent rounded-full animate-spin" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
}
