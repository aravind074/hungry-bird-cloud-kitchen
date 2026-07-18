import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  thumbnail: string;
  price: number;
  quantity: number;
  customizations?: { name: string; option: string; price: number }[];
  specialInstructions?: string;
}

interface CartState {
  items: CartItem[];
  couponCode?: string;
  couponDiscount: number;
  isOpen: boolean;
  // Computed
  itemCount: number;
  subtotal: number;
  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  setCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: undefined,
      couponDiscount: 0,
      isOpen: false,
      get itemCount() { return get().items.reduce((sum, i) => sum + i.quantity, 0); },
      get subtotal() { return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0); },

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find(i => i.menuItemId === item.menuItemId);
          if (existing) {
            return {
              items: state.items.map(i =>
                i.menuItemId === item.menuItemId ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
              isOpen: true,
            };
          }
          return {
            items: [...state.items, { ...item, id: `${item.menuItemId}-${Date.now()}` }],
            isOpen: true,
          };
        });
      },

      removeItem: (menuItemId) => {
        set((state) => ({ items: state.items.filter(i => i.menuItemId !== menuItemId) }));
      },

      updateQuantity: (menuItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(menuItemId);
          return;
        }
        set((state) => ({
          items: state.items.map(i => i.menuItemId === menuItemId ? { ...i, quantity } : i),
        }));
      },

      clearCart: () => set({ items: [], couponCode: undefined, couponDiscount: 0 }),

      setCoupon: (code, discount) => set({ couponCode: code, couponDiscount: discount }),

      removeCoupon: () => set({ couponCode: undefined, couponDiscount: 0 }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      setCartOpen: (open) => set({ isOpen: open }),
    }),
    {
      name: 'hungry-bird-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items, couponCode: state.couponCode, couponDiscount: state.couponDiscount }),
    }
  )
);
