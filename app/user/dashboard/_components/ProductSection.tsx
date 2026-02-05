"use client";

import ProductCard from "@/app/user/_components/Productcard";
import { useEffect, useMemo, useState } from "react";
import { getAllProduct } from "@/lib/api/product"; // ✅ adjust path to your product.ts
import { toast } from "react-toastify";
import { handleAddCartItem } from "@/lib/actions/cart-action";

type Product = {
  _id: string;
  name: string;
  price: number;
  image?: string; // backend may return image url/path
  inStock?: number;
};

function buildImageUrl(image?: string) {
  if (!image) return "/cookie.jpg";
  if (image.startsWith("http")) return image;
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  return `${base}/${image.replace(/^\/+/, "")}`;
}

export default function ProductSection({ title }: { title: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 const [adding, setAdding] = useState<Record<string, boolean>>({}); 
  // favorites stored by product id (best for refresh)
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
const isOutOfStock = (p: Product) => (p.inStock ?? 0) <= 0;

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const fetchProducts = async () => {
    try {
      setError(null);

      const res = await getAllProduct({ page: 1, size: 5 }); 
      const list: Product[] =
        res?.data?.products || res?.data || res?.products || [];

      setProducts(list.slice(0, 5));
    } catch (e: any) {
      setError(e.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    // refresh every 15 seconds (change to 10000 or 20000)
    const interval = setInterval(fetchProducts, 15000);

    return () => clearInterval(interval);
  }, []);

  // always show exactly 5 slots (nice layout)
  const fiveSlots = useMemo(() => {
    if (products.length >= 10) return products.slice(0, 10);
    return [...products, ...Array.from({ length: 10 - products.length }).map(() => null)];
  }, [products]);


const onAddCart = async (p: Product) => {
  if ((p.inStock ?? 0) <= 0) {
    toast.error("Out of stock");
    return;
  }

  try {
    setAdding((prev) => ({ ...prev, [p._id]: true }));

    const res = await handleAddCartItem({
      productId: p._id,
      quantity: 1,
    });

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success(res.message || "Added to cart");
  } finally {
    setAdding((prev) => ({ ...prev, [p._id]: false }));
  }
};


  return (
    <section className="max-w mx-auto px-10 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl text-black font-semibold">{title}</h2>

      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {fiveSlots.map((p, idx) => {
          if (!p) {
            return (
              <div
                key={`skeleton-${idx}`}
                className="w-64 rounded-3xl p-4 border bg-white animate-pulse"
              >
                <div className="h-36 rounded-2xl bg-gray-100" />
                <div className="mt-4 h-6 w-3/4 rounded bg-gray-100" />
                <div className="mt-2 h-5 w-1/2 rounded bg-gray-100" />
              </div>
            );
          }

          return (
            <div key={p._id} className="relative">
             <ProductCard
              image={buildImageUrl(p.image)}
              name={p.name}
              price={Number(p.price)}
              inStock={p.inStock ?? 0}
              isFavorite={!!favorites[p._id]}
              onToggleWishlist={() => toggleFavorite(p._id)}
              onAddToCart={() => onAddCart(p)}
            />

              {adding[p._id] && (
                <div className="absolute inset-0 grid place-items-center rounded-3xl bg-white/60">
                  <span className="text-sm font-medium">Adding…</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {loading && !products.length && (
        <p className="mt-4 text-sm text-gray-500">Loading products...</p>
      )}
    </section>
  );
}