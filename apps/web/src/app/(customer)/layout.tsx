import AppNavbar from '@/components/shared/AppNavbar';
import Footer from '@/components/shared/Footer';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppNavbar />
      <main className="min-h-screen pt-16">
        {children}
      </main>
      <Footer />
    </>
  );
}
