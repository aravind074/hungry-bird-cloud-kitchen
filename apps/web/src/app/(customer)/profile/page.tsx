'use client';

import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import { User, LogOut, Package, Heart, Settings, Bell, Shield, Wallet } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-extrabold mb-6">My Profile</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Sidebar / User Info */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 text-center">
              <div className="w-24 h-24 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-500 mx-auto flex items-center justify-center mb-4 text-4xl font-bold uppercase overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name.charAt(0)
                )}
              </div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-slate-500 text-sm mb-4">{user.email}</p>
              <div className="inline-block px-3 py-1 bg-orange-50 dark:bg-orange-500/10 text-orange-600 font-semibold text-xs rounded-full">
                {user.loyaltyPoints || 0} Hungry Points
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-2 shadow-sm border border-slate-200 dark:border-slate-800">
              <Link href="/orders" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <Package className="w-5 h-5 text-slate-400" />
                <span className="font-medium">My Orders</span>
              </Link>
              <Link href="/wishlist" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <Heart className="w-5 h-5 text-slate-400" />
                <span className="font-medium">Wishlist</span>
              </Link>
              <Link href="/subscription" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <Wallet className="w-5 h-5 text-slate-400" />
                <span className="font-medium">Subscriptions</span>
              </Link>
              <div className="h-px bg-slate-100 dark:bg-slate-800 my-2 mx-4" />
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>

          {/* Main Content Area (Settings) */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-orange-500" />
                Account Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Full Name</label>
                  <input type="text" defaultValue={user.name} disabled className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 opacity-70" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Email Address</label>
                  <input type="email" defaultValue={user.email} disabled className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 opacity-70" />
                </div>
                <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-sm font-semibold transition-colors">
                  Edit Profile
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-500">
                  <Bell className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Notifications</h3>
                  <p className="text-xs text-slate-500 mb-3">Manage email & push alerts</p>
                  <button className="text-sm text-blue-500 font-semibold hover:underline">Manage</button>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-4">
                <div className="p-3 bg-green-50 dark:bg-green-500/10 rounded-xl text-green-500">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Security</h3>
                  <p className="text-xs text-slate-500 mb-3">Change password & 2FA</p>
                  <button className="text-sm text-green-500 font-semibold hover:underline">Manage</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
