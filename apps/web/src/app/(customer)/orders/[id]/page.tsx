'use client';

import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api/client';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, MapPin, CheckCircle, Package, Bike, FileText } from 'lucide-react';
import { format } from 'date-fns';

const STATUS_STEPS = [
  { id: 'pending', label: 'Order Placed', icon: FileText, desc: 'We have received your order' },
  { id: 'confirmed', label: 'Confirmed', icon: CheckCircle, desc: 'Order confirmed by restaurant' },
  { id: 'preparing', label: 'Preparing', icon: Package, desc: 'Your food is being prepared' },
  { id: 'out_for_delivery', label: 'On the Way', icon: Bike, desc: 'Delivery partner is on the way' },
  { id: 'delivered', label: 'Delivered', icon: MapPin, desc: 'Order has been delivered' },
];

export default function OrderTrackingPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => apiGet<any>(`/orders/${id}`),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
        <h2 className="text-2xl font-bold mb-4">Order not found</h2>
        <button onClick={() => router.push('/orders')} className="btn-primary">Back to Orders</button>
      </div>
    );
  }

  const currentStatusIndex = STATUS_STEPS.findIndex(s => s.id === order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-3xl mx-auto px-4">
        
        <button 
          onClick={() => router.push('/orders')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Orders
        </button>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Track Order</h1>
              <p className="text-slate-500 text-sm">Order ID: {order.orderId}</p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-slate-900 dark:text-white font-bold text-xl">₹{order.pricing?.total}</p>
              <p className="text-slate-500 text-sm">{format(new Date(order.createdAt), 'dd MMM yyyy, h:mm a')}</p>
            </div>
          </div>

          {isCancelled ? (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 p-6 rounded-2xl flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-800/40 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold mb-2">Order Cancelled</h2>
              <p className="opacity-80">This order was cancelled and will not be delivered.</p>
            </div>
          ) : (
            <div className="relative pl-8 md:pl-0">
              <div className="hidden md:block absolute top-6 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full -z-10">
                 <div 
                   className="h-full bg-orange-500 rounded-full transition-all duration-1000"
                   style={{ width: `${(Math.max(0, currentStatusIndex) / (STATUS_STEPS.length - 1)) * 100}%` }}
                 />
              </div>

              <div className="md:hidden absolute top-0 left-[23px] w-1 h-full bg-slate-100 dark:bg-slate-800 rounded-full -z-10">
                 <div 
                   className="w-full bg-orange-500 rounded-full transition-all duration-1000"
                   style={{ height: `${(Math.max(0, currentStatusIndex) / (STATUS_STEPS.length - 1)) * 100}%` }}
                 />
              </div>

              <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-0">
                {STATUS_STEPS.map((step, idx) => {
                  const Icon = step.icon;
                  const isCompleted = currentStatusIndex >= idx;
                  const isCurrent = currentStatusIndex === idx;

                  return (
                    <motion.div 
                      key={step.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`relative flex md:flex-col items-start md:items-center gap-4 md:gap-3 text-left md:text-center
                        ${isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}
                      `}
                    >
                      <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-4 border-white dark:border-slate-900 transition-colors duration-500
                        ${isCompleted ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-slate-100 dark:bg-slate-800'}
                        ${isCurrent ? 'scale-110 ring-4 ring-orange-500/20' : ''}
                      `}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className={`font-bold text-sm ${isCurrent ? 'text-orange-500' : ''}`}>{step.label}</p>
                        <p className="text-xs mt-1 hidden md:block opacity-70 max-w-[120px] mx-auto">{step.desc}</p>
                        <p className="text-xs mt-1 md:hidden opacity-70">{step.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-12 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-orange-500" /> Order Details
            </h3>
            <div className="space-y-4">
              {order.items?.map((item: any, i: number) => (
                <div key={i} className="flex justify-between items-start text-sm">
                  <div className="flex gap-3">
                    <span className="font-medium text-slate-500">{item.quantity}x</span>
                    <span className="text-slate-900 dark:text-white">{item.name}</span>
                  </div>
                  <span className="font-medium">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
