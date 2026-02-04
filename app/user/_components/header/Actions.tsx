"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { Heart, ShoppingCart, Search, User, LogOut, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getMyCart } from "@/lib/api/cart"; // ✅ adjust path

type CartItem = { quantity: number };
type CartResponse = {
  data?: { items?: CartItem[] } | any;
  items?: CartItem[];
};

export default function Actions() {
  const router = useRouter();
  const { logout, loading } = useAuth();

  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {
    try {
      const res: CartResponse = await getMyCart();

      // supports different response shapes
      const items: CartItem[] =
        res?.data?.items || res?.items || res?.data?.data?.items || [];

      const totalQty = items.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0);
      setCartCount(totalQty);
    } catch {
      // If user not logged in or request fails, just show 0
      setCartCount(0);
    }
  };

  useEffect(() => {
    if (loading) return;

    fetchCartCount();

    // optional: keep it fresh
    const interval = setInterval(fetchCartCount, 15000);
    return () => clearInterval(interval);
  }, [loading]);

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
      <button
        type="button"
        onClick={() => router.push("/user/cart")} // ✅ route to cart page
        className="relative text-gray-600 hover:text-black transition cursor-pointer"
        aria-label="Cart"
      >
        <ShoppingCart size={20} />

        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs min-w-5 h-5 px-1 flex items-center justify-center rounded-full">
            {cartCount > 99 ? "99+" : cartCount}
          </span>
        )}
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="text-gray-600 hover:text-black transition outline-none cursor-pointer">
            <User size={20} />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            onClick={() => router.push("/user/profile")}
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
