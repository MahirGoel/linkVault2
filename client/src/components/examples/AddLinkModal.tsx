import { useState } from "react";
import { AddLinkModal } from "../AddLinkModal";
import { Button } from "@/components/ui/button";

// todo: remove mock functionality
const mockCategories = ["Development", "Design", "Marketing", "Business", "Personal"];

export default function AddLinkModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Add Link</Button>
      <AddLinkModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={(link) => {
          console.log("Saved link:", link);
          setOpen(false);
        }}
        categories={mockCategories}
      />
    </div>
  );
}
