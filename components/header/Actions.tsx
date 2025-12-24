'use client';

import { Heart, ShoppingCart, Search, User } from 'lucide-react';

export default function Actions() {
  return (
    <div className="flex items-center gap-5">
      
      {/* Search */}
      <button className="text-gray-600 hover:text-black transition">
        <Search size={20} />
      </button>

      {/* Wishlist */}
      <button className="relative text-gray-600 hover:text-red-500 transition">
        <Heart size={20} />
      </button>

      {/* Cart */}
      <button className="relative text-gray-600 hover:text-black transition">
        <ShoppingCart size={20} />

        {/* Cart count */}
        <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          3
        </span>
      </button>

      {/* User */}
      <button className="text-gray-600 hover:text-black transition">
        <User size={20} />
      </button>
    </div>
  );
}
