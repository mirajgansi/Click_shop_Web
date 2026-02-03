"use client";

import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";
import { handleDeleteUser } from "@/lib/actions/admin/user-action";
import DeleteModal from "@/app/_componets/DeleteModal";

type User = {
  _id: string;
  username: string;
  email: string;
  role: "user" | "admin" | "driver";
  phoneNumber?: string;
  location?: string;
  DOB?: string;
};

type Pagination = {
  page: number;
  size: number;
  total: number;
  totalPages: number;
};

export default function UsersTable({
  users,
  pagination,
  search,
}: {
  users: User[];
  pagination: Pagination;
  search?: string;
}) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(search || "");

  const pushWithParams = (next: { page?: number; search?: string }) => {
    const params = new URLSearchParams();

    const nextSearch = (next.search ?? searchTerm).trim();
    const nextPage = next.page ?? pagination.page ?? 1;

    if (nextSearch) params.set("search", nextSearch);
    if (nextPage > 1) params.set("page", String(nextPage)); // keep url clean
    // size is fixed (10) in server example; add if you want:
    // params.set("size", String(pagination.size ?? 10));

    router.push(`/admin/users?${params.toString()}`);
  };

  const onSearch = () => pushWithParams({ page: 1, search: searchTerm });
  const onClear = () => {
    setSearchTerm("");
    router.push("/admin/users");
  };
  const [deleteId, setDeleteId] = useState<string | null>(null);

  
  const onDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await handleDeleteUser(deleteId);
      if (!res.success) throw new Error(res.message || "Failed to delete user");
      toast.success("user deleted successfully");
      router.refresh(); 
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user");
    } finally {
      setDeleteId(null);
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-3">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by username, email, phone, location..."
          className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
        />
        <button
          type="button"
          onClick={onSearch}
          className="h-10 whitespace-nowrap rounded-md border px-3 text-sm"
        >
          Search
        </button>
        <button
          type="button"
          onClick={onClear}
          className="h-10 whitespace-nowrap rounded-md border px-3 text-sm"
        >
          Clear
        </button>
      </div>

      {/* Table */}
      {users.length === 0 ? (
        <p className="text-sm text-gray-600">No users found</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-900">
              <tr className="text-left">
                <th className="px-4 py-2">Username</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Location</th>
                <th className="px-4 py-2">Date of Birth</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t">
                  <td className="px-4 py-2">{user.username}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2 capitalize">{user.role}</td>
                  <td className="px-4 py-2">{user.phoneNumber ?? "-"}</td>
                  <td className="px-4 py-2">{user.location ?? "-"}</td>
                  <td className="px-4 py-2">
                    {user.DOB ? new Date(user.DOB).toLocaleDateString() : "-"}
                  </td>

                  <td className="px-4 py-2 text-right">
                    <div className="inline-flex gap-2">
                      <NextLink
                        href={`/admin/user/${user._id}/edit`}
                        className="inline-flex h-8 items-center rounded-md border px-3 text-sm text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30"
                      >
                        Edit
                      </NextLink>

                     <button
                      type="button"
                      className="h-8 rounded-md border border-red-500 px-3 text-sm text-red-600 cursor-pointer"
                      onClick={() => setDeleteId(user._id)}
                    >
                      Delete
                    </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
       <DeleteModal
  isOpen={!!deleteId}
  onClose={() => setDeleteId(null)}
  onConfirm={onDelete}
  title="Delete Confirmation"
  description="Are you sure you want to delete this user? This action cannot be undone."
  
/>
      {/* Pagination */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Page <span className="font-medium">{pagination.page}</span> of{" "}
          <span className="font-medium">{pagination.totalPages}</span> • Total{" "}
          <span className="font-medium">{pagination.total}</span>
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => pushWithParams({ page: Math.max(1, pagination.page - 1) })}
            disabled={pagination.page <= 1}
            className="h-9 rounded-md border px-3 text-sm disabled:opacity-50"
          >
            Prev
          </button>

          <button
            type="button"
            onClick={() =>
              pushWithParams({ page: Math.min(pagination.totalPages, pagination.page + 1) })
            }
            disabled={pagination.page >= pagination.totalPages}
            className="h-9 rounded-md border px-3 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
