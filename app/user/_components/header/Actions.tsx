"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import {
  Heart,
  ShoppingCart,
  Search,
  User,
  LogOut,
  UserCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getMyCart } from "@/lib/api/cart";

// ✅ import your drawer
import CartDrawer from "@/app/user/cart/components/CartDrawer"; // adjust path

type CartItem = { quantity: number };
type CartResponse = {
  data?: { items?: CartItem[] } | any;
  items?: CartItem[];
};

export default function Actions() {
  const router = useRouter();
  const { logout, loading } = useAuth();

  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {
    try {
      const res: CartResponse = await getMyCart();
      const items: CartItem[] =
        res?.data?.items || res?.items || res?.data?.data?.items || [];

      const totalQty = items.reduce(
        (sum, it) => sum + (Number(it.quantity) || 0),
        0,
      );
      setCartCount(totalQty);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    if (loading) return;

    fetchCartCount();
    const interval = setInterval(fetchCartCount, 15000);
    return () => clearInterval(interval);
  }, [loading]);

  if (loading) return null;

  return (
    <>
      <div className="flex items-center gap-5">
        {/* Search */}
        <button
          type="button"
          className="text-gray-600 hover:text-black transition"
          aria-label="Search"
        >
          <Search size={20} />
        </button>

        {/* Wishlist */}
        <button
          type="button"
          className="relative text-gray-600 hover:text-red-500 transition"
          aria-label="Wishlist"
        >
          <Heart size={20} />
        </button>

        {/* Cart (opens drawer) */}
        <button
          type="button"
          onClick={() => setCartOpen(true)}
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

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="text-gray-600 hover:text-black transition outline-none cursor-pointer"
              aria-label="User menu"
            >
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

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
