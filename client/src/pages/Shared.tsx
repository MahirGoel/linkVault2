import { useState } from "react";
import { Share2, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LinkCard, type LinkData } from "@/components/LinkCard";
import { PlaylistCard, type PlaylistData } from "@/components/PlaylistCard";
import { EmptyState } from "@/components/EmptyState";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// todo: remove mock functionality
const sharedWithMe: {
  links: (LinkData & { sharedBy: string })[];
  playlists: (PlaylistData & { sharedBy: string })[];
} = {
  links: [
    {
      id: "s1",
      url: "https://nextjs.org",
      title: "Next.js Documentation",
      description: "The React Framework for Production",
      category: "Development",
      tags: ["nextjs", "react", "framework"],
      createdAt: new Date().toISOString(),
      sharedBy: "John Doe",
    },
  ],
  playlists: [
    {
      id: "sp1",
      name: "Team Resources",
      description: "Shared team documentation and tools",
      linkCount: 25,
      isShared: true,
      createdAt: new Date().toISOString(),
      sharedBy: "Jane Smith",
    },
  ],
};

const sharedByMe: {
  links: (LinkData & { sharedWith: string[] })[];
  playlists: (PlaylistData & { sharedWith: string[] })[];
} = {
  links: [
    {
      id: "m1",
      url: "https://react.dev",
      title: "React Documentation",
      description: "Official React documentation",
      category: "Development",
      tags: ["react", "docs"],
      createdAt: new Date().toISOString(),
      sharedWith: ["John Doe", "Bob Wilson"],
    },
  ],
  playlists: [
    {
      id: "mp1",
      name: "Design System",
      description: "UI components and patterns",
      linkCount: 18,
      isShared: true,
      createdAt: new Date().toISOString(),
      sharedWith: ["Jane Smith"],
    },
  ],
};

export default function Shared() {
  const [activeTab, setActiveTab] = useState("with-me");

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="px-4 md:px-8 py-4 border-b">
        <h1 className="text-2xl font-semibold mb-4">Shared</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="with-me" data-testid="tab-shared-with-me">
              Shared with me
            </TabsTrigger>
            <TabsTrigger value="by-me" data-testid="tab-shared-by-me">
              Shared by me
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 overflow-auto px-4 md:px-8 py-4">
        {activeTab === "with-me" ? (
          <div className="space-y-6">
            {sharedWithMe.links.length === 0 && sharedWithMe.playlists.length === 0 ? (
              <EmptyState
                icon={Share2}
                title="Nothing shared with you yet"
                description="When someone shares a link or playlist with you, it will appear here."
              />
            ) : (
              <>
                {sharedWithMe.links.length > 0 && (
                  <div>
                    <h2 className="text-lg font-medium mb-3">Links</h2>
                    <div className="space-y-3 max-w-4xl">
                      {sharedWithMe.links.map((link) => (
                        <div key={link.id} className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Avatar className="w-5 h-5">
                              <AvatarFallback className="text-xs">
                                {getInitials(link.sharedBy)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{link.sharedBy} shared this</span>
                          </div>
                          <LinkCard link={link} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {sharedWithMe.playlists.length > 0 && (
                  <div>
                    <h2 className="text-lg font-medium mb-3">Playlists</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {sharedWithMe.playlists.map((playlist) => (
                        <div key={playlist.id} className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Avatar className="w-5 h-5">
                              <AvatarFallback className="text-xs">
                                {getInitials(playlist.sharedBy)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{playlist.sharedBy} shared this</span>
                          </div>
                          <PlaylistCard playlist={playlist} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {sharedByMe.links.length === 0 && sharedByMe.playlists.length === 0 ? (
              <EmptyState
                icon={Users}
                title="You haven't shared anything yet"
                description="Share links or playlists with others by clicking the share button."
              />
            ) : (
              <>
                {sharedByMe.links.length > 0 && (
                  <div>
                    <h2 className="text-lg font-medium mb-3">Links</h2>
                    <div className="space-y-3 max-w-4xl">
                      {sharedByMe.links.map((link) => (
                        <div key={link.id} className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="w-4 h-4" />
                            <span>Shared with:</span>
                            {link.sharedWith.map((name) => (
                              <Badge key={name} variant="outline" className="text-xs">
                                {name}
                              </Badge>
                            ))}
                          </div>
                          <LinkCard link={link} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {sharedByMe.playlists.length > 0 && (
                  <div>
                    <h2 className="text-lg font-medium mb-3">Playlists</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {sharedByMe.playlists.map((playlist) => (
                        <div key={playlist.id} className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="w-4 h-4" />
                            <span>Shared with:</span>
                            {playlist.sharedWith.map((name) => (
                              <Badge key={name} variant="outline" className="text-xs">
                                {name}
                              </Badge>
                            ))}
                          </div>
                          <PlaylistCard playlist={playlist} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
