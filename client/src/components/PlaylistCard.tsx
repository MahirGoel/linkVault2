import { FolderOpen, Link as LinkIcon, Share2, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface PlaylistData {
  id: string;
  name: string;
  description?: string;
  linkCount: number;
  isShared?: boolean;
  createdAt: string;
}

interface PlaylistCardProps {
  playlist: PlaylistData;
  onClick?: () => void;
  onEdit?: (playlist: PlaylistData) => void;
  onDelete?: (id: string) => void;
  onShare?: (playlist: PlaylistData) => void;
}

export function PlaylistCard({
  playlist,
  onClick,
  onEdit,
  onDelete,
  onShare,
}: PlaylistCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <Card
      className="p-4 cursor-pointer hover-elevate active-elevate-2"
      onClick={onClick}
      data-testid={`card-playlist-${playlist.id}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <FolderOpen className="w-6 h-6 text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-medium truncate" data-testid={`text-playlist-name-${playlist.id}`}>
              {playlist.name}
            </h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="flex-shrink-0">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit?.(playlist); }}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onShare?.(playlist); }}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-destructive"
                  onClick={(e) => { e.stopPropagation(); onDelete?.(playlist.id); }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {playlist.description && (
            <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
              {playlist.description}
            </p>
          )}

          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs gap-1">
              <LinkIcon className="w-3 h-3" />
              {playlist.linkCount} links
            </Badge>
            {playlist.isShared && (
              <Badge variant="secondary" className="text-xs gap-1">
                <Share2 className="w-3 h-3" />
                Shared
              </Badge>
            )}
            <span className="text-xs text-muted-foreground ml-auto">
              {formatDate(playlist.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
