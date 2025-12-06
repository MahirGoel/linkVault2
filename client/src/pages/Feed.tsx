import { useState, useEffect } from "react";
import { Plus, Link as LinkIcon, FolderOpen, Share2, Star, CheckSquare, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkCardEnhanced, type EnhancedLinkData } from "@/components/LinkCardEnhanced";
import { LinkDetailPanel } from "@/components/LinkDetailPanel";
import { SearchFilterBar } from "@/components/SearchFilterBar";
import { AdvancedFilters, type FilterState } from "@/components/AdvancedFilters";
import { AddLinkModal, type LinkFormData } from "@/components/AddLinkModal";
import { ShareDialog } from "@/components/ShareDialog";
import { AddToPlaylistModal } from "@/components/AddToPlaylistModal";
import { CreatePlaylistModal } from "@/components/CreatePlaylistModal";
import { StatCard } from "@/components/StatCard";
import { ActivityFeed } from "@/components/ActivityFeed";
import { BatchActions } from "@/components/BatchActions";
import { EmptyState } from "@/components/EmptyState";
import { FeedSkeleton } from "@/components/SkeletonCard";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// todo: remove mock functionality - replace with real API data
const mockLinks: EnhancedLinkData[] = [
  {
    id: "1",
    url: "https://react.dev",
    title: "React Documentation - The library for web and native user interfaces",
    description: "Build user interfaces out of individual pieces called components written in JavaScript. React lets you combine them into screens, pages, and apps.",
    category: "Development",
    tags: ["react", "javascript", "frontend", "library"],
    createdAt: new Date().toISOString(),
    isFavorite: true,
    viewCount: 24,
    isRead: true,
  },
  {
    id: "2",
    url: "https://tailwindcss.com",
    title: "Tailwind CSS - Rapidly build modern websites without ever leaving your HTML",
    description: "A utility-first CSS framework packed with classes that can be composed to build any design, directly in your markup.",
    category: "Design",
    tags: ["css", "tailwind", "styling", "utility"],
    thumbnail: "https://tailwindcss.com/_next/static/media/social-card-large.a6e71726.jpg",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    isFavorite: false,
    viewCount: 18,
    isRead: false,
  },
  {
    id: "3",
    url: "https://github.com",
    title: "GitHub - Where the world builds software",
    description: "Millions of developers and companies build, ship, and maintain their software on GitHub—the largest and most advanced development platform in the world.",
    category: "Development",
    tags: ["git", "code", "collaboration", "opensource"],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    isFavorite: true,
    viewCount: 156,
    isRead: true,
  },
  {
    id: "4",
    url: "https://figma.com",
    title: "Figma: The Collaborative Interface Design Tool",
    description: "Figma helps teams create, test, and ship better designs from start to finish. Design, prototype, and gather feedback all in one place.",
    category: "Design",
    tags: ["design", "prototyping", "ui", "collaboration"],
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    isFavorite: false,
    viewCount: 42,
    isRead: false,
  },
  {
    id: "5",
    url: "https://vercel.com",
    title: "Vercel: Develop. Preview. Ship.",
    description: "Vercel is the platform for frontend developers, providing the speed and reliability innovators need to create at the moment of inspiration.",
    category: "Development",
    tags: ["hosting", "deployment", "nextjs", "serverless"],
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    isFavorite: false,
    viewCount: 33,
    isRead: true,
  },
];

const mockCategories = ["Development", "Design", "Marketing", "Business", "Personal", "Learning"];
const mockTags = ["javascript", "react", "css", "api", "tutorial", "tools", "design", "frontend", "backend", "devops"];
const mockUsers = [
  { id: "1", name: "John Doe", email: "john@example.com" },
  { id: "2", name: "Jane Smith", email: "jane@example.com" },
  { id: "3", name: "Bob Wilson", email: "bob@example.com" },
];
const mockPlaylists = [
  { id: "1", name: "React Resources", linkCount: 12 },
  { id: "2", name: "Design Inspiration", linkCount: 8 },
  { id: "3", name: "Learning Path", linkCount: 15 },
];
const mockActivities = [
  { id: "1", type: "link_added" as const, title: "Added new link", description: "React Documentation", timestamp: new Date().toISOString() },
  { id: "2", type: "playlist_created" as const, title: "Created playlist", description: "Frontend Resources", timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: "3", type: "shared" as const, title: "Shared link", description: "Tailwind CSS with John", timestamp: new Date(Date.now() - 7200000).toISOString(), user: "You" },
  { id: "4", type: "received_share" as const, title: "Received shared playlist", description: "Team Resources", timestamp: new Date(Date.now() - 86400000).toISOString(), user: "Jane Smith" },
  { id: "5", type: "favorited" as const, title: "Favorited link", description: "GitHub", timestamp: new Date(Date.now() - 172800000).toISOString() },
];

