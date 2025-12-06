import { useState } from "react";
import { Share2, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LinkCard, type LinkData } from "@/components/LinkCard";
import { PlaylistCard, type PlaylistData } from "@/components/PlaylistCard";
import { EmptyState } from "@/components/EmptyState";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import type { Link, Playlist, Share, User } from "@shared/schema";

export default function Shared() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("with-me");

  const { data: sharedLinks = [], isLoading: linksLoading } = useQuery<Link[]>({
    queryKey: ["/api/shares/links"],
    enabled: isAuthenticated,
  });

  const { data: sharedPlaylists = [], isLoading: playlistsLoading } = useQuery<Playlist[]>({
    queryKey: ["/api/shares/playlists"],
    enabled: isAuthenticated,
  });

  const { data: receivedShares = [] } = useQuery<Share[]>({
    queryKey: ["/api/shares/received"],
    enabled: isAuthenticated,
  });

  const { data: sentShares = [] } = useQuery<Share[]>({
    queryKey: ["/api/shares/sent"],
    enabled: isAuthenticated,
  });

  const isLoading = linksLoading || playlistsLoading;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const sharedLinksData: LinkData[] = sharedLinks.map((link) => ({
    id: link.id,
    url: link.url,
    title: link.title || undefined,
    description: link.description || undefined,
    category: link.category || undefined,
    tags: link.tags || undefined,
    createdAt: link.createdAt?.toISOString?.() || new Date().toISOString(),
  }));

  const sharedPlaylistsData: PlaylistData[] = sharedPlaylists.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description || undefined,
    linkCount: 0,
    isShared: true,
    createdAt: p.createdAt?.toISOString?.() || new Date().toISOString(),
  }));

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="px-4 md:px-8 py-4 border-b">
        <h1 className="text-2xl font-semibold mb-4">Shared</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="with-me" data-testid="tab-shared-with-me">
              Shared with me ({sharedLinks.length + sharedPlaylists.length})
            </TabsTrigger>
            <TabsTrigger value="by-me" data-testid="tab-shared-by-me">
              Shared by me ({sentShares.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 overflow-auto px-4 md:px-8 py-4">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : activeTab === "with-me" ? (
          <div className="space-y-6">
            {sharedLinksData.length === 0 && sharedPlaylistsData.length === 0 ? (
              <EmptyState
                icon={Share2}
                title="Nothing shared with you yet"
                description="When someone shares a link or playlist with you, it will appear here."
              />
            ) : (
              <>
                {sharedLinksData.length > 0 && (
                  <div>
                    <h2 className="text-lg font-medium mb-3">Links ({sharedLinksData.length})</h2>
                    <div className="space-y-3 max-w-4xl">
                      {sharedLinksData.map((link) => (
                        <LinkCard key={link.id} link={link} />
                      ))}
                    </div>
                  </div>
                )}

                {sharedPlaylistsData.length > 0 && (
                  <div>
                    <h2 className="text-lg font-medium mb-3">Playlists ({sharedPlaylistsData.length})</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {sharedPlaylistsData.map((playlist) => (
                        <PlaylistCard key={playlist.id} playlist={playlist} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {sentShares.length === 0 ? (
              <EmptyState
                icon={Users}
                title="You haven't shared anything yet"
                description="Share links or playlists with others by clicking the share button."
              />
            ) : (
              <div>
                <h2 className="text-lg font-medium mb-3">Your Shared Items ({sentShares.length})</h2>
                <div className="space-y-3 max-w-4xl">
                  {sentShares.map((share) => (
                    <div
                      key={share.id}
                      className="p-4 border rounded-lg bg-card"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {share.linkId ? "Link" : "Playlist"} shared
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {share.canEdit ? "Can edit" : "View only"}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {new Date(share.createdAt || "").toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
