import { useState } from "react";
import { X, Trash2, FolderPlus, Share2, Tag, Star, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BatchActionsProps {
  selectedCount: number;
  onClearSelection: () => void;
  onDelete: () => void;
  onAddToPlaylist: () => void;
  onShare: () => void;
  onAddTags: () => void;
  onToggleFavorite: () => void;
  onMarkAsRead: () => void;
}

export function BatchActions({
  selectedCount,
  onClearSelection,
  onDelete,
  onAddToPlaylist,
  onShare,
  onAddTags,
  onToggleFavorite,
  onMarkAsRead,
}: BatchActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 bg-card border rounded-lg shadow-lg p-2">
        <Badge variant="secondary" className="text-sm px-3">
          {selectedCount} selected
        </Badge>

        <div className="h-6 w-px bg-border" />

        <Button variant="ghost" size="sm" onClick={onToggleFavorite}>
          <Star className="w-4 h-4 mr-1" />
          Favorite
        </Button>

        <Button variant="ghost" size="sm" onClick={onAddToPlaylist}>
          <FolderPlus className="w-4 h-4 mr-1" />
          Add to Playlist
        </Button>

        <Button variant="ghost" size="sm" onClick={onShare}>
          <Share2 className="w-4 h-4 mr-1" />
          Share
        </Button>

        <Button variant="ghost" size="sm" onClick={onAddTags}>
          <Tag className="w-4 h-4 mr-1" />
          Add Tags
        </Button>

        <Button variant="ghost" size="sm" onClick={onMarkAsRead}>
          <CheckCircle2 className="w-4 h-4 mr-1" />
          Mark Read
        </Button>

        <div className="h-6 w-px bg-border" />

        <Button variant="ghost" size="sm" onClick={onDelete} className="text-destructive hover:text-destructive">
          <Trash2 className="w-4 h-4 mr-1" />
          Delete
        </Button>

        <Button variant="ghost" size="icon" onClick={onClearSelection}>
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
