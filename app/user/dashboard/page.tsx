import { handleWhoami } from "@/lib/actions/auth-actions";
import { notFound } from "next/navigation";
import HomePage from "./_components/HomePage";

export default async function Page() {
  const result = await handleWhoami();

  if (!result.success) {
    throw new Error("Error fetching user data");
  }

  if (!result.data) {
    notFound();
  }

  return (
    <div className="bg-gray-100">
     <HomePage/>
    </div>
  );
}
