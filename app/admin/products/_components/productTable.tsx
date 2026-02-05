"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import DeleteModal from "@/app/_componets/DeleteModal";
import { handleDeleteProduct } from "@/lib/actions/product-action";
// import { handleDeleteProduct } from "@/lib/actions/admin/product-action"; // if you have it

export default function ProductTable({
  products,
  pagination,
  search,
}: {
  products: any[];
  pagination: any;
  search?: string;
}) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(search || "");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSearchChange = () => {
    router.push(`/admin/products?search=${encodeURIComponent(searchTerm)}`);
  };

  const onDelete = async () => {
    if (!deleteId) return;

    try {
      //  Uncomment when you have delete action ready
      const res = await handleDeleteProduct(deleteId);
      if (!res.success) throw new Error(res.message || "Failed to delete product");

      toast.success("Product deleted successfully");
      router.refresh(); // refresh list (or revalidatePath in server action)
    } catch (err: any) {
      toast.error(err.message || "Failed to delete product");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div>
      {/* Search */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search products..."
        className="input input-bordered w-full max-w-xs mb-4"
      />
      <button className="btn btn-primary mb-4" onClick={handleSearchChange}>
        Search
      </button>

   

      {/* Table */}
      <table className="table p-2 border">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>In Stock</th>
            <th>Available</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products?.map((product) => (
            <tr key={product._id}>
              <td className="max-w-[200px] truncate">{product._id}</td>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.category}</td>
              <td>{product.inStock}</td>
              <td>{product.available ? "Yes" : "No"}</td>
              <td>
                <Link
                  href={`/admin/products/edit/${product._id}`}
                  className="btn btn-sm btn-primary mr-2"
                >
                  Edit
                </Link>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => setDeleteId(product._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {!products?.length && (
            <tr>
              <td colSpan={7} className="text-center py-6">
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
   {/* Delete modal */}
      <DeleteModal
  isOpen={!!deleteId}
  onClose={() => setDeleteId(null)}
  onConfirm={onDelete}
  title="Delete Confirmation"
  description="Are you sure you want to delete this product? This action cannot be undone."
/>
      {/* Pagination */}
      <div className="pagination mt-4 flex items-center gap-3">
        {pagination && (
          <>
            {pagination.page > 1 && (
              <Link
                href={`/admin/products?page=${pagination.page - 1}&size=${
                  pagination.size
                }&search=${encodeURIComponent(search ?? "")}`}
              >
                Previous
              </Link>
            )}

            <span>
              Page {pagination.page} of {pagination.totalPages}
            </span>

            {pagination.page < pagination.totalPages && (
              <Link
                href={`/admin/products?page=${pagination.page + 1}&size=${
                  pagination.size
                }&search=${encodeURIComponent(search ?? "")}`}
              >
                Next
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}
