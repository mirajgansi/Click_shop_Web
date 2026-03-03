import Header from "./_components/header/Header";
import { handleWhoami } from "@/lib/actions/auth-actions";
import { AuthProvider } from "@/context/AuthContext";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const result = await handleWhoami();
  const user = result?.success ? result.data : null;

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Header user={user} />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}