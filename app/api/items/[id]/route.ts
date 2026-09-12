import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { normalizeItem, serializeTags } from "@/lib/db-utils";

const itemUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  nameAm: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  descriptionAm: z.string().optional().nullable(),
  price: z.number().positive().optional(),
  imageUrl: z.string().optional().nullable(),
  isAvailable: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  sortOrder: z.number().optional(),
  categoryId: z.string().optional(),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    const data = itemUpdateSchema.parse(body);

    const item = await prisma.menuItem.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.nameAm !== undefined && { nameAm: data.nameAm }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.descriptionAm !== undefined && { descriptionAm: data.descriptionAm }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl || null }),
        ...(data.isAvailable !== undefined && { isAvailable: data.isAvailable }),
        ...(data.tags !== undefined && { tags: serializeTags(data.tags) }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
        ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
      },
      include: { category: { select: { id: true, name: true, nameAm: true, slug: true } } },
    });
    return NextResponse.json(normalizeItem(item));
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.errors }, { status: 400 });
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    await prisma.menuItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
