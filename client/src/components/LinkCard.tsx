import { useState } from "react";
import { ExternalLink, Edit2, Share2, Trash2, Plus, Link as LinkIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export interface LinkData {
  id: string;
  url: string;
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
  thumbnail?: string;
  createdAt: string;
}

interface LinkCardProps {
  link: LinkData;
  onEdit?: (link: LinkData) => void;
  onDelete?: (id: string) => void;
  onShare?: (link: LinkData) => void;
  onAddToPlaylist?: (link: LinkData) => void;
}

export function LinkCard({
  link,
  onEdit,
  onDelete,
  onShare,
  onAddToPlaylist,
}: LinkCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return url;
    }
  };

  return (
    <Card
      className="p-4 flex gap-3 group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`card-link-${link.id}`}
    >
      <div className="w-20 h-20 rounded-lg bg-muted flex-shrink-0 flex items-center justify-center overflow-hidden">
        {link.thumbnail ? (
          <img
            src={link.thumbnail}
            alt={link.title || "Link thumbnail"}
            className="w-full h-full object-cover"
          />
        ) : (
          <LinkIcon className="w-8 h-8 text-muted-foreground" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-base truncate" data-testid={`text-title-${link.id}`}>
              {link.title || getDomain(link.url)}
            </h3>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-muted-foreground hover:text-foreground truncate block"
              data-testid={`link-url-${link.id}`}
            >
              {getDomain(link.url)}
              <ExternalLink className="w-3 h-3 inline ml-1" />
            </a>
          </div>

          <div
            className="flex gap-1 transition-opacity"
            style={{ visibility: isHovered ? "visible" : "hidden" }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit?.(link)}
              data-testid={`button-edit-${link.id}`}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onAddToPlaylist?.(link)}
              data-testid={`button-add-playlist-${link.id}`}
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onShare?.(link)}
              data-testid={`button-share-${link.id}`}
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete?.(link.id)}
              data-testid={`button-delete-${link.id}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {link.description && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {link.description}
          </p>
        )}

        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {link.category && (
            <Badge variant="secondary" className="text-xs">
              {link.category}
            </Badge>
          )}
          {link.tags?.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs font-mono">
              {tag}
            </Badge>
          ))}
          {link.tags && link.tags.length > 3 && (
            <span className="text-xs text-muted-foreground">
              +{link.tags.length - 3} more
            </span>
          )}
          <span className="text-xs text-muted-foreground ml-auto">
            {formatDate(link.createdAt)}
          </span>
        </div>
      </div>
    </Card>
  );
}
