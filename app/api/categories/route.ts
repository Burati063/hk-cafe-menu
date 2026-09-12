import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { slugify } from "@/lib/utils";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  nameAm: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  descriptionAm: z.string().optional().nullable(),
  sortOrder: z.number().optional(),
});

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { items: true } } },
    });
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = categorySchema.parse(body);
    const slug = slugify(data.name);

    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) return NextResponse.json({ error: "Category already exists" }, { status: 400 });

    const count = await prisma.category.count();
    const category = await prisma.category.create({
      data: {
        name: data.name,
        nameAm: data.nameAm ?? null,
        slug,
        description: data.description ?? null,
        descriptionAm: data.descriptionAm ?? null,
        sortOrder: data.sortOrder ?? count,
      },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.errors }, { status: 400 });
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
