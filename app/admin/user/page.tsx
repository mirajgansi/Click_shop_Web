import { handleGetAllUSER } from "@/lib/actions/admin/user-action";
import UsersTable from "./_componenet/usersTable";
import Link from "next/link";

export default async function Page({
  searchParams,
}: {
  searchParams?: { search?: string; page?: string };
}) {
  const search = searchParams?.search ?? "";
  const page = Number(searchParams?.page ?? "1");
  const size = 10;

  const res = await handleGetAllUSER({ page, size, search });

  if (!res.success) {
    return <p className="text-red-600">{res.message || "Failed to fetch users"}</p>;
  }

  return (
    <div className="p-4">
        <Link className="text-blue-500 border border-blue-500 p-2 rounded inline-block mb-10"
             href="/admin/user/create">Create new User</Link>
    <UsersTable
      users={res.users ?? []}
      pagination={res.pagination}
      search={search}
    />
    </div>
  );
}
