import { useState } from "react";
import { ShareDialog } from "../ShareDialog";
import { Button } from "@/components/ui/button";

// todo: remove mock functionality
const mockUsers = [
  { id: "1", name: "John Doe", email: "john@example.com" },
  { id: "2", name: "Jane Smith", email: "jane@example.com" },
  { id: "3", name: "Bob Wilson", email: "bob@example.com" },
  { id: "4", name: "Alice Brown", email: "alice@example.com" },
];

export default function ShareDialogExample() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Share</Button>
      <ShareDialog
        open={open}
        onClose={() => setOpen(false)}
        onShare={(userIds, canEdit) => {
          console.log("Shared with:", userIds, "Can edit:", canEdit);
        }}
        title="Share Playlist"
        availableUsers={mockUsers}
      />
    </div>
  );
}
