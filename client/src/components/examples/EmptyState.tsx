import { Link } from "lucide-react";
import { EmptyState } from "../EmptyState";

export default function EmptyStateExample() {
  return (
    <EmptyState
      icon={Link}
      title="No links yet"
      description="Start saving links to build your collection. Click the button below to add your first link."
      actionLabel="Add Link"
      onAction={() => console.log("Add link clicked")}
    />
  );
}
