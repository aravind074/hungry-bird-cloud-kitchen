'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Grid3X3, List, SlidersHorizontal, Star, Clock, Flame, Plus, Heart, ChevronDown, X } from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';
import toast from 'react-hot-toast';

import { MOCK_MENU_ITEMS, ALL_CATEGORIES, MEAL_TYPE_TABS, SORT_OPTIONS, DIETARY_TAGS } from '@/lib/data/mockMenu';
import { useWishlistStore } from '@/lib/store/wishlistStore';

export default function MenuPage() {
  const [search, setSearch] = useState('');
  const [mealType, setMealType] = useState('');
  const [selectedDiet, setSelectedDiet] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('-rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const wishlist = useWishlistStore(s => s.items);
  const toggleWishlist = useWishlistStore(s => s.toggleItem);

  const addItem = useCartStore(s => s.addItem);

  const handleAddToCart = (item: typeof MOCK_MENU_ITEMS[0]) => {
    addItem({
      menuItemId: item._id,
      name: item.name,
      thumbnail: item.thumbnail || item.emoji,
      price: item.price,
      quantity: 1,
    });
    toast.success(`${item.name} added to cart! 🛒`);
  };

  // ── Filtering & sorting ────────────────────────────────────────────────────
  let items = MOCK_MENU_ITEMS.filter(item => {
    if (search && !item.name.toLowerCase().includes(search.toLowerCase()) && !item.description.toLowerCase().includes(search.toLowerCase())) return false;
    if (mealType && item.mealType !== mealType) return false;
    if (selectedCategory && item.category !== selectedCategory) return false;
    if (selectedDiet.length && !selectedDiet.some(d => item.dietaryTags.includes(d))) return false;
    return true;
  });

  items = [...items].sort((a, b) => {
    if (sortBy === '-rating') return b.rating - a.rating;
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === '-price') return b.price - a.price;
    return b.rating - a.rating;
  });

  const activeFilterCount = selectedDiet.length + (selectedCategory ? 1 : 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">

      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white py-12 px-4">
        <div className="section-container text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-sm font-medium mb-4">
            🍽️ Our Menu
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
            What&apos;s Cooking Today
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Fresh, chef-crafted dishes made to order. Add to cart or subscribe for daily delivery.
          </p>
        </div>
      </div>

      {/* ── Meal type tab bar ───────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-16 z-30">
        <div className="section-container">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {MEAL_TYPE_TABS.map(tab => (
              <button
                key={tab.value}
                onClick={() => setMealType(tab.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-150 flex-shrink-0 ${
                  mealType === tab.value
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                id={`tab-${tab.value || 'all'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Search / Sort / Filter bar ──────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <div className="section-container py-3">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search dishes..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-11 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-400 transition"
                id="menu-search"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="pl-3 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500/40 cursor-pointer"
                id="menu-sort"
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                showFilters || activeFilterCount > 0
                  ? 'bg-orange-50 border-orange-300 text-orange-600 dark:bg-orange-500/10 dark:border-orange-500/30 dark:text-orange-400'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              id="menu-filter-toggle"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center">{activeFilterCount}</span>
              )}
            </button>

            {/* View mode */}
            <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden ml-auto">
              {(['grid', 'list'] as const).map(mode => (
                <button key={mode} onClick={() => setViewMode(mode)} className={`p-2.5 transition-colors ${viewMode === mode ? 'bg-orange-500 text-white' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`} aria-label={`${mode} view`}>
                  {mode === 'grid' ? <Grid3X3 className="w-4 h-4" /> : <List className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>

          {/* Filter panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="pt-4 pb-2 grid sm:grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 mt-3">
                  {/* Category */}
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Category</p>
                    <div className="flex flex-wrap gap-1.5">
                      <button onClick={() => setSelectedCategory('')} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${!selectedCategory ? 'bg-orange-500 text-white border-orange-500' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-orange-300'}`}>All</button>
                      {ALL_CATEGORIES.map(c => (
                        <button key={c} onClick={() => setSelectedCategory(c === selectedCategory ? '' : c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${selectedCategory === c ? 'bg-orange-500 text-white border-orange-500' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-orange-300'}`}>{c}</button>
                      ))}
                    </div>
                  </div>
                  {/* Dietary */}
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Dietary</p>
                    <div className="flex flex-wrap gap-1.5">
                      {DIETARY_TAGS.map(t => (
                        <button key={t} onClick={() => setSelectedDiet(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t])} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors capitalize ${selectedDiet.includes(t) ? 'bg-green-500 text-white border-green-500' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-green-300'}`}>{t === 'veg' ? '🟢 Veg' : t === 'non-veg' ? '🔴 Non-Veg' : '🟡 Egg'}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Results ─────────────────────────────────────────────────────────── */}
      <div className="section-container py-8">
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
          Showing <strong className="text-slate-900 dark:text-white">{items.length}</strong> dishes
          {search && <> for &quot;<strong className="text-orange-500">{search}</strong>&quot;</>}
        </p>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🍽️</p>
            <p className="text-slate-500 text-lg">No dishes found. Try a different search or filter.</p>
            <button onClick={() => { setSearch(''); setMealType(''); setSelectedDiet([]); setSelectedCategory(''); }} className="mt-4 px-6 py-2.5 rounded-xl bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 transition-colors">
              Clear all filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item, i) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-2xl overflow-hidden bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group"
                id={`menu-item-${item._id}`}
              >
                {/* Thumbnail */}
                <div className="relative h-44 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center overflow-hidden">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={e => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <span
                    className="text-6xl group-hover:scale-110 transition-transform duration-300 items-center justify-center"
                    style={{ display: item.thumbnail ? 'none' : 'flex' }}
                  >
                    {item.emoji}
                  </span>
                  {/* Wishlist */}
                  <button onClick={() => toggleWishlist(item._id)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-700/90 flex items-center justify-center shadow-sm">
                    <Heart className={`w-4 h-4 transition-colors ${wishlist.includes(item._id) ? 'fill-red-500 text-red-500' : 'text-slate-400 hover:text-red-400'}`} />
                  </button>
                  {item.isFeatured && (
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-bold">⭐ Featured</div>
                  )}
                  {/* Diet badge */}
                  <div className={`absolute bottom-3 left-3 px-2 py-0.5 rounded text-xs font-medium ${item.dietaryTags.includes('veg') ? 'bg-green-100 text-green-700' : item.dietaryTags.includes('egg') ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                    {item.dietaryTags.includes('veg') ? '🟢 Veg' : item.dietaryTags.includes('egg') ? '🟡 Egg' : '🔴 Non-Veg'}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-0.5 line-clamp-1">{item.name}</h3>
                  <p className="text-slate-400 text-xs mb-2 line-clamp-1">{item.description}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{item.rating}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.preparationTime}m</span>
                    {item.nutritionalInfo?.calories && <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-400" />{item.nutritionalInfo.calories} cal</span>}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-orange-500 text-base">₹{item.price}</span>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 text-orange-600 dark:text-orange-400 text-xs font-semibold hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all"
                      id={`add-cart-${item._id}`}
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, i) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all"
                id={`menu-item-list-${item._id}`}
              >
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={e => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <span className="text-3xl" style={{ display: item.thumbnail ? 'none' : 'block' }}>{item.emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">{item.name}</h3>
                      <p className="text-slate-400 text-xs mt-0.5 line-clamp-1">{item.description}</p>
                    </div>
                    <span className="font-bold text-orange-500 whitespace-nowrap">₹{item.price}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{item.rating}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.preparationTime}m</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${item.dietaryTags.includes('veg') ? 'bg-green-100 text-green-700' : item.dietaryTags.includes('egg') ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {item.dietaryTags.includes('veg') ? '🟢 Veg' : item.dietaryTags.includes('egg') ? '🟡 Egg' : '🔴 Non-Veg'}
                    </span>
                  </div>
                </div>
                <button onClick={() => handleAddToCart(item)} className="self-center flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors whitespace-nowrap">
                  <Plus className="w-4 h-4" /> Add
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
