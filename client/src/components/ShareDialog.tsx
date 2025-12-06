import { useState } from "react";
import { Search, X, Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
  onShare: (userIds: string[], canEdit: boolean) => void;
  title?: string;
  availableUsers?: User[];
}

export function ShareDialog({
  open,
  onClose,
  onShare,
  title = "Share",
  availableUsers = [],
}: ShareDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [canEdit, setCanEdit] = useState(false);

  const filteredUsers = availableUsers.filter(
    (user) =>
      !selectedUsers.find((u) => u.id === user.id) &&
      (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const addUser = (user: User) => {
    setSelectedUsers([...selectedUsers, user]);
    setSearchQuery("");
  };

  const removeUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((u) => u.id !== userId));
  };

  const handleShare = () => {
    onShare(
      selectedUsers.map((u) => u.id),
      canEdit
    );
    setSelectedUsers([]);
    setSearchQuery("");
    onClose();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Search users</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-share-search"
              />
            </div>
          </div>

          {searchQuery && filteredUsers.length > 0 && (
            <div className="border rounded-md max-h-40 overflow-y-auto">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-2 hover-elevate cursor-pointer"
                  onClick={() => addUser(user)}
                  data-testid={`button-select-user-${user.id}`}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="text-xs">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedUsers.length > 0 && (
            <div className="space-y-2">
              <Label>Selected users</Label>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <Badge
                    key={user.id}
                    variant="secondary"
                    className="gap-1 py-1"
                  >
                    <Avatar className="w-4 h-4">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="text-xs">
                        {getInitials(user.name)[0]}
                      </AvatarFallback>
                    </Avatar>
                    {user.name}
                    <X
                      className="w-3 h-3 cursor-pointer ml-1"
                      onClick={() => removeUser(user.id)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between py-2">
            <div>
              <Label htmlFor="can-edit">Allow editing</Label>
              <p className="text-xs text-muted-foreground">
                Users can modify or add to this content
              </p>
            </div>
            <Switch
              id="can-edit"
              checked={canEdit}
              onCheckedChange={setCanEdit}
              data-testid="switch-can-edit"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleShare}
            disabled={selectedUsers.length === 0}
            data-testid="button-confirm-share"
          >
            <Send className="w-4 h-4 mr-2" />
            Share
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