export default function Feed() {
  const [links, setLinks] = useState<EnhancedLinkData[]>(mockLinks);
  const [filteredLinks, setFilteredLinks] = useState<EnhancedLinkData[]>(mockLinks);
  const [isLoading, setIsLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
  const [createPlaylistOpen, setCreatePlaylistOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<EnhancedLinkData | null>(null);
  const [detailLink, setDetailLink] = useState<EnhancedLinkData | null>(null);
  const [editLink, setEditLink] = useState<EnhancedLinkData | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectionMode, setSelectionMode] = useState(false);
  const [viewMode, setViewMode] = useState<"all" | "favorites" | "unread">("all");
  const { toast } = useToast();

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (query: string) => {
    if (!query) {
      applyViewFilter(links);
      return;
    }
    const filtered = links.filter(
      (link) =>
        link.title?.toLowerCase().includes(query.toLowerCase()) ||
        link.description?.toLowerCase().includes(query.toLowerCase()) ||
        link.url.toLowerCase().includes(query.toLowerCase()) ||
        link.tags?.some((t) => t.toLowerCase().includes(query.toLowerCase()))
    );
    applyViewFilter(filtered);
  };

  const applyViewFilter = (linksToFilter: EnhancedLinkData[]) => {
    let result = linksToFilter;
    if (viewMode === "favorites") {
      result = result.filter((l) => l.isFavorite);
    } else if (viewMode === "unread") {
      result = result.filter((l) => !l.isRead);
    }
    setFilteredLinks(result);
  };

  const handleCategoryFilter = (categories: string[]) => {
    if (categories.length === 0) {
      applyViewFilter(links);
      return;
    }
    const filtered = links.filter((link) => link.category && categories.includes(link.category));
    applyViewFilter(filtered);
  };

  const handleTagFilter = (tags: string[]) => {
    if (tags.length === 0) {
      applyViewFilter(links);
      return;
    }
    const filtered = links.filter((link) => link.tags?.some((t) => tags.includes(t)));
    applyViewFilter(filtered);
  };

  const handleSort = (sort: string) => {
    const sorted = [...filteredLinks];
    switch (sort) {
      case "recent":
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "oldest":
        sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "a-z":
        sorted.sort((a, b) => (a.title || a.url).localeCompare(b.title || b.url));
        break;
      case "category":
        sorted.sort((a, b) => (a.category || "").localeCompare(b.category || ""));
        break;
    }
    setFilteredLinks(sorted);
  };

  const handleAdvancedFilters = (filters: FilterState) => {
    let result = [...links];

    if (filters.categories.length > 0) {
      result = result.filter((l) => l.category && filters.categories.includes(l.category));
    }
    if (filters.tags.length > 0) {
      result = result.filter((l) => l.tags?.some((t) => filters.tags.includes(t)));
    }
    if (filters.favoritesOnly) {
      result = result.filter((l) => l.isFavorite);
    }
    if (filters.unreadOnly) {
      result = result.filter((l) => !l.isRead);
    }
    if (filters.dateRange.from) {
      result = result.filter((l) => new Date(l.createdAt) >= filters.dateRange.from!);
    }
    if (filters.dateRange.to) {
      result = result.filter((l) => new Date(l.createdAt) <= filters.dateRange.to!);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (filters.sortBy) {
        case "title":
          comparison = (a.title || a.url).localeCompare(b.title || b.url);
          break;
        case "category":
          comparison = (a.category || "").localeCompare(b.category || "");
          break;
        case "viewCount":
          comparison = (a.viewCount || 0) - (b.viewCount || 0);
          break;
        default:
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return filters.sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredLinks(result);
    toast({ title: "Filters applied", description: `${result.length} links found` });
  };

  const handleSaveLink = (data: LinkFormData) => {
    if (editLink) {
      const updated = links.map((l) => (l.id === editLink.id ? { ...l, ...data } : l));
      setLinks(updated);
      applyViewFilter(updated);
      setEditLink(null);
      toast({ title: "Link updated" });
    } else {
      const newLink: EnhancedLinkData = {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date().toISOString(),
        isFavorite: false,
        viewCount: 0,
        isRead: false,
      };
      const updated = [newLink, ...links];
      setLinks(updated);
      applyViewFilter(updated);
      toast({ title: "Link saved", description: data.title || data.url });
    }
  };

  const handleDeleteLink = (id: string) => {
    const updated = links.filter((l) => l.id !== id);
    setLinks(updated);
    applyViewFilter(updated);
    if (detailLink?.id === id) setDetailLink(null);
    toast({ title: "Link deleted" });
  };

  const handleToggleFavorite = (id: string) => {
    const updated = links.map((l) =>
      l.id === id ? { ...l, isFavorite: !l.isFavorite } : l
    );
    setLinks(updated);
    applyViewFilter(updated);
    const link = updated.find((l) => l.id === id);
    toast({ title: link?.isFavorite ? "Added to favorites" : "Removed from favorites" });
  };

  const handleToggleRead = (id: string) => {
    const updated = links.map((l) =>
      l.id === id ? { ...l, isRead: !l.isRead } : l
    );
    setLinks(updated);
    applyViewFilter(updated);
  };

  const handleSelect = (id: string, selected: boolean) => {
    const newSelected = new Set(selectedIds);
    if (selected) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const handleViewModeChange = (mode: "all" | "favorites" | "unread") => {
    setViewMode(mode);
    let result = links;
    if (mode === "favorites") {
      result = links.filter((l) => l.isFavorite);
    } else if (mode === "unread") {
      result = links.filter((l) => !l.isRead);
    }
    setFilteredLinks(result);
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
    setSelectionMode(false);
  };

  const handleBatchDelete = () => {
    const updated = links.filter((l) => !selectedIds.has(l.id));
    setLinks(updated);
    applyViewFilter(updated);
    toast({ title: `${selectedIds.size} links deleted` });
    clearSelection();
  };

  const favoriteCount = links.filter((l) => l.isFavorite).length;
  const unreadCount = links.filter((l) => !l.isRead).length;

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto px-4 md:px-8 py-4">
        <FeedSkeleton />
      </div>
    );
  }

  return (
    <div className="flex-1 flex h-full overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-4 md:px-8 py-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard title="Total Links" value={links.length} icon={LinkIcon} />
            <StatCard title="Favorites" value={favoriteCount} icon={Star} />
            <StatCard title="Playlists" value={3} icon={FolderOpen} />
            <StatCard title="Shared" value={5} icon={Share2} />
          </div>

          <div className="flex items-center justify-between gap-4">
            <Tabs value={viewMode} onValueChange={(v) => handleViewModeChange(v as typeof viewMode)}>
              <TabsList>
                <TabsTrigger value="all" data-testid="tab-all">
                  All ({links.length})
                </TabsTrigger>
                <TabsTrigger value="favorites" data-testid="tab-favorites">
                  Favorites ({favoriteCount})
                </TabsTrigger>
                <TabsTrigger value="unread" data-testid="tab-unread">
                  Unread ({unreadCount})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2">
              <Button
                variant={selectionMode ? "secondary" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectionMode(!selectionMode);
                  if (selectionMode) clearSelection();
                }}
                data-testid="button-selection-mode"
              >
                <CheckSquare className="w-4 h-4 mr-1" />
                Select
              </Button>
              <AdvancedFilters
                categories={mockCategories}
                tags={mockTags}
                onApplyFilters={handleAdvancedFilters}
              />
            </div>
          </div>

          <SearchFilterBar
            onSearch={handleSearch}
            onCategoryFilter={handleCategoryFilter}
            onTagFilter={handleTagFilter}
            onSort={handleSort}
            categories={mockCategories}
            availableTags={mockTags}
          />
        </div>

        <div className="flex-1 overflow-auto px-4 md:px-8 py-2">
          {filteredLinks.length === 0 ? (
            <EmptyState
              icon={LinkIcon}
              title="No links found"
              description="Try adjusting your filters, or add a new link to get started."
              actionLabel="Add Link"
              onAction={() => setAddModalOpen(true)}
            />
          ) : (
            <div className="space-y-3 max-w-4xl pb-20">
              {filteredLinks.map((link) => (
                <LinkCardEnhanced
                  key={link.id}
                  link={link}
                  isSelected={selectedIds.has(link.id)}
                  onSelect={handleSelect}
                  selectionMode={selectionMode}
                  onEdit={(l) => {
                    setEditLink(l);
                    setAddModalOpen(true);
                  }}
                  onDelete={handleDeleteLink}
                  onShare={(l) => {
                    setSelectedLink(l);
                    setShareDialogOpen(true);
                  }}
                  onAddToPlaylist={(l) => {
                    setSelectedLink(l);
                    setPlaylistModalOpen(true);
                  }}
                  onToggleFavorite={handleToggleFavorite}
                  onToggleRead={handleToggleRead}
                  onCopyUrl={() => toast({ title: "URL copied to clipboard" })}
                  onClick={(l) => setDetailLink(l)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40">
          <Button
            size="lg"
            className="rounded-full shadow-lg h-14 w-14 p-0"
            onClick={() => setAddModalOpen(true)}
            data-testid="button-add-link-fab"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>

        <BatchActions
          selectedCount={selectedIds.size}
          onClearSelection={clearSelection}
          onDelete={handleBatchDelete}
          onAddToPlaylist={() => setPlaylistModalOpen(true)}
          onShare={() => setShareDialogOpen(true)}
          onAddTags={() => toast({ title: "Add tags", description: "Coming soon" })}
          onToggleFavorite={() => {
            const updated = links.map((l) =>
              selectedIds.has(l.id) ? { ...l, isFavorite: true } : l
            );
            setLinks(updated);
            applyViewFilter(updated);
            toast({ title: `${selectedIds.size} links favorited` });
            clearSelection();
          }}
          onMarkAsRead={() => {
            const updated = links.map((l) =>
              selectedIds.has(l.id) ? { ...l, isRead: true } : l
            );
            setLinks(updated);
            applyViewFilter(updated);
            toast({ title: `${selectedIds.size} links marked as read` });
            clearSelection();
          }}
        />
      </div>

      {detailLink && (
        <LinkDetailPanel
          link={detailLink}
          onClose={() => setDetailLink(null)}
          onEdit={(l) => {
            setEditLink(l);
            setAddModalOpen(true);
          }}
          onDelete={handleDeleteLink}
          onShare={(l) => {
            setSelectedLink(l);
            setShareDialogOpen(true);
          }}
          onToggleFavorite={handleToggleFavorite}
          onToggleRead={handleToggleRead}
          onAddToPlaylist={(l) => {
            setSelectedLink(l);
            setPlaylistModalOpen(true);
          }}
        />
      )}

      <AddLinkModal
        open={addModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          setEditLink(null);
        }}
        onSave={handleSaveLink}
        categories={mockCategories}
        editData={
          editLink
            ? {
                url: editLink.url,
                title: editLink.title,
                description: editLink.description,
                category: editLink.category,
                tags: editLink.tags,
                thumbnail: editLink.thumbnail,
              }
            : null
        }
      />

      <ShareDialog
        open={shareDialogOpen}
        onClose={() => {
          setShareDialogOpen(false);
          setSelectedLink(null);
        }}
        onShare={(userIds, canEdit) => {
          toast({
            title: "Shared successfully",
            description: `Shared with ${userIds.length} user(s)`,
          });
        }}
        title={`Share "${selectedLink?.title || "Link"}"`}
        availableUsers={mockUsers}
      />

      <AddToPlaylistModal
        open={playlistModalOpen}
        onClose={() => {
          setPlaylistModalOpen(false);
          setSelectedLink(null);
        }}
        onAdd={(playlistIds) => {
          toast({
            title: "Added to playlist",
            description: `Added to ${playlistIds.length} playlist(s)`,
          });
        }}
        onCreateNew={() => setCreatePlaylistOpen(true)}
        playlists={mockPlaylists}
        linkTitle={selectedLink?.title}
      />

      <CreatePlaylistModal
        open={createPlaylistOpen}
        onClose={() => setCreatePlaylistOpen(false)}
        onSave={(data) => {
          toast({ title: "Playlist created", description: data.name });
        }}
      />
    </div>
  );
}
