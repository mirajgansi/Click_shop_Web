import { notFound } from "next/navigation";
import { handleGetProductsByCategory } from "@/lib/actions/product-action";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // ✅ unwrap params first

const res = await handleGetProductsByCategory(slug);

  if (!res?.success) return notFound();

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold capitalize">{slug}</h1>

      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
        {(res.products ?? []).map((p: any) => (
          <div key={p._id} className="rounded-lg border p-3">
            {p.name}
          </div>
        ))}
      </div>
    </div>
  );
}
