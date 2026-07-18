'use client';

import { motion } from 'framer-motion';
import { UserPlus, Utensils, CreditCard, MapPin, Star, RefreshCw } from 'lucide-react';

const steps = [
  { icon: UserPlus,  num: '01', title: 'Register',           desc: 'Create your account in 30 seconds. Tell us your dietary preferences.',   color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20' },
  { icon: Utensils,  num: '02', title: 'Choose Your Plan',   desc: 'Pick Breakfast, Lunch, or Dinner. Select 15, 30, or 90 day duration.',    color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  { icon: CreditCard,num: '03', title: 'Pay Securely',       desc: 'Pay via Razorpay (UPI/card) or Stripe. 100% secure checkout.',           color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20' },
  { icon: MapPin,    num: '04', title: 'Track Live',          desc: 'Watch your meal travel from kitchen to your door on the live map.',       color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  { icon: Star,      num: '05', title: 'Rate Your Meal',      desc: 'Your feedback trains our AI to make the next meal even more perfect.',   color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  { icon: RefreshCw, num: '06', title: 'AI Learns & Adapts', desc: 'Our recommendation engine improves with every order you make.',          color: 'text-pink-400',   bg: 'bg-pink-500/10',   border: 'border-pink-500/20' },
];

export default function HowItWorksSection() {
  return (
    <section className="py-24 bg-white dark:bg-slate-950">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto">
            From signup to your first delivery in under 5 minutes.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-6 rounded-2xl border ${step.border} ${step.bg} backdrop-blur-sm group hover:scale-[1.02] transition-all duration-300`}
            >
              <div className="absolute top-4 right-4 text-5xl font-black text-slate-100 dark:text-slate-800 select-none">
                {step.num}
              </div>
              <div className={`w-12 h-12 rounded-xl ${step.bg} border ${step.border} flex items-center justify-center mb-4`}>
                <step.icon className={`w-6 h-6 ${step.color}`} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
