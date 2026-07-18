import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface WishlistState {
  items: string[]; // Array of item IDs
  toggleItem: (id: string) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      items: [],
      toggleItem: (id) =>
        set((state) => ({
          items: state.items.includes(id)
            ? state.items.filter((item) => item !== id)
            : [...state.items, id],
        })),
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'hungry-bird-wishlist',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
