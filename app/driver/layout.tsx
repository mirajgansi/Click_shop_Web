import { handleWhoami } from "@/lib/actions/auth-actions";
import { notFound } from "next/navigation";
import DriverLayoutClient from "./_components/DriverShell";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const result = await handleWhoami();

  if (!result?.success || !result?.data) {
    notFound();
  }

  return (
    <DriverLayoutClient user={result.data}>
      {children}
    </DriverLayoutClient>
  );
}
