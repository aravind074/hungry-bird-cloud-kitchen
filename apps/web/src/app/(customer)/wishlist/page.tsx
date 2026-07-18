'use client';

import { useWishlistStore } from '@/lib/store/wishlistStore';
import { useCartStore } from '@/lib/store/cartStore';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
// Need to import mock menu items to display the details of the wishlisted IDs
import MenuPage from '@/components/customer/MenuPage'; 
import { useState, useEffect } from 'react';

// Extracting mock menu items manually or via API. Since they are hardcoded in MenuPage right now, 
// let's fetch them from our component structure or recreate a shared constant.
// For now, I will extract the exact same mock menu items into a shared location or just define them here briefly if needed.
// Wait, the best approach is to refactor them out, but for immediate fix, we can just fetch all menu data via an API or mock here.
// Let's create a temporary mock mapping based on what's in MenuPage.
import { MOCK_MENU_ITEMS } from '@/lib/data/mockMenu';

export default function WishlistPage() {
  const { items, toggleItem, clearWishlist } = useWishlistStore();
  const addItemToCart = useCartStore((s) => s.addItem);
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const wishlistedFoods = MOCK_MENU_ITEMS.filter((food) => items.includes(food._id));

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
            My Wishlist
          </h1>
          {wishlistedFoods.length > 0 && (
            <button 
              onClick={() => { clearWishlist(); toast.success('Wishlist cleared'); }}
              className="text-sm font-semibold text-slate-500 hover:text-red-500"
            >
              Clear All
            </button>
          )}
        </div>

        {wishlistedFoods.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800">
            <Heart className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Your wishlist is empty</h2>
            <p className="text-slate-500 mb-6">Save your favorite dishes to quickly find them later!</p>
            <Link 
              href="/menu"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {wishlistedFoods.map((item) => (
              <div key={item._id} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 group relative">
                <div className="h-40 bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                  {item.thumbnail ? (
                    <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <span className="text-5xl">{item.emoji}</span>
                  )}
                  <button 
                    onClick={() => { toggleItem(item._id); toast.success('Removed from wishlist'); }}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 dark:bg-slate-800/90 rounded-full flex items-center justify-center text-red-500 hover:scale-110 transition-transform"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <div className="flex justify-between items-center mt-3">
                    <span className="font-bold text-orange-500">,1{item.price}</span>
                    <button
                      onClick={() => {
                        addItemToCart({
                          menuItemId: item._id,
                          name: item.name,
                          thumbnail: item.thumbnail || '',
                          price: item.price,
                          quantity: 1,
                        });
                        toast.success('Added to cart');
                      }}
                      className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-500 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
