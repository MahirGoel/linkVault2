import { useState } from "react";
import { Plus, FolderOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlaylistCard, type PlaylistData } from "@/components/PlaylistCard";
import { LinkCard, type LinkData } from "@/components/LinkCard";
import { CreatePlaylistModal } from "@/components/CreatePlaylistModal";
import { ShareDialog } from "@/components/ShareDialog";
import { EmptyState } from "@/components/EmptyState";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import type { Playlist, Link, User } from "@shared/schema";

export default function Playlists() {
  const { isAuthenticated } = useAuth();
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [editPlaylist, setEditPlaylist] = useState<Playlist | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const { toast } = useToast();

  const { data: playlists = [], isLoading } = useQuery<Playlist[]>({
    queryKey: ["/api/playlists"],
    enabled: isAuthenticated,
  });

  const { data: playlistLinks = [] } = useQuery<Link[]>({
    queryKey: ["/api/playlists", selectedPlaylist?.id, "links"],
    enabled: !!selectedPlaylist,
  });

  const { data: searchedUsers = [] } = useQuery<User[]>({
    queryKey: ["/api/users/search", { q: userSearchQuery }],
    enabled: userSearchQuery.length >= 2,
  });

  const createPlaylistMutation = useMutation({
    mutationFn: (data: { name: string; description: string }) =>
      apiRequest("POST", "/api/playlists", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/playlists"] });
      toast({ title: "Playlist created" });
    },
  });

  const updatePlaylistMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string; description: string } }) =>
      apiRequest("PATCH", `/api/playlists/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/playlists"] });
      toast({ title: "Playlist updated" });
    },
  });

  const deletePlaylistMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/playlists/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/playlists"] });
      toast({ title: "Playlist deleted" });
    },
  });

  const removeLinkFromPlaylistMutation = useMutation({
    mutationFn: ({ playlistId, linkId }: { playlistId: string; linkId: string }) =>
      apiRequest("DELETE", `/api/playlists/${playlistId}/links/${linkId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/playlists", selectedPlaylist?.id, "links"] });
      toast({ title: "Link removed from playlist" });
    },
  });

  const sharePlaylistMutation = useMutation({
    mutationFn: ({ playlistId, sharedWithUserId, canEdit }: { playlistId: string; sharedWithUserId: string; canEdit: boolean }) =>
      apiRequest("POST", "/api/shares", { playlistId, sharedWithUserId, canEdit }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shares/sent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/shares/playlists"] });
      toast({ title: "Playlist shared successfully" });
    },
  });

  const playlistsWithCounts: PlaylistData[] = playlists.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description || undefined,
    linkCount: 0,
    isShared: p.isPublic || false,
    createdAt: p.createdAt?.toISOString?.() || new Date().toISOString(),
  }));

  const filteredPlaylists = playlistsWithCounts.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreatePlaylist = (data: { name: string; description: string }) => {
    if (editPlaylist) {
      updatePlaylistMutation.mutate({ id: editPlaylist.id, data });
      setEditPlaylist(null);
    } else {
      createPlaylistMutation.mutate(data);
    }
  };

  const handleDeletePlaylist = (id: string) => {
    deletePlaylistMutation.mutate(id);
    if (selectedPlaylist?.id === id) {
      setSelectedPlaylist(null);
    }
  };

  const handleEditPlaylist = (playlist: PlaylistData) => {
    const originalPlaylist = playlists.find((p) => p.id === playlist.id);
    if (originalPlaylist) {
      setEditPlaylist(originalPlaylist);
      setCreateModalOpen(true);
    }
  };

  const handleSharePlaylist = (playlist: PlaylistData) => {
    const originalPlaylist = playlists.find((p) => p.id === playlist.id);
    if (originalPlaylist) {
      setSelectedPlaylist(originalPlaylist);
      setShareDialogOpen(true);
    }
  };

  const handleShare = (userIds: string[], canEdit: boolean) => {
    if (selectedPlaylist) {
      userIds.forEach((userId) => {
        sharePlaylistMutation.mutate({
          playlistId: selectedPlaylist.id,
          sharedWithUserId: userId,
          canEdit,
        });
      });
    }
  };

  const availableUsers = searchedUsers.map((u) => ({
    id: u.id,
    name: `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.email || "Unknown",
    email: u.email || "",
    avatar: u.profileImageUrl || undefined,
  }));

  if (selectedPlaylist) {
    const selectedPlaylistData = playlistsWithCounts.find((p) => p.id === selectedPlaylist.id);
    
    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="px-4 md:px-8 py-4 border-b">
          <Button
            variant="ghost"
            onClick={() => setSelectedPlaylist(null)}
            className="mb-4"
            data-testid="button-back-playlists"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Playlists
          </Button>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">{selectedPlaylist.name}</h1>
              {selectedPlaylist.description && (
                <p className="text-muted-foreground mt-1">{selectedPlaylist.description}</p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{playlistLinks.length} links</Badge>
                {selectedPlaylist.isPublic && <Badge variant="secondary">Public</Badge>}
              </div>
            </div>
            <Button onClick={() => setShareDialogOpen(true)} data-testid="button-share-playlist">
              Share
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto px-4 md:px-8 py-4">
          {playlistLinks.length === 0 ? (
            <EmptyState
              icon={FolderOpen}
              title="No links in this playlist"
              description="Add links to this playlist from your feed or links page."
            />
          ) : (
            <div className="space-y-3 max-w-4xl">
              {playlistLinks.map((link) => (
                <LinkCard
                  key={link.id}
                  link={{
                    id: link.id,
                    url: link.url,
                    title: link.title || undefined,
                    description: link.description || undefined,
                    category: link.category || undefined,
                    tags: link.tags || undefined,
                    createdAt: link.createdAt?.toISOString?.() || new Date().toISOString(),
                  }}
                  onDelete={(id) =>
                    removeLinkFromPlaylistMutation.mutate({
                      playlistId: selectedPlaylist.id,
                      linkId: id,
                    })
                  }
                />
              ))}
            </div>
          )}
        </div>

        <ShareDialog
          open={shareDialogOpen}
          onClose={() => setShareDialogOpen(false)}
          onShare={handleShare}
          title={`Share "${selectedPlaylist.name}"`}
          availableUsers={availableUsers}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="px-4 md:px-8 py-4 border-b">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h1 className="text-2xl font-semibold">Playlists</h1>
          <Button onClick={() => setCreateModalOpen(true)} data-testid="button-create-playlist">
            <Plus className="w-4 h-4 mr-2" />
            Create Playlist
          </Button>
        </div>
        <Input
          placeholder="Search playlists..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
          data-testid="input-search-playlists"
        />
      </div>

      <div className="flex-1 overflow-auto px-4 md:px-8 py-4">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : filteredPlaylists.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title="No playlists yet"
            description="Create a playlist to organize your links into collections."
            actionLabel="Create Playlist"
            onAction={() => setCreateModalOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlaylists.map((playlist) => (
              <PlaylistCard
                key={playlist.id}
                playlist={playlist}
                onClick={() => {
                  const originalPlaylist = playlists.find((p) => p.id === playlist.id);
                  if (originalPlaylist) setSelectedPlaylist(originalPlaylist);
                }}
                onEdit={handleEditPlaylist}
                onDelete={handleDeletePlaylist}
                onShare={handleSharePlaylist}
              />
            ))}
          </div>
        )}
      </div>

      <CreatePlaylistModal
        open={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          setEditPlaylist(null);
        }}
        onSave={handleCreatePlaylist}
        editData={editPlaylist ? { name: editPlaylist.name, description: editPlaylist.description || "" } : null}
      />
    </div>
  );
}
