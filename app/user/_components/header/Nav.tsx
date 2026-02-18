'use client';

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { CATEGORIES } from '@/lib/categories';


export default function Nav() {
  return (
    <nav className="hidden md:flex items-center gap-8">
      
      <Link
        href="/user/dashboard"
        className="text-sm font-medium text-gray-700 hover:text-green-600 transition"
      >
        Home
      </Link>

      <Link
        href="/user/orders"
        className="text-sm font-medium text-gray-700 hover:text-green-600 transition"
      >
        My orders
      </Link>

      <div className="relative group">
        <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-green-600 transition">
          Categories <ChevronDown size={16} />
        </button>

        
      <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition">
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={`/user/category/${c.slug}`}
            className="block px-4 py-2 hover:bg-gray-100"
          >
            {c.label}
          </Link>
        ))}
      </div>
      </div>

      <Link
        href="/user/deals"
        className="text-sm font-medium text-gray-700 hover:text-green-600 transition"
      >
        Deals
      </Link>

      <Link
        href="/user/contact"
        className="text-sm font-medium text-gray-700 hover:text-green-600 transition"
      >
        Contact
      </Link>
    </nav>
  );
}
