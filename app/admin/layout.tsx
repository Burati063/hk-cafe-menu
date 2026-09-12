import { AdminSidebar } from "@/components/admin/sidebar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side session check (middleware already handles unauthenticated requests,
  // this is a fallback for direct server renders)
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar
        userName={session.user?.name ?? "Admin"}
        userEmail={session.user?.email ?? undefined}
      />
      <main className="flex-1 overflow-auto pt-14 lg:pt-0">
        <div className="min-h-screen">{children}</div>
      </main>
    </div>
  );
}
