import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { normalizeItem, serializeTags } from "@/lib/db-utils";

const itemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  nameAm: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  descriptionAm: z.string().optional().nullable(),
  price: z.number().positive("Price must be positive"),
  imageUrl: z.string().optional().nullable(),
  isAvailable: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  sortOrder: z.number().optional(),
  categoryId: z.string().min(1, "Category is required"),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");

    const items = await prisma.menuItem.findMany({
      where: categoryId ? { categoryId } : {},
      orderBy: [{ sortOrder: "asc" }],
      include: { category: { select: { id: true, name: true, nameAm: true, slug: true } } },
    });
    return NextResponse.json(items.map(normalizeItem));
  } catch {
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = itemSchema.parse(body);
    const count = await prisma.menuItem.count({ where: { categoryId: data.categoryId } });

    const item = await prisma.menuItem.create({
      data: {
        name: data.name,
        nameAm: data.nameAm ?? null,
        description: data.description ?? null,
        descriptionAm: data.descriptionAm ?? null,
        price: data.price,
        imageUrl: data.imageUrl || null,
        isAvailable: data.isAvailable ?? true,
        tags: serializeTags(data.tags ?? []),
        sortOrder: data.sortOrder ?? count,
        categoryId: data.categoryId,
      },
      include: { category: { select: { id: true, name: true, nameAm: true, slug: true } } },
    });
    return NextResponse.json(normalizeItem(item), { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.errors }, { status: 400 });
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}
