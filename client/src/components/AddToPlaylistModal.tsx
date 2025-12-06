import { useState } from "react";
import { FolderOpen, Plus, Check, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Playlist {
  id: string;
  name: string;
  linkCount: number;
}

interface AddToPlaylistModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (playlistIds: string[]) => void;
  onCreateNew: () => void;
  playlists: Playlist[];
  linkTitle?: string;
}

export function AddToPlaylistModal({
  open,
  onClose,
  onAdd,
  onCreateNew,
  playlists,
  linkTitle,
}: AddToPlaylistModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);

  const filteredPlaylists = playlists.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const togglePlaylist = (id: string) => {
    setSelectedPlaylists((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleAdd = () => {
    onAdd(selectedPlaylists);
    setSelectedPlaylists([]);
    setSearchQuery("");
    onClose();
  };

  const handleClose = () => {
    setSelectedPlaylists([]);
    setSearchQuery("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Playlist</DialogTitle>
          {linkTitle && (
            <p className="text-sm text-muted-foreground truncate">
              {linkTitle}
            </p>
          )}
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search playlists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              data-testid="input-search-playlist-modal"
            />
          </div>

          <ScrollArea className="h-64">
            {filteredPlaylists.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No playlists found</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredPlaylists.map((playlist) => (
                  <div
                    key={playlist.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedPlaylists.includes(playlist.id)
                        ? "bg-primary/10"
                        : "hover-elevate"
                    }`}
                    onClick={() => togglePlaylist(playlist.id)}
                    data-testid={`playlist-option-${playlist.id}`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      selectedPlaylists.includes(playlist.id)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}>
                      {selectedPlaylists.includes(playlist.id) ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <FolderOpen className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{playlist.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {playlist.linkCount} links
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              handleClose();
              onCreateNew();
            }}
            data-testid="button-create-new-playlist-modal"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Playlist
          </Button>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            disabled={selectedPlaylists.length === 0}
            data-testid="button-add-to-playlists"
          >
            Add to {selectedPlaylists.length} Playlist{selectedPlaylists.length !== 1 ? "s" : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
