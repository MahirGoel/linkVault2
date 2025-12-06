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

// todo: remove mock functionality
const mockPlaylists: PlaylistData[] = [
  {
    id: "1",
    name: "React Resources",
    description: "Collection of useful React tutorials and documentation",
    linkCount: 12,
    isShared: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Design Inspiration",
    description: "UI/UX inspiration and design systems",
    linkCount: 8,
    isShared: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    name: "Learning Path",
    description: "Courses and tutorials for skill development",
    linkCount: 15,
    isShared: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

const mockPlaylistLinks: LinkData[] = [
  {
    id: "1",
    url: "https://react.dev",
    title: "React Documentation",
    description: "Official React documentation",
    category: "Development",
    tags: ["react", "docs"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    url: "https://react-query.tanstack.com",
    title: "TanStack Query",
    description: "Powerful async state management for React",
    category: "Development",
    tags: ["react", "query", "state"],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const mockUsers = [
  { id: "1", name: "John Doe", email: "john@example.com" },
  { id: "2", name: "Jane Smith", email: "jane@example.com" },
];

export default function Playlists() {
  const [playlists, setPlaylists] = useState<PlaylistData[]>(mockPlaylists);
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistData | null>(null);
  const [playlistLinks, setPlaylistLinks] = useState<LinkData[]>(mockPlaylistLinks);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [editPlaylist, setEditPlaylist] = useState<PlaylistData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPlaylists = playlists.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreatePlaylist = (data: { name: string; description: string }) => {
    if (editPlaylist) {
      setPlaylists(playlists.map((p) =>
        p.id === editPlaylist.id ? { ...p, ...data } : p
      ));
      setEditPlaylist(null);
    } else {
      const newPlaylist: PlaylistData = {
        id: Date.now().toString(),
        name: data.name,
        description: data.description,
        linkCount: 0,
        isShared: false,
        createdAt: new Date().toISOString(),
      };
      setPlaylists([newPlaylist, ...playlists]);
    }
  };

  const handleDeletePlaylist = (id: string) => {
    setPlaylists(playlists.filter((p) => p.id !== id));
    if (selectedPlaylist?.id === id) {
      setSelectedPlaylist(null);
    }
  };

  const handleEditPlaylist = (playlist: PlaylistData) => {
    setEditPlaylist(playlist);
    setCreateModalOpen(true);
  };

  const handleSharePlaylist = (playlist: PlaylistData) => {
    setSelectedPlaylist(playlist);
    setShareDialogOpen(true);
  };

  if (selectedPlaylist) {
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
                <Badge variant="outline">{selectedPlaylist.linkCount} links</Badge>
                {selectedPlaylist.isShared && <Badge variant="secondary">Shared</Badge>}
              </div>
            </div>
            <Button onClick={() => handleSharePlaylist(selectedPlaylist)} data-testid="button-share-playlist">
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
                  link={link}
                  onDelete={(id) => setPlaylistLinks(playlistLinks.filter((l) => l.id !== id))}
                />
              ))}
            </div>
          )}
        </div>

        <ShareDialog
          open={shareDialogOpen}
          onClose={() => setShareDialogOpen(false)}
          onShare={(userIds, canEdit) => {
            console.log("Shared playlist with:", userIds, "canEdit:", canEdit);
          }}
          title={`Share "${selectedPlaylist.name}"`}
          availableUsers={mockUsers}
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
        {filteredPlaylists.length === 0 ? (
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
                onClick={() => setSelectedPlaylist(playlist)}
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
