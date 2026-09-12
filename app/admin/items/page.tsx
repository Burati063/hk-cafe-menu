"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, UtensilsCrossed, X } from "lucide-react";
import type { MenuItem, Category } from "@/types/menu";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

const AVAILABLE_TAGS = ["Popular", "Spicy", "Vegetarian", "New"];

const itemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  nameAm: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  descriptionAm: z.string().optional().nullable(),
  price: z.coerce.number().positive("Price must be positive"),
  imageUrl: z.string().optional().nullable(),
  isAvailable: z.boolean(),
  tags: z.array(z.string()),
  categoryId: z.string().min(1, "Category is required"),
});
type ItemForm = z.infer<typeof itemSchema>;

export default function ItemsPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, control, watch, setValue, formState: { errors } } =
    useForm<ItemForm>({ resolver: zodResolver(itemSchema), defaultValues: { isAvailable: true, tags: [] } });

  const watchedTags = watch("tags") ?? [];

  const fetchData = useCallback(async () => {
    try {
      const [itemsRes, catsRes] = await Promise.all([fetch("/api/items"), fetch("/api/categories")]);
      setItems(await itemsRes.json());
      setCategories(await catsRes.json());
    } catch { toast.error("Failed to load data"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => {
    setEditingItem(null);
    reset({ name: "", nameAm: "", description: "", descriptionAm: "", price: 0, imageUrl: "", isAvailable: true, tags: [], categoryId: categories[0]?.id ?? "" });
    setDialogOpen(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditingItem(item);
    reset({ name: item.name, nameAm: item.nameAm ?? "", description: item.description ?? "", descriptionAm: item.descriptionAm ?? "", price: item.price, imageUrl: item.imageUrl ?? "", isAvailable: item.isAvailable, tags: item.tags, categoryId: item.categoryId });
    setDialogOpen(true);
  };

  const toggleTag = (tag: string) => {
    const current = watchedTags;
    setValue("tags", current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag]);
  };

  const onSubmit = async (data: ItemForm) => {
    setSubmitting(true);
    try {
      const url = editingItem ? `/api/items/${editingItem.id}` : "/api/items";
      const res = await fetch(url, { method: editingItem ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed to save");
      toast.success(editingItem ? "Item updated" : "Item created");
      setDialogOpen(false);
      fetchData();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Error"); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Item deleted");
      setDeleteId(null);
      fetchData();
    } catch { toast.error("Failed to delete"); }
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      await fetch(`/api/items/${item.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isAvailable: !item.isAvailable }) });
      fetchData();
    } catch { toast.error("Failed to update"); }
  };

  const filtered = items.filter((item) => filterCategory === "all" || item.categoryId === filterCategory);

  return (
    <div className="p-3 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Menu Items</h1>
          <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">{items.length} items · {categories.length} categories</p>
        </div>
        <Button onClick={openCreate} size="sm" className="gap-1 flex-shrink-0">
          <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add Item</span><span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* Filter */}
      <Select value={filterCategory} onValueChange={setFilterCategory}>
        <SelectTrigger className="w-full sm:w-52">
          <SelectValue placeholder="All categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          {categories.map((cat) => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
        </SelectContent>
      </Select>

      {/* Table / List */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <UtensilsCrossed className="w-10 h-10 text-muted-foreground/40 mx-auto" />
              <p className="text-muted-foreground text-sm">No items yet.</p>
              <Button size="sm" onClick={openCreate}><Plus className="w-4 h-4 mr-1" /> Add Item</Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[500px]">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-3 sm:px-4 py-3 font-medium text-muted-foreground w-10">Img</th>
                    <th className="text-left px-3 sm:px-4 py-3 font-medium text-muted-foreground">Name</th>
                    <th className="text-left px-3 sm:px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Category</th>
                    <th className="text-left px-3 sm:px-4 py-3 font-medium text-muted-foreground">Price</th>
                    <th className="text-left px-3 sm:px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Tags</th>
                    <th className="text-left px-3 sm:px-4 py-3 font-medium text-muted-foreground">On</th>
                    <th className="text-right px-3 sm:px-4 py-3 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-3 sm:px-4 py-2.5">
                        <div className="w-8 h-8 rounded-lg bg-muted overflow-hidden">
                          {item.imageUrl
                            ? <Image src={item.imageUrl} alt={item.name} width={32} height={32} className="object-cover w-full h-full" />
                            : <div className="w-full h-full flex items-center justify-center text-sm">🍽️</div>
                          }
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 py-2.5">
                        <div className="font-medium text-xs sm:text-sm">{item.name}</div>
                        {item.nameAm && <div className="text-[10px] text-muted-foreground">{item.nameAm}</div>}
                      </td>
                      <td className="px-3 sm:px-4 py-2.5 text-muted-foreground text-xs hidden sm:table-cell">{item.category?.name}</td>
                      <td className="px-3 sm:px-4 py-2.5 font-semibold text-accent text-xs sm:text-sm">{formatPrice(item.price)}</td>
                      <td className="px-3 sm:px-4 py-2.5 hidden md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map((tag) => <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">{tag}</Badge>)}
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 py-2.5">
                        <Switch checked={item.isAvailable} onCheckedChange={() => handleToggleAvailability(item)} aria-label={`Toggle ${item.name}`} />
                      </td>
                      <td className="px-3 sm:px-4 py-2.5">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(item)} aria-label={`Edit ${item.name}`}><Pencil className="w-3 h-3" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setDeleteId(item.id)} aria-label={`Delete ${item.name}`}><Trash2 className="w-3 h-3" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg w-[calc(100vw-1rem)] max-h-[92dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Item" : "New Menu Item"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mt-1">
            {/* Name EN + AM */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="item-name" className="text-xs">Name (EN) *</Label>
                <Input id="item-name" placeholder="HK Milk Tea" {...register("name")} className="h-8 text-sm" />
                {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="item-nameam" className="text-xs">Name (አማርኛ)</Label>
                <Input id="item-nameam" placeholder="HK ወተት ሻይ" {...register("nameAm")} className="h-8 text-sm" />
              </div>
            </div>

            {/* Description EN + AM */}
            <div className="space-y-1">
              <Label className="text-xs">Description (EN)</Label>
              <Textarea placeholder="Short description…" rows={2} {...register("description")} className="text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Description (አማርኛ)</Label>
              <Textarea placeholder="አጭር መግለጫ…" rows={2} {...register("descriptionAm")} className="text-sm" />
            </div>

            {/* Price + Category */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="item-price" className="text-xs">Price (HKD) *</Label>
                <Input id="item-price" type="number" step="1" min="0" placeholder="0" {...register("price")} className="h-8 text-sm" />
                {errors.price && <p className="text-destructive text-xs">{errors.price.message}</p>}
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Category *</Label>
                <Controller name="categoryId" control={control} render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select…" /></SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )} />
                {errors.categoryId && <p className="text-destructive text-xs">{errors.categoryId.message}</p>}
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-1">
              <Label htmlFor="item-image" className="text-xs">Image URL</Label>
              <Input id="item-image" placeholder="https://…" {...register("imageUrl")} className="h-8 text-sm" />
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <Label className="text-xs">Tags</Label>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_TAGS.map((tag) => (
                  <button key={tag} type="button" onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${watchedTags.includes(tag) ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border hover:border-primary/50"}`}>
                    {watchedTags.includes(tag) && <X className="w-2.5 h-2.5 inline mr-0.5" />}{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <Label className="text-xs font-medium">Available</Label>
                <p className="text-[10px] text-muted-foreground">Show on public menu</p>
              </div>
              <Controller name="isAvailable" control={control} render={({ field }) => (
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              )} />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" size="sm" disabled={submitting}>
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {editingItem ? "Save" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent className="max-w-xs w-[calc(100vw-2rem)]">
          <DialogHeader><DialogTitle>Delete Item?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" size="sm" onClick={() => deleteId && handleDelete(deleteId)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
