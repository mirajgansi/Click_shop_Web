import { notFound } from "next/navigation";
import { handleGetProductsByCategory } from "@/lib/actions/product-action";
import CategoryProductsClient from "../component/page";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const res = await handleGetProductsByCategory(slug);
  if (!res?.success) return notFound();

  const products = res.products ?? [];

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold capitalize">{slug}</h1>

      {products.length ? (
        <CategoryProductsClient products={products} />
      ) : (
        <p className="mt-6 text-gray-500">No products found in this category.</p>
      )}
    </div>
  );
}
