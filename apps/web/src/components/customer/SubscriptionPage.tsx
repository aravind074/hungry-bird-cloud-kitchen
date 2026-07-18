'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  CheckCircle,
  Star,
  Zap,
  Clock,
  Shield,
  Truck,
  ChevronRight,
  ArrowRight,
  X,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import toast from 'react-hot-toast';

// ─── Data ────────────────────────────────────────────────────────────────────

const plans = [
  {
    id: 'breakfast',
    name: 'Breakfast',
    emoji: '🌅',
    tagline: 'Start your day right',
    gradient: 'from-amber-500 to-orange-600',
    glowColor: 'shadow-amber-500/30',
    borderActive: 'border-amber-500',
    bgActive: 'bg-amber-500/10',
    textActive: 'text-amber-400',
    prices: { 15: 1799, 30: 2999, 90: 7499 },
    features: [
      'Fresh idli, dosa, paratha & more',
      'Healthy juices & smoothies',
      'Delivered 7:30 – 9:00 AM',
      'Nutritionist-approved recipes',
      'Daily menu rotation',
    ],
  },
  {
    id: 'lunch',
    name: 'Lunch',
    emoji: '☀️',
    tagline: 'Fuel your afternoon',
    gradient: 'from-orange-500 to-red-600',
    glowColor: 'shadow-orange-500/30',
    borderActive: 'border-orange-500',
    bgActive: 'bg-orange-500/10',
    textActive: 'text-orange-400',
    popular: true,
    prices: { 15: 2699, 30: 4499, 90: 11999 },
    features: [
      'Full thali or bowl meals',
      'Rice, roti & sabzi combos',
      'Delivered 12:00 – 1:30 PM',
      'Diet-friendly options',
      'Weekly special menus',
    ],
  },
  {
    id: 'dinner',
    name: 'Dinner',
    emoji: '🌙',
    tagline: 'End the day deliciously',
    gradient: 'from-purple-500 to-pink-600',
    glowColor: 'shadow-purple-500/30',
    borderActive: 'border-purple-500',
    bgActive: 'bg-purple-500/10',
    textActive: 'text-purple-400',
    prices: { 15: 2699, 30: 4499, 90: 11999 },
    features: [
      'Hearty dinner combos',
      'Special weekend menus',
      'Delivered 7:00 – 9:00 PM',
      'Low-calorie options available',
      'Chef special of the night',
    ],
  },
  {
    id: 'fullday',
    name: 'Full Day',
    emoji: '🌈',
    tagline: 'All three meals, zero effort',
    gradient: 'from-green-500 to-teal-600',
    glowColor: 'shadow-green-500/30',
    borderActive: 'border-green-500',
    bgActive: 'bg-green-500/10',
    textActive: 'text-green-400',
    badge: 'Best Value',
    prices: { 15: 5999, 30: 9999, 90: 24999 },
    features: [
      'All Breakfast + Lunch + Dinner',
      'Maximum savings (save 15%)',
      'Priority delivery slots',
      'Dedicated meal planner',
      'Free nutritionist consultation',
    ],
  },
];

const DURATIONS = [15, 30, 90] as const;
type Duration = (typeof DURATIONS)[number];

const DURATION_LABELS: Record<Duration, string> = {
  15: '15 Days',
  30: '1 Month',
  90: '3 Months',
};

const DURATION_DISCOUNT: Record<Duration, string> = {
  15: '',
  30: 'Save 5%',
  90: 'Save 10%',
};

const PERKS = [
  { icon: Truck, label: 'Free Delivery', sub: 'On every order' },
  { icon: Shield, label: 'Cancel Anytime', sub: 'No lock-in' },
  { icon: Clock, label: 'On-time Guarantee', sub: 'Or your money back' },
  { icon: Star, label: 'AI-Personalised', sub: 'Meals tailored for you' },
];

