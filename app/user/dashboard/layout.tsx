'use client';

import Image from "next/image";
import CategoryCard from '@/components/Catregorycard';
import ProductSection from '@/components/ProductSection';
import ProductFilterBar from '@/components/ProductFillterBar';

const HomePage = () => {
  return (
    <div className="bg-white">
     

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
          onSearch={(query) => console.log('Search:', query)}
          onCategoryChange={(category) => console.log('Category:', category)}
          onFind={() => console.log('Find product clicked')}
        />
      </section>

      {/* CATEGORY */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-black">Category</h2>
          <button className="text-green-600 font-medium">See all</button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-6">
          <CategoryCard title="Meat & Fish" image="/categories/meat.png" href="/category/meat" />
          <CategoryCard title="Cooking Oil & Ghee" image="/categories/oil.png" href="/category/oil" />
          <CategoryCard title="Pulses" image="/categories/pluse.png" href="/category/pulses" />
          <CategoryCard title="Bakery" image="/categories/bakery.png" href="/category/bakery" />
          <CategoryCard title="Snacks" image="/categories/snacks.png" href="/category/snacks" />
          <CategoryCard title="Beverages" image="/categories/beverages.png" href="/category/beverages" />
        </div>
      </section>

      {/* PRODUCT SECTIONS */}
      <ProductSection title="Trending items" />
      <ProductSection title="Recently Added" />
      <ProductSection title="Best Seller" />
      <ProductSection title="Seasonal Favorites" />
    </div>
  );
};

export default HomePage;
