import Header from "./_components/Header";
import Sidebar from "./_components/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <aside className="hidden xl:flex min-h-screen w-64 shrink-0">
        <Sidebar />
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col bg-background">
        {/* Header */}
        <Header />

        {/* Page content */}
        <main className="flex-1 px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
