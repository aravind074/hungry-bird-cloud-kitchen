'use client';

import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import { isFirebaseConfigured } from '@/lib/firebase/config';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

// Inner component that safely uses useSearchParams (must be inside Suspense)
function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, loginWithGoogle, isLoading } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/menu';

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
      toast.success('Welcome back! 🎉');
      router.push(redirect);
    } catch (err: any) {
      toast.error(err.message || err.response?.data?.message || 'Invalid credentials');
    }
  };

  const firebaseReady = isFirebaseConfigured();

  const handleGoogle = async () => {
    if (!firebaseReady) {
      toast.error('Google login requires Firebase setup. Please use email & password.', {
        duration: 4000,
        icon: '⚙️',
      });
      return;
    }
    try {
      await loginWithGoogle();
      toast.success('Welcome to Hungry Birds! 🐦');
      router.push(redirect);
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/unauthorized-domain') {
        toast.error('This domain is not authorised in Firebase. Add "localhost" in Firebase Console → Authentication → Settings → Authorized domains.', { duration: 8000 });
      } else if (code === 'auth/popup-blocked') {
        toast.error('Popup was blocked by your browser. Please allow popups for localhost and try again.', { duration: 6000 });
      } else if (code === 'auth/popup-closed-by-user') {
        toast.error('Sign-in popup was closed. Please try again.');
      } else if (code === 'auth/operation-not-allowed') {
        toast.error('Google sign-in is not enabled. Enable it in Firebase Console → Authentication → Sign-in method.', { duration: 8000 });
      } else {
        toast.error(`Google login failed: ${err?.message || code || 'Unknown error'}`, { duration: 6000 });
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-red-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-red-600/15 rounded-full blur-3xl" />
        </div>
        <div className="relative text-center text-white space-y-6 p-12 max-w-md">
          <motion.div
            className="relative w-40 h-40 mx-auto drop-shadow-2xl"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Image src="/logo.png" alt="Hungry Birds" fill className="object-contain" />
          </motion.div>
          <h2 className="text-4xl font-bold">Welcome Back!</h2>
          <p className="text-slate-300 text-lg leading-relaxed">
            Your daily meals are waiting. Log in to track orders, manage subscriptions, and discover personalised recommendations.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {['🍛 AI Recommendations', '📦 Live Tracking', '⭐ Loyalty Points', '🎁 Exclusive Offers'].map(f => (
              <span key={f} className="px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm">{f}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-slate-950">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 justify-center group">
            <div className="relative w-12 h-12">
              <Image src="/logo.png" alt="Hungry Birds" fill className="object-contain group-hover:scale-105 transition-transform" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-extrabold text-xl text-slate-900 dark:text-white tracking-wide">HUNGRY <span className="text-red-600">BIRDS</span></span>
              <span className="text-[10px] text-slate-400 tracking-widest uppercase">Feel the food with love</span>
            </div>
          </Link>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Sign In</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Welcome back — your meals miss you!</p>
          </div>

          {/* Google Login */}
          <div className="relative group/google">
            <button
              onClick={handleGoogle}
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border transition-all duration-200 shadow-sm font-medium
                ${firebaseReady
                  ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-70'
                }`}
              id="google-login-btn"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill={firebaseReady ? '#4285F4' : '#9CA3AF'} d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill={firebaseReady ? '#34A853' : '#9CA3AF'} d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill={firebaseReady ? '#FBBC05' : '#9CA3AF'} d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill={firebaseReady ? '#EA4335' : '#9CA3AF'} d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {firebaseReady ? 'Continue with Google' : 'Google login (not configured)'}
              {!firebaseReady && <AlertCircle className="w-4 h-4 ml-auto text-amber-500" />}
            </button>
            {!firebaseReady && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/google:block z-10 w-72 p-3 bg-slate-900 text-white text-xs rounded-xl shadow-xl text-center leading-relaxed">
                ⚙️ Firebase not configured. Add your real Firebase keys to <code className="bg-white/10 px-1 rounded">.env.local</code> to enable Google Sign-In.
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
              </div>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-700" /></div>
            <div className="relative flex justify-center text-sm"><span className="px-4 bg-white dark:bg-slate-950 text-slate-400">or continue with email</span></div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  className={`input-field pl-11 ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''}`}
                  placeholder="you@example.com"
                  {...register('email')}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                <Link href="/forgot-password" className="text-sm text-orange-500 hover:text-orange-600">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={`input-field pl-11 pr-11 ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="••••••••"
                  {...register('password')}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3.5 text-base"
              id="login-submit-btn"
            >
              {isLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Signing in...</>
              ) : (
                <>Sign In <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link href="/register" className="text-red-600 hover:text-red-700 font-semibold">Create one free</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// Outer page: wraps the form in Suspense so useSearchParams() is safe during SSR/prerendering
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-8 h-8 rounded-full border-4 border-red-500 border-t-transparent animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
