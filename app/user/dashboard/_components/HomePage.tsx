'use client';

import Image from "next/image";
import CategoryCard from '@/app/user/dashboard/_components/Catregorycard';
import ProductSection from '@/app/user/dashboard/_components/ProductSection';
import ProductFilterBar from '@/app/user/dashboard/_components/ProductFillterBar';
import Link from "next/link";
import { useRouter } from "next/navigation";

const HomePage = () => {
    const router = useRouter();

  return (
<div className="flex-1 min-h-screen ">
{/* HERO SECTION */}
      <section className="relative h-[70vh] w-full">
        <Image
          src="/hero-store.jpg"
          fill
          className="object-cover"
          alt="Store"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative max-w-7xl mx-auto px-6 flex flex-col justify-center h-full text-white">
          <h1 className="text-4xl md:text-5xl font-bold max-w-2xl">
            All Your Daily Needs, All in One Place!
          </h1>
          <p className="mt-4 text-lg text-white/90 max-w-xl">
            Enjoy the convenience of shopping without having to leave your home.
          </p>
        </div>
      </section>

      {/* FILTER BAR */}
      <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
<ProductFilterBar
  onSubmit={({ search, category }) => {
    const sp = new URLSearchParams();

    if (search.trim()) sp.set("search", search.trim());
    if (category && category !== "all") sp.set("category", category);

    router.push(`/user/products?${sp.toString()}`);
  }}
/>
      </section>

      {/* CATEGORY */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-black">Category</h2>
        </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-6">
  <CategoryCard title="Meat & Fish" image="/categories/meat.png" href="/user/category/meat" />
  <CategoryCard title="Cooking Oil & Ghee" image="/categories/oil.png" href="/user/category/oil" />
  <CategoryCard title="Pulses" image="/categories/pluse.png" href="/user/category/pulses" />
  <CategoryCard title="Bakery" image="/categories/bakery.png" href="/user/category/bakery" />
  <CategoryCard title="Snacks" image="/categories/snacks.png" href="/user/category/snacks" />
  <CategoryCard title="Beverages" image="/categories/beverages.png" href="/user/category/beverages" />
</div>
      </section>

      {/* PRODUCT SECTIONS */}

<Link href="/user/products">
  <button className="text-green-600 font-medium text-right px-10 hover:underline">
    See all
  </button>
</Link>
      <ProductSection title="Trending items" />
      <ProductSection title="Recently Added" />
      <ProductSection title="Best Seller" />
      <ProductSection title="Seasonal Favorites" />
    </div>
  );
};

export default HomePage;
