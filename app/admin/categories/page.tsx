"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Tag } from "lucide-react";
import type { Category } from "@/types/menu";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  nameAm: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  descriptionAm: z.string().optional().nullable(),
});
type CategoryForm = z.infer<typeof categorySchema>;

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
  });

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/categories");
      setCategories(await res.json());
    } catch { toast.error("Failed to load categories"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const openCreate = () => {
    setEditingCategory(null);
    reset({ name: "", nameAm: "", description: "", descriptionAm: "" });
    setDialogOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditingCategory(cat);
    reset({ name: cat.name, nameAm: cat.nameAm ?? "", description: cat.description ?? "", descriptionAm: cat.descriptionAm ?? "" });
    setDialogOpen(true);
  };

  const onSubmit = async (data: CategoryForm) => {
    setSubmitting(true);
    try {
      const url = editingCategory ? `/api/categories/${editingCategory.id}` : "/api/categories";
      const res = await fetch(url, { method: editingCategory ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      toast.success(editingCategory ? "Category updated" : "Category created");
      setDialogOpen(false);
      fetchCategories();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Error"); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Deleted");
      setDeleteId(null);
      fetchCategories();
    } catch { toast.error("Failed to delete"); }
  };

  return (
    <div className="p-3 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-5">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Categories</h1>
          <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">Manage menu categories</p>
        </div>
        <Button onClick={openCreate} size="sm" className="gap-1 flex-shrink-0">
          <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add Category</span><span className="sm:hidden">Add</span>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
          ) : categories.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Tag className="w-10 h-10 text-muted-foreground/40 mx-auto" />
              <p className="text-muted-foreground text-sm">No categories yet.</p>
              <Button size="sm" onClick={openCreate}><Plus className="w-4 h-4 mr-1" /> Add</Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-3 sm:px-4 py-3 font-medium text-muted-foreground">Name</th>
                    <th className="text-left px-3 sm:px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Amharic</th>
                    <th className="text-left px-3 sm:px-4 py-3 font-medium text-muted-foreground">Items</th>
                    <th className="text-right px-3 sm:px-4 py-3 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-3 sm:px-4 py-3">
                        <div className="font-medium text-sm">{cat.name}</div>
                        <div className="text-xs text-muted-foreground font-mono">{cat.slug}</div>
                        {cat.description && <div className="text-xs text-muted-foreground truncate max-w-[160px] sm:hidden">{cat.description}</div>}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-sm hidden sm:table-cell">
                        {cat.nameAm ? <span className="font-medium">{cat.nameAm}</span> : <span className="text-muted-foreground">—</span>}
                      </td>
                      <td className="px-3 sm:px-4 py-3">
                        <Badge variant="secondary">{cat._count?.items ?? 0}</Badge>
                      </td>
                      <td className="px-3 sm:px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(cat)} aria-label={`Edit ${cat.name}`}><Pencil className="w-3 h-3" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setDeleteId(cat.id)} aria-label={`Delete ${cat.name}`}><Trash2 className="w-3 h-3" /></Button>
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
        <DialogContent className="max-w-md w-[calc(100vw-1rem)]">
          <DialogHeader><DialogTitle>{editingCategory ? "Edit Category" : "New Category"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mt-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="cat-name" className="text-xs">Name (EN) *</Label>
                <Input id="cat-name" placeholder="Breakfast" {...register("name")} className="h-8 text-sm" />
                {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="cat-nameam" className="text-xs">Name (አማርኛ)</Label>
                <Input id="cat-nameam" placeholder="ቁርስ" {...register("nameAm")} className="h-8 text-sm" />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Description (EN)</Label>
              <Textarea placeholder="Short description…" rows={2} {...register("description")} className="text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Description (አማርኛ)</Label>
              <Textarea placeholder="አጭር መግለጫ…" rows={2} {...register("descriptionAm")} className="text-sm" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" size="sm" disabled={submitting}>
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {editingCategory ? "Save" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent className="max-w-xs w-[calc(100vw-2rem)]">
          <DialogHeader><DialogTitle>Delete Category?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">All items in this category will also be deleted.</p>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" size="sm" onClick={() => deleteId && handleDelete(deleteId)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
