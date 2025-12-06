import { useState } from "react";
import { TagInput } from "../TagInput";

export default function TagInputExample() {
  // todo: remove mock functionality
  const [tags, setTags] = useState(["react", "javascript"]);

  return (
    <div className="max-w-md">
      <TagInput
        value={tags}
        onChange={setTags}
        placeholder="Type and press Enter..."
      />
      <p className="text-sm text-muted-foreground mt-2">
        Current tags: {tags.join(", ")}
      </p>
    </div>
  );
}
