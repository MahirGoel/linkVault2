import { useState } from "react";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SearchFilterBarProps {
  onSearch: (query: string) => void;
  onCategoryFilter: (categories: string[]) => void;
  onTagFilter: (tags: string[]) => void;
  onSort: (sort: string) => void;
  categories?: string[];
  availableTags?: string[];
}

export function SearchFilterBar({
  onSearch,
  onCategoryFilter,
  onTagFilter,
  onSort,
  categories = [],
  availableTags = [],
}: SearchFilterBarProps) {
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("recent");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  const toggleCategory = (cat: string) => {
    const updated = selectedCategories.includes(cat)
      ? selectedCategories.filter((c) => c !== cat)
      : [...selectedCategories, cat];
    setSelectedCategories(updated);
    onCategoryFilter(updated);
  };

  const toggleTag = (tag: string) => {
    const updated = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(updated);
    onTagFilter(updated);
  };

  const handleSort = (sort: string) => {
    setSortBy(sort);
    onSort(sort);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedTags([]);
    onCategoryFilter([]);
    onTagFilter([]);
  };

  const activeFiltersCount = selectedCategories.length + selectedTags.length;

  return (
    <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b pb-3 pt-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search links..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
            data-testid="input-search"
          />
        </div>

        <Button
          variant={showFilters ? "secondary" : "outline"}
          onClick={() => setShowFilters(!showFilters)}
          data-testid="button-toggle-filters"
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" data-testid="button-sort">
              Sort
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleSort("recent")}>
              Most Recent
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort("oldest")}>
              Oldest First
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort("a-z")}>
              A-Z
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort("category")}>
              By Category
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {showFilters && (
        <div className="mt-3 flex flex-wrap gap-4">
          <div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-2">
              Categories
            </span>
            <div className="flex flex-wrap gap-1">
              {categories.map((cat) => (
                <Badge
                  key={cat}
                  variant={selectedCategories.includes(cat) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleCategory(cat)}
                  data-testid={`filter-category-${cat}`}
                >
                  {cat}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-2">
              Tags
            </span>
            <div className="flex flex-wrap gap-1">
              {availableTags.slice(0, 10).map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer font-mono"
                  onClick={() => toggleTag(tag)}
                  data-testid={`filter-tag-${tag}`}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeFiltersCount > 0 && (
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          {selectedCategories.map((cat) => (
            <Badge key={cat} variant="secondary" className="gap-1">
              {cat}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => toggleCategory(cat)}
              />
            </Badge>
          ))}
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1 font-mono">
              {tag}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => toggleTag(tag)}
              />
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs"
            data-testid="button-clear-filters"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
