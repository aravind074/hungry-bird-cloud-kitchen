import { Metadata } from 'next';
import SubscriptionPage from '@/components/customer/SubscriptionPage';

export const metadata: Metadata = {
  title: 'Subscribe – Daily Meal Plans',
  description: 'Choose your Hungry Bird subscription plan. Breakfast, Lunch, or Dinner — for 15, 30, or 90 days.',
};

export default function Subscription() {
  return <SubscriptionPage />;
}
