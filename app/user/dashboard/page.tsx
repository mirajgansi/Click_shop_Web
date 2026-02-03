import { handleWhoami } from "@/lib/actions/auth-actions";
import { notFound } from "next/navigation";
import Dashboard from "../../admin/dashboard/page";

export default async function Page() {
  const result = await handleWhoami();

  if (!result.success) {
    throw new Error("Error fetching user data");
  }

  if (!result.data) {
    notFound();
  }

  return (
    <>
      <Dashboard />
    </>
  );
}
