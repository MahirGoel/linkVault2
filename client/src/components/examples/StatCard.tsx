import { Link, FolderOpen, Share2 } from "lucide-react";
import { StatCard } from "../StatCard";

export default function StatCardExample() {
  return (
    <div className="grid grid-cols-3 gap-4 max-w-2xl">
      <StatCard
        title="Total Links"
        value={156}
        icon={Link}
        trend={{ value: 12, isPositive: true }}
      />
      <StatCard
        title="Playlists"
        value={8}
        icon={FolderOpen}
      />
      <StatCard
        title="Shared"
        value={24}
        icon={Share2}
        trend={{ value: 5, isPositive: true }}
      />
    </div>
  );
}
