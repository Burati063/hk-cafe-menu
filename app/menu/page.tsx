import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { MenuPageClient } from "./menu-client";
import { normalizeCategory } from "@/lib/db-utils";

export const metadata: Metadata = {
  title: "Menu — HK Cafe",
  description: "Browse our authentic Hong Kong menu — from silky milk teas to wonton noodles and egg tarts.",
};

export const revalidate = 60;

async function getMenuData() {
  try {
    const [rawCategories, settingsArr] = await Promise.all([
      prisma.category.findMany({
        orderBy: { sortOrder: "asc" },
        include: { items: { orderBy: { sortOrder: "asc" } } },
      }),
      prisma.setting.findMany(),
    ]);

    const categories = rawCategories.map(normalizeCategory);
    const settings = Object.fromEntries(settingsArr.map((s) => [s.key, s.value]));
    return { categories, settings };
  } catch {
    return { categories: [], settings: {} };
  }
}

export default async function MenuPage() {
  const { categories, settings } = await getMenuData();
  return <MenuPageClient categories={categories} settings={settings} />;
}
