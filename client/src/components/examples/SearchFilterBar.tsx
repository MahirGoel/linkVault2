import { SearchFilterBar } from "../SearchFilterBar";

// todo: remove mock functionality
const mockCategories = ["Development", "Design", "Marketing", "Business", "Personal"];
const mockTags = ["javascript", "react", "css", "api", "tutorial", "tools"];

export default function SearchFilterBarExample() {
  return (
    <div className="max-w-3xl">
      <SearchFilterBar
        onSearch={(q) => console.log("Search:", q)}
        onCategoryFilter={(c) => console.log("Categories:", c)}
        onTagFilter={(t) => console.log("Tags:", t)}
        onSort={(s) => console.log("Sort:", s)}
        categories={mockCategories}
        availableTags={mockTags}
      />
    </div>
  );
}
