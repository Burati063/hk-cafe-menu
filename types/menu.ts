export interface MenuItem {
  id: string;
  name: string;
  nameAm: string | null;
  description: string | null;
  descriptionAm: string | null;
  price: number;
  imageUrl: string | null;
  isAvailable: boolean;
  tags: string[];
  sortOrder: number;
  categoryId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  category?: {
    id: string;
    name: string;
    nameAm: string | null;
    slug: string;
  };
}

export interface Category {
  id: string;
  name: string;
  nameAm: string | null;
  slug: string;
  description: string | null;
  descriptionAm: string | null;
  sortOrder: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  items: MenuItem[];
  _count?: { items: number };
}

export interface Settings {
  cafe_name?: string;
  cafe_name_am?: string;
  cafe_tagline?: string;
  cafe_tagline_am?: string;
  cafe_description?: string;
  cafe_description_am?: string;
  opening_hours?: string;
  phone?: string;
  address?: string;
  currency?: string;
  menu_url?: string;
}

export type Language = "en" | "am";
