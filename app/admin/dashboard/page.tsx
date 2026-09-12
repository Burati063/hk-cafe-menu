import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UtensilsCrossed, Tag, CheckCircle, XCircle, TrendingUp } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { parseTags } from "@/lib/db-utils";

async function getDashboardData() {
  const [totalCategories, totalItems, availableItems, unavailableItems, rawPopular, rawRecent] =
    await Promise.all([
      prisma.category.count(),
      prisma.menuItem.count(),
      prisma.menuItem.count({ where: { isAvailable: true } }),
      prisma.menuItem.count({ where: { isAvailable: false } }),
      prisma.menuItem.findMany({
        include: { category: { select: { name: true } } },
        take: 20,
        orderBy: { sortOrder: "asc" },
      }),
      prisma.menuItem.findMany({
        orderBy: { createdAt: "desc" },
        include: { category: { select: { name: true } } },
        take: 5,
      }),
    ]);

  // parseTags handles both string[] (PostgreSQL) and JSON string (SQLite)
  const popularItems = rawPopular
    .filter((item) => parseTags(item.tags).includes("Popular"))
    .slice(0, 5);

  return { totalCategories, totalItems, availableItems, unavailableItems, popularItems, recentItems: rawRecent };
}

export default async function DashboardPage() {
  const { totalCategories, totalItems, availableItems, unavailableItems, popularItems, recentItems } =
    await getDashboardData();

  const stats = [
    { title: "Categories", value: totalCategories, icon: Tag, href: "/admin/categories", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/40" },
    { title: "Total Items", value: totalItems, icon: UtensilsCrossed, href: "/admin/items", color: "text-primary", bg: "bg-green-50 dark:bg-green-950/40" },
    { title: "Available", value: availableItems, icon: CheckCircle, href: "/admin/items", color: "text-green-600", bg: "bg-green-50 dark:bg-green-950/40" },
    { title: "Unavailable", value: unavailableItems, icon: XCircle, href: "/admin/items", color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/40" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Overview of your menu</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="p-4">
                <div className={`inline-flex p-2 rounded-lg ${stat.bg} mb-2`}>
                  <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.title}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Popular */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              <CardTitle className="text-sm sm:text-base">Popular Items</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {popularItems.length === 0 ? (
              <p className="text-muted-foreground text-sm px-6 pb-4">No popular items tagged yet.</p>
            ) : (
              <ul className="divide-y divide-border">
                {popularItems.map((item) => (
                  <li key={item.id} className="flex items-center justify-between px-4 sm:px-6 py-2.5">
                    <div className="min-w-0 mr-2">
                      <div className="text-sm font-medium truncate">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.category.name}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-sm font-semibold text-accent">{formatPrice(item.price)}</span>
                      {!item.isAvailable && <Badge variant="secondary" className="text-xs">Off</Badge>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Recent */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-accent" />
              <CardTitle className="text-sm sm:text-base">Recently Added</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {recentItems.length === 0 ? (
              <p className="text-muted-foreground text-sm px-6 pb-4">No items yet.</p>
            ) : (
              <ul className="divide-y divide-border">
                {recentItems.map((item) => (
                  <li key={item.id} className="flex items-center justify-between px-4 sm:px-6 py-2.5">
                    <div className="min-w-0 mr-2">
                      <div className="text-sm font-medium truncate">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.category.name}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-sm font-semibold text-accent">{formatPrice(item.price)}</span>
                      <Badge variant={item.isAvailable ? "default" : "secondary"} className="text-xs">
                        {item.isAvailable ? "On" : "Off"}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm sm:text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Link href="/admin/items">
              <button className="px-3 sm:px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs sm:text-sm font-medium hover:bg-primary/90 transition-colors">
                + Add Item
              </button>
            </Link>
            <Link href="/admin/categories">
              <button className="px-3 sm:px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-xs sm:text-sm font-medium hover:bg-secondary/80 transition-colors">
                + Add Category
              </button>
            </Link>
            <Link href="/admin/qr">
              <button className="px-3 sm:px-4 py-2 rounded-lg bg-accent text-white text-xs sm:text-sm font-medium hover:bg-accent/90 transition-colors">
                QR Code
              </button>
            </Link>
            <Link href="/menu" target="_blank">
              <button className="px-3 sm:px-4 py-2 rounded-lg border border-border text-xs sm:text-sm font-medium hover:bg-muted transition-colors">
                View Menu ↗
              </button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
