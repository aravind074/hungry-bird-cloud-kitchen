'use client';

import { motion } from 'framer-motion';
import { Star, Clock, Flame, Plus, Heart } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cartStore';
import toast from 'react-hot-toast';

// Placeholder featured items (will be replaced by API data in the full customer page)
const featuredItems = [
  { id: '1', name: 'Butter Chicken Rice Bowl', category: 'North Indian', price: 199, rating: 4.8, ratingCount: 342, calories: 520, time: 25, isVeg: false, isPopular: true, emoji: '🍲', color: 'from-orange-500/20 to-red-500/20', thumbnail: '/images/butter_chicken_bowl.jpg' },
  { id: '2', name: 'Masala Dosa Combo', category: 'South Indian', price: 149, rating: 4.9, ratingCount: 521, calories: 380, time: 20, isVeg: true, isPopular: true, emoji: '🥞', color: 'from-yellow-500/20 to-orange-500/20', thumbnail: '/images/masala_dosa.png' },
  { id: '3', name: 'Paneer Tikka Wrap', category: 'Street Food', price: 169, rating: 4.7, ratingCount: 198, calories: 420, time: 15, isVeg: true, emoji: '🌯', color: 'from-green-500/20 to-teal-500/20', thumbnail: '/images/paneer_tikka_wrap.png' },
  { id: '4', name: 'Chicken Biryani', category: 'Biryani', price: 249, rating: 4.9, ratingCount: 876, calories: 650, time: 30, isVeg: false, isPopular: true, emoji: '🍛', color: 'from-yellow-600/20 to-amber-500/20', thumbnail: '/images/chicken_biryani.png' },
  { id: '5', name: 'Dal Makhani Thali', category: 'Thali', price: 179, rating: 4.6, ratingCount: 254, calories: 550, time: 25, isVeg: true, emoji: '🥘', color: 'from-red-500/20 to-orange-500/20', thumbnail: '/images/dal_makhani.png' },
  { id: '6', name: 'Grilled Chicken Salad', category: 'Healthy', price: 219, rating: 4.8, ratingCount: 143, calories: 280, time: 15, isVeg: false, emoji: '🥗', color: 'from-green-500/20 to-emerald-500/20', thumbnail: '/images/grilled_chicken_salad.png' },
];

export default function FeaturedMenuSection() {
  const addItem = useCartStore(s => s.addItem);

  const handleAddToCart = (item: typeof featuredItems[0]) => {
    addItem({
      menuItemId: item.id,
      name: item.name,
      thumbnail: item.thumbnail || item.emoji,
      price: item.price,
      quantity: 1,
    });
    toast.success(`${item.name} added to cart! 🛒`);
  };

  return (
    <section className="py-24 bg-white dark:bg-slate-950">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4"
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
              Today's <span className="gradient-text">Highlights</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400">AI-curated picks based on what's trending today</p>
          </div>
          <Link href="/menu" className="btn-secondary whitespace-nowrap" id="view-full-menu">
            View Full Menu
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="food-card group"
              id={`menu-item-${item.id}`}
            >
              {/* Image Area */}
              <div className={`relative h-48 bg-gradient-to-br ${item.color} dark:opacity-80 flex items-center justify-center overflow-hidden`}>
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                ) : null}
                <span 
                  className="text-7xl group-hover:scale-110 transition-transform duration-300"
                  style={{ display: item.thumbnail ? 'none' : 'flex' }}
                >
                  {item.emoji}
                </span>
                {item.isPopular && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500 text-white text-xs font-bold">
                    <Flame className="w-3 h-3" /> Popular
                  </div>
                )}
                <button
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur flex items-center justify-center hover:scale-110 transition-transform"
                  aria-label={`Add ${item.name} to wishlist`}
                >
                  <Heart className="w-4 h-4 text-slate-400 hover:text-red-500 transition-colors" />
                </button>
                <div className={`absolute top-3 ${item.isPopular ? 'left-20' : 'left-3'} px-2 py-1 rounded-full text-xs font-medium ${item.isVeg ? 'badge-veg' : 'badge-nonveg'}`}>
                  {item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-slate-400 text-xs mt-0.5">{item.category}</p>
                  </div>
                  <span className="text-orange-500 font-bold text-lg">₹{item.price}</span>
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-slate-600 dark:text-slate-300">{item.rating}</span>
                    <span>({item.ratingCount})</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {item.time} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-orange-400" /> {item.calories} cal
                  </span>
                </div>

                <button
                  onClick={() => handleAddToCart(item)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 text-orange-600 dark:text-orange-400 font-semibold hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-200 text-sm"
                  id={`add-to-cart-${item.id}`}
                >
                  <Plus className="w-4 h-4" /> Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
