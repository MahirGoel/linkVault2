import {
  Link as LinkIcon,
  FolderPlus,
  Share2,
  Star,
  Edit2,
  Trash2,
  UserPlus,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type ActivityType = "link_added" | "playlist_created" | "shared" | "favorited" | "edited" | "deleted" | "received_share";

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  timestamp: string;
  user?: string;
}

interface ActivityFeedProps {
  activities: Activity[];
  maxHeight?: string;
}

const activityIcons: Record<ActivityType, typeof LinkIcon> = {
  link_added: LinkIcon,
  playlist_created: FolderPlus,
  shared: Share2,
  favorited: Star,
  edited: Edit2,
  deleted: Trash2,
  received_share: UserPlus,
};

const activityColors: Record<ActivityType, string> = {
  link_added: "bg-blue-500/10 text-blue-500",
  playlist_created: "bg-purple-500/10 text-purple-500",
  shared: "bg-green-500/10 text-green-500",
  favorited: "bg-yellow-500/10 text-yellow-500",
  edited: "bg-orange-500/10 text-orange-500",
  deleted: "bg-red-500/10 text-red-500",
  received_share: "bg-teal-500/10 text-teal-500",
};

export function ActivityFeed({ activities, maxHeight = "400px" }: ActivityFeedProps) {
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (activities.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          <p>No recent activity</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="font-medium mb-4">Recent Activity</h3>
      <ScrollArea style={{ maxHeight }}>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activityIcons[activity.type];
            const colorClass = activityColors[activity.type];

            return (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{activity.title}</span>
                  </p>
                  {activity.description && (
                    <p className="text-xs text-muted-foreground truncate">
                      {activity.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    {activity.user && (
                      <>
                        <Avatar className="w-4 h-4">
                          <AvatarFallback className="text-xs">
                            {getInitials(activity.user)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">
                          {activity.user}
                        </span>
                        <span className="text-muted-foreground">·</span>
                      </>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {formatTime(activity.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
}
