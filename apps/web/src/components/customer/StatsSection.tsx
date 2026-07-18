'use client';

import { motion } from 'framer-motion';
import CountUp from './CountUp';

const stats = [
  { value: 50000, suffix: '+', label: 'Happy Customers', emoji: '😊' },
  { value: 200, suffix: '+', label: 'Menu Items', emoji: '🍽️' },
  { value: 99, suffix: '%', label: 'On-time Delivery', emoji: '⚡' },
  { value: 4.9, suffix: '★', label: 'Average Rating', emoji: '⭐', decimals: 1 },
];

export default function StatsSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-orange-500 to-red-600">
      <div className="section-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center text-white"
            >
              <div className="text-3xl mb-2">{stat.emoji}</div>
              <div className="text-4xl md:text-5xl font-bold">
                <CountUp end={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
              </div>
              <div className="text-orange-100 mt-1 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
