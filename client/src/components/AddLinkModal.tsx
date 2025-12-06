import { useState } from "react";
import { Link as LinkIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TagInput } from "./TagInput";

interface AddLinkModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (link: LinkFormData) => void;
  categories?: string[];
  editData?: LinkFormData | null;
}

export interface LinkFormData {
  url: string;
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
  thumbnail?: string;
}

export function AddLinkModal({
  open,
  onClose,
  onSave,
  categories = [],
  editData,
}: AddLinkModalProps) {
  const [formData, setFormData] = useState<LinkFormData>(
    editData || {
      url: "",
      title: "",
      description: "",
      category: "",
      tags: [],
      thumbnail: "",
    }
  );
  const [urlError, setUrlError] = useState("");

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      setUrlError("");
      return true;
    } catch {
      setUrlError("Please enter a valid URL");
      return false;
    }
  };

  const handleSubmit = () => {
    if (!formData.url) {
      setUrlError("URL is required");
      return;
    }
    if (!validateUrl(formData.url)) return;

    onSave(formData);
    setFormData({
      url: "",
      title: "",
      description: "",
      category: "",
      tags: [],
      thumbnail: "",
    });
    onClose();
  };

  const handleClose = () => {
    setFormData({
      url: "",
      title: "",
      description: "",
      category: "",
      tags: [],
      thumbnail: "",
    });
    setUrlError("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LinkIcon className="w-5 h-5" />
            {editData ? "Edit Link" : "Add New Link"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL *</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={formData.url}
              onChange={(e) => {
                setFormData({ ...formData, url: e.target.value });
                if (urlError) validateUrl(e.target.value);
              }}
              className={urlError ? "border-destructive" : ""}
              data-testid="input-link-url"
            />
            {urlError && (
              <p className="text-sm text-destructive">{urlError}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title (optional)</Label>
            <Input
              id="title"
              placeholder="Link title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              data-testid="input-link-title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description of this link..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              data-testid="input-link-description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category (optional)</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger data-testid="select-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail URL (optional)</Label>
              <Input
                id="thumbnail"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                data-testid="input-link-thumbnail"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tags (optional)</Label>
            <TagInput
              value={formData.tags || []}
              onChange={(tags) => setFormData({ ...formData, tags })}
              placeholder="Type tag and press Enter..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={handleClose} data-testid="button-cancel-link">
            Cancel
          </Button>
          <Button onClick={handleSubmit} data-testid="button-save-link">
            {editData ? "Update" : "Save"} Link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
