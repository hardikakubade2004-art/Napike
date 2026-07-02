/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, ArrowLeft, ArrowRight, Loader2, Sparkles, CheckCircle, MailWarning } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ForgotPasswordProps {
  setCurrentTab: (tab: string) => void;
  setResetEmail: (email: string) => void;
}

export default function ForgotPassword({ setCurrentTab, setResetEmail }: ForgotPasswordProps) {
  const { sendPasswordReset, showToast } = useAuth();
  
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast('Please enter your email address.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    setIsSubmitting(true);
    const success = await sendPasswordReset(email);
    setIsSubmitting(false);

    if (success) {
      setResetEmail(email); // store it for ResetPassword
      setIsSuccess(true);
    }
  };

  return (
    <section id="forgot-password-page" className="py-24 bg-brand-cream border-t border-brand-beige text-left">
      <div className="max-w-md mx-auto px-4">
        
        {/* Back navigation button */}
        <button
          id="forgot-back-btn"
          onClick={() => setCurrentTab('login')}
          className="inline-flex items-center space-x-2 text-brand-charcoal hover:text-brand-sage text-xs font-semibold uppercase tracking-wider mb-8 cursor-pointer transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Sign In</span>
        </button>

        {/* Beautiful Floating Card */}
        <div className="bg-white border border-brand-beige rounded-[40px] p-8 sm:p-10 shadow-sm relative overflow-hidden">
          
          {/* Subtle gold decoration background */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/5 rounded-full filter blur-[40px]" />
          
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key="request-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="space-y-2 text-center sm:text-left">
                  <span className="text-[10px] font-bold tracking-[0.25em] text-brand-gold uppercase flex items-center justify-center sm:justify-start gap-1">
                    <Sparkles size={11} />
                    <span>Security Vault</span>
                  </span>
                  <h2 className="serif-display text-3xl font-light text-brand-charcoal leading-tight">Reset Password</h2>
                  <p className="text-xs text-brand-brown leading-relaxed">
                    Enter the email address associated with your Napike account. We'll generate a secure, simulated recovery session token.
                  </p>
                </div>

                <form id="forgot-password-request-form" onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-brand-brown-light">Email Address</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-brown-light">
                        <Mail size={16} />
                      </span>
                      <input
                        id="forgot-email-input"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. hardikakubade2004@gmail.com"
                        className="w-full bg-brand-cream border border-brand-beige focus:border-brand-sage focus:outline-none focus:ring-0 rounded-2xl py-3.5 pl-12 pr-4 text-xs sm:text-sm text-brand-charcoal transition-all placeholder-brand-brown-light/50 font-sans"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    id="forgot-submit-btn"
                    disabled={isSubmitting}
                    className="w-full bg-brand-sage hover:bg-brand-sage-dark disabled:bg-brand-sage/60 text-white font-semibold text-xs uppercase tracking-widest py-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Sending secure link...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Password Reset Link</span>
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
                exit={{ opacity: 0 }}
                className="space-y-6 text-center"
              >
                <div className="p-4 bg-emerald-50 text-emerald-600 w-fit rounded-full mx-auto shadow-sm animate-pulse">
                  <CheckCircle size={32} />
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] font-bold tracking-[0.3em] text-brand-gold uppercase">Delivery Dispatched</span>
                  <h3 className="serif-display text-2xl font-light text-brand-charcoal">Recovery Email Sent</h3>
                  <div className="w-12 h-[1px] bg-brand-gold mx-auto mt-2" />
                </div>

                <p className="text-xs text-brand-brown leading-relaxed max-w-sm mx-auto">
                  We've successfully processed your request and dispatched a secure recovery link to <strong>{email}</strong>. Please check your junk or spam folder if it doesn't appear in 2 minutes.
                </p>

                {/* demo reset gateway bypass */}
                <div className="p-4 bg-brand-cream border border-brand-gold/10 rounded-2xl space-y-3 mt-4 text-left">
                  <div className="flex gap-2 items-start text-brand-gold-dark">
                    <MailWarning size={15} className="shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-wider font-bold">Simulator Demo Gateway</p>
                      <p className="text-[11px] text-brand-brown leading-relaxed">
                        Since this is a simulated sandbox workspace, you cannot open a real email. We have created a bypass link so you can test the Reset Password flow directly!
                      </p>
                    </div>
                  </div>

                  <button
                    id="forgot-bypass-reset-btn"
                    onClick={() => setCurrentTab('reset-password')}
                    className="w-full bg-brand-sage hover:bg-brand-sage-dark text-white text-[10px] font-bold uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
                  >
                    <span>Simulate Reset Link Directly</span>
                    <ArrowRight size={11} />
                  </button>
                </div>

                <div className="pt-2 border-t border-brand-beige">
                  <button
                    id="forgot-return-login"
                    onClick={() => setCurrentTab('login')}
                    className="text-xs text-brand-brown font-semibold uppercase tracking-wider hover:text-brand-sage"
                  >
                    Return to Log In
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
}
