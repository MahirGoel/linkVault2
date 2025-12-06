import { useState } from "react";
import { Plus, Link as LinkIcon, FolderOpen, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkCard, type LinkData } from "@/components/LinkCard";
import { SearchFilterBar } from "@/components/SearchFilterBar";
import { AddLinkModal, type LinkFormData } from "@/components/AddLinkModal";
import { ShareDialog } from "@/components/ShareDialog";
import { StatCard } from "@/components/StatCard";
import { EmptyState } from "@/components/EmptyState";

// todo: remove mock functionality - replace with real API data
const mockLinks: LinkData[] = [
  {
    id: "1",
    url: "https://react.dev",
    title: "React Documentation",
    description: "The library for web and native user interfaces. Build user interfaces out of individual pieces called components.",
    category: "Development",
    tags: ["react", "javascript", "frontend"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    url: "https://tailwindcss.com",
    title: "Tailwind CSS",
    description: "A utility-first CSS framework packed with classes that can be composed to build any design.",
    category: "Design",
    tags: ["css", "tailwind", "styling"],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    url: "https://github.com",
    title: "GitHub",
    description: "Where the world builds software. Millions of developers and companies build, ship, and maintain their software on GitHub.",
    category: "Development",
    tags: ["git", "code", "collaboration"],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "4",
    url: "https://figma.com",
    title: "Figma",
    description: "The collaborative interface design tool. Design, prototype, and gather feedback all in one place.",
    category: "Design",
    tags: ["design", "prototyping", "ui"],
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
];

const mockCategories = ["Development", "Design", "Marketing", "Business", "Personal"];
const mockTags = ["javascript", "react", "css", "api", "tutorial", "tools", "design", "frontend"];
const mockUsers = [
  { id: "1", name: "John Doe", email: "john@example.com" },
  { id: "2", name: "Jane Smith", email: "jane@example.com" },
  { id: "3", name: "Bob Wilson", email: "bob@example.com" },
];

export default function Feed() {
  const [links, setLinks] = useState<LinkData[]>(mockLinks);
  const [filteredLinks, setFilteredLinks] = useState<LinkData[]>(mockLinks);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<LinkData | null>(null);
  const [editLink, setEditLink] = useState<LinkData | null>(null);

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredLinks(links);
      return;
    }
    const filtered = links.filter(
      (link) =>
        link.title?.toLowerCase().includes(query.toLowerCase()) ||
        link.description?.toLowerCase().includes(query.toLowerCase()) ||
        link.url.toLowerCase().includes(query.toLowerCase()) ||
        link.tags?.some((t) => t.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredLinks(filtered);
  };

  const handleCategoryFilter = (categories: string[]) => {
    if (categories.length === 0) {
      setFilteredLinks(links);
      return;
    }
    setFilteredLinks(links.filter((link) => link.category && categories.includes(link.category)));
  };

  const handleTagFilter = (tags: string[]) => {
    if (tags.length === 0) {
      setFilteredLinks(links);
      return;
    }
    setFilteredLinks(links.filter((link) => link.tags?.some((t) => tags.includes(t))));
  };

  const handleSort = (sort: string) => {
    const sorted = [...filteredLinks];
    switch (sort) {
      case "recent":
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "oldest":
        sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "a-z":
        sorted.sort((a, b) => (a.title || a.url).localeCompare(b.title || b.url));
        break;
      case "category":
        sorted.sort((a, b) => (a.category || "").localeCompare(b.category || ""));
        break;
    }
    setFilteredLinks(sorted);
  };

  const handleSaveLink = (data: LinkFormData) => {
    if (editLink) {
      setLinks(links.map((l) => (l.id === editLink.id ? { ...l, ...data } : l)));
      setFilteredLinks(filteredLinks.map((l) => (l.id === editLink.id ? { ...l, ...data } : l)));
      setEditLink(null);
    } else {
      const newLink: LinkData = {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date().toISOString(),
      };
      setLinks([newLink, ...links]);
      setFilteredLinks([newLink, ...filteredLinks]);
    }
  };

  const handleDeleteLink = (id: string) => {
    setLinks(links.filter((l) => l.id !== id));
    setFilteredLinks(filteredLinks.filter((l) => l.id !== id));
  };

  const handleEditLink = (link: LinkData) => {
    setEditLink(link);
    setAddModalOpen(true);
  };

  const handleShareLink = (link: LinkData) => {
    setSelectedLink(link);
    setShareDialogOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="px-4 md:px-8 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard title="Total Links" value={links.length} icon={LinkIcon} />
          <StatCard title="Playlists" value={3} icon={FolderOpen} />
          <StatCard title="Shared" value={5} icon={Share2} />
        </div>
      </div>

      <div className="px-4 md:px-8">
        <SearchFilterBar
          onSearch={handleSearch}
          onCategoryFilter={handleCategoryFilter}
          onTagFilter={handleTagFilter}
          onSort={handleSort}
          categories={mockCategories}
          availableTags={mockTags}
        />
      </div>

      <div className="flex-1 overflow-auto px-4 md:px-8 py-4">
        {filteredLinks.length === 0 ? (
          <EmptyState
            icon={LinkIcon}
            title="No links found"
            description="Try adjusting your search or filters, or add a new link to get started."
            actionLabel="Add Link"
            onAction={() => setAddModalOpen(true)}
          />
        ) : (
          <div className="space-y-3 max-w-4xl">
            {filteredLinks.map((link) => (
              <LinkCard
                key={link.id}
                link={link}
                onEdit={handleEditLink}
                onDelete={handleDeleteLink}
                onShare={handleShareLink}
                onAddToPlaylist={() => console.log("Add to playlist:", link.id)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8">
        <Button
          size="lg"
          className="rounded-full shadow-lg h-14 w-14 p-0"
          onClick={() => setAddModalOpen(true)}
          data-testid="button-add-link-fab"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      <AddLinkModal
        open={addModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          setEditLink(null);
        }}
        onSave={handleSaveLink}
        categories={mockCategories}
        editData={editLink ? {
          url: editLink.url,
          title: editLink.title,
          description: editLink.description,
          category: editLink.category,
          tags: editLink.tags,
          thumbnail: editLink.thumbnail,
        } : null}
      />

      <ShareDialog
        open={shareDialogOpen}
        onClose={() => {
          setShareDialogOpen(false);
          setSelectedLink(null);
        }}
        onShare={(userIds, canEdit) => {
          console.log("Shared", selectedLink?.id, "with", userIds, "canEdit:", canEdit);
        }}
        title={`Share "${selectedLink?.title || "Link"}"`}
        availableUsers={mockUsers}
      />
    </div>
  );
}
