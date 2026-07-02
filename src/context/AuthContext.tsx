/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, LogIn, Mail, ShieldAlert, CheckCircle, Info, X } from 'lucide-react';
import { User, Order } from '../types';
import {
  supabase,
  dbSaveUser,
  dbGetUser,
  testSupabaseConnection
} from '../lib/supabase';

// Custom Toast Interface
export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  toasts: Toast[];
  supabaseStatus: 'connected' | 'offline_fallback' | 'checking';
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;
  login: (email: string, password: string, rememberMe: boolean) => Promise<boolean>;
  signUp: (fullName: string, email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  sendPasswordReset: (email: string) => Promise<boolean>;
  resetPassword: (email: string, newPassword: string) => Promise<boolean>;
  updateProfile: (fullName: string, phone: string, photoUrl?: string) => Promise<boolean>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
  triggerGoogleSignIn: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [supabaseStatus, setSupabaseStatus] = useState<'connected' | 'offline_fallback' | 'checking'>('checking');
  const [isGooglePopupOpen, setIsGooglePopupOpen] = useState<boolean>(false);
  const [googleStep, setGoogleStep] = useState<'chooser' | 'loading' | 'success'>('chooser');

  // Load and seed users on mount
  useEffect(() => {
    // 1. Seed default user if not exists locally
    const existingUsersRaw = localStorage.getItem('napike_users');
    let usersList: User[] = [];

    if (existingUsersRaw) {
      try {
        usersList = JSON.parse(existingUsersRaw);
      } catch (e) {
        usersList = [];
      }
    }

    const defaultUserEmail = 'hardikakubade2004@gmail.com';
    const hasDefaultUser = usersList.some(u => u.email.toLowerCase() === defaultUserEmail.toLowerCase());

    const seededUserObj: User = {
      uid: 'usr_seeded_hardika',
      fullName: 'Hardika Kubade',
      email: defaultUserEmail,
      phone: '+91 98765 43210',
      joinedDate: 'June 2026',
      password: 'Password@123', // Demo password
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
    };

    if (!hasDefaultUser) {
      usersList.push(seededUserObj);
      localStorage.setItem('napike_users', JSON.stringify(usersList));
    }

    // 2. Restore active session
    const rememberedUser = localStorage.getItem('napike_current_user');
    if (rememberedUser) {
      try {
        setUser(JSON.parse(rememberedUser));
      } catch (e) {
        localStorage.removeItem('napike_current_user');
      }
    }

    // 3. Connect and seed Supabase
    const initSupabase = async () => {
      try {
        const isConnected = await testSupabaseConnection();
        if (isConnected) {
          setSupabaseStatus('connected');
          // Seed default user to Supabase
          const sUser = await dbGetUser(defaultUserEmail);
          if (!sUser) {
            await dbSaveUser(seededUserObj);
          }
        } else {
          setSupabaseStatus('offline_fallback');
        }
      } catch (err) {
        console.warn('Failed to init connection test:', err);
        setSupabaseStatus('offline_fallback');
      } finally {
        setLoading(false);
      }
    };

    initSupabase();
  }, []);

  // Toast notifications helpers
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = `toast_${Math.random().toString(36).substr(2, 9)}`;
    setToasts(prev => [...prev, { id, message, type }]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // 1. LOGIN
  const login = async (email: string, password: string, rememberMe: boolean): Promise<boolean> => {
    setLoading(true);
    try {
      // Simulate/add brief loading feel
      await new Promise(resolve => setTimeout(resolve, 800));

      let foundUser: User | null = null;

      // Try Supabase first
      if (supabaseStatus === 'connected') {
        foundUser = await dbGetUser(email);
        if (foundUser) {
          if (foundUser.password !== password) {
            showToast('The password you entered is incorrect. Please try again.', 'error');
            setLoading(false);
            return false;
          }
          // Sync found Supabase user to local storage napike_users list if not present
          const localUsersRaw = localStorage.getItem('napike_users') || '[]';
          const localUsers: User[] = JSON.parse(localUsersRaw);
          if (!localUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            localUsers.push(foundUser);
            localStorage.setItem('napike_users', JSON.stringify(localUsers));
          }
        }
      }

      // Local storage fallback if not found or offline
      if (!foundUser) {
        const usersListRaw = localStorage.getItem('napike_users') || '[]';
        const users: User[] = JSON.parse(usersListRaw);
        const localFound = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!localFound) {
          showToast('We couldn\'t find an account with that email address.', 'error');
          setLoading(false);
          return false;
        }

        if (localFound.password !== password) {
          showToast('The password you entered is incorrect. Please try again.', 'error');
          setLoading(false);
          return false;
        }

        foundUser = localFound;

        // If Supabase is connected but user was only local, sync user to Supabase!
        if (supabaseStatus === 'connected') {
          await dbSaveUser(localFound);
        }
      }

      // Successful login
      const { password: _, ...safeUser } = foundUser;
      setUser(safeUser);
      localStorage.setItem('napike_current_user', JSON.stringify(safeUser));

      if (rememberMe) {
        localStorage.setItem('napike_remembered_email', email);
      } else {
        localStorage.removeItem('napike_remembered_email');
      }

      showToast(`Welcome back, ${safeUser.fullName}!`, 'success');
      setLoading(false);
      return true;
    } catch (e) {
      showToast('An unexpected error occurred during login.', 'error');
      setLoading(false);
      return false;
    }
  };

  // 2. SIGN UP
  const signUp = async (fullName: string, email: string, phone: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const usersListRaw = localStorage.getItem('napike_users') || '[]';
      const users: User[] = JSON.parse(usersListRaw);

      // Check if user already exists in local storage
      let emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());

      // Check if user exists in Supabase
      if (!emailExists && supabaseStatus === 'connected') {
        const existingSupabaseUser = await dbGetUser(email);
        if (existingSupabaseUser) {
          emailExists = true;
        }
      }

      if (emailExists) {
        showToast('An account with this email already exists.', 'error');
        setLoading(false);
        return false;
      }

      const newUser: User = {
        uid: `usr_${Math.random().toString(36).substr(2, 9)}`,
        fullName,
        email,
        phone,
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        password,
        photoUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(fullName)}`
      };

      // Save locally
      users.push(newUser);
      localStorage.setItem('napike_users', JSON.stringify(users));

      // Save to Supabase if connected
      if (supabaseStatus === 'connected') {
        const savedToDb = await dbSaveUser(newUser);
        if (!savedToDb) {
          console.warn('Could not save user profile to Supabase, fallback to offline state');
        }
      }

      // Auto login after sign up
      const { password: _, ...safeUser } = newUser;
      setUser(safeUser);
      localStorage.setItem('napike_current_user', JSON.stringify(safeUser));

      showToast('Your account was created successfully! Welcome to Napike.', 'success');
      setLoading(false);
      return true;
    } catch (e) {
      showToast('An error occurred while setting up your account.', 'error');
      setLoading(false);
      return false;
    }
  };

  // 3. LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem('napike_current_user');
    showToast('You have been logged out successfully.', 'success');
  };

  // 4. FORGOT PASSWORD (Simulated)
  const sendPasswordReset = async (email: string): Promise<boolean> => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));

      const usersListRaw = localStorage.getItem('napike_users') || '[]';
      const users: User[] = JSON.parse(usersListRaw);

      const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (!exists) {
        showToast('We couldn\'t find an account associated with that email.', 'error');
        setLoading(false);
        return false;
      }

      showToast(`Password reset link sent to ${email}! Check your inbox.`, 'success');
      setLoading(false);
      return true;
    } catch (e) {
      showToast('Error requesting password reset.', 'error');
      setLoading(false);
      return false;
    }
  };

  // 5. RESET PASSWORD (Simulated)
  const resetPassword = async (email: string, newPassword: string): Promise<boolean> => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const usersListRaw = localStorage.getItem('napike_users') || '[]';
      const users: User[] = JSON.parse(usersListRaw);

      const userIdx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
      if (userIdx === -1) {
        showToast('Error resetting password: User not found.', 'error');
        setLoading(false);
        return false;
      }

      users[userIdx].password = newPassword;
      localStorage.setItem('napike_users', JSON.stringify(users));

      // If resetting password of currently logged-in user, sync session
      if (user && user.email.toLowerCase() === email.toLowerCase()) {
        const { password: _, ...safeUser } = users[userIdx];
        setUser(safeUser);
        localStorage.setItem('napike_current_user', JSON.stringify(safeUser));
      }

      showToast('Your password was updated successfully!', 'success');
      setLoading(false);
      return true;
    } catch (e) {
      showToast('Error resetting password.', 'error');
      setLoading(false);
      return false;
    }
  };

  // 6. EDIT PROFILE
  const updateProfile = async (fullName: string, phone: string, photoUrl?: string): Promise<boolean> => {
    if (!user) return false;
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const usersListRaw = localStorage.getItem('napike_users') || '[]';
      const users: User[] = JSON.parse(usersListRaw);

      const userIdx = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
      if (userIdx === -1) {
        showToast('Profile update failed: User session not found.', 'error');
        setLoading(false);
        return false;
      }

      users[userIdx].fullName = fullName;
      users[userIdx].phone = phone;
      if (photoUrl) {
        users[userIdx].photoUrl = photoUrl;
      }

      localStorage.setItem('napike_users', JSON.stringify(users));

      const { password: _, ...safeUser } = users[userIdx];
      setUser(safeUser);
      localStorage.setItem('napike_current_user', JSON.stringify(safeUser));

      // Sync with Supabase
      if (supabaseStatus === 'connected') {
        await dbSaveUser(users[userIdx]);
      }

      showToast('Your profile has been updated successfully!', 'success');
      setLoading(false);
      return true;
    } catch (e) {
      showToast('Error updating profile information.', 'error');
      setLoading(false);
      return false;
    }
  };

  // 7. CHANGE PASSWORD
  const changePassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
    if (!user) return false;
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const usersListRaw = localStorage.getItem('napike_users') || '[]';
      const users: User[] = JSON.parse(usersListRaw);

      const userIdx = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
      if (userIdx === -1) {
        showToast('Password update failed: Session expired.', 'error');
        setLoading(false);
        return false;
      }

      if (users[userIdx].password !== oldPassword) {
        showToast('The old password you entered is incorrect.', 'error');
        setLoading(false);
        return false;
      }

      users[userIdx].password = newPassword;
      localStorage.setItem('napike_users', JSON.stringify(users));

      // Sync with Supabase
      if (supabaseStatus === 'connected') {
        await dbSaveUser(users[userIdx]);
      }

      showToast('Your password has been changed successfully.', 'success');
      setLoading(false);
      return true;
    } catch (e) {
      showToast('Error updating password.', 'error');
      setLoading(false);
      return false;
    }
  };

  // Google Sign In trigger
  const triggerGoogleSignIn = () => {
    setGoogleStep('chooser');
    setIsGooglePopupOpen(true);
  };

  const handleGoogleAccountSelect = async (accountEmail: string, accountName: string) => {
    setGoogleStep('loading');
    
    // Simulate real Google Auth Exchange
    await new Promise(resolve => setTimeout(resolve, 1500));

    const usersListRaw = localStorage.getItem('napike_users') || '[]';
    const users: User[] = JSON.parse(usersListRaw);

    let foundUser = users.find(u => u.email.toLowerCase() === accountEmail.toLowerCase());

    if (!foundUser) {
      // Create user if they don't exist
      foundUser = {
        uid: `usr_gg_${Math.random().toString(36).substr(2, 9)}`,
        fullName: accountName,
        email: accountEmail,
        phone: '+91 99999 88888',
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        password: 'GoogleSecretPassword123!', // secure dummy for Google
        photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'
      };
      users.push(foundUser);
      localStorage.setItem('napike_users', JSON.stringify(users));
    }

    // Sync with Supabase
    if (supabaseStatus === 'connected') {
      await dbSaveUser(foundUser);
    }

    const { password: _, ...safeUser } = foundUser;
    setUser(safeUser);
    localStorage.setItem('napike_current_user', JSON.stringify(safeUser));
    
    setGoogleStep('success');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setIsGooglePopupOpen(false);
    showToast(`Logged in successfully via Google as ${safeUser.fullName}!`, 'success');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        toasts,
        supabaseStatus,
        showToast,
        dismissToast,
        login,
        signUp,
        logout,
        sendPasswordReset,
        resetPassword,
        updateProfile,
        changePassword,
        triggerGoogleSignIn
      }}
    >
      {children}

      {/* GLOBAL TOAST OVERLAY */}
      <div id="global-toasts-container" className="fixed bottom-6 right-6 z-100 flex flex-col gap-3 max-w-md w-full pointer-events-none px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              id={`toast-message-${toast.id}`}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ type: 'spring', damping: 20, stiffness: 250 }}
              className={`p-4 rounded-2xl shadow-xl flex items-start gap-3 border pointer-events-auto backdrop-blur-md text-left ${
                toast.type === 'success'
                  ? 'bg-white/95 border-emerald-500/10 text-brand-charcoal shadow-emerald-500/5'
                  : toast.type === 'error'
                  ? 'bg-white/95 border-red-500/10 text-brand-charcoal shadow-red-500/5'
                  : 'bg-white/95 border-brand-gold/10 text-brand-charcoal shadow-brand-gold/5'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {toast.type === 'success' && <CheckCircle size={18} className="text-emerald-600" />}
                {toast.type === 'error' && <ShieldAlert size={18} className="text-red-600" />}
                {toast.type === 'info' && <Info size={18} className="text-brand-gold-dark" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-brand-charcoal/90 leading-normal">
                  {toast.message}
                </p>
              </div>
              <button
                id={`dismiss-toast-${toast.id}`}
                onClick={() => dismissToast(toast.id)}
                className="shrink-0 text-brand-charcoal/40 hover:text-brand-charcoal p-0.5 rounded-full hover:bg-brand-beige/50 transition-colors"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* GOOGLE SIGN IN POPUP (SIMULATOR) */}
      <AnimatePresence>
        {isGooglePopupOpen && (
          <motion.div
            id="google-popup-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-charcoal/40 backdrop-blur-sm z-100 flex items-center justify-center p-4"
          >
            <motion.div
              id="google-popup-card"
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-brand-beige overflow-hidden text-center text-brand-charcoal flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-brand-beige">
                <div className="flex items-center gap-1.5">
                  {/* Google Custom colored dots */}
                  <div className="flex gap-1">
                    <span className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                    <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full" />
                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                    <span className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
                  </div>
                  <span className="text-xs font-medium text-brand-charcoal/60 font-sans tracking-wide">Sign in with Google</span>
                </div>
                <button
                  id="close-google-popup"
                  onClick={() => setIsGooglePopupOpen(false)}
                  className="text-brand-charcoal/50 hover:text-brand-charcoal hover:bg-brand-beige p-1 rounded-full transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {googleStep === 'chooser' && (
                <div className="py-6 space-y-6 text-left">
                  <div className="text-center">
                    <h3 className="serif-display text-lg font-normal text-brand-charcoal">Choose an Account</h3>
                    <p className="text-[11px] text-brand-brown mt-1">to continue to <strong>Napike India</strong></p>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {/* Primary Personal Email from metadata! */}
                    <button
                      id="google-account-metadata-primary"
                      onClick={() => handleGoogleAccountSelect('hardikakubade2004@gmail.com', 'Hardika Kubade')}
                      className="w-full p-3 bg-brand-cream hover:bg-brand-beige rounded-2xl border border-brand-beige flex items-center gap-3 transition-colors text-left cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-full bg-brand-sage text-white font-semibold flex items-center justify-center text-sm shadow-sm group-hover:scale-105 transition-transform">
                        HK
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-brand-charcoal truncate">Hardika Kubade</p>
                        <p className="text-[10px] text-brand-brown-light truncate">hardikakubade2004@gmail.com</p>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-brand-gold animate-pulse shrink-0" title="Active demo email" />
                    </button>

                    {/* Guest Google account example */}
                    <button
                      id="google-account-demo-alt"
                      onClick={() => handleGoogleAccountSelect('design.weaver@napike.com', 'Artisan Guild')}
                      className="w-full p-3 bg-white hover:bg-brand-beige rounded-2xl border border-brand-beige flex items-center gap-3 transition-colors text-left cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-full bg-brand-brown-light text-white font-semibold flex items-center justify-center text-sm shadow-sm group-hover:scale-105 transition-transform">
                        AG
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-brand-charcoal truncate">Artisan Guild</p>
                        <p className="text-[10px] text-brand-brown-light truncate">design.weaver@napike.com</p>
                      </div>
                    </button>
                  </div>

                  <div className="text-[10px] text-brand-brown-light leading-relaxed text-center border-t border-brand-beige/50 pt-4">
                    To continue, Google will share your name, email address, language preference, and profile picture with Napike. See their Privacy Policy.
                  </div>
                </div>
              )}

              {googleStep === 'loading' && (
                <div className="py-12 flex flex-col items-center justify-center space-y-4">
                  <div className="relative flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-brand-sage-light border-t-brand-sage rounded-full animate-spin" />
                    <Sparkles size={16} className="text-brand-gold absolute animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-brand-charcoal">Exchanging secure credentials...</p>
                    <p className="text-[10px] text-brand-brown-light">Connecting to secure Google API client</p>
                  </div>
                </div>
              )}

              {googleStep === 'success' && (
                <div className="py-12 flex flex-col items-center justify-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-md">
                    <CheckCircle size={24} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-brand-charcoal">Authentication Complete</p>
                    <p className="text-[10px] text-brand-brown-light">Syncing your Napike organic favorites</p>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthContext.Provider>
  );
}
