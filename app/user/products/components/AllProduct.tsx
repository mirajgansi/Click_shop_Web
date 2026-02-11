"use client";

import { useRouter } from "next/navigation";
import ProductsGrid from "../../_components/ProdcutGrid";
import ProductFilterBar from "../../dashboard/_components/ProductFillterBar";

export default function AllProductsPage() {
  const router = useRouter();

  return (
    <div className="w-full px-6 py-8">
      
      {/* FILTER BAR */}
      <div className="w-full">
        <ProductFilterBar
          onSubmit={({ search, category }) => {
            const sp = new URLSearchParams();

            if (search?.trim()) sp.set("search", search.trim());
            if (category && category !== "all") sp.set("category", category);

            router.push(`/user/products?${sp.toString()}`);
          }}
        />
      </div>

        <ProductsGrid
          title=""
          pageSize={20}
          refreshMs={10000}

        />
      </div>

  );
}
