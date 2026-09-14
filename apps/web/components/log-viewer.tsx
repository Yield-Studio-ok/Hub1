import React, { useState } from "react";
import { CopyIcon, CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LogViewerProps {
  logs: string;
}

export function LogViewer({ logs }: LogViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!logs) return;
    try {
      await navigator.clipboard.writeText(logs);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy logs", err);
    }
  };

  return (
    <div className="relative w-full rounded-md border bg-muted p-4">
      <div className="absolute top-2 right-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          aria-label="Copy logs"
          title="Copy logs"
          disabled={!logs}
        >
          {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
        </Button>
      </div>
      <div className="overflow-auto whitespace-pre-wrap font-mono text-sm max-h-96">
        {logs || "No logs available"}
      </div>
    </div>
  );
}
