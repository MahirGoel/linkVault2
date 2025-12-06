import { useState } from "react";
import { Tag, Plus, Edit2, Trash2, Link as LinkIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/EmptyState";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import type { Tag as TagType, Link } from "@shared/schema";

const colorOptions = [
  "#f7df1e", "#61dafb", "#264de4", "#e44d26", "#68a063",
  "#6c5ce7", "#00b894", "#fd79a8", "#a29bfe", "#636e72",
  "#ff7675", "#74b9ff", "#55efc4", "#ffeaa7", "#fab1a0",
];

export default function Tags() {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editTag, setEditTag] = useState<TagType | null>(null);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState(colorOptions[0]);
  const { toast } = useToast();

  const { data: tags = [], isLoading } = useQuery<TagType[]>({
    queryKey: ["/api/tags"],
    enabled: isAuthenticated,
  });

  const { data: links = [] } = useQuery<Link[]>({
    queryKey: ["/api/links"],
    enabled: isAuthenticated,
  });

  const createTagMutation = useMutation({
    mutationFn: (data: { name: string; color: string }) =>
      apiRequest("POST", "/api/tags", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tags"] });
      toast({ title: "Tag created" });
    },
  });

  const updateTagMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string; color: string } }) =>
      apiRequest("PATCH", `/api/tags/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tags"] });
      toast({ title: "Tag updated" });
    },
  });

  const deleteTagMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/tags/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tags"] });
      toast({ title: "Tag deleted" });
    },
  });

  const getTagLinkCount = (tagName: string) => {
    return links.filter((l) => l.tags?.includes(tagName)).length;
  };

  const tagsWithCounts = tags.map((t) => ({
    ...t,
    linkCount: getTagLinkCount(t.name),
  }));

  const filteredTags = tagsWithCounts.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedTags = [...filteredTags].sort((a, b) => b.linkCount - a.linkCount);

  const openCreateDialog = () => {
    setEditTag(null);
    setNewTagName("");
    setNewTagColor(colorOptions[Math.floor(Math.random() * colorOptions.length)]);
    setEditDialogOpen(true);
  };

  const openEditDialog = (tag: TagType & { linkCount: number }) => {
    setEditTag(tag);
    setNewTagName(tag.name);
    setNewTagColor(tag.color || colorOptions[0]);
    setEditDialogOpen(true);
  };

  const handleSave = () => {
    if (!newTagName.trim()) return;

    if (editTag) {
      updateTagMutation.mutate({
        id: editTag.id,
        data: { name: newTagName.trim().toLowerCase(), color: newTagColor },
      });
    } else {
      createTagMutation.mutate({
        name: newTagName.trim().toLowerCase(),
        color: newTagColor,
      });
    }
    setEditDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteTagMutation.mutate(id);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="px-4 md:px-8 py-4 border-b">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-semibold">Tags</h1>
            <p className="text-muted-foreground text-sm">{tags.length} tags total</p>
          </div>
          <Button onClick={openCreateDialog} data-testid="button-create-tag">
            <Plus className="w-4 h-4 mr-2" />
            Create Tag
          </Button>
        </div>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-tags"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto px-4 md:px-8 py-4">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : sortedTags.length === 0 ? (
          <EmptyState
            icon={Tag}
            title="No tags found"
            description="Create tags to organize your links better."
            actionLabel="Create Tag"
            onAction={openCreateDialog}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {sortedTags.map((tag) => (
              <Card
                key={tag.id}
                className="p-4 hover-elevate cursor-pointer group"
                data-testid={`card-tag-${tag.id}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${tag.color || "#6c5ce7"}20` }}
                    >
                      <Tag className="w-5 h-5" style={{ color: tag.color || "#6c5ce7" }} />
                    </div>
                    <div>
                      <p className="font-mono font-medium">{tag.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <LinkIcon className="w-3 h-3" />
                        {tag.linkCount} links
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditDialog(tag);
                      }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(tag.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
            <DialogTitle>{editTag ? "Edit Tag" : "Create Tag"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tag-name">Name</Label>
              <Input
                id="tag-name"
                placeholder="e.g., javascript"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value.toLowerCase())}
                className="font-mono"
                data-testid="input-tag-name"
              />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full transition-transform ${
                      newTagColor === color ? "ring-2 ring-offset-2 ring-primary scale-110" : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewTagColor(color)}
                    type="button"
                  />
                ))}
              </div>
            </div>
            <div className="pt-2">
              <Label>Preview</Label>
              <div className="mt-2">
                <Badge
                  className="font-mono"
                  style={{
                    backgroundColor: `${newTagColor}20`,
                    color: newTagColor,
                    borderColor: newTagColor,
                  }}
                >
                  {newTagName || "tag-name"}
                </Badge>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!newTagName.trim()} data-testid="button-save-tag">
              {editTag ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
