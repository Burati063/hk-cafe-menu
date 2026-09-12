import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { parseTags } from "@/lib/db-utils";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const [totalCategories, totalItems, availableItems, unavailableItems, allItems] =
      await Promise.all([
        prisma.category.count(),
        prisma.menuItem.count(),
        prisma.menuItem.count({ where: { isAvailable: true } }),
        prisma.menuItem.count({ where: { isAvailable: false } }),
        prisma.menuItem.findMany({
          select: { id: true, name: true, price: true, tags: true, category: { select: { name: true } } },
          take: 20,
        }),
      ]);

    const popularItems = allItems
      .filter((item) => parseTags(item.tags).includes("Popular"))
      .slice(0, 5);

    return NextResponse.json({ totalCategories, totalItems, availableItems, unavailableItems, popularItems });
  } catch {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
