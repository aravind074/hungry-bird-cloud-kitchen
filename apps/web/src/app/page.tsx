import { Metadata } from 'next';
import HeroSection from '@/components/customer/HeroSection';
import FeaturedMenuSection from '@/components/customer/FeaturedMenuSection';
import SubscriptionPlansSection from '@/components/customer/SubscriptionPlansSection';
import HowItWorksSection from '@/components/customer/HowItWorksSection';
import TestimonialsSection from '@/components/customer/TestimonialsSection';
import StatsSection from '@/components/customer/StatsSection';
import AppNavbar from '@/components/shared/AppNavbar';
import Footer from '@/components/shared/Footer';

export const metadata: Metadata = {
  title: 'Hungry Bird – AI Powered Cloud Kitchen',
  description: 'Fresh, chef-crafted meals delivered daily. Subscribe to Breakfast, Lunch, or Dinner plans personalised by AI.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <AppNavbar />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturedMenuSection />
        <HowItWorksSection />
        <SubscriptionPlansSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
}
