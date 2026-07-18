'use client';

import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, Eye, EyeOff, ArrowRight, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import { isFirebaseConfigured } from '@/lib/firebase/config';
import toast from 'react-hot-toast';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number').optional().or(z.literal('')),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must include an uppercase letter')
    .regex(/[a-z]/, 'Must include a lowercase letter')
    .regex(/[0-9]/, 'Must include a number'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(v => v, 'You must accept the terms'),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

const passwordChecks = [
  { label: '8+ characters', test: (p: string) => p.length >= 8 },
  { label: 'Uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { label: 'Number', test: (p: string) => /[0-9]/.test(p) },
];

// Inner component that safely uses useSearchParams (must be inside Suspense)
function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const { register: registerUser, loginWithGoogle, isLoading } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/menu';

  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const watchPassword = watch('password', '');

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser(data.name, data.email, data.password, data.phone);
      toast.success('Account created! Welcome to Hungry Birds 🐦');
      router.push(redirect);
    } catch (err: any) {
      toast.error(err.message || err.response?.data?.message || 'Registration failed');
    }
  };

  const firebaseReady = isFirebaseConfigured();

  const handleGoogle = async () => {
    if (!firebaseReady) {
      toast.error('Google login requires Firebase setup. Use email & password instead.', {
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
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-red-700 to-red-900 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {['🍛', '🥗', '🍜', '🥘', '🍱', '🧆', '🥙', '🍲'].map((e, i) => (
            <div key={i} className="absolute text-5xl" style={{ top: `${10 + (i * 11)}%`, left: `${5 + (i % 3) * 30}%`, transform: `rotate(${i * 15}deg)` }}>
              {e}
            </div>
          ))}
        </div>
        <div className="relative text-center text-white space-y-6 p-12 max-w-md">
          <motion.div
            className="relative w-36 h-36 mx-auto drop-shadow-2xl"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Image src="/logo.png" alt="Hungry Birds" fill className="object-contain" />
          </motion.div>
          <h2 className="text-4xl font-bold">Join Hungry Birds</h2>
          <p className="text-red-100 text-lg leading-relaxed">
            Get your first order with <strong>20% off</strong> using code <strong className="bg-white/20 px-2 py-0.5 rounded">WELCOME20</strong>
          </p>
          <div className="space-y-3 text-left">
            {['Personalised AI meal recommendations', 'Skip or pause anytime', 'Live delivery tracking', '3 months = 10% savings'].map(f => (
              <div key={f} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-red-200 flex-shrink-0" />
                <span className="text-red-100 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-slate-950 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md space-y-6 py-8"
        >
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
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Create Account</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Start your food journey today</p>
          </div>

          <div className="relative group/google">
            <button
              onClick={handleGoogle}
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border transition-all font-medium
                ${firebaseReady
                  ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-70'
                }`}
              id="google-register-btn"
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
                ⚙️ Firebase not configured. Add your Firebase keys to <code className="bg-white/10 px-1 rounded">.env.local</code> to enable Google Sign-In.
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
              </div>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-700" /></div>
            <div className="relative flex justify-center text-sm"><span className="px-4 bg-white dark:bg-slate-950 text-slate-400">or register with email</span></div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Name */}
            <div>
              <label htmlFor="reg-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input id="reg-name" type="text" autoComplete="name" className={`input-field pl-11 ${errors.name ? 'border-red-500' : ''}`} placeholder="Arjun Patel" {...register('name')} />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input id="reg-email" type="email" autoComplete="email" className={`input-field pl-11 ${errors.email ? 'border-red-500' : ''}`} placeholder="you@example.com" {...register('email')} />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="reg-phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Mobile Number <span className="text-slate-400 font-normal">(optional)</span></label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input id="reg-phone" type="tel" autoComplete="tel" className={`input-field pl-11 ${errors.phone ? 'border-red-500' : ''}`} placeholder="9876543210" {...register('phone')} />
              </div>
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input id="reg-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" className={`input-field pl-11 pr-11 ${errors.password ? 'border-red-500' : ''}`} placeholder="••••••••" {...register('password')} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password strength */}
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                {passwordChecks.map(check => (
                  <div key={check.label} className={`flex items-center gap-1.5 text-xs ${check.test(watchPassword) ? 'text-green-500' : 'text-slate-400'}`}>
                    <CheckCircle className={`w-3 h-3 ${check.test(watchPassword) ? 'opacity-100' : 'opacity-30'}`} />
                    {check.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="reg-confirm" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input id="reg-confirm" type="password" autoComplete="new-password" className={`input-field pl-11 ${errors.confirmPassword ? 'border-red-500' : ''}`} placeholder="••••••••" {...register('confirmPassword')} />
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input id="reg-terms" type="checkbox" className="mt-0.5 rounded border-slate-300 text-orange-500 focus:ring-orange-500" {...register('acceptTerms')} />
              <label htmlFor="reg-terms" className="text-sm text-slate-600 dark:text-slate-400">
                I agree to the <Link href="/terms" className="text-orange-500 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-orange-500 hover:underline">Privacy Policy</Link>
              </label>
            </div>
            {errors.acceptTerms && <p className="text-xs text-red-500">{errors.acceptTerms.message}</p>}

            <button type="submit" disabled={isLoading} className="btn-primary w-full py-3.5 text-base" id="register-submit-btn">
              {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Creating account...</> : <>Create Account <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="text-red-600 hover:text-red-700 font-semibold">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// Outer page: wraps the form in Suspense so useSearchParams() is safe during SSR/prerendering
export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-8 h-8 rounded-full border-4 border-red-500 border-t-transparent animate-spin" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
