import { useState } from "react";
import {
  ExternalLink,
  Edit2,
  Share2,
  Trash2,
  Plus,
  Link as LinkIcon,
  Star,
  MoreHorizontal,
  Copy,
  Eye,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface EnhancedLinkData {
  id: string;
  url: string;
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
  thumbnail?: string;
  createdAt: string;
  isFavorite?: boolean;
  viewCount?: number;
  isRead?: boolean;
}

interface LinkCardEnhancedProps {
  link: EnhancedLinkData;
  isSelected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
  onEdit?: (link: EnhancedLinkData) => void;
  onDelete?: (id: string) => void;
  onShare?: (link: EnhancedLinkData) => void;
  onAddToPlaylist?: (link: EnhancedLinkData) => void;
  onToggleFavorite?: (id: string) => void;
  onToggleRead?: (id: string) => void;
  onCopyUrl?: (url: string) => void;
  onClick?: (link: EnhancedLinkData) => void;
  selectionMode?: boolean;
}

export function LinkCardEnhanced({
  link,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
  onShare,
  onAddToPlaylist,
  onToggleFavorite,
  onToggleRead,
  onCopyUrl,
  onClick,
  selectionMode = false,
}: LinkCardEnhancedProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return url;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(link.url);
    onCopyUrl?.(link.url);
  };

  return (
    <Card
      className={`p-4 transition-all duration-200 group relative ${
        isSelected ? "ring-2 ring-primary" : ""
      } ${onClick ? "cursor-pointer" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick?.(link)}
      data-testid={`card-link-${link.id}`}
    >
      <div className="flex gap-4">
        {selectionMode && (
          <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => onSelect?.(link.id, !!checked)}
              data-testid={`checkbox-link-${link.id}`}
            />
          </div>
        )}

        <div className="w-24 h-24 rounded-lg bg-muted flex-shrink-0 flex items-center justify-center overflow-hidden relative">
          {link.thumbnail ? (
            <img
              src={link.thumbnail}
              alt={link.title || "Link thumbnail"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
              <LinkIcon className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
          
          {link.isFavorite && (
            <div className="absolute top-1 right-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-base truncate" data-testid={`text-title-${link.id}`}>
                  {link.title || getDomain(link.url)}
                </h3>
                {link.isRead && (
                  <Tooltip>
                    <TooltipTrigger>
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    </TooltipTrigger>
                    <TooltipContent>Read</TooltipContent>
                  </Tooltip>
                )}
              </div>
              
              <div className="flex items-center gap-2 mt-1">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs font-mono text-muted-foreground hover:text-foreground truncate flex items-center gap-1"
                  data-testid={`link-url-${link.id}`}
                >
                  {getDomain(link.url)}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div
              className="flex gap-1 transition-all"
              style={{ opacity: isHovered ? 1 : 0, visibility: isHovered ? "visible" : "hidden" }}
              onClick={(e) => e.stopPropagation()}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onToggleFavorite?.(link.id)}
                    data-testid={`button-favorite-${link.id}`}
                  >
                    <Star className={`w-4 h-4 ${link.isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{link.isFavorite ? "Unfavorite" : "Favorite"}</TooltipContent>
              </Tooltip>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit?.(link)}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onAddToPlaylist?.(link)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Playlist
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleCopy}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy URL
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onShare?.(link)}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onToggleRead?.(link.id)}>
                    <Eye className="w-4 h-4 mr-2" />
                    Mark as {link.isRead ? "Unread" : "Read"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => onDelete?.(link.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {link.description && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {link.description}
            </p>
          )}

          <div className="flex items-center gap-2 mt-3 flex-wrap">
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
                +{link.tags.length - 3}
              </span>
            )}
            
            <div className="flex items-center gap-3 ml-auto text-xs text-muted-foreground">
              {link.viewCount !== undefined && link.viewCount > 0 && (
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {link.viewCount}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDate(link.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
