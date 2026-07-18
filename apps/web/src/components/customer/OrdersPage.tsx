'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost } from '@/lib/api/client';
import { useAuthStore } from '@/lib/store/authStore';
import toast from 'react-hot-toast';
import { Clock, MapPin, CheckCircle, Package, Bike, Star, RotateCcw, XCircle, ChevronRight, Filter } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string; icon: any }> = {
  pending:          { label: 'Pending',          color: 'text-yellow-600', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800', icon: Clock },
  confirmed:        { label: 'Confirmed',        color: 'text-blue-600',   bgColor: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',     icon: CheckCircle },
  preparing:        { label: 'Preparing',        color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800', icon: Package },
  ready:            { label: 'Ready',            color: 'text-indigo-600', bgColor: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200',                      icon: CheckCircle },
  out_for_delivery: { label: 'On the Way',       color: 'text-orange-600', bgColor: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800', icon: Bike },
  delivered:        { label: 'Delivered',        color: 'text-green-600',  bgColor: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',   icon: CheckCircle },
  cancelled:        { label: 'Cancelled',        color: 'text-red-600',    bgColor: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',           icon: XCircle },
};

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    setCancellingId(orderId);
    try {
      await apiPost(`/orders/${orderId}/cancel`);
      toast.success('Order cancelled successfully');
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    } catch (error: any) {
      toast.error('Failed to cancel order');
    } finally {
      setCancellingId(null);
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ['orders', statusFilter],
    queryFn: () => apiGet<{ orders: any[]; total: number }>('/orders', { status: statusFilter || undefined, limit: 20 }),
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">🔐</div>
          <h2 className="text-2xl font-bold">Login Required</h2>
          <p className="text-slate-500">Please login to view your orders</p>
          <Link href="/login?redirect=/orders" className="btn-primary">Login Now</Link>
        </div>
      </div>
    );
  }

  const orders = data?.orders || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="section-container py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Orders</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">{data?.total || 0} orders total</p>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="input-field py-2 text-sm"
              id="order-status-filter"
            >
              <option value="">All Orders</option>
              {Object.entries(STATUS_CONFIG).map(([value, config]) => (
                <option key={value} value={value}>{config.label}</option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="rounded-2xl bg-white dark:bg-slate-800 p-5 space-y-3"><div className="skeleton h-5 w-1/3 rounded" /><div className="skeleton h-4 w-1/2 rounded" /><div className="skeleton h-10 w-full rounded-xl" /></div>)}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24 space-y-4">
            <div className="text-7xl">📦</div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">No Orders Yet</h2>
            <p className="text-slate-500 dark:text-slate-400">Your order history will appear here once you place your first order.</p>
            <Link href="/menu" className="btn-primary inline-flex">Browse Menu</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any, i: number) => {
              const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const StatusIcon = statusConfig.icon;
              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all"
                  id={`order-${order._id}`}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{order.orderId}</p>
                        <p className="text-slate-400 text-sm">{format(new Date(order.createdAt), 'dd MMM yyyy, h:mm a')}</p>
                      </div>
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${statusConfig.bgColor} ${statusConfig.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusConfig.label}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      {order.items?.slice(0, 3).map((item: any, j: number) => (
                        <span key={j} className="text-sm text-slate-600 dark:text-slate-300">
                          {item.name} × {item.quantity}{j < Math.min(order.items.length - 1, 2) ? ',' : ''}
                        </span>
                      ))}
                      {order.items?.length > 3 && <span className="text-sm text-slate-400">+{order.items.length - 3} more</span>}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="font-bold text-slate-900 dark:text-white">₹{order.pricing?.total}</span>
                        <span className="text-slate-400">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {order.status === 'delivered' && !order.isRated && (
                          <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 text-yellow-600 text-xs font-medium hover:bg-yellow-100 transition-colors">
                            <Star className="w-3.5 h-3.5" /> Rate
                          </button>
                        )}
                        {['pending', 'confirmed'].includes(order.status) && (
                          <button 
                            onClick={() => handleCancelOrder(order._id)}
                            disabled={cancellingId === order._id}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 text-red-600 text-xs font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
                          >
                            <XCircle className="w-3.5 h-3.5" /> {cancellingId === order._id ? 'Cancelling...' : 'Cancel'}
                          </button>
                        )}
                        <Link href={`/orders/${order._id}`} className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors" id={`view-order-${order._id}`}>
                          Track <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Progress bar for active orders */}
                  {['confirmed', 'preparing', 'ready', 'out_for_delivery'].includes(order.status) && (
                    <div className="px-5 pb-4">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                        <span>Confirmed</span><span>Preparing</span><span>Ready</span><span>Delivered</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500"
                          style={{ width: { confirmed: '25%', preparing: '50%', ready: '75%', out_for_delivery: '90%' }[order.status as string] || '0%' }}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
