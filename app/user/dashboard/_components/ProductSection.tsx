"use client";

import ProductCard from "@/app/user/_components/Productcard";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { SkeletonCard } from "../../_components/skeletonCard";
import { handleAddCartItem } from "@/lib/actions/cart-action";
import Link from "next/link";

import {
  getAllProduct,
  getProductsByCategory,
  getTopRatedProducts,
} from "@/lib/api/product";

import {
  handleGetPopularProducts,
  handleGetRecentProducts,
  handleGetTrendingProducts,
} from "@/lib/actions/product-action";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

type Product = {
  _id: string;
  name: string;
  price: number;
  image?: string;
  inStock?: number;
};

export type Kind =
  | "recent"
  | "trending"
  | "popular"
  | "topRated"
  | "bestSeller"
  | "seasonal"
  | "category";

function buildImageUrl(image?: string) {
  if (!image) return "/cookie.jpg";
  if (image.startsWith("http")) return image;
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  return `${base}/${image.replace(/^\/+/, "")}`;
}

export default function ProductSection({
  title,
  kind,
  limit = 4,
  category,
}: {
  title: string;
  kind: Kind;
  limit?: number;
  category?: string;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState<Record<string, boolean>>({});
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      let res: any;

      switch (kind) {
        case "recent":
          res = await handleGetRecentProducts(limit); 
          break;

        case "trending":
        case "bestSeller":
          res = await handleGetTrendingProducts(limit);
          break;

        case "popular":
          res = await handleGetPopularProducts(limit);
          break;

        case "topRated":
          res = await getTopRatedProducts(limit); 
          break;

        case "category":
          res = await getProductsByCategory(category || "");
          break;

        case "seasonal":
          // until you create seasonal endpoint, reuse recent
          res = await handleGetRecentProducts(limit);
          break;

        default:
          res = await getAllProduct({ page: 1, size: limit });
      }

      const list: Product[] = res?.data?.products || res?.data || res?.products || [];
      setProducts(list.slice(0, limit));
    } catch (e: any) {
      setError(e.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(fetchProducts, 15000);
    return () => clearInterval(interval);
  }, [kind, limit, category]); 

  const slots = useMemo(() => {
    if (products.length >= limit) return products.slice(0, limit);
    return [...products, ...Array.from({ length: limit - products.length }).map(() => null)];
  }, [products, limit]);

  const onAddCart = async (p: Product) => {
    if ((p.inStock ?? 0) <= 0) {
      toast.error("Out of stock");
      return;
    }

    try {
      setAdding((prev) => ({ ...prev, [p._id]: true }));

      const res = await handleAddCartItem({ productId: p._id, quantity: 1 });

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message || "Added to cart");
    } finally {
      setAdding((prev) => ({ ...prev, [p._id]: false }));
    }
  };
const [canLeft, setCanLeft] = useState(false);
const [canRight, setCanRight] = useState(false);
const scrollLeft = () => {
  const el = scrollRef.current;
  if (!el) return;
  el.scrollBy({ left: -el.clientWidth, behavior: "smooth" });
};

const scrollRight = () => {
  const el = scrollRef.current;
  if (!el) return;
  el.scrollBy({ left: el.clientWidth, behavior: "smooth" });
};
useEffect(() => {
  const el = scrollRef.current;
  if (!el) return;

  const update = () => {
    setCanLeft(el.scrollLeft > 0);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  };

  update();
  el.addEventListener("scroll", update);
  window.addEventListener("resize", update);
  return () => {
    el.removeEventListener("scroll", update);
    window.removeEventListener("resize", update);
  };
}, [products]);

  const showSkeleton = loading && products.length === 0;

 return (
  <section className="w-full py-6">
    {/* Header */}
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-lg md:text-xl text-black font-semibold">{title}</h2>

      <Link
        href={`/user/products?type=${kind}`}
        className="text-green-600 text-sm font-medium hover:underline"
      >
        See all →
      </Link>
    </div>

    {error && <p className="mb-3 text-xs text-red-600">{error}</p>}

    <div className="relative">
      {/* LEFT ARROW */}
      <button
        onClick={scrollLeft}
        disabled={!canLeft}
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white shadow p-1.5 hover:bg-gray-100 ${
          !canLeft ? "opacity-40 cursor-not-allowed" : ""
        }`}
        aria-label="Scroll left"
      >
        <ChevronLeft size={18} />
      </button>

      {/* RIGHT ARROW */}
      <button
        onClick={scrollRight}
        disabled={!canRight}
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white shadow p-1.5 hover:bg-gray-100 ${
          !canRight ? "opacity-40 cursor-not-allowed" : ""
        }`}
        aria-label="Scroll right"
      >
        <ChevronRight size={18} />
      </button>

      {/* ✅ Scroll row (smaller + compact) */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth px-6"
      >
        {showSkeleton
          ? Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="min-w-[180px]">
                <SkeletonCard idx={i} />
              </div>
            ))
          : products.map((p) => (
              <div key={p._id} className="min-w-[180px] md:min-w-[200px] relative">
                <ProductCard
                  id={p._id}
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
                    <span className="text-xs font-medium">Adding…</span>
                  </div>
                )}
              </div>
            ))}
      </div>
    </div>
  </section>
);

}
