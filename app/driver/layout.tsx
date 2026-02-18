import Header from "./_components/Header";
import Sidebar from "./_components/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex flex-col">
      {/* Header full row */}
      <Header />

      {/* Content row under header */}
      <div className="flex flex-1 w-full">
        {/* Sidebar below header */}
        <aside className="hidden xl:block w-64 shrink-0 border-r border-black/10 bg-background">
          <Sidebar />
        </aside>

        {/* Main content */}
        <main className="flex-1 px-6 py-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
