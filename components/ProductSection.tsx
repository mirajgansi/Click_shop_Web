'use client';

import { useState } from "react";
import ProductCard from "./product/Productcard";

function ProductSection({ title }: { title: string }) {
   const [favorites, setFavorites] = useState<boolean[]>([false, false]);

  const toggleFavorite = (index: number) => {
    setFavorites((prev) =>
      prev.map((fav, i) => (i === index ? !fav : fav))
    );
  };
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-2xl text-black font-semibold mb-6">{title}</h2>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <ProductCard key={index} image="/cookie.jpg" name="Wai Wai" price={5}
            isFavorite={favorites[index]}
            onToggleWishlist={() => toggleFavorite(index)} />
        ))}
      </div>
    </section>
  );
}

export default ProductSection;