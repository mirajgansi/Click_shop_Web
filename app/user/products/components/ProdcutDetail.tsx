"use client";

import Image from "next/image";
import { useMemo, useState, useTransition } from "react";
import { Heart, Share2, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { handleAddCartItem } from "@/lib/actions/cart-action";
import { handleCreateOrder } from "@/lib/actions/order-action";

type Product = {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  price: number;
  category?: string;
  inStock?: number;
  unit?: string; 
};

export default function ProductDetailClient({
  product,
  images,
}: {
  product: Product;
  images: string[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const inStock = product.inStock ?? 0;
  const outOfStock = inStock <= 0;

  const safeImages = images?.length ? images : ["/cookie.jpg"];
  const [activeImage, setActiveImage] = useState(safeImages[0]);

  const [quantity, setQuantity] = useState(1);


    const [expanded, setExpanded] = useState(false);

    const DESCRIPTION_LIMIT = 160; // characters
    const fullDescription = product.description || "No description available.";
    const isLong = fullDescription.length > DESCRIPTION_LIMIT;

const shortDescription = isLong
  ? fullDescription.slice(0, DESCRIPTION_LIMIT) + "..."
  : fullDescription;

  const totalPrice = useMemo(() => {
    const base = Number(product.price || 0);
  }, [product.price, quantity, ]);

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

  const onAddToCart = () => {
    if (outOfStock) return;

    startTransition(async () => {
      try {
        // ✅ adjust payload to match your backend
        const res = await handleAddCartItem({
          productId: product._id,
          quantity,
        } as any);

        if (res?.success) {
          toast.success("Added to cart!");
          router.refresh();
        } else {
          toast.error(res?.message || "Failed to add to cart");
        }
      } catch (e: any) {
        toast.error(e?.message || "Failed to add to cart");
      }
    });
  };

  const onShopNow = () => {
    if (outOfStock) return;

    startTransition(async () => {
      try {
        const res = await handleCreateOrder({
          items: [
            {
              productId: product._id,
              quantity,
            },
          ],
        } as any);

        if (res?.success) {
          toast.success("Order created!");
          // if you have an order page, navigate:
          // router.push(`/user/orders/${res.data._id}`);
          router.refresh();
        } else {
          toast.error(res?.message || "Failed to create order");
        }
      } catch (e: any) {
        toast.error(e?.message || "Failed to create order");
      }
    });
  };

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      {/* LEFT: Gallery */}
      <div className="space-y-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-50">
            <Image
              src={activeImage}
              alt={product.name}
              fill
              className="object-contain"
              unoptimized
              priority
            />
          </div>
        </div>

        {/* Thumbnails */}
        <div className="flex items-center gap-4">
          {safeImages.slice(0, 4).map((img) => {
            const isActive = img === activeImage;
            return (
              <button
                key={img}
                type="button"
                onClick={() => setActiveImage(img)}
                className={`h-24 w-28 rounded-2xl border bg-white p-2 shadow-sm transition ${
                  isActive ? "border-green-500 ring-2 ring-green-200" : "border-transparent hover:border-gray-200"
                }`}
              >
                <div className="relative h-full w-full">
                  <Image src={img} alt="thumb" fill className="object-contain" unoptimized />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT: Details */}
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-gray-500">{product.category ?? "Category"}</p>
            <h1 className="mt-1 text-3xl font-semibold text-gray-900">{product.name}</h1>
            <p className="mt-2 text-2xl font-bold text-green-600">
              ${Number(product.price).toFixed(2)}
              <span className="ml-1 text-sm font-medium text-gray-500">/{product.unit ?? "per kg"}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="rounded-full p-2 hover:bg-gray-100" aria-label="Share">
              <Share2 className="h-5 w-5 text-gray-600" />
            </button>
            <button className="rounded-full p-2 hover:bg-gray-100" aria-label="Favorite">
              <Heart className="h-5 w-5 text-gray-600" />
            </button>
            <button className="rounded-full p-2 hover:bg-gray-100" aria-label="More">
              <span className="text-xl text-gray-600">⋯</span>
            </button>
          </div>
        </div>

       <p className="text-sm leading-relaxed text-gray-600">
            {expanded ? fullDescription : shortDescription}

            {isLong && (
                <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="ml-2 font-semibold text-green-600 hover:underline"
                >
                {expanded ? "Read less" : "Read more"}
                </button>
            )}
            </p>

        <hr />

        {/* Controls row like screenshot */}
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Quantity */}
          <div>
            <p className="mb-2 text-xs font-semibold text-gray-500">Quantity</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity((q) => clamp(q - 1, 1, 999))}
                className="rounded-full bg-gray-100 p-2 hover:bg-gray-200"
              >
                <Minus className="h-4 w-4" />
              </button>

              <div className="min-w-10 text-center font-semibold">{quantity}</div>

              <button
                type="button"
                onClick={() => setQuantity((q) => clamp(q + 1, 1, 999))}
                className="rounded-full bg-green-600 p-2 text-white hover:opacity-90"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

        

          {/* Stock badge */}
          <div className="flex items-end">
            {outOfStock ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-2 text-sm font-semibold text-red-700">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                Out of stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-2 text-sm font-semibold text-green-700">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                {inStock}+ in stock
              </span>
            )}
          </div>
        </div>

        {/* Buttons row */}
        <div className="grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={onAddToCart}
            disabled={pending || outOfStock}
            className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold shadow-sm transition ${
              outOfStock
                ? "cursor-not-allowed bg-gray-200 text-gray-500"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            {pending ? "Working..." : `Add to Cart $${totalPrice}`}
          </button>

          <button
            type="button"
            onClick={onShopNow}
            disabled={pending || outOfStock}
            className={`rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-md transition ${
              outOfStock ? "cursor-not-allowed bg-gray-300" : "bg-green-700 hover:opacity-95"
            }`}
          >
            Shop Now
          </button>
        </div>

        {/* Delivery notice
        <div className="rounded-2xl border bg-white p-4 text-sm text-gray-600 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 h-6 w-6 rounded-full bg-red-100 text-center font-bold text-red-600">
              !
            </div>
            <div>
              <p className="font-semibold text-gray-900">Delivery Delay</p>
              <p className="mt-1 text-xs leading-relaxed">
                We apologize for the delay in delivering your order. This occurred due to operational issues beyond our
                control. Our team is following up to ensure items arrive as soon as possible. Thank you for your
                understanding and patience.
              </p>
            </div>
          </div>
        </div> */}
      </div>

    </div>
  );
}
