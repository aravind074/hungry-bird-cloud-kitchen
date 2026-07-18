'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';
import { useAuthStore } from '@/lib/store/authStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function CartDrawer() {
  const router = useRouter();
  const { items, isOpen, setCartOpen, updateQuantity, removeItem, clearCart, couponCode, couponDiscount } = useCartStore();
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const { isAuthenticated } = useAuthStore();
  const [couponInput, setCouponInput] = useState('');

  const deliveryFee = subtotal > 0 ? (subtotal >= 299 ? 0 : 39) : 0;
  const discount = couponDiscount > 0 ? Math.round(subtotal * couponDiscount / 100) : 0;
  const total = subtotal + deliveryFee - discount;

  const applyCoupon = () => {
    if (couponInput.toUpperCase() === 'HUNGRY10') {
      useCartStore.getState().setCoupon('HUNGRY10', 10);
      toast.success('Coupon applied! 10% off 🎉');
      setCouponInput('');
    } else if (couponInput.toUpperCase() === 'WELCOME20') {
      useCartStore.getState().setCoupon('WELCOME20', 20);
      toast.success('Welcome coupon applied! 20% off 🎉');
      setCouponInput('');
    } else {
      toast.error('Invalid coupon code');
    }
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-slate-900 z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-500/15 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white text-lg">Your Cart</h2>
                  <p className="text-slate-400 text-xs">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button
                    onClick={() => { clearCart(); toast.success('Cart cleared'); }}
                    className="text-xs text-red-400 hover:text-red-500 font-medium px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={() => setCartOpen(false)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  id="cart-close-btn"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Empty state */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="w-24 h-24 rounded-full bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center">
                  <ShoppingBag className="w-12 h-12 text-orange-300" />
                </div>
                <div>
                  <p className="text-slate-700 dark:text-slate-200 font-bold text-lg">Your cart is empty</p>
                  <p className="text-slate-400 text-sm mt-1">Add delicious items from our menu to get started</p>
                </div>
                <Link
                  href="/menu"
                  onClick={() => setCartOpen(false)}
                  className="mt-2 inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors text-sm"
                >
                  Browse Menu <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <>
                {/* Items list */}
                <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
                  <AnimatePresence initial={false}>
                    {items.map(item => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 60, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700"
                      >
                        {/* Thumbnail */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-orange-50 dark:bg-slate-700 flex-shrink-0 flex items-center justify-center">
                          {item.thumbnail && !item.thumbnail.startsWith('http') ? (
                            <span className="text-3xl">{item.thumbnail}</span>
                          ) : item.thumbnail ? (
                            <img
                              src={item.thumbnail}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={e => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <ShoppingBag className="w-6 h-6 text-slate-300" />
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 dark:text-white text-sm line-clamp-1">{item.name}</p>
                          <p className="text-orange-500 font-bold text-sm mt-0.5">₹{item.price}</p>

                          {/* Qty controls */}
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                              className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-500 hover:border-orange-400 hover:text-orange-500 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-sm font-bold text-slate-900 dark:text-white">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                              className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-500 hover:border-orange-400 hover:text-orange-500 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <span className="ml-auto text-sm font-bold text-slate-700 dark:text-slate-200">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => { removeItem(item.menuItemId); toast.success('Item removed'); }}
                          className="self-start p-1.5 rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Coupon */}
                <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800">
                  {couponCode ? (
                    <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-green-500" />
                        <span className="text-green-700 dark:text-green-400 text-sm font-semibold">{couponCode} applied!</span>
                        <span className="text-green-600 dark:text-green-400 text-xs">({couponDiscount}% off)</span>
                      </div>
                      <button
                        onClick={() => { useCartStore.getState().removeCoupon(); toast.success('Coupon removed'); }}
                        className="text-xs text-red-400 hover:text-red-500 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Enter coupon code"
                          value={couponInput}
                          onChange={e => setCouponInput(e.target.value.toUpperCase())}
                          onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400"
                        />
                      </div>
                      <button
                        onClick={applyCoupon}
                        className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-slate-400 mt-1.5 text-center">Try: <span className="font-mono font-semibold">HUNGRY10</span> or <span className="font-mono font-semibold">WELCOME20</span></p>
                </div>

                {/* Order summary + Checkout */}
                <div className="px-5 pt-3 pb-5 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm text-slate-500">
                      <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-500">
                      <span>Delivery</span>
                      {deliveryFee === 0
                        ? <span className="text-green-500 font-medium">FREE 🎉</span>
                        : <span className="text-slate-700 dark:text-slate-300 font-medium">₹{deliveryFee}</span>
                      }
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600">Coupon discount</span>
                        <span className="text-green-600 font-medium">-₹{discount.toLocaleString()}</span>
                      </div>
                    )}
                    {subtotal < 299 && subtotal > 0 && (
                      <p className="text-xs text-orange-500 text-center bg-orange-50 dark:bg-orange-500/10 rounded-lg py-1.5">
                        Add ₹{299 - subtotal} more for free delivery!
                      </p>
                    )}
                    <div className="flex justify-between font-bold text-base text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-700">
                      <span>Total</span>
                      <span className="text-orange-500">₹{total.toLocaleString()}</span>
                    </div>
                  </div>

                  {isAuthenticated ? (
                    <button
                      onClick={() => { setCartOpen(false); router.push('/checkout'); }}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 active:scale-[0.98] transition-all"
                      id="checkout-btn"
                    >
                      Proceed to Checkout
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        href="/login"
                        onClick={() => setCartOpen(false)}
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30"
                      >
                        Login to Checkout <ArrowRight className="w-5 h-5" />
                      </Link>
                      <p className="text-center text-xs text-slate-400">
                        New here?{' '}
                        <Link href="/register" onClick={() => setCartOpen(false)} className="text-orange-500 font-semibold hover:underline">
                          Create a free account
                        </Link>
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
