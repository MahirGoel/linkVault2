import { useState } from "react";
import { Layers, Plus, Edit2, Trash2, Link as LinkIcon, Search, GripVertical } from "lucide-react";
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

interface CategoryData {
  id: string;
  name: string;
  description?: string;
  linkCount: number;
  icon?: string;
  color?: string;
}

// todo: remove mock functionality
const mockCategories: CategoryData[] = [
  { id: "1", name: "Development", description: "Programming, coding, and software development resources", linkCount: 45, color: "#3b82f6" },
  { id: "2", name: "Design", description: "UI/UX, graphics, and visual design", linkCount: 28, color: "#8b5cf6" },
  { id: "3", name: "Marketing", description: "Digital marketing, SEO, and growth strategies", linkCount: 15, color: "#10b981" },
  { id: "4", name: "Business", description: "Entrepreneurship, startups, and business resources", linkCount: 22, color: "#f59e0b" },
  { id: "5", name: "Personal", description: "Personal interests and hobbies", linkCount: 18, color: "#ec4899" },
  { id: "6", name: "Learning", description: "Courses, tutorials, and educational content", linkCount: 34, color: "#06b6d4" },
];

const colorOptions = [
  "#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899", "#06b6d4",
  "#ef4444", "#84cc16", "#f97316", "#6366f1", "#14b8a6", "#a855f7",
];

export default function Categories() {
  const [categories, setCategories] = useState<CategoryData[]>(mockCategories);
  const [searchQuery, setSearchQuery] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<CategoryData | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "", color: colorOptions[0] });
  const { toast } = useToast();

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalLinks = categories.reduce((sum, c) => sum + c.linkCount, 0);

  const openCreateDialog = () => {
    setEditCategory(null);
    setFormData({ name: "", description: "", color: colorOptions[Math.floor(Math.random() * colorOptions.length)] });
    setEditDialogOpen(true);
  };

  const openEditDialog = (category: CategoryData) => {
    setEditCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      color: category.color || colorOptions[0],
    });
    setEditDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;

    if (editCategory) {
      setCategories(categories.map((c) =>
        c.id === editCategory.id
          ? { ...c, name: formData.name.trim(), description: formData.description.trim(), color: formData.color }
          : c
      ));
      toast({ title: "Category updated" });
    } else {
      const newCategory: CategoryData = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        linkCount: 0,
        color: formData.color,
      };
      setCategories([...categories, newCategory]);
      toast({ title: "Category created" });
    }
    setEditDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id));
    toast({ title: "Category deleted" });
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
        {filteredCategories.length === 0 ? (
          <EmptyState
            icon={Layers}
            title="No categories found"
            description="Create categories to organize your links by topic."
            actionLabel="Create Category"
            onAction={openCreateDialog}
          />
        ) : (
          <div className="space-y-3 max-w-3xl">
            {filteredCategories.map((category, index) => (
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
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <Layers className="w-6 h-6" style={{ color: category.color }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium">{category.name}</h3>
                    {category.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {category.description}
                      </p>
                    )}
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
              <Label htmlFor="category-description">Description (optional)</Label>
              <Textarea
                id="category-description"
                placeholder="What kind of links go in this category?"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                data-testid="input-category-description"
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
