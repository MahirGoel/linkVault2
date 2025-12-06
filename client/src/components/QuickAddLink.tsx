import { useState, useRef, useEffect } from "react";
import { Plus, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface QuickAddLinkProps {
  onAdd: (url: string) => void;
  onOpenFullModal: () => void;
}

export function QuickAddLink({ onAdd, onOpenFullModal }: QuickAddLinkProps) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    let finalUrl = url.trim();
    if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
      finalUrl = "https://" + finalUrl;
    }

    if (!validateUrl(finalUrl)) {
      setError("Please enter a valid URL");
      return;
    }

    setIsLoading(true);
    setError("");

    // Simulate saving
    await new Promise((r) => setTimeout(r, 500));
    
    onAdd(finalUrl);
    setUrl("");
    setIsLoading(false);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button data-testid="button-quick-add">
          <Plus className="w-4 h-4 mr-2" />
          Add Link
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-3" align="end">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Quick Add</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setOpen(false);
                onOpenFullModal();
              }}
              className="text-xs text-muted-foreground"
              data-testid="button-open-full-modal"
            >
              More options
            </Button>
          </div>
          
          <div className="space-y-2">
            <Input
              ref={inputRef}
              placeholder="Paste URL here..."
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError("");
              }}
              onKeyDown={handleKeyDown}
              className={error ? "border-destructive" : ""}
              data-testid="input-quick-url"
            />
            {error && (
              <p className="text-xs text-destructive">{error}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={isLoading}
              data-testid="button-quick-save"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
