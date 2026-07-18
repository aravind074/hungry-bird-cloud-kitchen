import { Metadata } from 'next';
import OrdersPage from '@/components/customer/OrdersPage';

export const metadata: Metadata = {
  title: 'My Orders – Track Your Deliveries',
  description: 'Track your current orders and view your order history.',
};

export default function Orders() {
  return <OrdersPage />;
}
