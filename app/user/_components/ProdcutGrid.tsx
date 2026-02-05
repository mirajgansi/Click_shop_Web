"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import ProductCard from "@/app/user/_components/Productcard";
import { handleAddCartItem } from "@/lib/actions/cart-action";
import { getAllProduct } from "@/lib/api/product";
import { SkeletonCard } from "./skeletonCard";

type Product = {
  _id: string;
  name: string;
  price: number;
  image?: string;
  inStock?: number;
  unit?: string;
};

function buildImageUrl(image?: string) {
  if (!image) return "/cookie.jpg";
  if (image.startsWith("http")) return image;
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  return `${base}/${image.replace(/^\/+/, "")}`;
}

export default function ProductsGrid({
  title,
  pageSize = 20,
  refreshMs = 0,
}: {
  title?: string;
  pageSize?: number;   // ✅ 20 for all products
  refreshMs?: number;  // ✅ 10000 if you want auto refresh
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState<Record<string, boolean>>({});
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const fetchProducts = async () => {
    try {
      setError(null);
      const res = await getAllProduct({ page, size: pageSize });

      const list: Product[] =
        res?.products ||
        res?.data?.products ||
        res?.data?.data?.products ||
        res?.data ||
        [];

      setProducts(list);
    } catch (e: any) {
      setError(e.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    if (!refreshMs) return;
    const id = setInterval(fetchProducts, refreshMs);
    return () => clearInterval(id);
  }, [page, pageSize, refreshMs]);

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
      } as any);

      if (!res?.success) {
        toast.error(res?.message || "Failed to add to cart");
        return;
      }

      toast.success(res.message || "Added to cart");
    } finally {
      setAdding((prev) => ({ ...prev, [p._id]: false }));
    }
  };
const showSkeleton = loading && products.length === 0;

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      {title && (
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-black">{title}</h2>
        </div>
      )}

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-5">
          {showSkeleton
    ? Array.from({ length: pageSize }).map((_, i) => <SkeletonCard key={i} idx={i} />)
    : products.map((p) => (

          <div key={p._id} className="relative">
            <ProductCard
              id={p._id}
              image={buildImageUrl(p.image)}
              name={p.name}
              price={Number(p.price)}
              unit={p.unit ?? "per kg"}
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
        ))}
      </div>

      {loading && !products.length && (
        <p className="mt-4 text-sm text-gray-500">Loading products...</p>
      )}

      {/* simple pagination buttons */}
      <div className="mt-10 flex items-center justify-center gap-3">
        <button
          className="rounded-md border px-4 py-2 text-sm"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Previous
        </button>
        <span className="text-sm">Page {page}</span>
        <button
          className="rounded-md border px-4 py-2 text-sm"
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </section>
  );
}
