import { useState } from "react";
import { FolderPlus } from "lucide-react";
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

interface CreatePlaylistModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { name: string; description: string }) => void;
  editData?: { name: string; description: string } | null;
}

export function CreatePlaylistModal({
  open,
  onClose,
  onSave,
  editData,
}: CreatePlaylistModalProps) {
  const [name, setName] = useState(editData?.name || "");
  const [description, setDescription] = useState(editData?.description || "");
  const [nameError, setNameError] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) {
      setNameError("Playlist name is required");
      return;
    }
    onSave({ name: name.trim(), description: description.trim() });
    setName("");
    setDescription("");
    setNameError("");
    onClose();
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setNameError("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5" />
            {editData ? "Edit Playlist" : "Create Playlist"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="playlist-name">Name *</Label>
            <Input
              id="playlist-name"
              placeholder="My awesome playlist"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError("");
              }}
              className={nameError ? "border-destructive" : ""}
              data-testid="input-playlist-name"
            />
            {nameError && (
              <p className="text-sm text-destructive">{nameError}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="playlist-description">Description (optional)</Label>
            <Textarea
              id="playlist-description"
              placeholder="What is this playlist about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              data-testid="input-playlist-description"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} data-testid="button-save-playlist">
            {editData ? "Update" : "Create"} Playlist
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
