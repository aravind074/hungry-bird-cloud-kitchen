'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, Clock, Leaf, Zap, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';

const floatingFoods = [
  { src: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=150&q=80', top: '10%', left: '5%', delay: 0 },
  { src: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=150&q=80', top: '20%', right: '8%', delay: 0.5 },
  { src: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=150&q=80', bottom: '25%', left: '3%', delay: 1 },
  { src: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=150&q=80', top: '60%', right: '5%', delay: 1.5 },
  { src: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=150&q=80', bottom: '10%', right: '12%', delay: 0.8 },
  { src: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=150&q=80', top: '45%', left: '2%', delay: 1.2 },
];

export default function HeroSection() {
  const { isAuthenticated } = useAuthStore();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-red-500/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-700/5 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Floating food images */}
      {floatingFoods.map((food, i) => (
        <motion.div
          key={i}
          className="absolute select-none pointer-events-none hidden md:block w-20 h-20 rounded-full overflow-hidden shadow-2xl border-2 border-white/10"
          style={{ top: food.top, left: food.left, right: (food as any).right, bottom: (food as any).bottom }}
          animate={{ y: [0, -15, 0], rotate: [-3, 3, -3] }}
          transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: food.delay, ease: 'easeInOut' }}
        >
          <img src={food.src} alt="Food item" className="w-full h-full object-cover" />
        </motion.div>
      ))}

      <div className="relative z-10 section-container w-full py-20 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-screen py-20">

          {/* ── Left: Text Content ── */}
          <div className="space-y-8">
            {/* Badge */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-sm font-medium">
                <Zap className="w-4 h-4" />
                AI-Powered Personalized Meals
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-2"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                Food That
                <br />
                <span className="bg-gradient-to-r from-red-400 via-red-500 to-rose-500 bg-clip-text text-transparent">
                  Loves You
                </span>
              </h1>
              <p className="text-xl text-slate-400 max-w-lg leading-relaxed mt-4">
                Chef-crafted meals, personalised by AI, delivered to your door. Subscribe to daily
                <span className="text-red-400 font-medium"> Breakfast, Lunch, </span>
                or
                <span className="text-red-400 font-medium"> Dinner </span>
                — or all three.
              </p>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap gap-4"
            >
              {[
                { icon: Star, text: '4.9★ Rating', sub: '10K+ reviews' },
                { icon: Clock, text: '30 min', sub: 'Avg. delivery' },
                { icon: Leaf, text: '100% Fresh', sub: 'No preservatives' },
              ].map(({ icon: Icon, text, sub }) => (
                <div key={text} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                  <Icon className="w-5 h-5 text-red-400" />
                  <div>
                    <p className="text-white font-semibold text-sm">{text}</p>
                    <p className="text-slate-500 text-xs">{sub}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href={isAuthenticated ? '/subscription' : '/register'}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-red-600/30 hover:shadow-xl hover:shadow-red-600/40 active:scale-[0.98] group text-base"
                id="hero-subscribe-cta"
              >
                Start Your Subscription
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/menu"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white hover:bg-white/10 bg-white/5 font-semibold rounded-xl transition-all duration-200 text-base"
                id="hero-browse-menu"
              >
                Browse Menu
              </Link>
            </motion.div>

            {/* Perks */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-x-6 gap-y-2"
            >
              {['Free delivery on first order', 'Cancel anytime', 'Chef-curated daily menus'].map((perk) => (
                <div key={perk} className="flex items-center gap-1.5 text-slate-400 text-sm">
                  <CheckCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  {perk}
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right: Brand Logo Visual ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden lg:flex items-center justify-center"
          >
            <div className="relative w-[480px] h-[480px] flex items-center justify-center">
              {/* Glowing rings */}
              <div className="absolute inset-0 rounded-full border-2 border-red-500/20 animate-pulse" />
              <div className="absolute inset-8 rounded-full border border-red-500/15" />
              <div className="absolute inset-16 rounded-full bg-gradient-to-br from-red-600/10 to-red-900/10 backdrop-blur-sm border border-red-500/20" />

              {/* Central logo */}
              <motion.div
                className="relative z-10 flex flex-col items-center gap-4"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="relative w-56 h-56 drop-shadow-2xl">
                  <Image
                    src="/logo.png"
                    alt="Hungry Birds Mascot"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="text-center">
                  <div className="text-white font-extrabold text-2xl tracking-wide">
                    HUNGRY <span className="text-red-500">BIRDS</span>
                  </div>
                  <div className="text-slate-400 text-sm tracking-[0.2em] uppercase mt-0.5">
                    Feel the food with love
                  </div>
                </div>
              </motion.div>

              {/* Orbiting info cards */}
              {[
                { label: '🥗 Healthy', angle: -60, color: 'from-green-500/20 to-emerald-600/20', border: 'border-green-500/30' },
                { label: '⚡ 20 min', angle: 60, color: 'from-blue-500/20 to-cyan-600/20', border: 'border-blue-500/30' },
                { label: '🌟 AI Pick', angle: 180, color: 'from-red-500/20 to-pink-600/20', border: 'border-red-500/30' },
              ].map(({ label, angle, color, border }) => {
                const rad = (angle * Math.PI) / 180;
                const x = Math.cos(rad) * 205;
                const y = Math.sin(rad) * 205;
                return (
                  <motion.div
                    key={label}
                    className={`absolute px-4 py-2 rounded-xl bg-gradient-to-br ${color} border ${border} backdrop-blur-sm text-white text-sm font-medium whitespace-nowrap shadow-lg`}
                    style={{ left: `calc(50% + ${x}px - 50px)`, top: `calc(50% + ${y}px - 18px)` }}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: Math.abs(angle) / 100, ease: 'easeInOut' }}
                  >
                    {label}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-slate-600 flex items-start justify-center pt-2">
          <div className="w-1.5 h-3 bg-red-500 rounded-full animate-bounce" />
        </div>
        <span className="text-xs">Scroll</span>
      </motion.div>
    </section>
  );
}
