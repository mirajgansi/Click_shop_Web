'use client';
import ProductCard from '@/components/card';
import Header from '@/components/header/Header';
import Image from "next/image";

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
  <div className="absolute inset-0 bg-black/40" />

  <div className="relative max-w-7xl mx-auto px-6 py-24 text-white">
    <h1 className="text-4xl md:text-5xl font-bold max-w-xl">
    All Your Daily Needs, All in One Place!    </h1>
    <p className="mt-4 text-lg text-white/90 max-w-lg">
      Enjoy the convenience of shopping without having to leave your home.    </p>
  </div>
</section>

        <section className="max-w-7xl mx-auto px-6 py-12">
  <h2 className="text-2xl font-semibold mb-6 text-black">Category</h2>

  <div className="grid grid-cols-4 md:grid-cols-8 gap-6">
  </div>
</section>
      <section className="max-w-7xl mx-auto px-6 py-12">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-semibold text-black">Popular Products</h2>
    <button className="text-green-600 font-medium">View all</button>
  </div>

  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <ProductCard
  image="/cooskie.jpg"
  name="Wai Wai"
  price={5}
  onAddToCart={() => console.log('Added to cart')}
  onToggleWishlist={() => console.log('Wishlist toggled')}
/>
</div>
</section>
</div>
    </div>
  )
}

export default homePage;