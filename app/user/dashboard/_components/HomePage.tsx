"use client";

import Image from "next/image";
import CategoryCard from "@/app/user/dashboard/_components/Catregorycard";
import ProductSection from "@/app/user/dashboard/_components/ProductSection";
import ProductFilterBar from "@/app/user/dashboard/_components/ProductFillterBar";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();

  return (
    <div className="flex-1 min-h-screen bg-gray-50">
      {/* HERO */}
      <section className="relative h-[55vh] w-full">
        <Image
          src="/hero-store.jpg"
          fill
          className="object-cover"
          alt="Store"
          priority
        />
        <div className="absolute inset-0 bg-black/35" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 flex flex-col justify-center h-full text-white">
          <h1 className="text-3xl md:text-4xl font-bold max-w-2xl leading-tight">
            All Your Daily Needs, All in One Place!
          </h1>
          <p className="mt-3 text-base md:text-lg text-white/90 max-w-xl">
            Enjoy the convenience of shopping without having to leave your home.
          </p>
        </div>
      </section>

      {/* FILTER */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
        <ProductFilterBar
          onSubmit={({ search, category }) => {
            const sp = new URLSearchParams();
            if (search.trim()) sp.set("search", search.trim());
            if (category && category !== "all") sp.set("category", category);
            router.push(`/user/products?${sp.toString()}`);
          }}
        />
      </section>

      {/* CATEGORY + PRODUCTS */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
<div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT SIDEBAR */}
          <div className="w-60 bg-white rounded-2xl border border-gray-200 p-4 space-y-2 h-fit">
            <h3 className="text-base font-semibold mb-2">Categories</h3>

            <CategoryCard title="Meat & Fish" image="/categories/meat.png" href="/user/category/meat" />
            <CategoryCard title="Cooking Oil & Ghee" image="/categories/oil.png" href="/user/category/oil" />
            <CategoryCard title="Pulses" image="/categories/pluse.png" href="/user/category/pulses" />
            <CategoryCard title="Bakery" image="/categories/bakery.png" href="/user/category/bakery" />
            <CategoryCard title="Snacks" image="/categories/snacks.png" href="/user/category/snacks" />
            <CategoryCard title="Beverages" image="/categories/beverages.png" href="/user/category/beverages" />
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex-1 space-y-10">
            <ProductSection title="Trending items" kind="trending" />
            <ProductSection title="Recently Added" kind="recent" />
            <ProductSection title="Best Seller" kind="bestSeller" />
            <ProductSection title="Seasonal Favorites" kind="seasonal" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
