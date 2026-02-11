import Image from "next/image";
import { handleGetProductById } from "@/lib/actions/product-action";
import { notFound } from "next/navigation";
import ProductDetailClient from "../components/ProdcutDetail";
import ProductSection from "../../dashboard/_components/ProductSection";

function buildImageUrl(image?: string) {
  if (!image) return "/cookie.jpg";
  if (image.startsWith("http")) return image;

  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  return `${base}/${image.replace(/^\/+/, "")}`;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await handleGetProductById(id);

  if (!res?.success) notFound();

  const product = res.product; // adjust if your action returns res.data
  if (!product?._id) notFound();

  // If you only have 1 image, we still create thumbnails using it.
  // If later you add product.images (array), you can map it here.
const images = product.images?.length
  ? product.images.map(buildImageUrl)
  : [buildImageUrl(product.image)];
 return (
  <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
    <ProductDetailClient product={product} images={images} />
    <div className="mt-10">
      <ProductSection title="Recently viewed" kind="recent" />
    </div>
  </div>
);

}
