import { handleGetProductById } from "@/lib/actions/product-action";
import EditProductForm from "../components/EditProductForm";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>; // ✅ if you keep it as Promise
}) {
  const { id } = await params; // ✅ unwrap first

  const res = await handleGetProductById(id);

  if (!res.success) {
    return <p className="text-red-600">{res.message || "Product not found"}</p>;
  }

  // if you changed action to return data:
  // const product = res.data;

  const product = res.product; // ✅ if your action returns { product }

  return (
    <div className="p-6">
      <EditProductForm product={product} />
    </div>
  );
}
