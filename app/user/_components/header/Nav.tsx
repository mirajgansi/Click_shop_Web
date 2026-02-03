'use client';

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

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
        href="/user/shop"
        className="text-sm font-medium text-gray-700 hover:text-green-600 transition"
      >
        Shop
      </Link>

      <div className="relative group">
        <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-green-600 transition">
          Categories <ChevronDown size={16} />
        </button>

        <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition">
          <Link href="/user/category/fruits" className="block px-4 py-2 hover:bg-gray-100">
            Fruits
          </Link>
          <Link href="/user/category/vegetables" className="block px-4 py-2 hover:bg-gray-100">
            Vegetables
          </Link>
          <Link href="/user/category/snacks" className="block px-4 py-2 hover:bg-gray-100">
            Snacks
          </Link>
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
