import {
  ExternalLink,
  Edit2,
  Share2,
  Trash2,
  Star,
  Copy,
  Eye,
  Clock,
  Tag,
  Folder,
  X,
  Plus,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { EnhancedLinkData } from "./LinkCardEnhanced";

interface LinkDetailPanelProps {
  link: EnhancedLinkData | null;
  onClose: () => void;
  onEdit: (link: EnhancedLinkData) => void;
  onDelete: (id: string) => void;
  onShare: (link: EnhancedLinkData) => void;
  onToggleFavorite: (id: string) => void;
  onToggleRead: (id: string) => void;
  onAddToPlaylist: (link: EnhancedLinkData) => void;
}

export function LinkDetailPanel({
  link,
  onClose,
  onEdit,
  onDelete,
  onShare,
  onToggleFavorite,
  onToggleRead,
  onAddToPlaylist,
}: LinkDetailPanelProps) {
  if (!link) return null;

  const getDomain = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace("www.", "");
    } catch {
      return url;
    }
  };

  const formatFullDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(link.url);
  };

  return (
    <div className="w-80 border-l bg-background flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">Link Details</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          <div className="aspect-video rounded-lg bg-muted flex items-center justify-center overflow-hidden">
            {link.thumbnail ? (
              <img
                src={link.thumbnail}
                alt={link.title || "Link preview"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                <ExternalLink className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold leading-tight">
              {link.title || getDomain(link.url)}
            </h2>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-mono text-primary hover:underline flex items-center gap-1 mt-1"
            >
              {getDomain(link.url)}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {link.description && (
            <p className="text-sm text-muted-foreground">{link.description}</p>
          )}

          <div className="flex flex-wrap gap-2">
            <Button
              variant={link.isFavorite ? "secondary" : "outline"}
              size="sm"
              onClick={() => onToggleFavorite(link.id)}
            >
              <Star className={`w-4 h-4 mr-1 ${link.isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
              {link.isFavorite ? "Favorited" : "Favorite"}
            </Button>
            <Button
              variant={link.isRead ? "secondary" : "outline"}
              size="sm"
              onClick={() => onToggleRead(link.id)}
            >
              <CheckCircle2 className={`w-4 h-4 mr-1 ${link.isRead ? "text-green-500" : ""}`} />
              {link.isRead ? "Read" : "Mark Read"}
            </Button>
          </div>

          <Separator />

          <div className="space-y-3">
            {link.category && (
              <div className="flex items-center gap-2">
                <Folder className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Category:</span>
                <Badge variant="secondary">{link.category}</Badge>
              </div>
            )}

            {link.tags && link.tags.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Tags:</span>
                </div>
                <div className="flex flex-wrap gap-1 ml-6">
                  {link.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="font-mono text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Added {formatFullDate(link.createdAt)}</span>
            </div>

            {link.viewCount !== undefined && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="w-4 h-4" />
                <span>Viewed {link.viewCount} times</span>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="w-4 h-4 mr-2" />
                Copy URL
              </Button>
              <Button variant="outline" size="sm" onClick={() => onEdit(link)}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => onAddToPlaylist(link)}>
                <Plus className="w-4 h-4 mr-2" />
                Playlist
              </Button>
              <Button variant="outline" size="sm" onClick={() => onShare(link)}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={() => onDelete(link.id)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Link
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
