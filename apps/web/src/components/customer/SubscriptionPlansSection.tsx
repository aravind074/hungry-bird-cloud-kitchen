'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle, Star, Zap } from 'lucide-react';

const plans = [
  {
    name: 'Breakfast',
    emoji: '🌅',
    tagline: 'Start your day right',
    color: 'from-amber-500 to-orange-600',
    glow: 'shadow-amber-500/25',
    prices: { 15: 1799, 30: 2999, 90: 7499 },
    features: ['Fresh idli, dosa, paratha & more', 'Healthy juices & smoothies', 'Delivered 7:30 - 9:00 AM', 'Nutritionist-approved recipes'],
  },
  {
    name: 'Lunch',
    emoji: '☀️',
    tagline: 'Fuel your afternoon',
    color: 'from-orange-500 to-red-600',
    glow: 'shadow-orange-500/25',
    prices: { 15: 2699, 30: 4499, 90: 11999 },
    features: ['Full thali or bowl meals', 'Rice, roti & sabzi combos', 'Delivered 12:00 - 1:30 PM', 'Diet-friendly options'],
    popular: true,
  },
  {
    name: 'Dinner',
    emoji: '🌙',
    tagline: 'End the day deliciously',
    color: 'from-purple-500 to-pink-600',
    glow: 'shadow-purple-500/25',
    prices: { 15: 2699, 30: 4499, 90: 11999 },
    features: ['Hearty dinner combos', 'Special weekend menus', 'Delivered 7:00 - 9:00 PM', 'Low-calorie options available'],
  },
  {
    name: 'Full Day',
    emoji: '🌈',
    tagline: 'All three meals, zero effort',
    color: 'from-green-500 to-teal-600',
    glow: 'shadow-green-500/25',
    prices: { 15: 5999, 30: 9999, 90: 24999 },
    features: ['All B+L+D included', 'Maximum savings (save 15%)', 'Priority delivery slots', 'Dedicated meal planner'],
    badge: 'Best Value',
  },
];

const DURATIONS = [15, 30, 90] as const;
const DURATION_LABELS: Record<number, string> = { 15: '15 Days', 30: '1 Month', 90: '3 Months' };
const DURATION_DISCOUNT: Record<number, string> = { 15: '', 30: 'Save 5%', 90: 'Save 10%' };

export default function SubscriptionPlansSection() {
  return (
    <section className="py-24 bg-slate-950" id="subscription-plans">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-sm font-medium mb-4">
            <Star className="w-4 h-4" /> Subscription Plans
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Never Think About
            <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent"> Food Again</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Choose your meal type and duration. Our AI personalises every delivery to your taste, diet, and mood.
          </p>
        </motion.div>

        {/* Plan Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-3xl bg-slate-900 border ${plan.popular ? 'border-orange-500' : 'border-slate-800'} overflow-hidden hover:border-opacity-70 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:${plan.glow}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-red-600" />
              )}
              {plan.badge && (
                <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-green-500/20 border border-green-500/40 text-green-400 text-xs font-bold">
                  {plan.badge}
                </div>
              )}
              {plan.popular && (
                <div className="absolute top-4 left-4 flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-bold">
                  <Zap className="w-3 h-3" /> Most Popular
                </div>
              )}

              <div className="p-6">
                <div className="text-4xl mb-3">{plan.emoji}</div>
                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-slate-400 text-sm mb-5">{plan.tagline}</p>

                {/* Duration pricing */}
                <div className="space-y-2 mb-5">
                  {DURATIONS.map(d => (
                    <div key={d} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60">
                      <div>
                        <span className="text-white text-sm font-medium">{DURATION_LABELS[d]}</span>
                        {DURATION_DISCOUNT[d] && (
                          <span className="ml-2 text-xs text-green-400 font-medium">{DURATION_DISCOUNT[d]}</span>
                        )}
                      </div>
                      <span className="text-orange-400 font-bold">₹{(plan.prices as any)[d].toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-slate-300 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/subscription"
                  className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all duration-200 bg-gradient-to-r ${plan.color} text-white hover:opacity-90 hover:shadow-lg`}
                  id={`subscribe-${plan.name.toLowerCase().replace(' ', '-')}`}
                >
                  Subscribe Now
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
