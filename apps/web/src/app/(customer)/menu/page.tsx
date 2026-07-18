import { Metadata } from 'next';
import MenuPage from '@/components/customer/MenuPage';

export const metadata: Metadata = {
  title: 'Menu – Browse All Dishes',
  description: 'Explore our full menu of chef-crafted, AI-personalised meals. Filter by dietary preference, meal type, price, and more.',
};

export default function Menu() {
  return <MenuPage />;
}
