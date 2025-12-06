import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  Link as LinkIcon,
  FolderOpen,
  Share2,
  User,
  Plus,
  Search,
  Settings,
  Moon,
  Sun,
  LogOut,
  Tag,
  Layers,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface CommandPaletteProps {
  onAddLink: () => void;
  onCreatePlaylist: () => void;
}

export function CommandPalette({ onAddLink, onCreatePlaylist }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." data-testid="input-command-search" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => runCommand(onAddLink)} data-testid="command-add-link">
            <Plus className="mr-2 h-4 w-4" />
            <span>Add New Link</span>
            <CommandShortcut>N</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(onCreatePlaylist)} data-testid="command-create-playlist">
            <FolderOpen className="mr-2 h-4 w-4" />
            <span>Create Playlist</span>
            <CommandShortcut>P</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => console.log("Search focus"))}>
            <Search className="mr-2 h-4 w-4" />
            <span>Search Links</span>
            <CommandShortcut>/</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => setLocation("/"))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Feed</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setLocation("/links"))}>
            <LinkIcon className="mr-2 h-4 w-4" />
            <span>My Links</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setLocation("/playlists"))}>
            <FolderOpen className="mr-2 h-4 w-4" />
            <span>Playlists</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setLocation("/shared"))}>
            <Share2 className="mr-2 h-4 w-4" />
            <span>Shared</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setLocation("/tags"))}>
            <Tag className="mr-2 h-4 w-4" />
            <span>Tags</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setLocation("/categories"))}>
            <Layers className="mr-2 h-4 w-4" />
            <span>Categories</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Settings">
          <CommandItem onSelect={() => runCommand(toggleTheme)}>
            {theme === "light" ? (
              <Moon className="mr-2 h-4 w-4" />
            ) : (
              <Sun className="mr-2 h-4 w-4" />
            )}
            <span>Toggle {theme === "light" ? "Dark" : "Light"} Mode</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setLocation("/account"))}>
            <User className="mr-2 h-4 w-4" />
            <span>Account</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setLocation("/settings"))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
