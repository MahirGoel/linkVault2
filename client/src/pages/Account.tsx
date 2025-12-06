import { Link as LinkIcon, FolderOpen, Share2, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatCard } from "@/components/StatCard";
import { useAuth } from "@/contexts/AuthContext";

export default function Account() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const memberSince = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex-1 overflow-auto px-4 md:px-8 py-4">
      <h1 className="text-2xl font-semibold mb-6">Account</h1>

      <div className="max-w-4xl space-y-6">
        <Card className="p-6">
          <div className="flex items-start gap-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-semibold" data-testid="text-user-name">
                {user.name}
              </h2>
              <p className="text-muted-foreground" data-testid="text-user-email">
                {user.email}
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
              value={156}
              icon={LinkIcon}
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard
              title="Playlists Created"
              value={8}
              icon={FolderOpen}
            />
            <StatCard
              title="Shared Items"
              value={24}
              icon={Share2}
              trend={{ value: 5, isPositive: true }}
            />
          </div>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <LinkIcon className="w-5 h-5" />
              <span>Add Link</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <FolderOpen className="w-5 h-5" />
              <span>New Playlist</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <Calendar className="w-5 h-5" />
              <span>Activity</span>
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Account Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">Connected Account</p>
                <p className="text-sm text-muted-foreground">Google - {user.email}</p>
              </div>
              <Button variant="outline" size="sm">Manage</Button>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">Export Data</p>
                <p className="text-sm text-muted-foreground">Download all your links and playlists</p>
              </div>
              <Button variant="outline" size="sm">Export</Button>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-destructive">Delete Account</p>
                <p className="text-sm text-muted-foreground">Permanently delete your account and data</p>
              </div>
              <Button variant="destructive" size="sm">Delete</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
