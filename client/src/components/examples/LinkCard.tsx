import { LinkCard } from "../LinkCard";

// todo: remove mock functionality
const mockLink = {
  id: "1",
  url: "https://github.com/facebook/react",
  title: "React - A JavaScript library for building user interfaces",
  description: "React lets you build user interfaces out of individual pieces called components.",
  category: "Development",
  tags: ["javascript", "frontend", "library"],
  createdAt: new Date().toISOString(),
};

export default function LinkCardExample() {
  return (
    <div className="max-w-2xl">
      <LinkCard
        link={mockLink}
        onEdit={(link) => console.log("Edit:", link)}
        onDelete={(id) => console.log("Delete:", id)}
        onShare={(link) => console.log("Share:", link)}
        onAddToPlaylist={(link) => console.log("Add to playlist:", link)}
      />
    </div>
  );
}
