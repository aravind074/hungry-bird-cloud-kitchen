import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Twitter, Facebook, Youtube, MapPin, Phone, Mail } from 'lucide-react';

const footerLinks = {
  Company: [
    { href: '/about', label: 'About Us' },
    { href: '/careers', label: 'Careers' },
    { href: '/blog', label: 'Blog' },
    { href: '/press', label: 'Press' },
  ],
  Customers: [
    { href: '/menu', label: 'Browse Menu' },
    { href: '/subscription', label: 'Subscription Plans' },
    { href: '/orders', label: 'Track Order' },
    { href: '/refer', label: 'Refer & Earn' },
  ],
  Legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/refund', label: 'Refund Policy' },
    { href: '/contact', label: 'Contact Us' },
  ],
};

const socials = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
      <div className="section-container py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* ── Brand ── */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-14 h-14 flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="Hungry Birds"
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-200 drop-shadow-lg"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-white font-extrabold text-lg tracking-wide">
                  HUNGRY <span className="text-red-500">BIRDS</span>
                </span>
                <span className="text-slate-500 text-[10px] tracking-[0.18em] uppercase mt-0.5">
                  Feel the food with love
                </span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed max-w-xs">
              AI-powered cloud kitchen delivering fresh, personalised meals daily. Subscribe to
              Breakfast, Lunch, or Dinner — crafted by chefs, recommended by AI.
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
                42, Food Street, Koramangala, Bangalore – 560034
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-500" />
                +91 98765 43210
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-500" />
                hello@hungrybirds.in
              </div>
            </div>

            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-red-600 transition-colors group"
                >
                  <Icon className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* ── Links ── */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-white font-semibold mb-4">{section}</h3>
              <ul className="space-y-3">
                {links.map(({ href, label }) => (
                  <li key={label}>
                    <Link href={href} className="text-sm hover:text-red-400 transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm">© 2026 Hungry Birds. All rights reserved. Made with ❤️ in India 🇮🇳</p>
          <div className="flex gap-3 text-sm">
            <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300">🍎 App Store – Coming Soon</span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300">🤖 Play Store – Coming Soon</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
