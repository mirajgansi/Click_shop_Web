"use client";

import ProductCard from "@/app/user/_components/Productcard";
import { useEffect, useMemo, useState } from "react";
import { getAllProduct } from "@/lib/api/product"; // ✅ adjust path to your product.ts
import { toast } from "react-toastify";
import { handleAddCartItem } from "@/lib/actions/cart-action";
import { SkeletonCard } from "../../_components/skeletonCard";

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

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);          
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
    const interval = setInterval(fetchProducts, 15000);

    return () => clearInterval(interval);
  }, []);

  const fiveSlots = useMemo(() => {
    if (products.length >= 5) return products.slice(0, 5);
    return [...products, ...Array.from({ length: 5 - products.length }).map(() => null)];
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


const showSkeleton = loading && products.length === 0;
  return (
    <section className="max-w mx-auto px-10 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl text-black font-semibold">{title}</h2>

      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

     <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
  {showSkeleton
    ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} idx={i} />)
    : fiveSlots.map((p, idx) => {
        if (!p) return <SkeletonCard key={idx} idx={idx} />;

        return (
          <div key={p._id} className="relative">
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