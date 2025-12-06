import { useState } from "react";
import { Plus, Link as LinkIcon, FolderOpen, Share2, Star, CheckSquare } from "lucide-react";
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
import { BatchActions } from "@/components/BatchActions";
import { EmptyState } from "@/components/EmptyState";
import { FeedSkeleton } from "@/components/SkeletonCard";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import type { Link, Category, Tag, Playlist, User } from "@shared/schema";

export default function Feed() {
  const { isAuthenticated, isLoading: authLoading, login } = useAuth();
  const [filteredLinks, setFilteredLinks] = useState<EnhancedLinkData[]>([]);
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
  const [hasAppliedFilter, setHasAppliedFilter] = useState(false);
  const { toast } = useToast();

  // Fetch links
  const { data: links = [], isLoading: linksLoading } = useQuery<Link[]>({
    queryKey: ["/api/links"],
    enabled: isAuthenticated,
  });

  // Fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    enabled: isAuthenticated,
  });

  // Fetch tags
  const { data: tags = [] } = useQuery<Tag[]>({
    queryKey: ["/api/tags"],
    enabled: isAuthenticated,
  });

  // Fetch playlists
  const { data: playlists = [] } = useQuery<Playlist[]>({
    queryKey: ["/api/playlists"],
    enabled: isAuthenticated,
  });

  // Fetch shared links with me
  const { data: sharedLinks = [] } = useQuery<Link[]>({
    queryKey: ["/api/shares/links"],
    enabled: isAuthenticated,
  });

  // Convert to enhanced link data
  const enhancedLinks: EnhancedLinkData[] = links.map((link) => ({
    id: link.id,
    url: link.url,
    title: link.title || undefined,
    description: link.description || undefined,
    category: link.category || undefined,
    tags: link.tags || undefined,
    thumbnail: link.thumbnail || undefined,
    createdAt: link.createdAt?.toISOString?.() || new Date().toISOString(),
    isFavorite: link.isFavorite || false,
    viewCount: link.viewCount || 0,
    isRead: link.isRead || false,
  }));

  // Get display links based on filters
  const displayLinks = hasAppliedFilter ? filteredLinks : (() => {
    if (viewMode === "favorites") return enhancedLinks.filter((l) => l.isFavorite);
    if (viewMode === "unread") return enhancedLinks.filter((l) => !l.isRead);
    return enhancedLinks;
  })();

  // Create link mutation
  const createLinkMutation = useMutation({
    mutationFn: (data: LinkFormData) =>
      apiRequest("POST", "/api/links", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/links"] });
      toast({ title: "Link saved" });
    },
  });

  // Update link mutation
  const updateLinkMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      apiRequest("PATCH", `/api/links/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/links"] });
      toast({ title: "Link updated" });
    },
  });

  // Delete link mutation
  const deleteLinkMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest("DELETE", `/api/links/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/links"] });
      toast({ title: "Link deleted" });
    },
  });

  // Share link mutation
  const shareLinkMutation = useMutation({
    mutationFn: ({ linkId, sharedWithUserId, canEdit }: { linkId: string; sharedWithUserId: string; canEdit: boolean }) =>
      apiRequest("POST", "/api/shares", { linkId, sharedWithUserId, canEdit }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shares/sent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/shares/links"] });
      toast({ title: "Link shared successfully" });
    },
  });

  // Add link to playlist mutation
  const addToPlaylistMutation = useMutation({
    mutationFn: ({ playlistId, linkId }: { playlistId: string; linkId: string }) =>
      apiRequest("POST", `/api/playlists/${playlistId}/links`, { linkId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/playlists"] });
      toast({ title: "Added to playlist" });
    },
  });

  // Create playlist mutation
  const createPlaylistMutation = useMutation({
    mutationFn: (data: { name: string; description: string }) =>
      apiRequest("POST", "/api/playlists", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/playlists"] });
      toast({ title: "Playlist created" });
    },
  });

  // User search state
  const [userSearchQuery, setUserSearchQuery] = useState("");
  
  // Fetch users for sharing
  const { data: searchedUsers = [] } = useQuery<User[]>({
    queryKey: ["/api/users/search", { q: userSearchQuery }],
    enabled: userSearchQuery.length >= 2,
  });

  const availableUsers = searchedUsers.map((u) => ({
    id: u.id,
    name: `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.email || "Unknown",
    email: u.email || "",
    avatar: u.profileImageUrl || undefined,
  }));

  const categoryNames = categories.map((c) => c.name);
  const tagNames = tags.map((t) => t.name);

  const handleSearch = (query: string) => {
    setHasAppliedFilter(!!query);
    if (!query) {
      setFilteredLinks([]);
      return;
    }
    const filtered = enhancedLinks.filter(
      (link) =>
        link.title?.toLowerCase().includes(query.toLowerCase()) ||
        link.description?.toLowerCase().includes(query.toLowerCase()) ||
        link.url.toLowerCase().includes(query.toLowerCase()) ||
        link.tags?.some((t) => t.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredLinks(filtered);
  };

  const handleCategoryFilter = (selectedCategories: string[]) => {
    setHasAppliedFilter(selectedCategories.length > 0);
    if (selectedCategories.length === 0) {
      setFilteredLinks([]);
      return;
    }
    const filtered = enhancedLinks.filter((link) => link.category && selectedCategories.includes(link.category));
    setFilteredLinks(filtered);
  };

  const handleTagFilter = (selectedTags: string[]) => {
    setHasAppliedFilter(selectedTags.length > 0);
    if (selectedTags.length === 0) {
      setFilteredLinks([]);
      return;
    }
    const filtered = enhancedLinks.filter((link) => link.tags?.some((t) => selectedTags.includes(t)));
    setFilteredLinks(filtered);
  };

  const handleSort = (sort: string) => {
    const sorted = [...(hasAppliedFilter ? filteredLinks : enhancedLinks)];
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
    setHasAppliedFilter(true);
  };

  const handleAdvancedFilters = (filters: FilterState) => {
    let result = [...enhancedLinks];

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
    setHasAppliedFilter(true);
    toast({ title: "Filters applied", description: `${result.length} links found` });
  };

  const handleSaveLink = (data: LinkFormData) => {
    if (editLink) {
      updateLinkMutation.mutate({ id: editLink.id, data: data as unknown as Record<string, unknown> });
      setEditLink(null);
    } else {
      createLinkMutation.mutate(data);
    }
  };

  const handleDeleteLink = (id: string) => {
    deleteLinkMutation.mutate(id);
    if (detailLink?.id === id) setDetailLink(null);
  };

  const handleToggleFavorite = (id: string) => {
    const link = enhancedLinks.find((l) => l.id === id);
    if (link) {
      updateLinkMutation.mutate({ id, data: { isFavorite: !link.isFavorite } });
    }
  };

  const handleToggleRead = (id: string) => {
    const link = enhancedLinks.find((l) => l.id === id);
    if (link) {
      updateLinkMutation.mutate({ id, data: { isRead: !link.isRead } });
    }
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
    setHasAppliedFilter(false);
    setFilteredLinks([]);
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
    setSelectionMode(false);
  };

  const handleBatchDelete = () => {
    selectedIds.forEach((id) => deleteLinkMutation.mutate(id));
    toast({ title: `${selectedIds.size} links deleted` });
    clearSelection();
  };

  const favoriteCount = enhancedLinks.filter((l) => l.isFavorite).length;
  const unreadCount = enhancedLinks.filter((l) => !l.isRead).length;

  // Show login page if not authenticated
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <LinkIcon className="w-16 h-16 mx-auto text-muted-foreground" />
          <h1 className="text-2xl font-bold">Welcome to LinkVault</h1>
          <p className="text-muted-foreground">Sign in to start saving and organizing your links</p>
          <Button onClick={login} size="lg" data-testid="button-login">
            Sign in with Replit
          </Button>
        </div>
      </div>
    );
  }

  if (authLoading || linksLoading) {
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
            <StatCard title="Total Links" value={enhancedLinks.length} icon={LinkIcon} />
            <StatCard title="Favorites" value={favoriteCount} icon={Star} />
            <StatCard title="Playlists" value={playlists.length} icon={FolderOpen} />
            <StatCard title="Shared" value={sharedLinks.length} icon={Share2} />
          </div>

          <div className="flex items-center justify-between gap-4">
            <Tabs value={viewMode} onValueChange={(v) => handleViewModeChange(v as typeof viewMode)}>
              <TabsList>
                <TabsTrigger value="all" data-testid="tab-all">
                  All ({enhancedLinks.length})
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
                categories={categoryNames}
                tags={tagNames}
                onApplyFilters={handleAdvancedFilters}
              />
            </div>
          </div>

          <SearchFilterBar
            onSearch={handleSearch}
            onCategoryFilter={handleCategoryFilter}
            onTagFilter={handleTagFilter}
            onSort={handleSort}
            categories={categoryNames}
            availableTags={tagNames}
          />
        </div>

        <div className="flex-1 overflow-auto px-4 md:px-8 py-2">
          {displayLinks.length === 0 ? (
            <EmptyState
              icon={LinkIcon}
              title="No links found"
              description="Try adjusting your filters, or add a new link to get started."
              actionLabel="Add Link"
              onAction={() => setAddModalOpen(true)}
            />
          ) : (
            <div className="space-y-3 max-w-4xl pb-20">
              {displayLinks.map((link) => (
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
            selectedIds.forEach((id) => {
              updateLinkMutation.mutate({ id, data: { isFavorite: true } });
            });
            toast({ title: `${selectedIds.size} links favorited` });
            clearSelection();
          }}
          onMarkAsRead={() => {
            selectedIds.forEach((id) => {
              updateLinkMutation.mutate({ id, data: { isRead: true } });
            });
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
        categories={categoryNames}
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
          if (selectedLink) {
            userIds.forEach((userId) => {
              shareLinkMutation.mutate({
                linkId: selectedLink.id,
                sharedWithUserId: userId,
                canEdit,
              });
            });
          }
        }}
        title={`Share "${selectedLink?.title || "Link"}"`}
        availableUsers={availableUsers}
      />

      <AddToPlaylistModal
        open={playlistModalOpen}
        onClose={() => {
          setPlaylistModalOpen(false);
          setSelectedLink(null);
        }}
        onAdd={(playlistIds) => {
          if (selectedLink) {
            playlistIds.forEach((playlistId) => {
              addToPlaylistMutation.mutate({
                playlistId,
                linkId: selectedLink.id,
              });
            });
          }
        }}
        onCreateNew={() => setCreatePlaylistOpen(true)}
        playlists={playlists.map((p) => ({ id: p.id, name: p.name, linkCount: 0 }))}
        linkTitle={selectedLink?.title}
      />

      <CreatePlaylistModal
        open={createPlaylistOpen}
        onClose={() => setCreatePlaylistOpen(false)}
        onSave={(data) => {
          createPlaylistMutation.mutate(data);
        }}
      />
    </div>
  );
}
