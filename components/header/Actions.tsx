'use client';

import { useAuth } from '@/context/AuthContext';
import { API } from '@/lib/api/endpoint';
import { Heart, ShoppingCart, Search, User } from 'lucide-react';
import { useRouter } from "next/navigation";

export default function Actions() {
   const router = useRouter();

   const { logout, loading } = useAuth();
  if (loading) return null;

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
       <button
      onClick={logout}
      className="text-gray-600 hover:text-black transition"
    >
      <User size={20} />
    </button>
    </div>
  );
}
