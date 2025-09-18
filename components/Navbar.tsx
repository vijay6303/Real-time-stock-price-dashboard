import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();

  const navItems = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/stocks', label: 'Portfolio', icon: '📈' }, // Changed from "Stocks" to "Portfolio"
    { href: '/about', label: 'About', icon: 'ℹ️' },
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl">📊</div>
            <span className="text-xl font-bold text-gray-900">
              Real-Time Stock Dashboard
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  router.pathname === item.href
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-700 hover:text-primary-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
