"use client";

import { handleGetAllUSER } from "@/lib/actions/admin/user-action";
import { Icon, Link, Pencil } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type User = {
  _id: string;
  username: string;
  email: string;
  role: "user" | "admin" | "driver";
  phoneNumber?: string;
  location?: string;
  DOB?: string; // make optional to avoid crash
};

type Pagination = {
  page: number;
  size: number;
  total: number;
  totalPages: number;
};

export function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // search + pagination state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [size] = useState(10);

  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    size: 10,
    total: 0,
    totalPages: 1,
  });

  // Debounce search input (300ms)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  // When search changes, go back to page 1
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  // Fetch users when page/search changes
  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError(null);

      try {
        const res = await handleGetAllUSER({
          page,
          size,
          search: debouncedSearch,
        });

        if (!res.success) {
          throw new Error(res.message || "Failed to fetch users");
        }

        setUsers(res.users ?? []);
        if (res.pagination) setPagination(res.pagination);
        else {
          // fallback if backend doesn’t return pagination
          setPagination((p) => ({ ...p, page }));
        }
      } catch (err: any) {
        setError(err.message);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [page, size, debouncedSearch]);

  const pageNumbers = useMemo(() => {
    // show up to 5 pages around current
    const totalPages = pagination.totalPages || 1;
    const current = pagination.page || page;

    const start = Math.max(1, current - 2);
    const end = Math.min(totalPages, start + 4);

    const nums: number[] = [];
    for (let i = start; i <= end; i++) nums.push(i);
    return nums;
  }, [pagination.totalPages, pagination.page, page]);

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="flex items-center gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by username, email, phone, location..."
          className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
        />
        <button
          type="button"
          onClick={() => setSearch("")}
          className="h-10 whitespace-nowrap rounded-md border px-3 text-sm"
        >
          Clear
        </button>
      </div>

      {/* Table */}
      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-900 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Username</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">Location</th>
                <th className="px-4 py-2 text-left">Date of Birth</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>

         <tbody>
  {loading ? (
    <tr>
      <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500">
        Loading users...
      </td>
    </tr>
  ) : users.length === 0 ? (
    <tr>
      <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500">
        No users found
      </td>
    </tr>
  ) : (
  users.map((user) => (
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
   <Link
        href={`/admin/user/${user._id}/edit`}
        className="inline-flex h-8 items-center gap-2 rounded-md border  text-sm
                  text-blue-600 hover:bg-blue-50
                  dark:text-blue-400 dark:hover:bg-blue-900/30"
      >
        Edit
      </Link>

        <button
          type="button"
          className="h-8 rounded-md border border-red-500 px-3 text-sm text-red-600 disabled:opacity-50"
          onClick={async () => {
            const ok = confirm(
              `Delete ${user.username}? This cannot be undone.`
            );
            if (!ok) return;

            // const res = await handleDeleteUser(user._id);

            // if (!res.success) {
            //   alert(res.message || "Delete failed");
            //   return;
            // }

            // ✅ remove from UI instantly
            setUsers((prev) => prev.filter((u) => u._id !== user._id));
          }}
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
))
  )}
</tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Page <span className="font-medium">{pagination.page}</span> of{" "}
          <span className="font-medium">{pagination.totalPages}</span>{" "}
          {typeof pagination.total === "number" ? (
            <>
              • Total <span className="font-medium">{pagination.total}</span>
            </>
          ) : null}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={pagination.page <= 1}
            className="h-9 rounded-md border px-3 text-sm disabled:opacity-50"
          >
            Prev
          </button>

          {pageNumbers.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPage(n)}
              className={`h-9 rounded-md border px-3 text-sm ${
                n === pagination.page ? "bg-gray-200 dark:bg-gray-800" : ""
              }`}
            >
              {n}
            </button>
          ))}

          <button
            type="button"
            onClick={() =>
              setPage((p) => Math.min(pagination.totalPages || p + 1, p + 1))
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
