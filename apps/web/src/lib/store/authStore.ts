import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { api } from '@/lib/api/client';
import { getFirebaseAuth, getGoogleProvider } from '@/lib/firebase/config';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';

const setAuthCookie = () => {
  if (typeof document !== 'undefined') {
    document.cookie = 'accessToken=client_auth_token; path=/; max-age=86400';
  }
};

const clearAuthCookie = () => {
  if (typeof document !== 'undefined') {
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
};

export type UserRole = 'customer' | 'admin' | 'kitchen_staff' | 'delivery_partner';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  loyaltyPoints?: number;
  isEmailVerified?: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: User | null) => void;
}

// ─── Local demo fallback (when backend is offline) ───────────────────────────
const DEMO_STORE_KEY = 'hb_demo_users';

function getDemoUsers(): Record<string, User & { password: string }> {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(DEMO_STORE_KEY) || '{}'); } catch { return {}; }
}

function saveDemoUser(email: string, user: User & { password: string }) {
  const all = getDemoUsers();
  all[email] = user;
  localStorage.setItem(DEMO_STORE_KEY, JSON.stringify(all));
}

function makeDemoUser(name: string, email: string): User {
  return {
    id: `demo_${Date.now()}`,
    name,
    email,
    role: 'customer',
    loyaltyPoints: 0,
    isEmailVerified: false,
  };
}
// ─────────────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      // ── Register ──────────────────────────────────────────────────────────
      register: async (name, email, password, phone) => {
        set({ isLoading: true });
        try {
          // 1. Try backend
          const res = await api.post('/auth/register', { name, email, password, phone });
          setAuthCookie();
          set({ user: res.data.data.user, isAuthenticated: true });
        } catch (backendErr: any) {
          // 2. Backend offline → try Firebase
          try {
            await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
            const user = makeDemoUser(name, email);
            saveDemoUser(email, { ...user, password });
            setAuthCookie();
            set({ user, isAuthenticated: true });
          } catch (firebaseErr: any) {
            // Firebase not configured → full offline demo mode
            const existingUsers = getDemoUsers();
            if (existingUsers[email]) {
              throw new Error('An account with this email already exists. Please sign in.');
            }
            const user = makeDemoUser(name, email);
            saveDemoUser(email, { ...user, password });
            setAuthCookie();
            set({ user, isAuthenticated: true });
          }
        } finally {
          set({ isLoading: false });
        }
      },

      // ── Login ─────────────────────────────────────────────────────────────
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          // 1. Try backend
          const res = await api.post('/auth/login', { email, password });
          setAuthCookie();
          set({ user: res.data.data.user, isAuthenticated: true });
        } catch {
          // 2. Try Firebase
          try {
            await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
            const stored = getDemoUsers()[email];
            const user = stored ? { ...stored } : makeDemoUser(email.split('@')[0], email);
            setAuthCookie();
            set({ user, isAuthenticated: true });
          } catch {
            // 3. Full offline demo mode
            const users = getDemoUsers();
            const stored = users[email];
            if (!stored) throw new Error('No account found with this email. Please register first.');
            if (stored.password !== password) throw new Error('Incorrect password. Please try again.');
            setAuthCookie();
            set({ user: stored, isAuthenticated: true });
          }
        } finally {
          set({ isLoading: false });
        }
      },

      // ── Google Login ──────────────────────────────────────────────────────
      loginWithGoogle: async () => {
        set({ isLoading: true });
        try {
          const credential = await signInWithPopup(getFirebaseAuth(), getGoogleProvider());
          const fbUser = credential.user;
          try {
            const idToken = await fbUser.getIdToken();
            const res = await api.post('/auth/firebase', { idToken });
            setAuthCookie();
            set({ user: res.data.data.user, isAuthenticated: true });
          } catch {
            // Backend offline, use Firebase profile directly
            const user: User = {
              id: fbUser.uid,
              name: fbUser.displayName || 'User',
              email: fbUser.email || '',
              role: 'customer',
              avatar: fbUser.photoURL || undefined,
              loyaltyPoints: 0,
            };
            setAuthCookie();
            set({ user, isAuthenticated: true });
          }
        } catch (err: any) {
          set({ isLoading: false });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      // ── Logout ────────────────────────────────────────────────────────────
      logout: async () => {
        set({ isLoading: true });
        try {
          await api.post('/auth/logout').catch(() => {});
          await firebaseSignOut(getFirebaseAuth()).catch(() => {});
          clearAuthCookie();
        } finally {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      // ── Refresh ───────────────────────────────────────────────────────────
      refreshUser: async () => {
        try {
          const res = await api.get('/auth/me');
          set({ user: res.data.data.user, isAuthenticated: true });
        } catch {
          // Keep existing user if backend is offline
        }
      },
    }),
    {
      name: 'hungry-bird-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
