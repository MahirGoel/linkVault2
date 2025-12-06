import { Link as LinkIcon, FolderOpen, Share2, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatCard } from "@/components/StatCard";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import type { Link, Playlist, Share } from "@shared/schema";

export default function Account() {
  const { user, logout, isAuthenticated } = useAuth();

  const { data: links = [] } = useQuery<Link[]>({
    queryKey: ["/api/links"],
    enabled: isAuthenticated,
  });

  const { data: playlists = [] } = useQuery<Playlist[]>({
    queryKey: ["/api/playlists"],
    enabled: isAuthenticated,
  });

  const { data: sentShares = [] } = useQuery<Share[]>({
    queryKey: ["/api/shares/sent"],
    enabled: isAuthenticated,
  });

  if (!user) return null;

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    const first = firstName?.[0] || "";
    const last = lastName?.[0] || "";
    return (first + last).toUpperCase() || "U";
  };

  const displayName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email || "User";

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recently";

  return (
    <div className="flex-1 overflow-auto px-4 md:px-8 py-4">
      <h1 className="text-2xl font-semibold mb-6">Account</h1>

      <div className="max-w-4xl space-y-6">
        <Card className="p-6">
          <div className="flex items-start gap-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user.profileImageUrl || undefined} />
              <AvatarFallback className="text-2xl">
                {getInitials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-semibold" data-testid="text-user-name">
                {displayName}
              </h2>
              <p className="text-muted-foreground" data-testid="text-user-email">
                {user.email || "No email"}
              </p>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Member since {memberSince}</span>
              </div>
            </div>
            <Button variant="outline" onClick={logout} data-testid="button-logout-account">
              Log out
            </Button>
          </div>
        </Card>

        <div>
          <h3 className="text-lg font-medium mb-4">Your Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Total Links"
              value={links.length}
              icon={LinkIcon}
            />
            <StatCard
              title="Playlists Created"
              value={playlists.length}
              icon={FolderOpen}
            />
            <StatCard
              title="Shared Items"
              value={sentShares.length}
              icon={Share2}
            />
          </div>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Account Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">Connected Account</p>
                <p className="text-sm text-muted-foreground">Replit - {user.email || "Connected"}</p>
              </div>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">Sign Out</p>
                <p className="text-sm text-muted-foreground">Sign out of your account</p>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                Sign Out
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
