import { useState } from "react";
import { CreatePlaylistModal } from "../CreatePlaylistModal";
import { Button } from "@/components/ui/button";

export default function CreatePlaylistModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Create Playlist</Button>
      <CreatePlaylistModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={(data) => {
          console.log("Created playlist:", data);
          setOpen(false);
        }}
      />
    </div>
  );
}
