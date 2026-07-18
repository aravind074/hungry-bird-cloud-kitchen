'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, Moon, Sun, Bell, LogOut, ChevronDown } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuthStore } from '@/lib/store/authStore';
import { useCartStore } from '@/lib/store/cartStore';
import toast from 'react-hot-toast';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/subscription', label: 'Subscribe' },
  { href: '/orders', label: 'My Orders' },
];

export default function AppNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { itemCount, toggleCart } = useCartStore();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    setIsProfileOpen(false);
  };

  const roleLinks: Record<string, { href: string; label: string }[]> = {
    admin: [{ href: '/admin', label: '⚙️ Admin Dashboard' }],
    kitchen_staff: [{ href: '/kitchen', label: '🍳 Kitchen Dashboard' }],
    delivery_partner: [{ href: '/delivery', label: '🛵 Delivery Dashboard' }],
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <nav className="section-container flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 font-bold group" id="navbar-logo">
            <div className="relative w-12 h-12 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Hungry Birds"
                fill
                className="object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-200"
                priority
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[15px] font-extrabold tracking-wide text-slate-900 dark:text-white">
                HUNGRY <span className="text-red-600">BIRDS</span>
              </span>
              <span className="text-[9px] tracking-[0.15em] uppercase text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                Feel the food with love
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  pathname === href
                    ? 'text-red-600 bg-red-50 dark:bg-red-500/10'
                    : 'text-slate-600 dark:text-slate-300 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                id={`nav-${label.toLowerCase().replace(' ', '-')}`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-1.5">
            {/* Theme toggle */}
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
              id="theme-toggle"
            >
              {resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsNotificationsOpen(!isNotificationsOpen);
                      setIsProfileOpen(false);
                    }}
                    className="relative w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    id="notifications-btn"
                  >
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                  </button>

                  <AnimatePresence>
                    {isNotificationsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl py-2 z-50"
                      >
                        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                          <p className="font-semibold text-slate-900 dark:text-white text-sm">Notifications</p>
                          <span className="text-[10px] text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400 px-2 py-0.5 rounded-full font-medium">1 New</span>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto">
                          <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors border-l-2 border-red-500">
                            <p className="text-sm font-medium text-slate-900 dark:text-white mb-0.5">Welcome to Hungry Birds! 🐦</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Use code WELCOME20 to get 20% off on your first order.</p>
                            <p className="text-[10px] text-slate-400 mt-1.5">Just now</p>
                          </div>
                          <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors">
                            <p className="text-sm font-medium text-slate-900 dark:text-white mb-0.5">Order Delivered 📦</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Your previous order has been delivered successfully.</p>
                            <p className="text-[10px] text-slate-400 mt-1.5">Yesterday</p>
                          </div>
                        </div>
                        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-700 text-center mt-1">
                          <button onClick={() => setIsNotificationsOpen(false)} className="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 transition-colors">
                            Mark all as read
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Cart */}
                <button
                  onClick={toggleCart}
                  className="relative w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  id="cart-btn"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {itemCount > 0 && (
                    <motion.span
                      key={itemCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold"
                    >
                      {itemCount > 9 ? '9+' : itemCount}
                    </motion.span>
                  )}
                </button>

                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsProfileOpen(!isProfileOpen);
                      setIsNotificationsOpen(false);
                    }}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    id="profile-btn"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white text-sm font-bold shadow-md">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl py-2 z-50"
                      >
                        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                          <p className="font-semibold text-slate-900 dark:text-white text-sm">{user?.name}</p>
                          <p className="text-slate-400 text-xs truncate">{user?.email}</p>
                        </div>
                        {[
                          { href: '/profile', label: '👤 My Profile' },
                          { href: '/orders', label: '📦 My Orders' },
                          { href: '/wishlist', label: '❤️ Wishlist' },
                          ...(user?.role ? (roleLinks[user.role] || []) : []),
                        ].map(({ href, label }) => (
                          <Link
                            key={href}
                            href={href}
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                          >
                            {label}
                          </Link>
                        ))}
                        <div className="border-t border-slate-100 dark:border-slate-700 mt-2 pt-2">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            id="logout-btn"
                          >
                            <LogOut className="w-4 h-4" /> Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="btn-ghost text-sm" id="login-btn">Login</Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/35 active:scale-[0.98] text-sm"
                  id="register-btn"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Open menu"
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700"
            >
              <div className="section-container py-4 space-y-1">
                {navLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      pathname === href
                        ? 'text-red-600 bg-red-50 dark:bg-red-500/10'
                        : 'text-slate-600 dark:text-slate-300 hover:text-red-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {label}
                  </Link>
                ))}
                {!isAuthenticated && (
                  <div className="flex gap-2 pt-2">
                    <Link href="/login" className="flex-1 text-center px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Login</Link>
                    <Link href="/register" className="flex-1 text-center px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors">Get Started</Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Overlay */}
      {(isProfileOpen || isNotificationsOpen) && (
        <div className="fixed inset-0 z-40" onClick={() => { setIsProfileOpen(false); setIsNotificationsOpen(false); }} />
      )}
    </>
  );
}