const faqs = [
  {
    q: 'Can I pause my subscription?',
    a: 'Yes! You can pause your subscription for up to 7 days per month directly from your dashboard. No charges during the pause period.',
  },
  {
    q: 'What if I miss a delivery?',
    a: 'Missed deliveries are credited back as loyalty points automatically, which you can redeem on any future order.',
  },
  {
    q: 'Can I customise my daily menu?',
    a: 'Absolutely. Our AI learns your preferences over time. You can also set dietary restrictions, allergies, and cuisine preferences from your profile.',
  },
  {
    q: 'Is there a minimum commitment?',
    a: 'Our minimum plan is 15 days. After that you can renew, switch plans, or cancel — completely your choice.',
  },
  {
    q: 'How do I change my delivery address?',
    a: 'You can update your delivery address anytime before 10 PM for the next day\'s delivery, from your account settings.',
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function SubscriptionPage() {
  const { isAuthenticated } = useAuthStore();
  const [selectedPlan, setSelectedPlan] = useState<string>('lunch');
  const [selectedDuration, setSelectedDuration] = useState<Duration>(30);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const activePlan = plans.find((p) => p.id === selectedPlan)!;
  const price = activePlan.prices[selectedDuration];

  const handleSubscribe = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to subscribe 🔐');
      return;
    }
    toast.success(`Subscribing to ${activePlan.name} – ${DURATION_LABELS[selectedDuration]}! 🎉`);
    // TODO: navigate to checkout / call API
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ── Hero Banner ─────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800">
        {/* Glow blobs */}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-orange-600/8 rounded-full blur-3xl pointer-events-none" />

        <div className="section-container py-20 relative z-10 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-sm font-medium mb-6"
          >
            <Zap className="w-4 h-4" /> Flexible Meal Plans
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-extrabold mb-5 leading-tight"
          >
            Subscribe &amp; Save{' '}
            <span className="bg-gradient-to-r from-orange-400 via-red-400 to-rose-500 bg-clip-text text-transparent">
              Every Day
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg max-w-xl mx-auto"
          >
            Chef-crafted meals personalised by AI — pick your plan, choose your duration, and
            get fresh food at your door daily.
          </motion.p>

          {/* Perks row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6 mt-10"
          >
            {PERKS.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-9 h-9 rounded-xl bg-orange-500/15 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-orange-400" />
                </div>
                <div className="text-left">
                  <p className="text-white text-sm font-semibold">{label}</p>
                  <p className="text-slate-500 text-xs">{sub}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Main Configurator ───────────────────────────────────────────────── */}
      <div className="section-container py-20">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* Left: Plan + Duration selector */}
          <div className="lg:col-span-2 space-y-10">

            {/* Step 1 – Pick a Plan */}
            <div>
              <h2 className="text-2xl font-bold mb-2">
                <span className="text-orange-400 mr-2">01.</span> Choose Your Meal Plan
              </h2>
              <p className="text-slate-400 text-sm mb-6">Pick the meal(s) you want delivered daily.</p>

              <div className="grid sm:grid-cols-2 gap-4">
                {plans.map((plan, i) => {
                  const isActive = selectedPlan === plan.id;
                  return (
                    <motion.button
                      key={plan.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`relative text-left p-5 rounded-2xl border-2 transition-all duration-200 ${
                        isActive
                          ? `${plan.borderActive} ${plan.bgActive} shadow-xl ${plan.glowColor}`
                          : 'border-slate-700 bg-slate-900 hover:border-slate-600'
                      }`}
                      id={`plan-select-${plan.id}`}
                    >
                      {plan.popular && (
                        <span className="absolute -top-3 left-4 px-3 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs font-bold shadow">
                          🔥 Most Popular
                        </span>
                      )}
                      {plan.badge && (
                        <span className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-green-500/20 border border-green-500/40 text-green-400 text-xs font-bold">
                          {plan.badge}
                        </span>
                      )}
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">{plan.emoji}</span>
                        <div>
                          <p className="font-bold text-white text-lg">{plan.name}</p>
                          <p className="text-slate-400 text-xs">{plan.tagline}</p>
                        </div>
                        {isActive && (
                          <CheckCircle className={`w-5 h-5 ml-auto ${plan.textActive}`} />
                        )}
                      </div>
                      <ul className="space-y-1.5">
                        {plan.features.slice(0, 3).map((f) => (
                          <li key={f} className="flex items-center gap-2 text-slate-300 text-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-500 flex-shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Step 2 – Pick Duration */}
            <div>
              <h2 className="text-2xl font-bold mb-2">
                <span className="text-orange-400 mr-2">02.</span> Choose Duration
              </h2>
              <p className="text-slate-400 text-sm mb-6">Longer plans save you more money.</p>

              <div className="grid grid-cols-3 gap-4">
                {DURATIONS.map((d) => {
                  const isActive = selectedDuration === d;
                  const dPrice = activePlan.prices[d];
                  const discount = DURATION_DISCOUNT[d];
                  return (
                    <button
                      key={d}
                      onClick={() => setSelectedDuration(d)}
                      className={`relative p-5 rounded-2xl border-2 text-center transition-all duration-200 ${
                        isActive
                          ? 'border-orange-500 bg-orange-500/10 shadow-xl shadow-orange-500/20'
                          : 'border-slate-700 bg-slate-900 hover:border-slate-600'
                      }`}
                      id={`duration-${d}`}
                    >
                      {discount && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-green-500 text-white text-[10px] font-bold whitespace-nowrap">
                          {discount}
                        </span>
                      )}
                      <p className="text-white font-bold text-lg">{DURATION_LABELS[d]}</p>
                      <p className="text-orange-400 font-extrabold text-xl mt-1">
                        ₹{dPrice.toLocaleString()}
                      </p>
                      <p className="text-slate-500 text-xs mt-0.5">
                        ≈ ₹{Math.round(dPrice / d)}/day
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Features full list */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <h3 className="font-bold text-white mb-4">
                What&apos;s included in the{' '}
                <span className={`bg-gradient-to-r ${activePlan.gradient} bg-clip-text text-transparent`}>
                  {activePlan.name}
                </span>{' '}
                plan
              </h3>
              <ul className="grid sm:grid-cols-2 gap-3">
                {activePlan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
                <li className="flex items-center gap-2.5 text-slate-300 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  Pause or cancel anytime
                </li>
                <li className="flex items-center gap-2.5 text-slate-300 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  Real-time delivery tracking
                </li>
              </ul>
            </div>
          </div>

          {/* Right: Order summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <motion.div
                layout
                className="rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden shadow-2xl"
              >
                {/* Gradient top bar */}
                <div className={`h-1.5 bg-gradient-to-r ${activePlan.gradient}`} />

                <div className="p-6 space-y-5">
                  <div>
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">
                      Your Subscription
                    </p>
                    <h3 className="text-2xl font-extrabold text-white mt-1">
                      {activePlan.emoji} {activePlan.name}
                    </h3>
                    <p className="text-slate-400 text-sm mt-0.5">{DURATION_LABELS[selectedDuration]} plan</p>
                  </div>

                  <div className="border-t border-slate-800 pt-5 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Plan price</span>
                      <span className="text-white font-semibold">₹{price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Delivery charges</span>
                      <span className="text-green-400 font-semibold">FREE</span>
                    </div>
                    {selectedDuration === 90 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Discount (10%)</span>
                        <span className="text-green-400 font-semibold">
                          -₹{Math.round(price * 0.1).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {selectedDuration === 30 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Discount (5%)</span>
                        <span className="text-green-400 font-semibold">
                          -₹{Math.round(price * 0.05).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-800 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold text-lg">Total</span>
                      <span className="text-3xl font-extrabold text-orange-400">
                        ₹{price.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs mt-1 text-right">
                      Approx. ₹{Math.round(price / selectedDuration)}/day
                    </p>
                  </div>

                  {isAuthenticated ? (
                    <button
                      onClick={handleSubscribe}
                      className={`w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r ${activePlan.gradient} hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-lg flex items-center justify-center gap-2 text-base`}
                      id="subscribe-now-btn"
                    >
                      Subscribe Now
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <Link
                        href="/register"
                        className={`w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r ${activePlan.gradient} hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-lg flex items-center justify-center gap-2 text-base`}
                        id="subscribe-register-btn"
                      >
                        Get Started
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                      <p className="text-center text-slate-500 text-xs">
                        Already have an account?{' '}
                        <Link href="/login" className="text-orange-400 hover:underline">
                          Sign in
                        </Link>
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-slate-500 text-xs justify-center">
                    <Shield className="w-3.5 h-3.5" />
                    Secure payment · Cancel anytime
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Comparison Table ────────────────────────────────────────────────── */}
      <div className="border-t border-slate-800 bg-slate-900/50">
        <div className="section-container py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Compare All Plans
            </h2>
            <p className="text-slate-400">Find the perfect fit for your lifestyle.</p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="p-5 text-left text-slate-400 font-medium text-sm w-1/3">Feature</th>
                  {plans.map((p) => (
                    <th key={p.id} className={`p-5 text-center text-sm font-bold ${p.id === selectedPlan ? 'text-orange-400' : 'text-white'}`}>
                      {p.emoji} {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Meal slots', values: ['Breakfast', 'Lunch', 'Dinner', 'B + L + D'] },
                  { label: 'Delivery time', values: ['7:30–9 AM', '12–1:30 PM', '7–9 PM', 'All slots'] },
                  { label: 'AI personalisation', values: [true, true, true, true] },
                  { label: 'Cancel anytime', values: [true, true, true, true] },
                  { label: 'Priority support', values: [false, false, false, true] },
                  { label: 'Nutritionist consult', values: [false, false, false, true] },
                  { label: '15-day from', values: ['₹1,799', '₹2,699', '₹2,699', '₹5,999'] },
                ].map(({ label, values }) => (
                  <tr key={label} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
                    <td className="p-5 text-slate-400 text-sm">{label}</td>
                    {values.map((v, i) => (
                      <td key={i} className="p-5 text-center">
                        {typeof v === 'boolean' ? (
                          v ? (
                            <CheckCircle className="w-5 h-5 text-green-400 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-slate-700 mx-auto" />
                          )
                        ) : (
                          <span className={`text-sm font-medium ${i === plans.findIndex(p => p.id === selectedPlan) ? 'text-orange-400' : 'text-slate-300'}`}>{v}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
      <div className="section-container py-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400">Everything you need to know.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                layout
                className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                  id={`faq-${i}`}
                >
                  <span className="font-semibold text-white text-sm pr-4">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="px-5 pb-5 text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA Banner ──────────────────────────────────────────────────────── */}
      <div className="border-t border-slate-800">
        <div className="section-container py-20 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Ready to eat better?{' '}
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Start today.
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-lg mx-auto mb-8">
            Join 10,000+ happy subscribers who never worry about meals anymore.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded-2xl shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/40 active:scale-[0.98] transition-all duration-200 text-base"
            id="cta-scroll-top"
          >
            Choose Your Plan
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
