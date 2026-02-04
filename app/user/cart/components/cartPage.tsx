"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { toast } from "react-toastify";

import { getMyCart, updateCartItemQuantity, removeCartItem, clearCart } from "@/lib/api/cart";

type Product = {
  _id: string;
  name: string;
  price: number;
  image?: string;
};

type CartItem = {
  productId: string | Product; // could be populated object or string
  quantity: number;
};

type Cart = {
  items: CartItem[];
};

function buildImageUrl(image?: string) {
  if (!image) return "/cookie.jpg";
  if (image.startsWith("http")) return image;
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  return `${base}/${image.replace(/^\/+/, "")}`;
}

function getProduct(item: CartItem): Product | null {
  if (typeof item.productId === "string") return null;
  return item.productId;
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart>({ items: [] });
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await getMyCart();

      // support different shapes
      const items: CartItem[] = res?.data?.items || res?.items || res?.data?.data?.items || [];
      setCart({ items });
    } catch (e: any) {
      toast.error(e.message || "Failed to load cart");
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const total = useMemo(() => {
    return cart.items.reduce((sum, item) => {
      const p = getProduct(item);
      const price = p?.price ?? 0;
      return sum + price * item.quantity;
    }, 0);
  }, [cart.items]);

  const changeQty = async (productId: string, nextQty: number) => {
    if (nextQty < 1) return;

    try {
      await updateCartItemQuantity(productId, nextQty);
      await fetchCart();
    } catch (e: any) {
      toast.error(e.message || "Failed to update quantity");
    }
  };

  const removeItem = async (productId: string) => {
    try {
      await removeCartItem(productId);
      toast.success("Item removed");
      await fetchCart();
    } catch (e: any) {
      toast.error(e.message || "Failed to remove item");
    }
  };

  const onClearCart = async () => {
    try {
      await clearCart();
      toast.success("Cart cleared");
      await fetchCart();
    } catch (e: any) {
      toast.error(e.message || "Failed to clear cart");
    }
  };

  if (loading) {
    return <div className="p-10 text-sm text-gray-500">Loading cart...</div>;
  }

  // ✅ Empty state
  if (!cart.items.length) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
          <ShoppingCart className="h-10 w-10 text-gray-500" />
        </div>
        <h2 className="mt-6 text-2xl font-semibold">No items in cart</h2>
        <p className="mt-2 text-sm text-gray-500">
          Add products to your cart and they will show up here.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your Cart</h1>

        <button
          type="button"
          onClick={onClearCart}
          className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm hover:bg-black/5"
        >
          <Trash2 className="h-4 w-4" />
          Clear cart
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => {
            const product = getProduct(item);

            // If backend does NOT populate product, you need to fetch product details by id.
            if (!product) {
              return (
                <div key={String(item.productId)} className="rounded-2xl border p-4">
                  <p className="text-sm text-gray-600">
                    Product details not available. (Backend needs populate)
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-500">ID: {String(item.productId)}</span>
                    <button
                      type="button"
                      onClick={() => removeItem(String(item.productId))}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            }

            const id = product._id;
            const lineTotal = product.price * item.quantity;

            return (
              <div key={id} className="flex gap-4 rounded-2xl border bg-white p-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-gray-100">
                  <Image
                    src={buildImageUrl(product.image)}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(id)}
                      className="rounded-full p-2 text-gray-500 hover:bg-black/5 hover:text-red-600"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    {/* Qty controls */}
                    <div className="inline-flex items-center rounded-full border">
                      <button
                        type="button"
                        onClick={() => changeQty(id, item.quantity - 1)}
                        className="p-2 hover:bg-black/5"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>

                      <span className="w-10 text-center text-sm font-medium">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => changeQty(id, item.quantity + 1)}
                        className="p-2 hover:bg-black/5"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="font-semibold">${lineTotal.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="rounded-2xl border bg-white p-5 h-fit">
          <h3 className="text-lg font-semibold">Order Summary</h3>

          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-gray-600">Items</span>
            <span className="font-medium">{cart.items.length}</span>
          </div>

          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-gray-600">Total</span>
            <span className="text-lg font-semibold">${total.toFixed(2)}</span>
          </div>

          <button
            type="button"
            className="mt-5 w-full rounded-full bg-green-600 py-3 text-sm font-semibold text-white hover:opacity-90"
            onClick={() => toast.info("Checkout coming soon")}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
