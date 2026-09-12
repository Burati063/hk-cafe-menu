import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // middleware already handles unauthenticated redirects for non-login pages
  // this is a server-side fallback
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
