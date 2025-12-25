'use client';
import ProductCard from '@/components/product/Productcard';
import Header from '@/components/header/Header';
import Image from "next/image";
import CategoryCard from '@/components/Catregorycard';
import ProductSection from '@/components/ProductSection';
import ProductFilterBar from '@/components/ProductFillterBar';

const homePage = () => {
  return (
    <div className='bg-white'>
    <div >
        <Header />
        <section className="relative">
  <Image
    src="/hero-store.jpg"
    fill
    className="object-cover"
    alt="Store"
  />
  <div className="absolute inset-0 bg-black/40 rounded-2xl" />

  <div className="relative max-w-7xl mx-auto px-6 py-30 text-white">
    <h1 className="text-4xl md:text-5xl font-bold w-full mt-10 ">
    All Your Daily Needs, All in One Place!</h1>
    <p className="mt-4 text-lg text-white/90 w-full">
      Enjoy the convenience of shopping without having to leave your home.</p>
  </div>
</section>

<section className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
  <ProductFilterBar
    onSearch={(query) => console.log('Search:', query)}
    onCategoryChange={(category) => console.log('Category:', category)}
    onFind={() => console.log('Find product clicked')}
  />
</section>

        <section className="max-w-7xl mx-auto px-6 py-12">
  <h2 className="text-2xl font-semibold mb-6 text-black">Category</h2>
  <h2 className="text-md mb-6 text-gray-600">see All</h2>
<div className="grid grid-cols-4 md:grid-cols-8 gap-6">
      <CategoryCard
        title="Meat & Fish"
        image="/categories/meat.png"
        href="/category/fruits"
      />
      <CategoryCard
        title="Cooking Oil & Ghee"
        image="/categories/oil.png"
        href="/category/vegetables"
      />
      <CategoryCard
        title="Pulses"
        image="/categories/pluse.png"
        href="/category/snacks"
      />
       <CategoryCard
        title="Bakery "
        image="/categories/bakery.png"
        href="/category/snacks"
      /> <CategoryCard
        title="Snacks"
        image="/categories/snacks.png"
        href="/category/snacks"
      />
       <CategoryCard
        title="Beverages"
        image="/categories/beverages.png"
        href="/category/snacks"
      />
    </div>
    
  <div className="grid grid-cols-4 md:grid-cols-8 gap-6">
  </div>
</section>
      <section className="max-w-7xl mx-auto px-6 py-12">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-semibold text-black">Popular Products</h2>
    <button className="text-green-600 font-medium  cursor-pointer">View all</button>
  </div>
<div className="flex flex-row gap-14 overflow-x-auto">
  {Array.from({ length: 6 }).map((_, index) => (
    <ProductCard
      key={index}
      image="/cookie.jpg"
      name="Wai Wai"
      price={5}
      onAddToCart={() => console.log('Added to cart')}
      onToggleWishlist={() => console.log('Wishlist toggled')} isFavorite={false}    />
  ))}

  {/* for real data */}
  {/* products.map(product => (
  <ProductCard key={product.id} {...product} />
)) */}
</div>
</section>
 <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-4 gap-3">
  <ProductSection title="Trending items" />
<ProductSection title="Recently Added" />
<ProductSection title="Best Seller" />
<ProductSection title="Seasonal Favorites" />
</div>
</div>
    </div>
  )
}

export default homePage;