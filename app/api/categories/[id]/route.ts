import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { slugify } from "@/lib/utils";

const categorySchema = z.object({
  name: z.string().min(1).optional(),
  nameAm: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  descriptionAm: z.string().optional().nullable(),
  sortOrder: z.number().optional(),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    const data = categorySchema.parse(body);

    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) { updateData.name = data.name; updateData.slug = slugify(data.name); }
    if (data.nameAm !== undefined) updateData.nameAm = data.nameAm;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.descriptionAm !== undefined) updateData.descriptionAm = data.descriptionAm;
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;

    const category = await prisma.category.update({ where: { id }, data: updateData });
    return NextResponse.json(category);
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.errors }, { status: 400 });
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
