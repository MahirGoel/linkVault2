import { useState } from "react";
import { Layers, Plus, Edit2, Trash2, Search, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/EmptyState";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import type { Category, Link } from "@shared/schema";

const colorOptions = [
  "#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899", "#06b6d4",
  "#ef4444", "#84cc16", "#f97316", "#6366f1", "#14b8a6", "#a855f7",
];

export default function Categories() {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: "", color: colorOptions[0] });
  const { toast } = useToast();

  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    enabled: isAuthenticated,
  });

  const { data: links = [] } = useQuery<Link[]>({
    queryKey: ["/api/links"],
    enabled: isAuthenticated,
  });

  const createCategoryMutation = useMutation({
    mutationFn: (data: { name: string; color: string }) =>
      apiRequest("POST", "/api/categories", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: "Category created" });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string; color: string } }) =>
      apiRequest("PATCH", `/api/categories/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: "Category updated" });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: "Category deleted" });
    },
  });

  const getCategoryLinkCount = (categoryName: string) => {
    return links.filter((l) => l.category === categoryName).length;
  };

  const categoriesWithCounts = categories.map((c) => ({
    ...c,
    linkCount: getCategoryLinkCount(c.name),
  }));

  const filteredCategories = categoriesWithCounts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalLinks = links.length;

  const openCreateDialog = () => {
    setEditCategory(null);
    setFormData({ name: "", color: colorOptions[Math.floor(Math.random() * colorOptions.length)] });
    setEditDialogOpen(true);
  };

  const openEditDialog = (category: Category & { linkCount: number }) => {
    setEditCategory(category);
    setFormData({
      name: category.name,
      color: category.color || colorOptions[0],
    });
    setEditDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;

    if (editCategory) {
      updateCategoryMutation.mutate({
        id: editCategory.id,
        data: { name: formData.name.trim(), color: formData.color },
      });
    } else {
      createCategoryMutation.mutate({
        name: formData.name.trim(),
        color: formData.color,
      });
    }
    setEditDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteCategoryMutation.mutate(id);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="px-4 md:px-8 py-4 border-b">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-semibold">Categories</h1>
            <p className="text-muted-foreground text-sm">
              {categories.length} categories · {totalLinks} total links
            </p>
          </div>
          <Button onClick={openCreateDialog} data-testid="button-create-category">
            <Plus className="w-4 h-4 mr-2" />
            Create Category
          </Button>
        </div>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-categories"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto px-4 md:px-8 py-4">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : filteredCategories.length === 0 ? (
          <EmptyState
            icon={Layers}
            title="No categories found"
            description="Create categories to organize your links by topic."
            actionLabel="Create Category"
            onAction={openCreateDialog}
          />
        ) : (
          <div className="space-y-3 max-w-3xl">
            {filteredCategories.map((category) => (
              <Card
                key={category.id}
                className="p-4 hover-elevate group"
                data-testid={`card-category-${category.id}`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-muted-foreground cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="w-5 h-5" />
                  </div>

                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${category.color || "#3b82f6"}20` }}
                  >
                    <Layers className="w-6 h-6" style={{ color: category.color || "#3b82f6" }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium">{category.name}</h3>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">{category.linkCount}</p>
                      <p className="text-xs text-muted-foreground">links</p>
                    </div>

                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(category)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(category.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editCategory ? "Edit Category" : "Create Category"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">Name</Label>
              <Input
                id="category-name"
                placeholder="e.g., Development"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                data-testid="input-category-name"
              />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full transition-transform ${
                      formData.color === color ? "ring-2 ring-offset-2 ring-primary scale-110" : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData({ ...formData, color })}
                    type="button"
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!formData.name.trim()} data-testid="button-save-category">
              {editCategory ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
