'use client';
import { useState } from 'react';

type ProductFilterBarProps = {
  onSearch: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onFind: () => void;
};

const ProductFilterBar = ({
  onSearch,
  onCategoryChange,
  onFind,
}: ProductFilterBarProps) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  return (
    <div className="bg-white shadow-md rounded-xl p-5">
      {/* Title row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Find your products
        </h3>
        <h3 className="text-lg font-semibold text-gray-800">
          Choose type
        </h3>
      </div>

      {/* Input row */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            onSearch(e.target.value);
          }}
          className="w-full md:flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* Category dropdown */}
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            onCategoryChange(e.target.value);
          }}
          className="w-full md:w-56 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="all">All Categories</option>
          <option value="snacks">Snacks</option>
          <option value="bakery">Bakery</option>
          <option value="beverages">Beverages</option>
          <option value="meat">Meat & Fish</option>
        </select>

        {/* Find button */}
        <button
          onClick={onFind}
          className="w-full md:w-auto bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Find Product
        </button>
      </div>
    </div>
  );
};

export default ProductFilterBar;
