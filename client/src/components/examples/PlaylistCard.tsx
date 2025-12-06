import { PlaylistCard } from "../PlaylistCard";

// todo: remove mock functionality
const mockPlaylist = {
  id: "1",
  name: "React Resources",
  description: "Collection of useful React tutorials and documentation",
  linkCount: 12,
  isShared: true,
  createdAt: new Date().toISOString(),
};

export default function PlaylistCardExample() {
  return (
    <div className="max-w-sm">
      <PlaylistCard
        playlist={mockPlaylist}
        onClick={() => console.log("Clicked playlist")}
        onEdit={(p) => console.log("Edit:", p)}
        onDelete={(id) => console.log("Delete:", id)}
        onShare={(p) => console.log("Share:", p)}
      />
    </div>
  );
}
