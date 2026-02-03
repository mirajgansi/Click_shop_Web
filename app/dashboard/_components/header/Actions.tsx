'use client';

import { useAuth } from '@/context/AuthContext';
import {
  Heart,
  ShoppingCart,
  Search,
  User,
  LogOut,
  UserCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
        <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          3
        </span>
      </button>

      {/* User Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="text-gray-600 hover:text-black transition outline-none">
            <User size={20} />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            onClick={() => router.push('/user/profile')}
            className="cursor-pointer"
          >
            <UserCircle className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={logout}
            className="cursor-pointer text-red-600 focus:text-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
