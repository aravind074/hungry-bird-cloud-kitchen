'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  { name: 'Priya Sharma', role: 'Software Engineer', rating: 5, review: 'The AI actually learns what I like! After 2 weeks, every meal feels tailor-made. The lunch subscription has saved me so much time and money.', emoji: '👩‍💻', city: 'Bangalore' },
  { name: 'Rahul Verma', role: 'Startup Founder', rating: 5, review: 'Breakfast subscription is a game changer. Fresh food at 8 AM, zero effort. The quality is consistently incredible.', emoji: '👨‍💼', city: 'Mumbai' },
  { name: 'Ananya Krishnan', role: 'Fitness Coach', rating: 5, review: 'I told them I prefer high-protein, low-carb meals. Now every delivery is perfectly aligned with my fitness goals. Amazing!', emoji: '🏋️‍♀️', city: 'Hyderabad' },
  { name: 'Karthik Nair', role: 'Doctor', rating: 5, review: 'The live tracking is super cool. I know exactly when my dinner arrives so I can plan my shifts. No more cold food!', emoji: '👨‍⚕️', city: 'Chennai' },
  { name: 'Sneha Gupta', role: 'Teacher', rating: 4, review: 'Been subscribing for 3 months now. The renewal reminder was helpful and the 90-day discount is great value for money.', emoji: '👩‍🏫', city: 'Delhi' },
  { name: 'Arjun Patel', role: 'Architect', rating: 5, review: 'Tried the full day plan and I don\'t regret it one bit. Three fresh meals daily for less than eating out once. Pure value.', emoji: '👨‍🎨', city: 'Pune' },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Loved by <span className="gradient-text">50,000+</span> Customers
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg">Real stories from real food lovers.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <Quote className="w-8 h-8 text-orange-200 dark:text-orange-900 mb-3" />
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">"{t.review}"</p>
              <div className="flex mb-3">
                {[...Array(t.rating)].map((_, s) => (
                  <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-xl">
                  {t.emoji}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">{t.name}</p>
                  <p className="text-slate-400 text-xs">{t.role} · {t.city}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
