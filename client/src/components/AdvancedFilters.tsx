import { useState } from "react";
import { Filter, X, Calendar, Tag, Folder, Star, Eye, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface AdvancedFiltersProps {
  categories: string[];
  tags: string[];
  onApplyFilters: (filters: FilterState) => void;
}

export interface FilterState {
  categories: string[];
  tags: string[];
  dateRange: { from?: Date; to?: Date };
  favoritesOnly: boolean;
  unreadOnly: boolean;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

const defaultFilters: FilterState = {
  categories: [],
  tags: [],
  dateRange: {},
  favoritesOnly: false,
  unreadOnly: false,
  sortBy: "createdAt",
  sortOrder: "desc",
};

export function AdvancedFilters({
  categories,
  tags,
  onApplyFilters,
}: AdvancedFiltersProps) {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const activeFiltersCount =
    filters.categories.length +
    filters.tags.length +
    (filters.dateRange.from ? 1 : 0) +
    (filters.favoritesOnly ? 1 : 0) +
    (filters.unreadOnly ? 1 : 0);

  const toggleCategory = (cat: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
  };

  const toggleTag = (tag: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const applyFilters = () => {
    onApplyFilters(filters);
    setOpen(false);
  };

  const formatDateRange = () => {
    if (!filters.dateRange.from) return "Select dates";
    if (!filters.dateRange.to) {
      return filters.dateRange.from.toLocaleDateString();
    }
    return `${filters.dateRange.from.toLocaleDateString()} - ${filters.dateRange.to.toLocaleDateString()}`;
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" data-testid="button-advanced-filters">
          <Filter className="w-4 h-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:max-w-[400px]">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            Advanced Filters
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-muted-foreground"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
          </SheetTitle>
        </SheetHeader>

        <div className="py-6 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Categories</Label>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Badge
                  key={cat}
                  variant={filters.categories.includes(cat) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleCategory(cat)}
                >
                  {cat}
                  {filters.categories.includes(cat) && (
                    <X className="w-3 h-3 ml-1" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Tags</Label>
            </div>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant={filters.tags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer font-mono text-xs"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                  {filters.tags.includes(tag) && (
                    <X className="w-3 h-3 ml-1" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Date Range</Label>
            </div>
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  {formatDateRange()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="range"
                  selected={{
                    from: filters.dateRange.from,
                    to: filters.dateRange.to,
                  }}
                  onSelect={(range) => {
                    setFilters((prev) => ({
                      ...prev,
                      dateRange: { from: range?.from, to: range?.to },
                    }));
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="favorites-only">Favorites only</Label>
              </div>
              <Switch
                id="favorites-only"
                checked={filters.favoritesOnly}
                onCheckedChange={(checked) =>
                  setFilters((prev) => ({ ...prev, favoritesOnly: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="unread-only">Unread only</Label>
              </div>
              <Switch
                id="unread-only"
                checked={filters.unreadOnly}
                onCheckedChange={(checked) =>
                  setFilters((prev) => ({ ...prev, unreadOnly: checked }))
                }
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label className="text-sm font-medium">Sort By</Label>
            <div className="grid grid-cols-2 gap-2">
              <Select
                value={filters.sortBy}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, sortBy: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Date Added</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                  <SelectItem value="viewCount">View Count</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.sortOrder}
                onValueChange={(value: "asc" | "desc") =>
                  setFilters((prev) => ({ ...prev, sortOrder: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Descending</SelectItem>
                  <SelectItem value="asc">Ascending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <SheetFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={applyFilters} data-testid="button-apply-filters">
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
