import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeCategory } from "@/lib/db-utils";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: { items: { orderBy: { sortOrder: "asc" } } },
    });
    return NextResponse.json(categories.map(normalizeCategory));
  } catch {
    return NextResponse.json({ error: "Failed to fetch menu" }, { status: 500 });
  }
}
