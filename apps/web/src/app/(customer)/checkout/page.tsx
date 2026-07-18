'use client';

import { useCartStore } from '@/lib/store/cartStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ShieldCheck, CreditCard } from 'lucide-react';
import { apiPost } from '@/lib/api/client';
import { useState } from 'react';

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const router = useRouter();
  
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 0 ? (subtotal >= 299 ? 0 : 39) : 0;
  const total = subtotal + deliveryFee;

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      await apiPost('/orders', { 
        items, 
        paymentMethod 
      });
      toast.success('Payment Successful! Order placed.', { duration: 4000 });
      clearCart();
      setTimeout(() => {
        router.push('/orders');
      }, 1000);
    } catch (error: any) {
      toast.error('Failed to place order. ' + (error.response?.data?.message || ''));
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">Your cart is empty</h2>
          <button 
            onClick={() => router.push('/menu')}
            className="px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        
        {/* Payment Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold mb-2">Secure Checkout</h1>
            <p className="text-slate-500">Complete your order securely.</p>
          </div>
          
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="text-orange-500 w-6 h-6" />
              <h2 className="text-xl font-bold">Payment Method</h2>
            </div>
            
            <div className="space-y-4">
              <label 
                className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'upi' ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                onClick={() => setPaymentMethod('upi')}
              >
                <input type="radio" name="payment" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="w-4 h-4 text-orange-500" />
                <span className={`font-${paymentMethod === 'upi' ? 'semibold' : 'medium'}`}>UPI / Google Pay</span>
              </label>
              
              <label 
                className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                onClick={() => setPaymentMethod('card')}
              >
                <input type="radio" name="payment" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="w-4 h-4 text-slate-500" />
                <span className={`font-${paymentMethod === 'card' ? 'semibold' : 'medium'}`}>Credit / Debit Card</span>
              </label>
              
              <label 
                className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                onClick={() => setPaymentMethod('cod')}
              >
                <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-4 h-4 text-slate-500" />
                <span className={`font-${paymentMethod === 'cod' ? 'semibold' : 'medium'}`}>Cash on Delivery</span>
              </label>
            </div>
            
            <button 
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full mt-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 flex justify-center items-center gap-2 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : `Pay ₹${total.toLocaleString()}`}
            </button>
            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              100% Secure Payment
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
              {items.map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                    {item.thumbnail && (
                      <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 flex justify-between">
                    <div>
                      <p className="font-bold text-sm">{item.name}</p>
                      <p className="text-slate-500 text-xs mt-1">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-sm">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-3 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Delivery Fee</span>
                {deliveryFee === 0 ? (
                  <span className="text-green-500 font-medium">Free</span>
                ) : (
                  <span>₹{deliveryFee}</span>
                )}
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-slate-200 dark:border-slate-800">
                <span>Total</span>
                <span className="text-orange-500">₹{total.toLocaleString()}</span>
              </div>
            </div>
            
          </div>
        </div>
        
      </div>
    </div>
  );
}
