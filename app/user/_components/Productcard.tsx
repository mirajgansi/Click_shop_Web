'use client';
import { Heart } from 'lucide-react';
import Image from "next/image";
import { useState } from 'react';

type ProductCardProps = {
  image: string;
  name: string;
  price: number;
  unit?: string;
  stock?: string;
  isFavorite: boolean;          
  onAddToCart?: () => void;
  onToggleWishlist?: () => void;
};

  
export default function ProductCard({
  image,
  name,
  price,
  unit = 'per kg',
  stock = '50+ in stock',
  onAddToCart,
  isFavorite,
  onToggleWishlist,
}: ProductCardProps) {
  return (
    <div className="w-64 bg-white rounded-3xl p-4 shadow-sm relative">
      
      <button
  type="button"
  onClick={() => onToggleWishlist?.()}
  className="absolute top-4 right-4 z-10 cursor-pointer"
  aria-label="Add to wishlist"
>
  <Heart
    className={`w-6 h-6 transition ${
      isFavorite ? "text-red-500" : "text-gray-400"
    }`}
    fill={isFavorite ? "currentColor" : "none"}
  />
</button>

      <div className="bg-gray-100 rounded-2xl p-4 flex justify-center items-center">
                <Image
            src={image}
            alt={name}
            width={120}
            height={100}
              unoptimized

            className="object"
          />
      </div>

      <div className="mt-3 inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
        <span className="w-4 h-4 bg-green-500 rounded-full" />
        {stock}
      </div>

      <h3 className="mt-3 text-lg font-semibold text-gray-900">
        {name}
      </h3>

      <div className="mt-2 flex items-center justify-between">
        <p className="text-green-600 text-lg font-bold">
          RS{price.toFixed(2)}
          <span className="text-gray-500 text-sm font-normal">
            /{unit}
          </span>
        </p>

        <button
          onClick={onAddToCart}
          className="bg-green-500 text-white p-3 rounded-full shadow-md hover:bg-green-600 transition cursor-pointer"
          aria-label="Add to cart"

        >
         <svg xmlns="http://www.w3.org/2000/svg" width={24} height={20} viewBox="0 0 24 24"><circle cx={10.5} cy={19.5} r={1.5} fill="currentColor"></circle><circle cx={17.5} cy={19.5} r={1.5} fill="currentColor"></circle><path fill="currentColor" d="M13 13h2v-2.99h2.99v-2H15V5.03h-2v2.98h-2.99v2H13z"></path><path fill="currentColor" d="M10 17h8a1 1 0 0 0 .93-.64L21.76 9h-2.14l-2.31 6h-6.64L6.18 4.23A2 2 0 0 0 4.33 3H2v2h2.33l4.75 11.38A1 1 0 0 0 10 17"></path></svg>
        </button>
      </div>
    </div>
  );
}
