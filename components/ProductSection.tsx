'use client';

import ProductCard from "./product/Productcard";

function ProductSection({ title }: { title: string }) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-2xl text-black font-semibold mb-6">{title}</h2>

      <div className="grid grid-rows-2 md:grid-rows-2 lg:grid-rows-2 gap-6">
        {Array.from({ length: 2 }).map((_, index) => (
          <ProductCard key={index} image="/cookie.jpg" name="Wai Wai" price={5} />
        ))}
      </div>
    </section>
  );
}

export default ProductSection;