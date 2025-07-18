'use client';

import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';
import { usePathname } from 'next/navigation';
import {
  Home,
  Clock,
  User,
  Instagram,
  Youtube,
  Linkedin,
  Phone,
} from 'lucide-react';

export default function Footer() {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const pathname = usePathname();

  // Theme class constants
  const theme = {
    background: isDarkMode ? 'bg-[#082238]' : 'bg-[#0B5FAC]',
    text: 'text-white',
  };

  const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Clock, label: 'History', href: '/history' },
    { icon: User, label: 'Profile', href: '/profile' },
  ];

  return (
    <footer>
      {/* Mobile Bottom Nav */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 md:hidden px-6 py-2 shadow-md flex justify-around items-center ${theme.background} ${theme.text}`}
      >
        {navItems.map(({ icon: Icon, label, href }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={label}
              href={href}
              className={`flex flex-col items-center text-sm transition-colors ${
                isActive ? 'text-white font-bold' : 'hover:text-white/80'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              {label}
            </Link>
          );
        })}
      </div>

      {/* Desktop Footer */}
      <div className={`hidden md:block ${theme.background} ${theme.text}`}>
        <div className="max-w-7xl mx-auto py-16 px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-orange-400">FastMover</h3>
            <p className="mt-2 text-sm">Move Smarter. Build Faster.</p>
            <p className="text-xs mt-4">
              © {new Date().getFullYear()} FastMover India Pvt. Ltd.
            </p>
          </div>

          {/* Important Links */}
          <div>
            <h4 className="font-semibold mb-2">Important</h4>
            <ul className="space-y-1 text-sm">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/book">Bookings</Link></li>
              <li><Link href="/driver/register">Join as Driver</Link></li>
              <li><Link href="/admin">Admin Login</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-2">Support</h4>
            <ul className="space-y-1 text-sm">
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/help">Help Center</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/install">Install PWA</Link></li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h4 className="font-semibold mb-2">Legal & Social</h4>
            <ul className="space-y-1 text-sm mb-4">
              <li><Link href="/terms">Terms & Conditions</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/cancellation">Cancellation Policy</Link></li>
              <li><Link href="/refund">Refund Policy</Link></li>
            </ul>
            <div className="flex space-x-4">
              <Link href="#" aria-label="Instagram">
                <Instagram className="w-5 h-5 hover:text-orange-300" />
              </Link>
              <Link href="#" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5 hover:text-orange-300" />
              </Link>
              <Link href="#" aria-label="YouTube">
                <Youtube className="w-5 h-5 hover:text-orange-300" />
              </Link>
              <Link href="#" aria-label="Phone">
                <Phone className="w-5 h-5 hover:text-orange-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
