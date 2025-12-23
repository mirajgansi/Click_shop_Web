'use client';
import { Heart, ShoppingCart } from 'lucide-react';

type ProductCardProps = {
  image: string;
  name: string;
  price: number;
  unit?: string;
  stock?: string;
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
  onToggleWishlist,
}: ProductCardProps) {
  return (
    <div className="w-64 bg-white rounded-3xl p-4 shadow-sm relative">
      
      {/* Wishlist Icon */}
      <button
        onClick={onToggleWishlist}
        className="absolute top-4 right-4"
        aria-label="Add to wishlist"
      >
        <Heart className="w-6 h-6 text-gray-400 hover:text-red-500 transition" />
      </button>

      {/* Product Image */}
      <div className="bg-gray-100 rounded-2xl p-4 flex justify-center items-center">
        <img src={image} alt={name} className="h-24 object-contain" />
      </div>

      {/* Stock Badge */}
      <div className="mt-3 inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
        <span className="w-4 h-4 bg-green-500 rounded-full" />
        {stock}
      </div>

      {/* Product Name */}
      <h3 className="mt-3 text-lg font-semibold text-gray-900">
        {name}
      </h3>

      {/* Price & Cart */}
      <div className="mt-2 flex items-center justify-between">
        <p className="text-green-600 text-lg font-bold">
          ${price.toFixed(2)}
          <span className="text-gray-500 text-sm font-normal">
            /{unit}
          </span>
        </p>

        <button
          onClick={onAddToCart}
          className="bg-green-500 text-white p-3 rounded-full shadow-md hover:bg-green-600 transition"
          aria-label="Add to cart"
        >
          <ShoppingCart size={18} />
        </button>
      </div>
    </div>
  );
}
